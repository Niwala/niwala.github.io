function FetchNotion(command, callback)
{
	fetch('https://backendfinalfinalv3.vercel.app/notion/' + command)
		.then(response => response.json())
		.then(data => callback(null, data))
		.catch(error => callback(error, null));
}

function FetchNotionDatabase(callback) 
{
	FetchNotion("database/get-data/12b5d96b946d8060b5e9d08b0167fce1", (error, data) => 
	{
		if (error)
			console.error(error);
		else
			callback(data);
	});
}

 function FetchNotionPage(pageID, callback)
 {
 	FetchNotion("page/get-children/" + pageID, (error, data) => 
 	{
		if (error)
			console.error(error);
		else
			callback(data);
 	});
 }

async function FetchNotionBlock(blockID) 
{
    return new Promise((resolve, reject) => {
        FetchNotion("page/get-children/" + blockID, (error, data) => 
		  {
				if (error)
				{
					reject(error);
				}
				else
				{
					resolve(data);
				}
        });
    });
}

 async function BuildHtmlFromPage(pageData, onPageUpdate) 
 {
	let notionPage = new PageContent(pageData, FetchNotionBlock, onPageUpdate);
}