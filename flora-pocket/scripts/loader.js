

Main();

var content;
var currentPage;

function Main()
{

    content = document.getElementById("content");

    ReadJsonFile("root.json").then(jsonFile =>
    {
        currentPage = new NotionPage(jsonFile, OnPageUpdate);
    });


}

function ReadPageName(fileID)
{
    const request = new XMLHttpRequest();
    request.open("GET", "data/" + fileID + ".meta", false); // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) 
    {
        return JSON.parse(request.response).name;
    }
    return null;
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