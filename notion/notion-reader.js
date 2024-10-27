
var notionContent;
var content;

Initialize();
FetchNotionData();

function Initialize()
{
	content = "";
	notionContent = document.getElementById("notion-content");
}

async function FetchNotionData() 
{
	try 
	{
		const response = await fetch('https://backendfinalfinalv3.vercel.app/api');
		
		if (!response.ok) 
		{
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		console.log(data);
		
		for	(let i = 0; i < data.results.length; i++)
		{
			ParsePageProperties(data.results[i]);
		}
		
	} 
	catch (error) 
	{
		console.error('Error fetching data:', error);
	}
}

function ParsePageProperties(data)
{
	content += "\n" + data.properties.Name.title[0].plain_text;
	
	notionContent.innerText = content;
}

