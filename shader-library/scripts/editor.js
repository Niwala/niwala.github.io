
var codeElement;
var codeEditorArea;
var codeEditorOverlay;
var overlayElement;
var overlayCanvas;
var shaderCanvas;
var scrollArea;
var renderer;

//Popup panel
var popupPanel;
var popupPanelOwner;
var layoutSection;
var infoSection;
var examplesSection;
var exportSection;

//
var fontSizeRule;
var lineNumbersRule;

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
	env.classes.push('keyword-' + env.content);
});

Main();
FormatTextArea();

function Main()
{
	textSizeElement = document.getElementById("text-size");
	codeElement = document.getElementById("code");
	overlayElement = document.getElementById("overlay");
	overlayCanvas = document.getElementById("overlay-canvas");
	codeEditorArea = document.getElementById("code-editor-area");
	codeEditorOverlay = document.getElementById("code-editor-overlay");
	shaderCanvas = document.getElementById("shader-canvas");
	scrollArea = document.getElementById("scroll-area");

	layoutSection = document.getElementById("layout-section");
	exportSection = document.getElementById("export-section");
	examplesSection = document.getElementById("examples-section");
	infoSection = document.getElementById("info-section");
	renderer = new ShaderRenderer(overlayCanvas);

	popupPanel = document.getElementById("popup-panel");
	popupPanel.addEventListener('click', (event) => event.stopPropagation());
	document.getElementById("banner").addEventListener('click', ClosePopup);
	document.getElementById("back").addEventListener('click', ClosePopup);

	//Find style for code font size
	const styleSheets = document.styleSheets;
	for (let sheet of styleSheets) 
	{
		try {
			for (let rule of sheet.cssRules) 
			{
					if (rule.selectorText === '.format-code') 
					{
						fontSizeRule = rule;
					}

					else if (rule.selectorText === '.line-numbers') 
					{
						lineNumbersRule = rule;
					}
			}
		} catch (e) 
		{
			console.error('Cannot access stylesheet rules (dynamic font-size) :', e);
		}
	}

	CompileShader();
}

