

Main();

var content;

function Main()
{

    content = document.getElementById("content");

    ReadJsonFile("root.json").then(jsonFile =>
    {
        let notionPage = new NotionPage(jsonFile, OnPageUpdate);
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