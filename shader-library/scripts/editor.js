
var codeElement;
var codeEditorArea;
var codeEditorOverlay;
var overlayCanvas;
var shaderCanvas;
var renderer;

//URL params
var shaderOnly = false;
var largeLayout = false;

window.Prism = window.Prism || {};
Prism.manual = true;

Prism.hooks.add('wrap', function (env) 
{
	if (env.type !== 'keyword') 
	{
		return;
	}
	console.log(env.content);
	env.classes.push('keyword-' + env.content);
});

Main();
FormatTextArea();

function Main()
{
	codeElement = document.getElementById("code");
	overlayCanvas = document.getElementById("overlay-canvas");
	codeEditorArea = document.getElementById("code-editor-area");
	codeEditorOverlay = document.getElementById("code-editor-overlay");
	shaderCanvas = document.getElementById("shader-canvas");
	renderer = new ShaderRenderer(overlayCanvas);
	
	CompileShader();
}

function ConvertToUrl()
{
	let packedData = new PackedData();
	packedData.shader = codeEditorArea.value;

	let url = window.location.href;
	let params = "&hide-banner";

	if (shaderOnly)
		params += "&shader-only";

	if (largeLayout)
		params += "&large-layout";

	let rootLastIndex = url.lastIndexOf('/');
	url = url.substring(0, rootLastIndex);

	url += "?embed=" + packedData.CompressToURL() + params;
	SetClipboard(url);
}

function SetClipboard(value)
{
	try 
	{
		navigator.clipboard.writeText(value).then(function() 
		{
			console.log('Url to clipboard');
		}).catch(function(error) 
		{
			console.error('Error copying text: ', error);
		});
	} 
	catch (err) 
	{
		console.error('Clipboard API not supported:', err);
	}
}

function CompileShader()
{
	let hlsl = codeEditorArea.value.replace("\t", "    ");
	codeEditorArea.value = hlsl;
	codeElement.innerHTML = hlsl;
	AsyncHighlight();

	let data = new ShaderData(shaderCanvas, "shader-editor", codeEditorArea.value, null);

	renderer.ClearRenderers();
	renderer.AddRenderer(data);
	
	renderer.Render(Date.now());
	
}

async function AsyncHighlight()
{
	Prism.highlightElement(codeElement, false);
}

//PRoperties controls ---------------------

function AddToggle()
{

}

//URL params ------------------------------
function SwitchToggle(toggleID)
{
	let toggleElement = document.getElementById(toggleID);
	toggleElement.checked = !toggleElement.checked;
	toggleElement.onchange();
}

function SetShaderOnly(toggleElement)
{
	shaderOnly = toggleElement.checked;
}

function SEtLargeLayout(toggleElement)
{
	largeLayout = toggleElement.checked;
}
//-----------------------------------------

function FormatTextArea()
{
	codeEditorArea.addEventListener('scroll', () => 
	{
		codeEditorOverlay.scrollTop = codeEditorArea.scrollTop;
		codeEditorOverlay.scrollLeft = codeEditorArea.scrollLeft;
	});

	codeEditorArea.addEventListener('keydown', function (e) 
	{
		if (e.key === 'Tab') 
		{
			//Prevent the focus change
			e.preventDefault();

			if (e.shiftKey)
			{
				//Group of line
				if (this.selectionStart != this.selectionEnd)
				{
					let start = this.selectionStart;
					let end = this.selectionEnd;

					let lineIndices = GetLineStartIndicesInSelection(this.value, this.selectionStart, this.selectionEnd);
					let value = this.value;
					let globalOffset = 0;
					for (let i = lineIndices.length - 1; i >= 0; i--) 
					{
						const index = lineIndices[i];
						let [newValue, offset] = OutdentLineAt(value, index);
						globalOffset += offset;
						value = newValue;

						if (i == 0)
						{
							start += offset;
						}
					}

					this.value = value;
					this.selectionStart = start;
					this.selectionEnd = end + globalOffset;
				}

				//One line
				else
				{
					let cursorPos = this.selectionStart;
					let [newValue, offset] = OutdentLineAt(this.value, this.selectionStart);
					this.value = newValue;
					this.selectionStart = this.selectionEnd = cursorPos + offset;
				}
			}
			else
			{
				//Group of line
				if (this.selectionStart != this.selectionEnd)
				{
					let start = this.selectionStart;
					let end = this.selectionEnd;

					let lineIndices = GetLineStartIndicesInSelection(this.value, this.selectionStart, this.selectionEnd);
					let value = this.value;
					let globalOffset = 0;
					for (let i = lineIndices.length - 1; i >= 0; i--) 
					{
						const index = lineIndices[i];
						let [newValue, offset] = IndentLineAt(value, index);
						globalOffset += offset;
						value = newValue;

						if (i == 0)
						{
							start += offset;
						}
					}

					this.value = value;
					this.selectionStart = start;
					this.selectionEnd = end + globalOffset;
				}

				//One line
				else
				{
					let cursorPos = this.selectionStart;
					let [newValue, offset] = IndentLineAt(this.value, this.selectionStart);
					this.value = newValue;
					this.selectionStart = this.selectionEnd = cursorPos + offset;
				}
			}

			// // Insère une tabulation à l'endroit du curseur
			// const start = this.selectionStart;
			// const end = this.selectionEnd;

			// // Ajoute une tabulation
			// const tab = "    ";
			// this.value = this.value.substring(0, start) + tab + this.value.substring(end);

			// // Replace le curseur après la tabulation
			// this.selectionStart = this.selectionEnd = start + tab.length;
        }

		else if (e.key == 'Enter')
		{
			e.preventDefault();
			let cursorPos = this.selectionStart;
			let [newValue, offset] = CreateNewLine(this.value, this.selectionStart);
			this.value = newValue;
			this.selectionStart = this.selectionEnd = cursorPos + offset;
		}

    });
}

