

var shaderTextArea;
//var shaderCodeOverlay;
var overlayCanvas;
var shaderCanvas;
var renderer;

Main();
FormatTextArea();

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

function FormatTextArea()
{
    shaderTextArea.addEventListener('keydown', function (e) 
	{
        if (e.key === 'Tab') 
		{
            e.preventDefault(); // Empêche le changement de focus

            // Insère une tabulation à l'endroit du curseur
            const start = this.selectionStart;
            const end = this.selectionEnd;

            // Ajoute une tabulation
            const tab = "    ";
            this.value = this.value.substring(0, start) + tab + this.value.substring(end);

            // Replace le curseur après la tabulation
            this.selectionStart = this.selectionEnd = start + tab.length;
        }
    });
}