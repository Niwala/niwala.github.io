class ShaderRenderer
{
	constructor(canvas, data, example)
	{
		this.canvas = canvas;
		this.data = data;
		this.example = example;
		
		this.locations = new Map();
		this.floatValues = new Map();
		this.colorValues = new Map();
		
		
		//Load gl context
		this.gl = canvas.getContext('webgl');
		
		if (!this.gl) 
		{
			alert('Unable to initialize WebGL. Your browser or machine may not support it.');
			return;
		}
		
		
		//Build uniforms
		let uniforms = "";
		for (let j = 0; j < this.example.properties.length; j++)
		{
			let property = this.example.properties[j];
			
			switch (property.type)
			{
				case "float":
				uniforms += "\nuniform highp float " + property.id + ";";
				break;
				
				case "color":
				uniforms += "\nuniform highp vec3 " + property.id + ";";
				break;
			}
		}
		
		
		//Build shaders > Vertex
		let vertexShader = 
`
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(void) 
{
	gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	vTextureCoord = aTextureCoord;
}
`;

		//Build shaders > Fragment
		let fragmentShader = 
`
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform highp vec4 testColor;
uniform highp float time;
	
//Custom properties` + uniforms + ` 

void main(void) 
{
	highp vec2 uv = gl_FragCoord.xy / 200.0;
	highp vec3 color = vec3(0.0);
		
	//Custom frag
	` + this.example.shader + `
		
	gl_FragColor = vec4(color, 1.0);
}
`;
		
		//Log shader for dev purposes
		console.log("Frag shader\n" + fragmentShader);

		// Initialize a shader program; this is where all the lighting
		// for the vertices and so forth is established.
		this.shaderProgram = this.initShaderProgram(this.gl, vertexShader, fragmentShader);
		  
		//Get properties locations > Built-in properties
		this.timeLocation = this.gl.getUniformLocation(this.shaderProgram, "time");
		
		//Get properties locations > Example properties
		for	(let i = 0; i < this.example.properties.length; i++)
		{
			let property = this.example.properties[i];
			let propHtmlName = this.data.name + "-" + this.example.name + "-" + property.name
			let loc = this.gl.getUniformLocation(this.shaderProgram, property.id);
			this.locations.set(propHtmlName, loc);
			
			switch(property.type)
			{
				case "float":
				this.floatValues.set(propHtmlName, 0.0);
				break;
				
				case "color":
				this.colorValues.set(propHtmlName, [0.0, 0.0, 0.0]);
				break;
			}
		}

		// Collect all the info needed to use the shader program.
		// Look up which attributes our shader program is using
		// for aVertexPosition, aTextureCoord and also
		// look up uniform locations.
		this.programInfo = {
			program: this.shaderProgram,
			attribLocations: {
			  vertexPosition: this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
			  textureCoord: this.gl.getAttribLocation(this.shaderProgram, 'aTextureCoord'),
			},
			uniformLocations: {
			  projectionMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
			  modelViewMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
			  uSampler: this.gl.getUniformLocation(this.shaderProgram, 'uSampler'),
			}
		  };

		// Here's where we call the routine that builds all the
		// objects we'll be drawing.
		this.buffers = this.initBuffers(this.gl);


		var then = 0;

		// Draw the scene repeatedly
		this.render = (now) =>  
		{
			now *= 0.001;  // convert to seconds
			this.deltaTime = now - then;
			then = now;
			
			this.time = now;
						
			this.drawScene(this.gl, this.programInfo, this.buffers, null, now, this.deltaTime);

			requestAnimationFrame(this.render);
		}
		requestAnimationFrame(this.render);
	}
	
	SetFloatValue(name, value)
	{
		this.floatValues.set(name, value);
	}
	
	SetColorValue(name, value)
	{
		this.colorValues.set(name, value);
	}
	
	UpdateProperties()
	{
		//Built-in Properties
		this.gl.uniform1f(this.timeLocation, this.time);
		
		//Example properties
		this.floatValues.forEach((value, key) => 
		{
			let loc = this.locations.get(key);
			this.gl.uniform1f(loc, value);
		});
		
		this.colorValues.forEach((value, key) => 
		{
			let loc = this.locations.get(key);
			this.gl.uniform3f(loc, value);
		});
	}
	
	//
	// initBuffers
	//
	// Initialize the buffers we'll need. For this demo, we just
	// have one object -- a simple three-dimensional cube.
	//
	initBuffers(gl) 
	{

	  // Create a buffer for the cube's vertex positions.
	  this.positionBuffer = gl.createBuffer();

	  // Select the positionBuffer as the one to apply buffer
	  // operations to from here out.

	  gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

	  // Now create an array of positions for the cube.

	  this.positions = [
		// Front face
		-1.0, -1.0,  1.0,
		 1.0, -1.0,  1.0,
		 1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,
	  ];

	  // Now pass the list of positions into WebGL to build the
	  // shape. We do this by creating a Float32Array from the
	  // JavaScript array, then use it to fill the current buffer.

	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

	  // Now set up the texture coordinates for the faces.

	  this.textureCoordBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

	  this.textureCoordinates = [
		// Front
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
	  ];

	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),
					gl.STATIC_DRAW);

	  // Build the element array buffer; this specifies the indices
	  // into the vertex arrays for each face's vertices.

	  this.indexBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

	  // This array defines each face as two triangles, using the
	  // indices into the vertex array to specify each triangle's
	  // position.

	  this.indices = [
		0,  1,  2,      0,  2,  3,    // front
	  ];

	  // Now send the element array to GL

	  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
		  new Uint16Array(this.indices), gl.STATIC_DRAW);

	  return {
		position: this.positionBuffer,
		textureCoord: this.textureCoordBuffer,
		indices: this.indexBuffer,
	  };
	}

	//
	// Initialize a texture and load an image.
	// When the image finished loading copy it into the texture.
	//
	loadTexture(gl, url) 
	{
	  const texture = gl.createTexture();
	  gl.bindTexture(gl.TEXTURE_2D, texture);

	  // Because images have to be download over the internet
	  // they might take a moment until they are ready.
	  // Until then put a single pixel in the texture so we can
	  // use it immediately. When the image has finished downloading
	  // we'll update the texture with the contents of the image.
	  const level = 0;
	  const internalFormat = gl.RGBA;
	  const width = 1;
	  const height = 1;
	  const border = 0;
	  const srcFormat = gl.RGBA;
	  const srcType = gl.UNSIGNED_BYTE;
	  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
	  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
					width, height, border, srcFormat, srcType,
					pixel);

	  const image = new Image();
	  image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
					  srcFormat, srcType, image);

		// WebGL1 has different requirements for power of 2 images
		// vs non power of 2 images so check if the image is a
		// power of 2 in both dimensions.
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
		   // Yes, it's a power of 2. Generate mips.
		   gl.generateMipmap(gl.TEXTURE_2D);
		} else {
		   // No, it's not a power of 2. Turn of mips and set
		   // wrapping to clamp to edge
		   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	  };
	  image.src = url;

	  return texture;
	}

	isPowerOf2(value) 
	{
	  return (value & (value - 1)) == 0;
	}

	//
	// Draw the scene.
	//
	drawScene(gl, programInfo, buffers, texture, time, deltaTime) 
	{
	  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	  gl.clearDepth(1.0);                 // Clear everything
	  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	  // Clear the canvas before we start drawing on it.
	  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	  // Create a perspective matrix, a special matrix that is
	  // used to simulate the distortion of perspective in a camera.
	  // Our field of view is 45 degrees, with a width/height
	  // ratio that matches the display size of the canvas
	  // and we only want to see objects between 0.1 units
	  // and 100 units away from the camera.

	  let fieldOfView = 45 * Math.PI / 180;   // in radians
	  let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	  let zNear = 0.1;
	  let zFar = 100.0;
	  let projectionMatrix = mat4.create();

	  // note: glmatrix.js always has the first argument
	  // as the destination to receive the result.
	  mat4.perspective(projectionMatrix,
					   fieldOfView,
					   aspect,
					   zNear,
					   zFar);

	  // Set the drawing position to the "identity" point, which is
	  // the center of the scene.
	  let modelViewMatrix = mat4.create();

	  // Now move the drawing position a bit to where we want to
	  // start drawing the square.

	  mat4.translate(modelViewMatrix,     // destination matrix
					 modelViewMatrix,     // matrix to translate
					 [0.0, 0.0, -3.0]);  // amount to translate
	  // mat4.rotate(modelViewMatrix,  // destination matrix
				  // modelViewMatrix,  // matrix to rotate
				  // cubeRotation,     // amount to rotate in radians
				  // [0, 0, 1]);       // axis to rotate around (Z)
	  // mat4.rotate(modelViewMatrix,  // destination matrix
				  // modelViewMatrix,  // matrix to rotate
				  // cubeRotation * .7,// amount to rotate in radians
				  // [0, 1, 0]);       // axis to rotate around (X)

	  // Tell WebGL how to pull out the positions from the position
	  // buffer into the vertexPosition attribute
	  {
		let numComponents = 3;
		let type = gl.FLOAT;
		let normalize = false;
		let stride = 0;
		let offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			programInfo.attribLocations.vertexPosition);
	  }

	  // Tell WebGL how to pull out the texture coordinates from
	  // the texture coordinate buffer into the textureCoord attribute.
	  // {
		// const numComponents = 2;
		// const type = gl.FLOAT;
		// const normalize = false;
		// const stride = 0;
		// const offset = 0;
		// gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
		// gl.vertexAttribPointer(
			// programInfo.attribLocations.textureCoord,
			// numComponents,
			// type,
			// normalize,
			// stride,
			// offset);
		// gl.enableVertexAttribArray(
			// programInfo.attribLocations.textureCoord);
	  // }

	  // Tell WebGL which indices to use to index the vertices
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

	  // Tell WebGL to use our program when drawing

	  gl.useProgram(programInfo.program);

	  // Set the shader uniforms

	  gl.uniformMatrix4fv(
		  programInfo.uniformLocations.projectionMatrix,
		  false,
		  projectionMatrix);
	  gl.uniformMatrix4fv(
		  programInfo.uniformLocations.modelViewMatrix,
		  false,
		  modelViewMatrix);

	  // Specify the texture to map onto the faces.

	  // Tell WebGL we want to affect texture unit 0
	  // gl.activeTexture(gl.TEXTURE0);

	  // Bind the texture to texture unit 0
	  // gl.bindTexture(gl.TEXTURE_2D, texture);

	  // Tell the shader we bound the texture to texture unit 0
	  // gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

	  {
		let vertexCount = 6;
		let type = gl.UNSIGNED_SHORT;
		let offset = 0;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	  }

		//
		this.UpdateProperties();

	  
	  //gl.uniform4f(testColorID, 1.0, 0.0, 0.5, 0.0);
	}

	//
	// Initialize a shader program, so WebGL knows how to draw our data
	//
	initShaderProgram(gl, vsSource, fsSource) 
	{
	  this.vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
	  this.fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	  // Create the shader program
	  this.shaderProgram = gl.createProgram();
	  gl.attachShader(this.shaderProgram, this.vertexShader);
	  gl.attachShader(this.shaderProgram, this.fragmentShader);
	  gl.linkProgram(this.shaderProgram);

	  // If creating the shader program failed, alert
	  if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) 
	  {
		console.error('Unable to initialize the shader program\n' + gl.getProgramInfoLog(this.shaderProgram));
		return null;
	  }

	  return this.shaderProgram;
	}

	//
	// creates a shader of the given type, uploads the source and
	// compiles it.
	//
	loadShader(gl, type, source) 
	{
	  let shader = gl.createShader(type);

	  // Send the source to the shader object
	  gl.shaderSource(shader, source);

	  // Compile the shader program
	  gl.compileShader(shader);

	  // See if it compiled successfully
	  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
	  {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	  }

	  return shader;
	}
}