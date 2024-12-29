var currentExampleFields = new Map();
var isDragging;
var dragGuid;
var dragPosition;
var currentShaderData;

//Drag stuf -------------------------------------
document.addEventListener('mouseup', () => 
{
	if (isDragging != null) 
	{
			isDragging = null;
			dragGuid = "";
			document.removeEventListener('mousemove', onDrag);
	}
});

function StartDrag(guid, type)
{
	isDragging = type;
	dragGuid = guid;
	dragPosition = event.clientX;
	document.addEventListener('mousemove', onDrag);
}

function onDrag()
{
	if (isDragging == null)
		return;

	let delta = parseFloat(dragPosition) - parseFloat(event.clientX);
	dragPosition = event.clientX;

	switch(isDragging)
	{
		case "FloatField": FloatFieldDrag(dragGuid, delta); break;
		case "SliderField": SliderFieldDrag(dragGuid, delta); break;

	}
}



//Toggle ---------------------------------------
class ToggleField
{
	constructor(name, defaultValue)
	{
		this.name = name;
		this.value = defaultValue;
		this.SetValue(this.value);
	}

	CreateHtml(exampleID)
	{
		this.guid = exampleID + "-" + this.name;
		currentExampleFields.set(this.guid, this);

		return "<div class='shader-property' id='" + this.guid + "'>" + 
			"<p style='user-select: none; cursor: pointer;' onmousedown='SwitchSetToggle(this)'>" + this.name + "</p>" + 
			"<label class=\"toggle-container\">" +
			"<input type=\"checkbox\" onchange=\"SetToggleValue(this)\"" + (this.value ? "checked" : "") + " id='field-" + this.guid + "'>" +
			"<span class=\"checkmark\"></span>" +
			"</label></div>";
	}

	SetValue(value)
	{
		this.value = value;
		if (currentShaderData != null)
		{
			currentShaderData.SetFloatValue(this.name, value ? 1.0 : 0.0);
		}
	}
}

function SetToggleValue(element)
{
	let guid = element.parentElement.parentElement.id;
	let toggleData = currentExampleFields.get(guid);
	let field = document.getElementById("field-" + guid);

	toggleData.SetValue(field.checked);
}

function SwitchSetToggle(element)
{
	let guid = element.parentElement.id;
	let toggleData = currentExampleFields.get(guid);
	let field = document.getElementById("field-" + guid);

	field.checked = !field.checked;
	toggleData.SetValue(field.checked);
}




//Float field --------------------------------------
class FloatField
{
	constructor(name, defaultValue)
	{
		this.name = name;
		this.value = defaultValue;

		this.SetValue(this.value);
	}

	CreateHtml(exampleID)
	{
		this.guid = exampleID + "-" + this.name;
		currentExampleFields.set(this.guid, this);

		return "<div class='shader-property' id='" + this.guid + "'>" + 
			"<p name='" + this.guid + "' style='user-select: none; cursor: ew-resize;' onmousedown=\"StartDrag('" + this.guid + "', 'FloatField')\">" + this.name + "</p>" + 
			"<input type='number' class='float-field' oninput='SetFloatValue(this)' value='" + this.value + "' id='field-" + this.guid + "'/>" +
			"</div>";
	}

	SetValue(value)
	{
		this.value = value;
		if (currentShaderData != null)
		{
			currentShaderData.SetFloatValue(this.name, value);
		}
	}
}

function SetFloatValue(element)
{
	let guid = element.parentElement.id;
	let floatData = currentExampleFields.get(guid);

	let field = document.getElementById("field-" + guid);
	floatData.SetValue(field.value);
}

function FloatFieldDrag(guid, delta)
{
	let floatData = currentExampleFields.get(guid);
	let field = document.getElementById("field-" + guid);
	let value = parseFloat(field.value);
	value -= parseFloat(delta) * 0.1;
	value = Math.round(value * 100) / 100;
	field.value = value;
	floatData.SetValue(field.value);	
}


//Slider field --------------------------------------
class SliderField
{
	constructor(name, defaultValue, min, max)
	{
		this.name = name;
		this.value = defaultValue;
		this.min = min;
		this.max = max;
		this.SetValue(defaultValue);
	}

