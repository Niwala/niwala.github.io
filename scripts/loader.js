Parse();
SetupSearchHooks();

//URL params
var exampleID;						//id
var pageName;						//name (before '.')
var exampleName;					//name (after '.')
var hideBanner;					//hide-banner
var hideContent;					//hide-content
var largeLayout;					//large-layout
var shaderPropertiesLayout;	//properties
var shaderOnly;					//shader-only


//Home page
var homePageLoaded;


//Html elements
var bannerElement;


//Data
var functionsMap;		//Map : key = notionID, value = NotionPage
var nameToPageID;		//Map : key = pageName, value = notionID
var examplesMap;		//Map : key = notionID, value = NotionExample


//Error message
var errorBoxElement;
var errorTitleElement;
var errorMessageElement;

//Examples
var exampleElement;
var exampleContentElement;
var exampleProperties;
var exampleCanvas;
var shaderOnlyCanvas;

//Loading throbber
var loading;
var loadingShader;

var templateContainer;
var templateExample;

var exampleButtonsContainer;
var exampleList;
var sliderList;
var toggleList;
var colorFieldList;

var currentFileName;
var currentFunction;
var currentExample

var searchBar;
var searchBarList;
var searchItems;



var introduction;
var functionListCanvas;
var functionListRenderer;
var functionList;

var homepage;
var page;
var pageContent;

var bypassUrlAdaptation;

var functionNameToData;



function Parse()
{
	LoadUrlParams();
	LoadHtmlElements();
	LoadLoadingShader();

	ApplyStateFromUrlParams();
	LoadAndShowCurrentPage();


	//LoadNotionHome();

	//ReadFunctionsIndex();
	
	//Track and react to previous / next page of browser
	window.addEventListener('popstate', (event) => 
	{
		if (event.state) 
		{
			bypassUrlAdaptation = true;
			OpenFunctionFromURL();
			bypassUrlAdaptation = false;
		}
	});
}

function LoadUrlParams()
{
	let params = new URLSearchParams(window.location.search);	
	exampleID = params.get("id");

	if (exampleID == null)
	{
		let fullName = params.get("name");
		if (fullName != null && fullName.includes("."))
		{
			pageName = fullName.split('.')[0];
			exampleName = fullName.split('.')[1];
		}
	}
	else
	{
		pageName = null;
		exampleName = null;
	}

	shaderOnly = params.has("shader-only");
	hideBanner = params.has("hide-banner") || shaderOnly;
	hideContent = params.has("hide-content") || shaderOnly;
	largeLayout = params.has("large-layout") || shaderOnly;
	properties = shaderOnly ? "none" : params.get("properties");
}

function LoadHtmlElements()
{
	functionsMap = new Map();
	nameToPageID = new Map();
	examplesMap = new Map();
	searchItems = new Map();

	//Banner
	bannerElement = document.getElementById("banner");

	//Error
	errorBoxElement = document.getElementById("error-box");
	errorTitleElement = document.getElementById("error-title");
	errorMessageElement = document.getElementById("error-message");

	//Example
	exampleElement = document.getElementById("example");
	exampleContentElement = document.getElementById("example-content");
	exampleProperties = document.getElementById("example-properties");
	exampleCanvas = document.getElementById("example-canvas");
	shaderOnlyCanvas = document.getElementById("shader-only-canvas");


	introduction = document.getElementById("introduction");
	functionList = document.getElementById("function-list");
	functionListCanvas = document.getElementById("function-list-canvas");
	functionListRenderer = new ShaderRenderer(functionListCanvas);

	introduction.style.display = "none";
	functionList.innerHTML = "";


	
	//Template example
	let example = document.getElementById("template-example");
	templateExample = example.innerHTML;

	//Homepage
	homepage = document.getElementById("homepage");

	//Page
	page = document.getElementById("page");
	pageContent = document.getElementById("page-content");
	exampleButtonsContainer = document.getElementById("example-buttons-container");
}

//Changes the visibility of html elements based on variables in the URL Params group.
function ApplyStateFromUrlParams()
{
	bannerElement.style.display = hideBanner ? "none" : "flex";
}

//Loads a page according to the variables in the URL params group.
function LoadAndShowCurrentPage()
{
	StartLoadingAction();

	//Direct load
	if (exampleID != null)
	{
		LoadAndShowExampleWithDirectID(exampleID);
	}

	//Load from name
	else if (pageName != null)
	{

	}

	//Load home page
	else
	{
		LoadHomePage();
		ShowHomePage();
	}
}