//Return [new line, applied offset]
function OutdentLineAt(text, cursorPos)
{
	let lineStart = GetLineStartIndicesInSelection(text, cursorPos, cursorPos)[0];
	let spaceCount = GetSpaceCount(text, lineStart);
	let targetSpaceCount = (Math.ceil(spaceCount / 4.0) - 1) * 4;

	let toRemove = Math.min((spaceCount - targetSpaceCount), spaceCount);

	return [text.substring(0, lineStart) + text.substring(lineStart + toRemove), -toRemove];
}

//Return [new line, applied offset]
function IndentLineAt(text, cursorPos)
{
	let lineStart = GetLineStartIndicesInSelection(text, cursorPos, cursorPos)[0];
	let spaceCount = GetSpaceCount(text, lineStart);
	let targetSpaceCount = (Math.floor(spaceCount / 4.0) + 1) * 4;
	let missingSpaces = ' '.repeat(targetSpaceCount - spaceCount);

	return [text.substring(0, lineStart) + missingSpaces + text.substring(lineStart), targetSpaceCount - spaceCount];
}

function CreateNewLine(text, cursorPos)
{
	let lineStart = GetLineStartIndicesInSelection(text, cursorPos, cursorPos)[0];
	let spaceCount = GetSpaceCount(text, lineStart);

	let newLine = "\n" + ' '.repeat(spaceCount);

	return [text.substring(0, cursorPos) + newLine + text.substring(cursorPos), spaceCount + 1];
}

//Return [line start index, space count]
function FindIndexBeforeIndentation(text, cursorPos) 
{
	let lineStartIndex;

	// Trouver la position de début de la ligne
	if (text[cursorPos] != "\n")
	{
   	const textBeforeCursor = text.slice(0, cursorPos);
    	lineStartIndex = textBeforeCursor.lastIndexOf('\n') + 1;
	}
	else
	{
		return [lineStartIndex, lineStartIndex];
	}

    // Trouver la fin des espaces en début de ligne
    const lineText = text.slice(lineStartIndex);
    const indentationEnd = lineText.search(/\S|$/); // Index du premier caractère non-espace

    // Retourner l'index avant les espaces
    return [lineStartIndex, indentationEnd];
}

function GetLineStartIndicesInSelection(text, selectionStart, selectionEnd) 
{
    const indices = [];
    const lines = text.split('\n'); // Diviser le texte en lignes
    let currentIndex = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineStart = currentIndex; // Début de la ligne
        const lineEnd = currentIndex + line.length; // Fin de la ligne

        // Vérifie si la ligne chevauche la sélection
        if (lineEnd >= selectionStart && lineStart <= selectionEnd) {
            indices.push(lineStart);
        }

        // Met à jour l'index pour la prochaine ligne (+1 pour le '\n')
        currentIndex += line.length + 1;
    }

    return indices;
}

function GetSpaceCount(text, cursorPos)
{
	let i = 0;
	let maxLength = text.length;
	while(cursorPos < maxLength && text[cursorPos] == ' ')
	{
		i++;
		cursorPos++;
	}
	return i;
}