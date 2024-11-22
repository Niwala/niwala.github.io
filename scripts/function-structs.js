

class ToggleField
{
	constructor(name, defaultValue)
	{
		this.name = name;
		this.value = defaultValue;
		console.log("build toggle field");
	}
}

class FloatField
{
	constructor(name, defaultValue)
	{
		this.name = name;
		this.value = defaultValue;
		console.log("build float field");
	}
}

class SliderField
{
	constructor(name, defaultValue, min, max)
	{
		this.name = name;
		this.value = defaultValue;
		this.min = min;
		this.max = max;
		console.log("build slider field");
	}
}

class ColorField
{
	constructor(name, defaultValue)
	{
		this.name = name;
		this.defaultValue = defaultValue;
		console.log("build color field");
	}
}