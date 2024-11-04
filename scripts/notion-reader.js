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

 function BuildHtmlFromPage(pageData)
 {
 	let html = "";
 	for (var i = 0; i < pageData.results.length; i++) 
 	{
 		html += BuildBlockHtml(pageData.results[i]);
 	}
 	return html;
 }


function BuildBlockHtml(blockData)
{
	switch(blockData.type)
	{
		case "heading_1": return "<div class='heading_1'>" + ValueFromRichText(blockData.heading_1) + "</div>"; break;
		case "heading_2": return "<div class='heading_2'>" + ValueFromRichText(blockData.heading_2) + "</div>"; break;
		case "heading_3": return "<div class='heading_3'>" + ValueFromRichText(blockData.heading_3) + "</div>"; break;
		case "paragraph": return "<p>" + ValueFromRichText(blockData.paragraph) + "</div>"; break;
		case "code": return "<div class='code-container'><pre class='line-numbers'><code class='language-hlsl'>" + ValueFromRichText(blockData.code) + "</code></pre></div>"; break;
		case "callout": return "<div class='callout'>Callout</div>"; break;
		case "bulleted_list_item": return "<ul><li>" + ValueFromRichText(blockData.bulleted_list_item) + "</li></ul>"; break;
		case "numbered_list_item": return "<ol><li>" + ValueFromRichText(blockData.numbered_list_item) + "</li></ol>"; break;
		case "divider": return "<div class='divider'></div>"; break;
		case "toggle": return "</br>toggle"; break;
		case "quote": return "<blockquote>" + ValueFromRichText(blockData.quote) + "</blockquote>"; break;
		case "link_to_page": return "<a href='" + ValueFromPageID(blockData.link_to_page) + "'>link_to_page</a>"; break;
	}
}