	CreateHtml(exampleID)
	{
		this.guid = exampleID + "-" + this.name;
		currentExampleFields.set(this.guid, this);

		return "<div class='shader-property' id='" + this.guid +"'>" + 
			"<p style='user-select: none; cursor: ew-resize;' onmousedown=\"StartDrag('" + this.guid + "', 'SliderField')\">" + this.name + "</p>" + 
			"<input type=\"range\" oninput=\"SetSliderValue(this)\" min=\"" + this.min + "\" max=\"" + this.max + "\" value=\"" + this.value + "\" step=\"" + 0.01 + "\" class='slider' id='slider-" + this.guid +"'>" +
			"<p class=\"slider-value\"><span id='field-" + exampleID + "-" + this.name + "'>" + this.value + "</span></p></div>";
	}

	SetValue(value)
	{
		this.value = value;

		if (currentShaderData != null)
		{
			currentShaderData.SetFloatValue(this.name, value);
		}
	}
}

function SetSliderValue(slider)
{
	let guid = slider.parentElement.id;
	let sliderData = currentExampleFields.get(guid);
	let value = parseFloat(slider.value);

	//Update text
	let label = document.getElementById("field-" + guid);
	label.innerText = value.toFixed(2);
	sliderData.SetValue(value);
}

function SliderFieldDrag(guid, delta)
{
	let sliderData = currentExampleFields.get(guid);

	//Update slider
	let slider = document.getElementById("slider-" + guid);
	let value = parseFloat(slider.value);
	value -= parseFloat(delta) * 0.005 * (sliderData.max - sliderData.min);
	value = Math.min(Math.max(sliderData.min, value), sliderData.max);
	slider.value = value;

	//Update text
	let label = document.getElementById("field-" + guid);
	label.innerText = value.toFixed(2);
	sliderData.SetValue(value);
}



//Color field --------------------------------------
class ColorField
{
	constructor(name, defaultValue)
	{
		this.name = name;

		this.hexColor = defaultValue;
		let c = HexToRGB(defaultValue);
		this.value = `R: ${c[0]} G: ${c[1]} B: ${c[2]} A: 1.00`;

		let color = ParseNormalizedColor(this.value);
		this.SetValue([color[1], color[2], color[3], color[4]]);
	}

	CreateHtml(exampleID)
	{
		this.guid = exampleID + "-" + this.name;
		currentExampleFields.set(this.guid, this);

		return "<div class='shader-property'>" + 
			"<p style='user-select: none; cursor: default;'>" + this.name + "</p>" +
				"<div class=color-field>" +
					"<input type='text' style='background-color:" + this.hexColor + ";' value='" + this.hexColor + "' class='coloris test' data-coloris onmousedown='ConfigureColorPicker(this)' oninput=\"SetColorValue(this)\" id=\"" + this.guid + "\">" +
				"</div>" +
			"</div>";
	}

	SetValue(value)
	{
		this.value = value;
		if (currentShaderData != null)
		{
			currentShaderData.SetColorValue(this.name, value);
		}
	}
}

function ConfigureColorPicker(element)
{
	Coloris.setInstance('.test', {
      theme: 'pill',
      themeMode: 'dark',
		format: 'unit',
      swatches: [
        '#000000',
        '#FFFFFF',
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#FFFF00',
        '#FF00FF',
        '#00FFFF'
      ]
    });
}

function SetColorValue(element)
{
	let guid = element.id;
	let colorData = currentExampleFields.get(guid);

	let color = ParseNormalizedColor(element.value);
	element.style.backgroundColor = color[0];

	colorData.SetValue([color[1], color[2], color[3], color[4]]);
}

function ParseNormalizedColor(colorString) 
{
    const match = colorString.match(/R:\s*([\d.]+)\s*G:\s*([\d.]+)\s*B:\s*([\d.]+)\s*A:\s*([\d.]+)/);

    if (!match) 
	 {
        return 'rgba(0, 0, 0, 0)';
    }

    const [_, r, g, b, a] = match.map(parseFloat);

    if ([r, g, b, a].some(val => val < 0 || val > 1)) 
	 {
        return 'rgba(0, 0, 0, 0)';
    }

    const red = Math.round(r * 255);
    const green = Math.round(g * 255);
    const blue = Math.round(b * 255);

    return [`rgba(${red}, ${green}, ${blue}, ${a.toFixed(2)})`, r, g, b, a];
}

function HexToRGB(h) 
{
  let r = 0, g = 0, b = 0;

  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
    
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }
    
  {
    r = +(r / 255).toFixed(2);
    g = +(g / 255).toFixed(2);
    b = +(b / 255).toFixed(2);
  }
  
  return [r, g, b];
}