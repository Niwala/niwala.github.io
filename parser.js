Parse();

//Templates
var templateContainer;
var templateExample;


var exampleList;
var sliderList;
var toggleList;
var colorFieldList;

function Parse()
{
	LoadTemplates();
	ReadAllFunctions();
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

function ReadAllFunctions()
{
	let index;
		fetch("https://niwala.github.io/functions.json")
		.then(response => response.json())
		.then(jsonResponse => ReadFunctions(jsonResponse.functions))     
	  	.catch((e) => console.error(e));
}

function ReadFunctions(functions)
{
	for (var i = 0; i < functions.length; i++) 
	{
		let filename = "https://niwala.github.io/functions/" + functions[i];

	  	fetch(filename)
		.then(response => response.json())
		.then(jsonResponse => ReadJson(jsonResponse)) 
	  	.catch((e) => console.error(e));
	}
}

function ReadJson(data)
{
	exampleList = new Array();
	sliderList = new Array();
	toggleList =  new Array();
	colorFieldList = new Array();
	
	let content = templateContainer;
	content = content.replace(/template-title/g, data.name);
	content = content.replace(/template-description/g, data.description);
	
	
	//Example buttons
	let exampleButtons = "";
	for	(let i = 0; i < data.examples.length; i++)
	{
		exampleButtons += BuildExampleButton(data.examples[i], data.name, i);
	}
	content = content.replace(/template-buttons/g, exampleButtons);
	
	
	//Add all examples
	let examples = "";
	for	(let i = 0; i < data.examples.length; i++)
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
		let properties = "";
		for	(let i = 0; i < example.properties.length; i++)
		{
			let property = example.properties[i];
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
	
	
	//Apply new html
	let contentContainer = document.getElementById("content-container");
	contentContainer.innerHTML = content;
	
	//Update Prism
	Prism.highlightAll();
	
	
	//Open first example
	OpenExample(0);
	
	

	//Bind canvas
	const renderers = new Map();
	for (let i = 0; i < data.examples.length; i++)
	{
		let canvasID = data.name + "-" + data.examples[i].name + "-canvas"
		let canvas = document.getElementById(canvasID);
		
		var shaderRenderer = new ShaderRenderer(canvas, data, data.examples[i]);
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
	for	(let i = 0; i < exampleList.length; i++)
	{
		let example = document.getElementById(exampleList[i]);
		
		if (i == id)
			example.style.display = 'flex';
		else
			example.style.display = 'none';
	}
}

function BuildExampleButton(example, group, id)
{
	return "<input type=\"radio\" id=\"button-" + id + "\" name=\"button-" + group + "\" " + (id == 0 ? "checked" : "") + " onclick=\"OpenExample(" + id + ")\"><label for=\"button-" + id + "\">" + example.name + "</label></input>";
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

