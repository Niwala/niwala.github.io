import { GIFEncoder, quantize, applyPalette } 
    from 'https://unpkg.com/gifenc@1.0.3';


//Export settings
var exportWidth;
var exportHeight;
var exportStartTime;
var exportDuration;
var exportFPS;


LoadExportSettings();


window.LoadExportSettings = LoadExportSettings;
export function LoadExportSettings()
{
	exportWidth = document.getElementById("export-width").value;
	exportHeight = document.getElementById("export-height").value;
	exportStartTime = document.getElementById("export-start-time").value;
	exportDuration = document.getElementById("export-duration").value;
	exportFPS = document.getElementById("export-fps").value;
	console.log("update settings");
}


window.ExecuteExporter = ExecuteExporter;
export function ExecuteExporter(width, height, exporter)
{
    //Save current canvas style
	const prevPosition = shaderCanvas.style.position;
	const prevTop = shaderCanvas.style.top;
	const prevLeft = shaderCanvas.style.left;
	const prevWidth = shaderCanvas.style.width;
	const prevheight = shaderCanvas.style.height;
	const prevZ = shaderCanvas.style.zIndex;

	//Place canvas top-left
	shaderCanvas.style.position = 'fixed';
	shaderCanvas.style.top = '0';
	shaderCanvas.style.left = '0';
	shaderCanvas.style.width = width + 'px';
	shaderCanvas.style.height = height + 'px';
	shaderCanvas.style.zIndex = '9999'; //Ensure above UI

	//currentShaderData
	renderer.overrideSize = true;

	exporter();

	//Restore canvas style & rendering
	shaderCanvas.style.position = prevPosition;
	shaderCanvas.style.top = prevTop;
	shaderCanvas.style.left = prevLeft;
	shaderCanvas.style.width = prevWidth;
	shaderCanvas.style.height = prevheight;
	shaderCanvas.style.zIndex = prevZ;

	//Restore rendering
	renderer.overrideSize = false;
	renderer.Render();
}


window.ExportPNG = ExportPNG;
export function ExportPNG()
{
	ExecuteExporter(exportWidth, exportHeight, () => 
	{
		renderer.RenderNow(exportStartTime);

		const dataURL = overlayCanvas.toDataURL("image/png");

		const link = document.createElement("a");
		link.download = "shader_render.png";
		link.href = dataURL;
		link.click();
	});
}

window.ExportGIF = ExportGIF;
export async function ExportGIF()
{
    const delay = (1.0 / exportFPS) * 1000;
    const totalFrames = exportDuration * exportFPS;

    const gif = GIFEncoder();
    const offscreen = new OffscreenCanvas(exportWidth, exportHeight)

    await ExecuteExporter(exportWidth, exportHeight, async () => 
    {
        for (let i = 0; i < totalFrames; i++) 
        {
            renderer.RenderNow(i / exportFPS);
            renderer.gl.finish();
            renderer.gl.bindFramebuffer(renderer.gl.FRAMEBUFFER, null);

            //Copy the final rendered image
            const ctx = offscreen.getContext("2d");
            ctx.drawImage(overlayCanvas, 0, 0);

            //Extract pixels
            const { data:pixels } = ctx.getImageData(0, 0, exportWidth, exportHeight);

            //Quantize & encode
            const palette = quantize(pixels, 256);
            const index = applyPalette(pixels, palette);
            gif.writeFrame(index, exportWidth, exportHeight, { palette, delay });
        }

        gif.finish();
        const output = gif.bytes();

        //Auto-download
        const blob = new Blob([output], { type: 'image/gif' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shader_render.gif';
        a.click();
        URL.revokeObjectURL(url);
    });
}


window.ExportWebM = ExportWebM;
export async function ExportWebM()
{
    const totalFrames = exportDuration * exportFPS;

	//Create WebM Writer
    console.log(exportWidth);
	const writer = new WebMWriter({
		width: exportWidth,
		height: exportHeight,
		quality: 0.95,
		frameRate: exportFPS
	});

	let frame = 0;

    await ExecuteExporter(exportWidth, exportHeight, async () => 
    {
        while (frame < totalFrames)
		{
		    renderer.RenderNow(frame / exportFPS + exportStartTime);
		    writer.addFrame(overlayCanvas);
            frame++;
		}

		console.log("Finalizing WebM...");
        writer.complete().then((blob) =>
        {
            //Download WebM
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "shader_render.webm";
            link.click();
            URL.revokeObjectURL(url);
            console.log("WebM export complete");
        });
    });
}