Parse();

function Parse()
{
	fetch("https://niwala.github.io/sine.json")
		.then(response => response.json())
		.then(jsonResponse => ReadJson(jsonResponse))     
	  .catch((e) => console.error(e));
	
}

function ReadJson(data)
{
	
	//Variants
	var switchField = document.getElementById("template-switch");
	var templateSwitchButton = switchField.innerHTML;
	var allSwitchButtons = "";
	
	for	(let i = 0; i < data.examples.length; i++)
	{
		var s = templateSwitchButton.replace(/button-id/g, "button" + i);
		s = s.replace(/button-group/g, "group-0");
		s = s.replace(/button-value/g, i == 0 ? "true" : "false");
		s = s.replace(/template-button/g, data.examples[i].name);
		allSwitchButtons += s;
	}
	
	
	switchField.innerHTML = allSwitchButtons;
	
	var templateElement = document.getElementById("template")
	var template = templateElement.innerHTML;
	// templateElement.style.display = 'none';
	
	template = template.replace(/template-title/g, data.name);
	template = template.replace(/template-description/g, data.description);
	

	
	var contentContainer = document.getElementById("content-container");
	contentContainer.innerHTML = template + template + template + template;
	
}
