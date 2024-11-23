
var currentExample;
var currentshaderData;


//Show stuff ------------------------------------------------
function ShowError(title, message)
{
	HideLoadingThrobber();
	errorBoxElement.style.display = "flex";
	errorTitleElement.innerText = title;
	errorMessageElement.innerText = message;
}


function ShowHomePage()
{
	HideLoadingThrobber();
}


function ShowFunction(notionPage)
{
	HideLoadingThrobber();
}


function ShowExample(example)
{
	HideLoadingThrobber();
	currentExample = example;
	exampleElement.style.display = "flex";

	//Example content
	OnExampleContentUpdated(example);

	//Example properties
	OnExamplePropertiesUpdated(example);

	//Example code
	if (!example.hasCode)
	{
		ShowError("Example error", "No code found on this example.\nCheck the id to make sure it's an example page.\nThe page must contain a code block to incldue HLSL code.");
	}
	else
	{
		//Apply shader
		currentshaderData = new ShaderData(exampleCanvas, example.json.request_id, example.code, null);
		functionListRenderer.AddRenderer(currentshaderData);
	}
}


//Hide stuff ------------------------------------------------
function HideHomePage()
{

}


function HideFunction()
{

}


function HideExample()
{

}


function HideLoadingThrobber()
{
	loading.style.display = "none";
}



//Miscs -----------------------------------------------------


//Displays the loading throbber. Will be automatically hidden when page content changes.
function StartLoadingAction()
{
	loading.style.display = "flex";
}


//Called when a page is updated. (usually by deferred callback / async)
//This updates the page only if it is still displayed to the user.
function OnPageUpdated(id)
{

}


//Called when a example content is updated. (usually by deferred callback / async)
//This updates the example only if it is still displayed to the user.
function OnExampleContentUpdated(example)
{
	//Update data in any cases
	examplesMap.set(example.json.request_id, example);
	if (example == null || currentExample == null || (currentExample.json.request_id != example.json.request_id))
		return;
	currentExample = example;

	//Update html
	if (!hideContent)
	{
		exampleContentElement.innerHTML = example.html;
		exampleContentElement.style.display = "flex";
	}
	else
	{
		exampleContentElement.innerHTML = "";
		exampleContentElement.style.display = "none";
	}

	console.log(example.hasTable + "  " + example.fields.length);
}


//Called when a example properties is updated. (usually by deferred callback / async)
//This updates the example only if it is still displayed to the user.
function OnExamplePropertiesUpdated(example)
{
	//Update data in any cases
	examplesMap.set(example.json.request_id, example);
	if (example == null || currentExample == null || (currentExample.json.request_id != example.json.request_id))
		return;
	currentExample = example;

	//Update html
	let propertiesHtml = "";
	if (example.hasTable)
	{
		for (let i = 0; i < example.fields.length; i++) 
		{
			let field = example.fields[i];
			propertiesHtml += field.CreateHtml(example.json.request_id);
		}
	}
	exampleProperties.innerHTML = propertiesHtml;
}