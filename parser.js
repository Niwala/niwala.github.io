Parse();

//Templates
var templateContainer;
var templatePropertySlider;
var templatePropertyColor;
var templatePropertyCode;
var templateSwitchButton;

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
	// container.style.display = 'none';
	
	//Property Slider
	var propertySlider = document.getElementById("template-property-slider");
	templatePropertySlider = propertySlider.innerHTML;
	//propertySlider.style.display = 'none';
	
	//Property color
	var propertyColor = document.getElementById("template-property-color");
	templatePropertyColor = propertyColor.innerHTML;
	//propertyColor.style.display = 'none';

	//Code
	var propertyCode = document.getElementById("template-code");
	templatePropertyCode = propertyCode.innerHTML;
	//propertyCode.style.display = 'none';

	//Switch buttons
	var switchField = document.getElementById("template-switch");
	templateSwitchButton = switchField.innerHTML;
	//switchField.style.display = 'none';
}

function ReadJson(data)
{
	//Variants
	// var allSwitchButtons = "";
	
	// for	(let i = 0; i < data.examples.length; i++)
	// {
		// var s = templateSwitchButton.replace(/button-id/g, "button" + i);
		// s = s.replace(/button-group/g, "group-0");
		// s = s.replace(/button-value/g, i == 0 ? "true" : "false");
		// s = s.replace(/template-button/g, data.examples[i].name);
		// allSwitchButtons += s;
	// }
	
	
	// switchField.innerHTML = allSwitchButtons;
	
	// //Build container
	// var container = templateContainer;
	// container = container.replace(/template-title/g, data.name);
	// container = container.replace(/template-description/g, data.description);
	
	var content = templateContainer;
	content = content.replace(/template-title/g, data.name);
	content = content.replace(/template-description/g, data.description);
	
	
	//Example
	var exampleID = 0;
	var example = data.examples[exampleID];
	
	content = content.replace(/example-name/g, example.name);
	content = content.replace(/example-description/g, example.description);
	
	content = content.replace(/example-properties/g, BuildSlider("TestSlider", 2, 0, 5, 0.01, "TestSliderID"));

	var contentContainer = document.getElementById("content-container");
	contentContainer.innerHTML = content;
	
}

function BuildSlider(name, value, minValue, maxValue, step, shaderID)
{
	return "<div class=\"slider-container\"><p>" + name + "</p>" + 
	"<input type=\"range\" min=\"" + minValue + "\" max=\"" + maxValue + "\" value=\"" + value + "\" step=\"" + step + "\" class=\"slider\"/ id=\"slider-" + name +"\"></div>" +
	"<p class=\"slider-value\"><span id=\"slider-field-" + name + "\">50</span></p>";
}
