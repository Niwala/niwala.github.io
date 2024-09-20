parse();

function parse()
{
	var contentContainer = document.getElementById("content-container");
	
	contentContainer.innerHTML = "test";
	
	fetch("sine.pack")
	  .then((res) => res.text())
	  .then((text) => {
		  print(text);
		// do something with "text"
	   })
	  .catch((e) => console.error(e));
	
}