function ConvertToUrl()
{
	let packedData = new PackedData();
	packedData.shader = ConvertIntegersToFloats(codeEditorArea.value);

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
		navigator.clipboard.writeText(value).then(function ()
		{
			console.log('Url to clipboard');
		}).catch(function (error)
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
	let hlsl = codeEditorArea.value.replace(/\t/g, "    ");
	codeEditorArea.value = hlsl;
	codeElement.innerHTML = hlsl + "\n";
	textSizeElement.innerText = hlsl + "\n";
	SetHeights();
	AsyncHighlight();

	let shader = ConvertIntegersToFloats(codeEditorArea.value);
	let data = new ShaderData(shaderCanvas, "shader-editor", shader, null);

	renderer.ClearRenderers();
	renderer.AddRenderer(data);

	renderer.Render(Date.now());

}

async function AsyncHighlight()
{
	Prism.highlightElement(codeElement, false);
}

function SyncScroll()
{
	overlayElement.scrollTop = codeEditorArea.scrollTop;
   overlayElement.scrollLeft = codeEditorArea.scrollLeft;
}

function SetHeights()
{
	const codePaddingLeft = 45 + 22;
	const codePaddingTop = 24 + 4;

	const containerRect = scrollArea.getBoundingClientRect();
	const referenceRect = textSizeElement.getBoundingClientRect();

	let targetWidth = Math.max(containerRect.width  - codePaddingLeft, referenceRect.width);
	let targetHeight = Math.max(containerRect.height - codePaddingTop, referenceRect.height);

	//Extend horizontal when text is near to the right edge
	let horizontalSup = 0;
	if (referenceRect.width > (containerRect.width - 120))
	{
		horizontalSup += 120;
	}

	codeEditorArea.style.width = `${targetWidth + horizontalSup}px`;
	codeEditorArea.style.height = `${targetHeight}px`;

	codeEditorArea.scrollLeft = 0;
	codeEditorArea.scrollTop = 0;

	const relativeRect = codeEditorArea.getBoundingClientRect();
	const top = relativeRect.top + scrollArea.scrollTop;
	const left = relativeRect.left + scrollArea.scrollLeft;

	overlayElement.style.left = `${window.scrollX - containerRect.left + left}px`;
	overlayElement.style.top = `${window.scrollY - containerRect.top + top}px`;
	overlayElement.style.width = `${relativeRect.width + horizontalSup}px`;
	overlayElement.style.height = `${relativeRect.height}px`;

	overlayElement.style.right = 0;
}

function UpdateContentWithUndoRedo(textarea, newValue) 
{
    const event = new InputEvent('input', {
        inputType: 'insertText',
        data: newValue,
        bubbles: true,
        cancelable: true
    });

   //  textarea.value = newValue;
    textarea.dispatchEvent(event);
}


//Page controls----------------------------
function SetLayout(id)
{
	console.log("Set layout " + id);
}

function ClearPopupPanel()
{
	layoutSection.style.display = "none";
	infoSection.style.display = "none";
	examplesSection.style.display = "none";
	exportSection.style.display = "none";
}

function ToggleLayoutPanel(element)
{
	TogglePanelForElement(element, layoutSection);
}

function ToggleInfoPanel(element)
{
	TogglePanelForElement(element, infoSection);
}

function ToggleExamplesPanel(element)
{
	TogglePanelForElement(element, examplesSection);
}

function ToggleExportPanel(element)
{
	TogglePanelForElement(element, exportSection);
}

function TogglePanelForElement(element, section)
{
	let rect = element.getBoundingClientRect();
	let leftSide = (rect.x + rect.width * 0.5) < innerWidth * 0.5;

	//Enable - disables sections
	layoutSection.style.display = (layoutSection == section ? "flex" : "none");
	infoSection.style.display = (infoSection == section ? "flex" : "none");
	examplesSection.style.display = (examplesSection == section ? "flex" : "none");
	exportSection.style.display = (exportSection == section ? "flex" : "none");

	//Disable current owner
	if (popupPanelOwner != null)
	{
		popupPanelOwner.classList.remove('active');
	}

	//Check state
	const isVisible = (popupPanel.style.display === 'block' && popupPanelOwner == element);
	popupPanelOwner = element;

	//Apply change
	if (isVisible) 
	{
		popupPanel.style.display = 'none';
		element.classList.remove('active');
	} else 
	{
		popupPanel.style.display = 'block';
		element.classList.add('active');

		let rect = element.getBoundingClientRect();
		popupPanel.style.top = (rect.top + rect.height) + "px";

		if (leftSide)
			popupPanel.style.left = rect.left + "px";
		else
			popupPanel.style.left = (rect.left - 520 + rect.width) + "px";

	}
	return isVisible;
}

function ClosePopup(event) 
{
	//Check source - avoid close on buttons (redondant)
	const source = event.target || event.srcElement;
	if (source.nodeName === "BUTTON")
		return;

	//Disable current owner
	if (popupPanelOwner != null)
	{
		popupPanelOwner.classList.remove('active');
	}
	popupPanel.style.display = 'none';
}

//Properties controls ---------------------

function AddToggle(event)
{

}

function SetFontSize(slider)
{
	fontSizeRule.style.setProperty('font-size', slider.value + 'px', 'important');
	fontSizeRule.style.setProperty('line-height', (slider.value * 1.5) + 'px', 'important');

	let margin = (slider.value - 16) * 3 + 60; /* Sync with code-editor-area & line-numbers styles */

	lineNumbersRule.style.setProperty('padding-left', margin + 'px', 'important');
	codeEditorArea.style.paddingLeft = margin + 'px';

	SetHeights();
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

function SetLargeLayout(toggleElement)
{
	largeLayout = toggleElement.checked;
}
//-----------------------------------------

function FormatTextArea()
{
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

		else if (e.key == 'Backspace')	//Can remove a tab
		{
			let text = this.value;
			let cursorPos = this.selectionStart;
			let lineStart = GetLineStartIndicesInSelection(text, cursorPos, cursorPos)[0];

			let pre = text.substring(lineStart, cursorPos);
			let preLength = pre.length;

			if (preLength >= 4 && IsOnlySpaces(pre, 0, pre.length))
			{
				let targetSpaceCount = Math.floor(preLength / 4.0) * 4;
				let offset = preLength - targetSpaceCount;
				if (offset == 0)
					offset = 4;

				e.preventDefault();
				this.value = text.substring(0, cursorPos - offset) + text.substring(cursorPos);
				this.selectionStart = this.selectionEnd = cursorPos - offset;
			}
		}

	});
}

function ConvertIntegersToFloats(shaderCode)
{
	const regex = /(?<=\bfloat\s+\w+\s*=\s*)(-?\d+)(?=;)/g;
	return shaderCode.replace(regex, (match) => `${match}.0`);
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

	for (let i = 0; i < lines.length; i++)
	{
		const line = lines[i];
		const lineStart = currentIndex; // Début de la ligne
		const lineEnd = currentIndex + line.length; // Fin de la ligne

		// Vérifie si la ligne chevauche la sélection
		if (lineEnd >= selectionStart && lineStart <= selectionEnd)
		{
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
	while (cursorPos < maxLength && text[cursorPos] == ' ')
	{
		i++;
		cursorPos++;
	}
	return i;
}

function IsOnlySpaces(text, start, end)
{
	let i = start;
	while (i < end)
	{
		if (text[i] != ' ')
			return false;
		i++;
	}
	return true;
}