function LoadAndShowExampleWithDirectID(id)
{
	//ID is missing -> Just go to the home page
	if (id == null || id == "")
	{
		LoadHomePage();
		return;
	}

	//ID exist
	else
	{
		//Check if pageData already contains this page
		if (examplesMap != null && examplesMap.has(id))
		{
			HideHomePage();
			HideFunction();
			ShowExample(examplesMap[id]);
			return;
		}

		//Check ID through notion
		FetchNotionPage(id, (result) => 
		{
			console.log(result);

			//Bad ID error
			if (result.status == 400)
			{
				ShowError('Content missing', `The requested ID does not exist in the database:\n(${id})`);	
			}

			//Other errors
			else if (result.name == "APIResponseError")
			{
				ShowError('API response error', JSON.parse(result.body).message);	
			}

			//Create notion example & add it to Data
			else
			{
				let example = new NotionExample(result, OnExampleContentUpdated, OnExamplePropertiesUpdated);
				examplesMap.set(id, example);
				HideHomePage();
				HideFunction();
				ShowExample(example);
			}
		});
	}
}

function LoadHomePage()
{

}

function LoadLoadingShader()
{
	loading = document.getElementById("loading");

	fetch('https://niwala.github.io/shaders/loading.glsl')
	.then(response => response.text())
	.then(shader => 
		{
			loadingShader = shader;
			let shaderData = new ShaderData(loading, "loading", shader,  null);
			functionListRenderer.AddRenderer(shaderData);
		}
	);
}

function LoadNotionHome()
{
	FetchNotionDatabase((data) => 
	{
		functionNameToData = new Map();

		//Foreach entry in database
		for(let i = 0; i < data.results.length; i++)
		{
			let functionPreview = new FunctionPreview(data.results[i]);
			functionNameToData.set(functionPreview.name, functionPreview);

			//Add function to the homepage list if public
			if (functionPreview.public)
			{
				AddFunctionPreview(functionPreview);
			}
		}

		BindHomepageCanvases();

		homepage.style.display = "flex";
		introduction.style.display = "flex";
	});
}

function AddFunctionPreview(functionPreview)
{
				console.log("Add function preview");

	//Add buttons for functions
	let functionBox = "<button class='function-box' onclick=\"ReadFunctionFile('" + functionPreview.name + "')\"><div class='horizontal'><div class='vertical' style='margin-right:8px;'><h3>" +
	functionPreview.niceName + 
	"</h3><p>" + 
	functionPreview.description + 
	"</p></div><canvas id='shader-preview-" + functionPreview.name + "' width='150' height='150' class='shader-index-preview'></canvas></div></button>";
	
	let searchButton = "<button type=\"button\" class=\"search-bar-item\" id=\"search-item-" + functionPreview.name + "\" onclick=\"SelectSearchItem('" + functionPreview.name + "')\">" + functionPreview.niceName + "</button>";


	functionList.innerHTML += functionBox;
	searchBarList.innerHTML += searchButton;
	

	//Add search item
	searchItems.set((functionPreview.name + " " + functionPreview.tags).toLowerCase(), document.getElementById("search-item-" + functionPreview.name));
}

function BindHomepageCanvases()
{
	functionNameToData.forEach((value, key) =>
	{
		if (!value.public)
			return;

		//Bind canvas
		let previewId = "shader-preview-" + value.name;
		let canvas = document.getElementById(previewId);
		let shaderData = new ShaderData(canvas, previewId, value.preview, null);
		functionListRenderer.AddRenderer(shaderData);
	});
}


function SetupSearchHooks()
{
	searchBar = document.getElementById("search-bar");
	searchBarList = document.getElementById("search-bar-list");
	let searchForm = document.getElementById("search-form");
	
	searchBar.addEventListener("blur", function(event) 
	{
		if (event.relatedTarget == null || event.relatedTarget.getAttribute("class") != "search-bar-item")
		{
			StopSearch();
		}
    });
	
	searchForm.addEventListener("submit", function() 
	{
		event.preventDefault(); 
		SelectFirstSearchItem();
    });
	
	//Add shortcut on search bar
	document.addEventListener("keydown", function(event) 
	{
		if (document.activeElement === searchBar)
			return;
				
		if (event.key === "f" || event.key === "F") 
		{
			event.preventDefault();  // Empêche les comportements par défaut de la touche F
			searchBar.focus();  // Focalise la barre de recherche
		}
	});
}


function GetCleanURL()
{
	let url = document.URL;
	return url.substring(0, url.indexOf('?'));
}

