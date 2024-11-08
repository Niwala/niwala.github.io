async function FetchNotion(command, callback)
{
	try 
	{
		const response = await fetch('https://backendfinalfinalv3.vercel.app/notion/' + command);
		
		if (!response.ok) 
		{
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		console.log(data);
		callback(data);
	} 
	catch (error) 
	{
		console.error('Error fetching data:', error);
	}
}

function FetchNotionDatabase(callback) 
{
	FetchNotion("database/get-data/12b5d96b946d8060b5e9d08b0167fce1", (data) => 
	{
		callback(data);
	});
}

 function FetchNotionPage(pageID, callback)
 {
 	FetchNotion("page/get-children/" + pageID, (data) => 
 	{
 		callback(data);
 	});
 }

 async function BuildHtmlFromPage(pageData) 
 {
    let html = "";

    // Crée une liste de promesses pour chaque bloc Notion
    const blockPromises = pageData.results.map(result => {
        const notionBlock = new NotionBlock(result);
        return notionBlock.promise; // Renvoie la promesse de chaque bloc
    });

    // Attends que toutes les promesses soient résolues
    const allHtmlBlocks = await Promise.all(blockPromises);

    // Concatène le HTML final
    html = allHtmlBlocks.join(""); 

    return html;
}