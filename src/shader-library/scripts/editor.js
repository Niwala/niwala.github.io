var editor;
var overlayElement;
var overlayCanvas;
var shaderCanvas;
var scrollArea;
var renderer;
var shaderProperties;
var errorMessageElement;

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

var currentLayoutBtn;
var currentLayoutValue = 10;


//URL params
var shaderOnly = false;
var largeLayout = false;


Main();

function Main()
{

	//Setup ace
	ace.config.set("basePath", "/shader-library/external/ace");

	editor = ace.edit("ace-editor");

	editor.session.setMode("ace/mode/glsl");
	editor.setTheme("ace/theme/dracula");

	editor.setOptions({
		fontFamily: "Consolas, monospace",
		enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
	});

	editor.session.on('change', function(delta) 
	{
		CompileShader();
	});

	
	//Get document elements
	textSizeElement = document.getElementById("text-size");
	overlayElement = document.getElementById("overlay");
	overlayCanvas = document.getElementById("overlay-canvas");
	shaderCanvas = document.getElementById("shader-canvas");
	scrollArea = document.getElementById("scroll-area");
	shaderProperties = document.getElementById("shader-properties");
	// errorMessageElement = document.getElementById("error-message");

	layoutSection = document.getElementById("layout-section");
	exportSection = document.getElementById("export-section");
	examplesSection = document.getElementById("examples-section");
	infoSection = document.getElementById("info-section");
	renderer = new ShaderRenderer(overlayCanvas);

	popupPanel = document.getElementById("popup-panel");
	popupPanel.addEventListener('click', (event) => event.stopPropagation());
	document.getElementById("banner").addEventListener('click', ClosePopup);
	document.getElementById("back").addEventListener('click', ClosePopup);

	//Default layout
	currentLayoutBtn = document.getElementById("layout-btn-" + currentLayoutValue);
	currentLayoutBtn.classList.add("selected-btn");

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

	let params = new URLSearchParams(window.location.search);	
	let embedShader = params.get("shader");
	if (embedShader != null)
	{
		let packedData = new PackedData();
		packedData.DecompressURL(embedShader);
		editor.setValue(packedData.shader, -1);
		CompileShader();
	}
	else
	{
		OpenExample("default");
	}
}

function GoToLibrary(event)
{
	let url = "index.html";

	//Context clic : Nothing
	if (event.button == 2)
		return;

	//Shift key : Open in new tab
	if (event != null && (event.ctrlKey || event.shiftKey || event.button == 1))
	{
		window.open(url, '_blank');
	}
	else
	{
		window.location="index.html"
	}
}

function ExportIFrame()
{
	let packedData = new PackedData();
	packedData.shader = ConvertIntegersToFloats(editor.getValue());

	let url = window.location.href;
	let params = "&hide-banner";

	if (shaderOnly)
		params += "&shader-only";

	if (largeLayout)
		params += "&large-layout";

	let rootLastIndex = url.lastIndexOf('/');
	url = url.substring(0, rootLastIndex);

	url += "/shader-library?embed=" + packedData.CompressToURL() + params;
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
	let hlsl = editor.getValue().replace(/\t/g, "    ");
	textSizeElement.innerText = hlsl + "\n";

	let shader = ConvertIntegersToFloats(hlsl);
	currentShaderData = new ShaderData(shaderCanvas, "shader-editor", shader, currentLayoutValue, OnShaderCompiled);

	renderer.ClearRenderers();
	renderer.AddRenderer(currentShaderData);

	UpdateProperties(currentShaderData);

}

function UpdateProperties(shaderData)
{
	let html = "";
	shaderData.attributes.forEach(element => 
	{
		html += CreateFieldHtmlFromAttribute("shader-editor", element);
	});

    shaderProperties.innerHTML = html;
}

async function AsyncHighlight()
{
	Prism.highlightElement(codeElement, false);
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
function SetLayout(element, id)
{
	if (currentShaderData.layout == id)
	{
		currentLayoutBtn.classList.remove("selected-btn");
		currentShaderData.layout = 0;
		currentLayoutValue = 0;
	}
	else
	{
		currentLayoutBtn.classList.remove("selected-btn");
		currentLayoutBtn = element;
		element.classList.add("selected-btn");
		currentShaderData.layout = id;
		currentLayoutValue = id;
	}
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
	} 
	else 
	{
		popupPanel.style.display = 'block';
		element.classList.add('active');

		let rect = element.getBoundingClientRect();
		const scrollX = window.scrollX || window.pageXOffset;
		const scrollY = window.scrollY || window.pageYOffset;

		//Compute absolute position including scroll
		const top = rect.top + rect.height + scrollY;
		const left = leftSide 
			? rect.left + scrollX 
			: rect.left - 520 + rect.width + scrollX;

		popupPanel.style.top = top + "px";
		popupPanel.style.left = left + "px";
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

async function OpenExample(fileName)
{
    try 
	{
        const response = await fetch("./src/shader-library/examples/" + fileName + ".shader");

        if (!response.ok) 
		{
            throw new Error(`Error on loading example : (${fileName}) ${response.statusText}`);
        }

        const text = await response.text();
		editor.setValue(text, -1);
		CompileShader();
    } 
	catch (error) 
	{
        console.error('Unable to load exemple : ' + fileName + "\n" + error);
    }
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

//Shader compilation-------------------------
function OnShaderCompiled(error, lineOffset = 0)
{
	ParseShaderErrors(error, lineOffset);
}

function ParseShaderErrors(errorString, lineOffset) 
{
    const annotations = [];
    const lines = errorString.split('\n');

    lines.forEach(line => {
        //Example : ERROR: 0:125: 'fds' : undeclared identifier
        const match = line.match(/(ERROR|WARNING):\s*\d+:(\d+):\s*(.*)/);
        if (match) {
            const typeStr = match[1];   // ERROR or WARNING
            const lineNum = parseInt(match[2]) - lineOffset;
            const message = match[3].trim();

            if (lineNum >= 0) 
			{
                annotations.push({
                    row: lineNum,
                    column: 0,
                    text: message,
                    type: typeStr.toLowerCase() // "error", "warning", "info"
                });
            }
        }
    });

    editor.getSession().setAnnotations(annotations);
}