

var shaderTextArea;
//var shaderCodeOverlay;
var overlayCanvas;
var shaderCanvas;
var renderer;

Main();

function Main()
{
	overlayCanvas = document.getElementById("overlay-canvas");
	shaderTextArea = document.getElementById("shader-text-area");
	//shaderCodeOverlay = document.getElementById("code-overlay");
	shaderCanvas = document.getElementById("shader-canvas");
	renderer = new ShaderRenderer(overlayCanvas);
	
	CompileShader();
}

function CompileShader()
{
	//shaderCodeOverlay.innerText = shaderTextArea.value;

	let data = new ShaderData(shaderCanvas, "shader-editor", shaderTextArea.value, null);

	renderer.ClearRenderers();
	renderer.AddRenderer(data);
	
	renderer.Render(Date.now());
	

	//Prism.highlightAll();
}