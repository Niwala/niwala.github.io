Parse();

//Templates
var templateContainer;
var templateExample;


var exampleList;
var sliderList;
var colorFieldList;

function Parse()
{
	LoadTemplates();
	
	fetch("https://niwala.github.io/sine.json")
		.then(response => response.json())
		.then(jsonResponse => ReadJson(jsonResponse))     
	  .catch((e) => console.error(e));
	
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

function ReadJson(data)
{
	exampleList = new Array();
	sliderList = new Array();
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
				case "float":
					sliderList.push(propertyHtmlID);
					properties += BuildSlider(propertyHtmlID, property);
				break;
				
				case "color":
					colorFieldList.push(propertyHtmlID);
					properties += BuildColorPicker(propertyHtmlID, property);
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
	
	
	//Bind properties
	for (let i = 0; i < sliderList.length; i++)
	{
		let slider = document.getElementById("slider-" + sliderList[i]);
		let field = document.getElementById("slider-field-" + sliderList[i]);
		field.innerText = slider.value;

		slider.oninput = function() 
		{
		  field.innerText = this.value;
		}
	}
	
	//Bind canvas
	for (let i = 0; i < data.examples.length; i++)
	{
		let canvasID = data.name + "-" + data.examples[i].name + "-canvas"
		let canvas = document.getElementById(canvasID);
		ApplyShader(canvas, data.examples[i].shader);
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
	return "<input type=\"radio\" id=\"button-" + id + "\" name=\"button-" + group + "\" value=\"" + (id == 0 ? "true" : "false") + "\" onclick=\"OpenExample(" + id + ")\"><label for=\"button-" + id + "\">" + example.name + "</label></input>";
}

function BuildSlider(htmlID, property)
{
	return "<div class=\"slider-container\">" + 
	"<p>" + property.name + "</p>" + 
	"<input type=\"range\" min=\"" + property.min + "\" max=\"" + property.max + "\" value=\"" + property.value + "\" step=\"" + 0.01 + "\" class=\"slider\"/ id=\"slider-" + htmlID +"\">" +
	"<p class=\"slider-value\"><span id=\"slider-field-" + htmlID + "\">50</span></p></div>";
}

function BuildColorPicker(htmlID, property)
{
	return "<div class=\"slider-container\">" + 
	"<p>" + property.name + "</p>" +
	"<input type=\"color\" value=\"" + property.value + "\" class=\"color-picker\" id=\"color-" + htmlID + "\"/>" +
	"</div>";
}

