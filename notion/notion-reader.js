
var notionContent;
var content;

Initialize();
FetchNotionData();

function Initialize()
{
	content = "";
	notionContent = document.getElementById("notion-content");
}

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

function FetchNotionData() 
{
	FetchNotion("database/query/12b5d96b946d8060b5e9d08b0167fce1", (data) => 
	{
		for	(let i = 0; i < data.results.length; i++)
		{
			ParsePageProperties(data.results[i]);
		}
	});
}

function ParsePageProperties(data)
{
	content += "\n" + data.properties.Name.title[0].plain_text;
	ParsePageContent(data.id);
	
	notionContent.innerText = content;
	
	
}

function ParsePageContent(data)
{
	
}