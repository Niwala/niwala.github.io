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
 	console.log("page/get-children/" + pageID);
 	FetchNotion("page/get-children/" + pageID, (data) => 
 	{
 		callback(data);
 	});
 }

// function ParsePageProperties(data)
// {
// 	content += "\n" + data.properties.Name.title[0].plain_text;
// 	FetchNotionPage(data.id);
	
// 	notionContent.innerText = content;
// }

// function ParsePageContent(data)
// {
// 	console.log(data);
// }