Parse();
SetupSearchHooks();

//Templates
var templateContainer;
var templateExample;


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

function Parse()
{
	LoadTemplates();
	ReadFunctionsIndex();
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

function GetURLParams() 
{
	var idx = document.URL.indexOf('?');
	var params = new Array();
	if (idx != -1) 
	{
		var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
		for (var i = 0; i < pairs.length; i++) 
		{
			nameVal = pairs[i].split('=');
			params[nameVal[0]] = nameVal[1];
	   }
	}
	return params;
}

function LoadTemplates()
{
	//Template container
	container = document.getElementById("template")
	templateContainer = container.innerHTML;
	
	//Template example
	let example = document.getElementById("template-example")
	templateExample = example.innerHTML;
	
	//Hide template
	container.style.display = 'none';
}

function ReadFunctionsIndex()
{
	let index;
		fetch("https://niwala.github.io/functions.json")
		.then(response => response.json())
		.then(jsonResponse => AddFunctions(jsonResponse.functions))     
	  	.catch((e) => console.error(e));
}

function AddFunctions(functions)
{
	//Add buttons for functions
	let list = "";
	let searchList = "";
	searchItems = new Map();
	for (var i = 0; i < functions.length; i++) 
	{		
		list += "<button class='function-box' onclick=\"ReadFunctionFile('" + functions[i].filename + "')\"><div class='horizontal'><div class='vertical'><h3>" +
		functions[i].name + 
		"</h3><p>" + 
		functions[i].description + 
		"</p></div><canvas id='shader-preview-" + functions[i].name + "' width='150' height='150' class='shader-index-preview'></canvas></div></button>";
		
		searchList += "<button type=\"button\" class=\"search-bar-item\" id=\"search-item-" + functions[i].name + "\" onclick=\"SelectSearchItem('" + functions[i].filename + "')\">" + functions[i].name + "</button>";
	}
	let btnContainer = document.getElementById("function-list");
	btnContainer.innerHTML = list;
	searchBarList.innerHTML = searchList;
	
	
	//List search items & Bind shader preview canvases
	for (var i = 0; i < functions.length; i++) 
	{
		searchItems.set((functions[i].name + " " + functions[i].tags).toLowerCase(), document.getElementById("search-item-" + functions[i].name));
		
		let previewId = "shader-preview-" + functions[i].name;
		let canvas = document.getElementById(previewId);
		let shaderRenderer = new ShaderRenderer(canvas, previewId, functions[i].previewShader, null);
	}
	
	
	//Auto-read function from url params
	let params = GetURLParams();	
	let functionFromParams = params["function"];
	let exampleFromParams = params["example"];
	let exampleID = exampleFromParams == null ? 0 : exampleFromParams;
	
	if (functionFromParams != null)
	{
		funcLoop : for (var i = 0; i < functions.length; i++) 
		{			
			if (RemoveExtension(functions[i].filename) == functionFromParams)
			{
				//Read function + example
				ReadFunctionFile(functions[i].filename, exampleID);
								
				//break
				break funcLoop;
			}
		}
	}
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
	console.log("Read " + filename);
	
	//Record new current filename
	currentFileName = filename;
	
	//Read file
	let fileUrl = "https://niwala.github.io/functions/" + filename;
	fetch(fileUrl)
	.then(response => response.json())
	.then(jsonResponse => OpenFunction(jsonResponse, exampleID)) 
	.catch((e) => console.error(e));
}

function RemoveExtension(filename)
{
	return filename.replace(/\.[^/\\.]+$/, "")
}

function OpenFunction(data, exampleID = 0)
{
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
	
	
	//Add all examples
	let examples = "";
	for	(let i = 0; i < exampleCount; i++)
	{
		//Start example
		let exampleContent = templateExample;
		let example = data.examples[i];
		let exampleHtmlID = data.name + "-" + example.name;
		examples += "<div id=\"" + exampleHtmlID + "\">";
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
		let canvasID = data.name + "-" + data.examples[i].name + "-canvas"
		let canvas = document.getElementById(canvasID);
		
		var shaderRenderer = RendererFromExample(canvas, data, data.examples[i]);
		renderers.set(data.name + "-" + data.examples[i].name, shaderRenderer);
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
}

function OpenExample(id)
{	
	//Record new current example
	currentExample = currentFunction.examples[id];
	
	//Update url parameters
	const url = new URL(document.URL);
	let shortName = RemoveExtension(currentFileName);
	url.searchParams.set('function', shortName);
	url.searchParams.set('example', id);
	
	document.title = "Shader Functions (" + currentFunction.name + ")";
	window.history.pushState('data', "Shader Functions (" + currentFunction.name + ")", url.href);

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
	//Update url parameters
	const url = new URL(document.URL);
	let shortName = RemoveExtension(currentFileName);
	url.searchParams.delete('function');
	url.searchParams.delete('example');
	
	document.title = "Shader Functions";
	window.history.pushState('data', "Shader Functions", url.href);
	
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

function BuildSlider(htmlID, dataExampleName, property)
{
	return "<div class=\"slider-container\">" + 
	"<p>" + property.name + "</p>" + 
	"<input type=\"range\" data-example-name=\"" + dataExampleName + "\" min=\"" + property.min + "\" max=\"" + property.max + "\" value=\"" + property.value + "\" step=\"" + 0.01 + "\" class=\"slider\"/ id=\"" + htmlID +"\">" +
	"<p class=\"slider-value\"><span id=\"field-" + htmlID + "\">50</span></p></div>";
}

function BuildToggle(htmlID, dataExampleName, property)
{
	return "<div class=\"slider-container\">" + 
	"<p>" + property.name + "</p>" + 
	"<label class=\"toggle-container\">" +
	"<input type=\"checkbox\" data-example-name=\"" + dataExampleName + "\"" + (property.value ? "checked" : "") + " id=\"" + htmlID +"\">" +
	"<span class=\"checkmark\"></span>" +
	"</label></div>";
}

function BuildColorPicker(htmlID, dataExampleName, property)
{
	return "<div class=\"slider-container\">" + 
	"<p>" + property.name + "</p>" +
	"<input type=\"color\" data-example-name=\"" + dataExampleName + "\" value=\"" + property.value + "\" class=\"color-picker\" id=\"" + htmlID + "\"/>" +
	"</div>";
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