function OpenFunctionFromURL()
{
	bypassUrlAdaptation = true;
		
	let params = GetURLParams();	
	let functionFromParams = params["function"];
	let exampleFromParams = params["example"];
	let exampleID = exampleFromParams == null ? 0 : exampleFromParams;
	
	if (functionFromParams != null)
	{
		ReadFunctionFile(functionFromParams, exampleID);
	}
	else
	{
		CloseFunction();
	}
	
	bypassUrlAdaptation = false;
}

function SelectFirstSearchItem()
{
	let searchText = searchBar.value.toLowerCase();
	
	if (searchText == "home")
	{
		StopSearch();
		GoHome();
		return;
	}
	
	searchItems.forEach((value, key) => 
	{
		let inSearch = key.includes(searchText);
		if (inSearch)
		{
			value.click();
			return;
		}
	});
}

function SelectSearchItem(filename)
{
	StopSearch();
	ReadFunctionFile(filename);
}

function StopSearch()
{
	searchBar.value= "";
	searchBarList.style.display = 'none';
}

function ReadFunctionFile(filename, exampleID = 0)
{	

	homepage.style.display = "none";


	//Record new current filename
	currentFileName = filename;

	if (!functionNameToData.has(filename))
	{
		console.error("Function not found : " + filename);
		return;
	}

	let functionID = functionNameToData.get(filename).id;
	FetchNotionPage(functionID, (pageData) => 
	{
		BuildHtmlFromPage(pageData, (updatedHtml) => {pageContent.innerHTML = updatedHtml;});
		page.style.display = "flex";
	});
}

function RemoveExtension(filename)
{
	return filename.replace(/\.[^/\\.]+$/, "")
}

function OpenPage(filename)
{
	console.log("Open " + filename);
}

function OpenFunction(data, exampleID = 0)
{
	//Hide introduction
	introduction.style.display = "none";

	//Record new current function
	currentFunction = data;
	
	exampleList = new Array();
	sliderList = new Array();
	toggleList =  new Array();
	colorFieldList = new Array();
	
	let content = templateContainer;
	content = content.replace(/template-title/g, data.name);
	content = content.replace(/template-description/g, data.description);
	
	//Example buttons
	let exampleButtons = "";
	let exampleCount = data.examples == null ? 0 : data.examples.length;
	for	(let i = 0; i < exampleCount; i++)
	{
		exampleButtons += BuildExampleButton(data.examples[i], data.name, i, exampleID);
	}
	content = content.replace(/template-buttons/g, exampleButtons);
	exampleButtonsContainer.innerHTML = exampleButtons;
	
	//Add all examples
	let examples = "";
	for	(let i = 0; i < exampleCount; i++)
	{
		//Start example
		let exampleContent = templateExample;
		let example = data.examples[i];
		let exampleHtmlID = data.name + "-" + example.name;
		examples += "<div id=\"" + exampleHtmlID + "\" style='flex-wrap:wrap'>";
		exampleList.push(exampleHtmlID);
		
		//Example > content
		exampleContent = exampleContent.replace(/example-name/g, example.name);
		exampleContent = exampleContent.replace(/example-description/g, example.description);
		
		
		//Example > Properties
		let propertyCount = example.properties == null ? 0 : example.properties.length;
		let properties = "";
		for	(let j = 0; j < propertyCount; j++)
		{
			let property = example.properties[j];
			let propertyHtmlID = sliderHtmlID = data.name + "-" + example.name + "-" + property.name;
			
			switch (property.type)
			{
				case "range":
					sliderList.push(propertyHtmlID);
					properties += BuildSlider(propertyHtmlID, data.name + "-" + example.name, property);
				break;
				
				case "toggle":
					toggleList.push(propertyHtmlID);
					properties += BuildToggle(propertyHtmlID, data.name + "-" + example.name, property);
				break;
				
				case "color":
					colorFieldList.push(propertyHtmlID);
					properties += BuildColorPicker(propertyHtmlID, data.name + "-" + example.name, property);
				break;
			}
		}
		exampleContent = exampleContent.replace(/example-properties/g, properties);


		//Example > Code
		exampleContent = exampleContent.replace(/example-code/g, example.code);
		
		//Example > Canvas
		exampleContent = exampleContent.replace(/example-canvas-id/g, data.name + "-" + example.name + "-canvas");
		
		//Close example
		examples += exampleContent + "</div>";
	}
	content = content.replace(/template-examples/g, examples);
	
	
	//Apply new html & show content container
	let contentContainer = document.getElementById("content-container");
	contentContainer.style.display = 'flex';
	contentContainer.innerHTML = content;
	
	//Hide function list
	let functionBox = document.getElementById("function-list");
	functionBox.style.display = 'none';
	
	//Update Prism
	Prism.highlightAll();
	
	
	//Open example
	OpenExample(exampleID);
	
	
	//Bind canvas
	const renderers = new Map();
	for (let i = 0; i < exampleCount; i++)
	{
		let exampleID = data.name + "-" + data.examples[i].name;
		let canvasID = exampleID + "-canvas"
		let canvas = document.getElementById(canvasID);
		
		let shaderData = new ShaderData(canvas, exampleID, data.examples[i].shader,  data.examples[i].properties);
		functionListRenderer.AddRenderer(shaderData);
		renderers.set(data.name + "-" + data.examples[i].name, shaderData);
	}
	
	//Bind properties > Sliders
	for (let i = 0; i < sliderList.length; i++)
	{
		let slider = document.getElementById(sliderList[i]);
		let field = document.getElementById("field-" + sliderList[i]);

		let exampleName = slider.getAttribute("data-example-name");
		let renderer = renderers.get(exampleName);

        renderer.SetFloatValue(slider.id, slider.value);
        field.innerText = slider.value;
		
		slider.oninput = function() 
		{
			let dn = this.getAttribute("data-example-name");
			let r = renderers.get(dn);
			
			r.SetFloatValue(this.id, this.value);
			field.innerText = this.value;
		};
	}
	
	//Bind properties > Toggles
	for (let i = 0; i < toggleList.length; i++)
	{
		let toggle = document.getElementById(toggleList[i]);
		let exampleName = toggle.getAttribute("data-example-name");
		let renderer = renderers.get(exampleName);

        renderer.SetFloatValue(toggle.id, toggle.value ? 1.0 : 0.0);
		
		toggle.oninput = function() 
		{
			let dn = this.getAttribute("data-example-name");
			let r = renderers.get(dn);
			
			r.SetFloatValue(this.id, toggle.checked ? 1.0 : 0.0);
		};
	}
	
	//Bind properties > Colors
	for (let i = 0; i < colorFieldList.length; i++)
	{
		let colorField = document.getElementById(colorFieldList[i]);

		let exampleName = colorField.getAttribute("data-example-name");
		let renderer = renderers.get(exampleName);

		let color = HexToRGB(colorField.value);
        renderer.SetColorValue(colorField.id, color);
		
		colorField.oninput = function() 
		{
			let dn = this.getAttribute("data-example-name");
			let r = renderers.get(dn);
			
			let c = HexToRGB(this.value);
			r.SetColorValue(this.id, c);
		};
	}
}

