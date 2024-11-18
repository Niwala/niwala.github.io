function FetchNotion(command, callback)
{
	fetch('https://backendfinalfinalv3.vercel.app/notion/' + command)
		.then(response => response.json())
		.then(data => callback(data))
		.catch(error => console.error(error));
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

async function FetchNotionBlock(blockID) 
{
    return new Promise(resolve => {
        FetchNotion("page/get-children/" + blockID, (data) => 
		  {
            resolve(data);
        });
    });
}

 async function BuildHtmlFromPage(pageData, onPageUpdate) 
 {
	let notionPage = new PageContent(pageData, FetchNotionBlock, onPageUpdate);
}