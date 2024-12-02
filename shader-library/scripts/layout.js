
var currentExample;
var currentshaderData;
var currentPage;


//Show stuff ------------------------------------------------
function ApplyUrlParams()
{
	exampleElement.style.display = shaderOnly ? "none" : "flex";
	shaderOnlyCanvas.style.display = shaderOnly ? "flex" : "none";
	bannerElement.style.display = hideBanner ? "none" : "flex";
	searchBar.style.display = homePageLoaded ? "flex" : "none";

	if (hideContent)
	{
		document.body.style.backgroundColor = "transparent";
		exampleElement.style.padding = "0";
		exampleBox.parentElement.style.padding = "0";
		exampleBox.style.borderTopLeftRadius = "5px";
	}

	let multipleExample = currentPage != null && currentPage.examples?.length > 0;
	exampleButtons.style.display = (!hideContent && multipleExample) ? "flex" : "none";

	//Example box
	if (largeLayout && exampleBox.classList.contains('example-box'))
	{
		exampleBox.classList.remove('example-box');
		exampleBox.classList.add('example-box-large');
	}
	else if (!largeLayout && exampleBox.classList.contains('example-box-large'))
	{
		exampleBox.classList.remove('example-box-large');
		exampleBox.classList.add('example-box');
	}
}

function ShowError(title, message)
{
	HideLoadingThrobber();
	errorBoxElement.style.display = "flex";
	errorTitleElement.innerText = title;
	errorMessageElement.innerText = message;
}


function ShowHomePage()
{
	//Shows and hides elements
	HideLoadingThrobber();
	homepage.style.display = "flex";
	introduction.style.display = "flex";
	bannerElement.style.display = hideBanner ? "none" : "flex";
	searchBar.style.display = "flex";
}


function ShowFunction(notionPage)
{
	//Shows and hides elements
	HideLoadingThrobber();
	pageElement.style.display = "flex";
	bannerElement.style.display = hideBanner ? "none" : "flex";
	searchBar.style.display = "flex";

	//Set new value
	currentPage = notionPage;

	//Refresh content
	OnPageUpdated(currentPage);
	OnExampleContentUpdated(currentPage);
}


function ShowExample(example)
{
	//Shows and hides elements
	HideLoadingThrobber();
	exampleElement.style.display = shaderOnly ? "none" : "flex";
	shaderOnlyCanvas.style.display = shaderOnly ? "flex" : "none";
	bannerElement.style.display = hideBanner ? "none" : "flex";
	searchBar.style.display = homePageLoaded ? "flex" : "none";

	//Set new value
	currentExample = example;

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
		let canvas = shaderOnly ? shaderOnlyCanvas : exampleCanvas;
		currentshaderData = new ShaderData(canvas, example.json.request_id, example.code, null);
		functionListRenderer.AddRenderer(currentshaderData);
	}
}


//Hide stuff ------------------------------------------------
function HideHomePage()
{
	homepage.style.display = "none";
	introduction.style.display = "none";
}


function HideFunction()
{
	pageElement.style.display = "none";
}


function HideExample()
{
	exampleElement.style.display = "none";
	shaderOnlyCanvas.style.display = "none";
}


function HideLoadingThrobber()
{
	loading.style.display = "none";
}



//Miscs -----------------------------------------------------


//Displays the loading throbber. Will be automatically hidden when page content changes.
function StartLoadingAction()
{
	HideHomePage();
	HideFunction();
	HideExample();
	loading.style.display = "flex";
}


//Called when a page is updated. (usually by deferred callback / async)
//This updates the page only if it is still displayed to the user.
function OnPageUpdated(notionPage)
{
	if (currentPage == null || currentPage.json.id != notionPage.json.id)
		return;
	currentPage = notionPage;

	//Update page html
	pageContent.innerHTML = notionPage.html;
}

function OnPageExamplesUdpated(notionPage)
{
	if (currentPage == null || currentPage.json.id != notionPage.json.id)
		return;
	currentPage = notionPage;

	//Update button list
	let btns = "";
	for (let i = 0; i < notionPage.examples.length; i++) 
	{
		let example = notionPage.examples[i];
		let name = example.name;

		if (i == 0 && exampleName == null)
		{
			exampleName = name;
			ShowExample(example);
		}

		let checked = name == exampleName;

		btns += "<input type='radio' onchange='SelectExample(\"" + name + "\")' id='example-" + name + "' name='button-group' " + (checked ? "checked" : "") + "><label for='example-" + name + "'>" + name + "</label></input>"
	}
	exampleButtons.innerHTML = btns;
	exampleButtons.style.display = (notionPage.examples.length > 1) ? "flex" : "none";
}

function SelectExample(name)
{
	for (let i = 0; i < currentPage.examples.length; i++) 
	{
		let example = currentPage.examples[i];
		if (example.name == name)
		{
			exampleName = name;
			ShowExample(example);
		}
	}
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