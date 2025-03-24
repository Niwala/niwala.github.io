

Main();

var content;
var currentPage;
var functionListRenderer;

function Main()
{

    content = document.getElementById("content");

    ReadJsonFile("root.json").then(jsonFile =>
    {
        currentPage = new NotionPage(jsonFile, OnPageUpdate);
    });

    functionListCanvas = document.getElementById("overlay-canvas");
    functionListRenderer = new ShaderRenderer(functionListCanvas);
    LoadLoadingShader();
}

function LoadLoadingShader()
{
	loading = document.getElementById("overlay-canvas");

    let shader = ReadFile("shaders/background.shader");
    let shaderData = new ShaderData(loading, "loading", shader,  null);
    functionListRenderer.AddRenderer(shaderData);
}

function ReadPageName(fileID)
{
    let file = ReadFile("data/" + fileID + ".meta");
    return JSON.parse(file).name;
}

function ReadFile(path)
{
    const request = new XMLHttpRequest();
    request.open("GET", path, false); // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) 
    {
        return request.response;
    }
    return "";
}

function OnSelectNewPage(fileID)
{
    ReadJsonFile("data/" + fileID + ".json").then(jsonFile =>
    {
        currentPage = new NotionPage(jsonFile, OnPageUpdate);
    });
}

function OnPageUpdate(page)
{
    content.innerHTML = page.html;
}

function ReadJsonFile(filePath) 
{
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json(); // Convertit en objet JS
        })
        .catch(error => {
            console.error("Erreur lors de la lecture du fichier JSON :", error);
            return null;
        });
}