function OpenExample(id)
{	
	//Record new current example
	currentExample = currentFunction.examples[id];
	
	//Update url parameters
	if (!bypassUrlAdaptation)
	{
		const url = new URL(document.URL);
		let shortName = RemoveExtension(currentFileName);
		url.searchParams.set('function', shortName);
		url.searchParams.set('example', id);
		
		document.title = "Shader Functions (" + currentFunction.name + ")";
		window.history.pushState('data', "Shader Functions (" + currentFunction.name + ")", url.href);
	}

	//Enable selected example
	for	(let i = 0; i < exampleList.length; i++)
	{
		let example = document.getElementById(exampleList[i]);
		
		if (i == id)
			example.style.display = 'flex';
		else
			example.style.display = 'none';
	}
}

function CloseFunction()
{
	//Close introduction
	introduction.style.display = "flex";

	if (!bypassUrlAdaptation)
	{
		//Update url parameters
		const url = new URL(document.URL);
		let shortName = RemoveExtension(currentFileName);
		url.searchParams.delete('function');
		url.searchParams.delete('example');
		
		document.title = "Shader Functions";
		window.history.pushState('data', "Shader Functions", url.href);
	}
	
	//Hide content container
	let contentContainer = document.getElementById("content-container");
	contentContainer.style.display = 'none'; 
	
	//Show function list
	let functionBox = document.getElementById("function-list");
	functionBox.style.display = 'flex';
}

function GoHome()
{
	CloseFunction();
}

function BuildExampleButton(example, group, id, selectedID = 0)
{
	return "<input type=\"radio\" id=\"button-" + id + "\" name=\"button-" + group + "\" " + (id == selectedID ? "checked" : "") + " onclick=\"OpenExample(" + id + ")\"><label for=\"button-" + id + "\">" + example.name + "</label></input>";
}

function SearchFunction(search)
{
	let searchText = searchBar.value.toLowerCase();
	
	if (searchText.length == 0)
	{
		searchBarList.style.display = 'none';
	}
	else
	{
		searchBarList.style.display = 'flex';
	}
	
	searchItems.forEach((value, key) => 
	{
		let inSearch = key.includes(searchText);
		value.style.display = inSearch ? 'flex' : 'none';
	});
	
}