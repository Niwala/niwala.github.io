
onmousemove = function(e){mouseX = e.clientX; mouseY = e.clientY}

var mouseX;
var mouseY;
var focusedShaderData;

function RendererFromExample(canvas, data, example)
{
	return new ShaderData(canvas, data.name + "-" + example.name, example.shader, 1);
}

function ContextMenuAction(action)
{
	//Execute action
	switch (action)
	{
		case "Copy":
			navigator.clipboard.writeText(focusedShaderData.shaderInclude);
		break;

		default :

			let packedData = new PackedData();
			packedData.shader = ConvertIntegersToFloats(focusedShaderData.shaderInclude);

			let url = window.location.href;
			let rootLastIndex = url.lastIndexOf('/');
			url = url.substring(0, rootLastIndex);
			url += "/shader-editor.html?shader=" + packedData.CompressToURL();

			window.open(url, "_blank");
			break;
	}

	//Hide menu
	menu.style.display='none';
}

class ShaderData
{
	constructor(element, shaderGuid, shaderInclude, layout)
	{
		this.shaderInclude = shaderInclude;
		this.element = element;
		this.width = element.getAttribute("width");
		this.height = element.getAttribute("height");
		this.shaderGuid = shaderGuid;
		this.layout = layout;

		let parse = this.ParseAttributes(shaderInclude);
		this.shaderFragContent = parse.cleanedShader;
		this.attributes = parse.parsedUniforms;

		this.locations = new Map();
		this.floatValues = new Map();
		this.float2Values = new Map();
		this.float3Values = new Map();
		this.float4Values = new Map();
		
		//Add context menu
		this.element.addEventListener('click',()=>{menu.style.display='none';});
		this.element.addEventListener('contextmenu',(e)=>{
			e.preventDefault();
			menu.style.left = e.clientX + 'px';
			menu.style.top = e.clientY + 'px';
			menu.style.display = 'flex';
			focusedShaderData = this;
		});
		document.addEventListener('mousedown',(e)=>{
			if(!menu.contains(e.target)){
				menu.style.display='none';
			}
		});

		//Build shaders > Vertex
		this.vertexShader = 
			`
			attribute vec4 aVertexPosition;
			attribute vec2 aTextureCoord;

			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;

			varying highp vec4 vTextureCoord;

			uniform highp vec4 editor_uvScaleOffset;

			void main(void) 
			{
				gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
				vTextureCoord = vec4(aTextureCoord * editor_uvScaleOffset.xy + editor_uvScaleOffset.zw, aTextureCoord);
			}
			`;

		//Build shaders > Fragment
		this.fragmentShader = 
			`
			precision highp float;
			varying vec4 vTextureCoord;
			
			#define frac(x) fract(x)
			#define lerp(a, b, c) mix(a, b, c)
			#define saturate(x) clamp(x, 0.0, 1.0)
			#define PI 3.1415926532
			#define TAU 6.283185307
			#define float2 vec2
			#define float3 vec3
			#define float4 vec4

			uniform sampler2D uSampler;
			uniform float time;
			uniform float4 screenSize;
			uniform float4 mousePos;
			uniform float layout;

			// Description : Array and textureless GLSL 2D simplex noise function. -----------------
			//      Author : Ian McEwan, Ashima Arts.
			//  Maintainer : stegu
			//     Lastmod : 20110822 (ijm)
			//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
			//               Distributed under the MIT License. See LICENSE file.
			//               https://github.com/ashima/webgl-noise
			//               https://github.com/stegu/webgl-noise
			// 

			vec3 mod289(vec3 x) 
			{
				return x - floor(x * (1.0 / 289.0)) * 289.0;
			}

			vec2 mod289(vec2 x) 
			{
				return x - floor(x * (1.0 / 289.0)) * 289.0;
			}

			vec3 permute(vec3 x) 
			{
				return mod289(((x*34.0)+10.0)*x);
			}

			float snoise(vec2 v)
			{
				const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
											0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
											-0.577350269189626,  // -1.0 + 2.0 * C.x
											0.024390243902439); // 1.0 / 41.0
				// First corner
				vec2 i  = floor(v + dot(v, C.yy) );
				vec2 x0 = v -   i + dot(i, C.xx);

				// Other corners
				vec2 i1;
				//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
				//i1.y = 1.0 - i1.x;
				i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
				// x0 = x0 - 0.0 + 0.0 * C.xx ;
				// x1 = x0 - i1 + 1.0 * C.xx ;
				// x2 = x0 - 1.0 + 2.0 * C.xx ;
				vec4 x12 = x0.xyxy + C.xxzz;
				x12.xy -= i1;

				// Permutations
				i = mod289(i); // Avoid truncation effects in permutation
				vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
						+ i.x + vec3(0.0, i1.x, 1.0 ));

				vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
				m = m*m ;
				m = m*m ;

				// Gradients: 41 points uniformly over a line, mapped onto a diamond.
				// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

				vec3 x = 2.0 * fract(p * C.www) - 1.0;
				vec3 h = abs(x) - 0.5;
				vec3 ox = floor(x + 0.5);
				vec3 a0 = x - ox;

				// Normalise gradients implicitly by scaling m
				// Approximation of: m *= inversesqrt( a0*a0 + h*h );
				m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

				// Compute final noise value at P
				vec3 g;
				g.x  = a0.x  * x0.x  + h.x  * x0.y;
				g.yz = a0.yz * x12.xz + h.yz * x12.yw;
				return 130.0 * dot(m, g);
			}


			//----------------------
			
			//smin from Inigo Quilez
			float smin(float a, float b, float k)
			{
				float h = saturate(0.5 + 0.5 * (b - a) / k);
				return lerp(b, a, h) - k * h * (1.0 - h);
			}

			mat2 rotate(float angle) 
			{
				float cosA = cos(angle);
				float sinA = sin(angle);
				return mat2(
					cosA, -sinA,
					sinA,  cosA
				);
			}
			
			float2 rotate(float2 space, float angle) 
			{
				return rotate(angle) * space;
			}

			//Custom shader 
			` + this.shaderFragContent + ` 

			void main(void) 
			{
				gl_FragColor = Execute(vTextureCoord);
			}
			`;

		this.errorFragmentShader = 
			`
			precision highp float;
			varying vec4 vTextureCoord;

			uniform sampler2D uSampler;
			uniform float time;

			void main(void) 
			{
				gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
			}
			`;
	}

	ParseAttributes(shaderCode)
	{
		const result = [];
    
		const regex = /\[([^\]]+)]\s*uniform\s+([^\s]+)\s+([^\s;]+);/g;
		
		let cleanedShader = shaderCode;
		
		let match;
		while ((match = regex.exec(shaderCode)) !== null)
		{
			const annotation = match[1]; // "Range(5.0, 0.0, 20.0)"
			const type = match[2]; // "float"
			const name = match[3]; // "speed"
			
			const argsMatch = annotation.match(/([a-zA-Z]+)\(([^)]+)\)/);
			const attributeName = argsMatch ? argsMatch[1] : null; // Example : "Range"
			const argumentsList = argsMatch ? argsMatch[2].split(',').map(arg => arg.trim()) : []; // Example : ["5.0", "0.0", "20.0"]
			
			result.push({
				uniform: name,
				type: type,
				attribute: attributeName,
				arguments: argumentsList
			});
			
			cleanedShader = cleanedShader.replace(match[0], `uniform ${type} ${name};`);
		}
		
		return { cleanedShader, parsedUniforms: result };
	}

	SetFloatValue(name, value)
	{
		this.floatValues.set(name, value);
	}
	
	SetFloat2Value(name, color)
	{
		this.float2Values.set(name, color);
	}

	SetFloat3Value(name, color)
	{
		this.float3Values.set(name, color);
	}

	SetFloat4Value(name, color)
	{
		this.float4Values.set(name, color);
	}

	UpdateProperties(gl, time)
	{
		gl.useProgram(this.shaderProgram);
		
		let bounds = this.element.getBoundingClientRect();

		//Layout
		let uvFactorX = 1.0;
		let uvFactorY = 1.0;
		let uvOffsetX = 0.0;
		let uvOffsetY = 0.0;

		if (this.layout != 0)
		{
			if (bounds.width > bounds.height)
			{
				//Default : Left
				uvFactorX = bounds.width / bounds.height;

				//Center
				if ((this.layout & 2) == 2)
				{
					uvOffsetX = (1.0 - uvFactorX) * 0.5;
				}

				//Right
				else if ((this.layout & 4) == 4)
				{
					uvOffsetX = 1.0 - uvFactorX;
				}
			}
			else if (bounds.height > bounds.width)
			{
				//Default : Bottom
				uvFactorY = bounds.height / bounds.width;

				//Center
				if ((this.layout & 8) == 8)
				{
					uvOffsetY = (1.0 - uvFactorY) * 0.5;
				}

				//Right
				else if ((this.layout & 16) == 16)
				{
					uvOffsetY = 1.0 - uvFactorY;
				}
			}
		}
		gl.uniform4f(this.uvScaleOffsetLocation, uvFactorX, uvFactorY, uvOffsetX, uvOffsetY);

		//Mouse Position
		let mx = isNaN(mouseX) ? bounds.width * 0.5 : (mouseX - bounds.x);
		let my = isNaN(mouseY) ? bounds.height * 0.5 : bounds.height - (mouseY - bounds.y);
		let nmx = mx / bounds.width;
		let nmy = my / bounds.height;

		//Screen size
		let ssX = bounds.width;
		let ssY = bounds.height;
		let ssZ = 1.0 / ssX;
		let ssW = 1.0 / ssY;

		//Built-in Properties
		gl.uniform1f(this.timeLocation, time);
		gl.uniform4f(this.screenSizeLocation, ssX, ssY, ssZ, ssW);
		gl.uniform4f(this.mousePosLocation, nmx, nmy, mx, my);
		

		//Example properties
		this.floatValues.forEach((value, key) => 
		{
			if (!this.locations.has(key))
				this.locations.set(key, gl.getUniformLocation(this.shaderProgram, key));

			let loc = this.locations.get(key);
			gl.uniform1f(loc, value);
		});
		
		this.float2Values.forEach((value, key) => 
		{
			if (!this.locations.has(key))
				this.locations.set(key, gl.getUniformLocation(this.shaderProgram, key));

			let loc = this.locations.get(key);
			gl.uniform2f(loc, value[0], value[1]);
		});

		this.float3Values.forEach((value, key) => 
		{
			if (!this.locations.has(key))
				this.locations.set(key, gl.getUniformLocation(this.shaderProgram, key));

			let loc = this.locations.get(key);
			gl.uniform3f(loc, value[0], value[1], value[2]);
		});

		this.float4Values.forEach((value, key) => 
		{
			if (!this.locations.has(key))
				this.locations.set(key, gl.getUniformLocation(this.shaderProgram, key));

			let loc = this.locations.get(key);
			gl.uniform4f(loc, value[0], value[1], value[2], value[3]);
		});
	}


	Load(gl)
	{
		this.shaderProgram = this.initShaderProgram(gl, this.vertexShader, this.fragmentShader, this.errorFragmentShader);

		if (!this.compiled)
			return;

		gl.useProgram(this.shaderProgram);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		//Get properties locations > Built-in properties
		this.timeLocation = gl.getUniformLocation(this.shaderProgram, "time");
		this.screenSizeLocation = gl.getUniformLocation(this.shaderProgram, "screenSize");
		this.mousePosLocation = gl.getUniformLocation(this.shaderProgram, "mousePos");
		this.uvScaleOffsetLocation = gl.getUniformLocation(this.shaderProgram, "editor_uvScaleOffset");

		// Collect all the info needed to use the shader program.
		// Look up which attributes our shader program is using
		// for aVertexPosition, aTextureCoord and also
		// look up uniform locations.
		this.programInfo = {
			program: this.shaderProgram,
			attribLocations: {
			  vertexPosition: gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
			  textureCoord: gl.getAttribLocation(this.shaderProgram, 'aTextureCoord'),
			},
			uniformLocations: {
			  projectionMatrix: gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
			  modelViewMatrix: gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
			  uSampler: gl.getUniformLocation(this.shaderProgram, 'uSampler'),
			}
		  };
	}

	//
	// Initialize a shader program, so WebGL knows how to draw our data
	//
	initShaderProgram(gl, vsSource, fsSource, fsErrorSource) 
	{
		this.vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
		this.fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

		// Create the shader program
		this.shaderProgram = gl.createProgram();

		//try
		{
			gl.attachShader(this.shaderProgram, this.vertexShader);

			try
			{
				gl.attachShader(this.shaderProgram, this.fragmentShader);
			}
			catch
			{
				this.fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsErrorSource);
				gl.attachShader(this.shaderProgram, this.fragmentShader);
			}
			gl.linkProgram(this.shaderProgram);

			// If creating the shader program failed, alert
			if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) 
			{
				console.error('Error on shader ' + this.shaderGuid + "\n" + gl.getProgramInfoLog(this.shaderProgram) + "\n\n" + this.shaderFragContent);

				this.fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsErrorSource);
				gl.attachShader(this.shaderProgram, this.fragmentShader);
				gl.linkProgram(this.shaderProgram);
				return this.shaderProgram;
			}
		}
		// catch (e)
		// {
		// 	console.error('Error on shader ' + this.shaderGuid + "\n" + e + "\n\n" + this.shaderFragContent);

		// 	this.fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsErrorSource);
		// 	gl.attachShader(this.shaderProgram, this.fragmentShader);
		// 	gl.linkProgram(this.shaderProgram);
		// 	return this.shaderProgram;
		// }

		this.compiled = true;
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
		//alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	  }

	  return shader;
	}
}

class ShaderRenderer
{	
	constructor(canvas)
	{
		this.shaderData = new Array();
		this.canvas = canvas;
		
		this.width = canvas.getAttribute("width");
		this.height = canvas.getAttribute("height");

		this.overrideSize = false;
		this.overrideWidth = 512;
		this.overrideHeight = 512;
		
		//Load gl context
		this.gl = canvas.getContext('webgl2', {preserveDrawingBuffer: true});
		
		if (!this.gl) 
		{
			alert('Unable to initialize WebGL. Your browser or machine may not support it.');
			return;
		}
		
		
		// Here's where we call the routine that builds all the
		// objects we'll be drawing.
		this.buffers = this.initBuffers(this.gl);

		this.time = 0;
		this.lastTime = 0;

		

		// Draw the scene repeatedly
		requestAnimationFrame(this.Render);
	}
	
	Render = (now) => 
	{
		this.time = now * 0.001;
		this.deltaTime = this.time - this.lastTime;
		this.lastTime = this.time;

		
		//Keep canvas size sync
		let bounds = this.canvas.getBoundingClientRect();
		let currentWidth = bounds.width;
		let currentHeight = bounds.height;
		
		if (this.overrideSize)
		{
			currentWidth = this.overrideWidth;
			currentHeight = this.overrideHeight;
		}

		if (this.width != currentWidth || this.height != currentHeight)
		{
			this.width = currentWidth;
			this.height = currentHeight;
			this.canvas.setAttribute("width", this.width);
			this.canvas.setAttribute("height", this.height);
			
			this.gl.viewport.width = this.width;
			this.gl.viewport.height = this.height;
		}

		this.clearScene(this.gl);
		for (var i = 0; i < this.shaderData.length; i++) 
		{
			this.shaderData[i].UpdateProperties(this.gl, this.time);
			this.drawObject(this.gl, this.shaderData[i].programInfo, this.buffers, this.shaderData[i]);
		}
					
		requestAnimationFrame(this.Render)
	}
		
	RenderNow(time) 
	{
		//Keep canvas size sync
		let bounds = this.canvas.getBoundingClientRect();
		let currentWidth = bounds.width;
		let currentHeight = bounds.height;
		
		if (this.overrideSize)
		{
			currentWidth = this.overrideWidth;
			currentHeight = this.overrideHeight;
		}

		if (this.width != currentWidth || this.height != currentHeight)
		{
			this.width = currentWidth;
			this.height = currentHeight;
			this.canvas.setAttribute("width", this.width);
			this.canvas.setAttribute("height", this.height);
			
			this.gl.viewport.width = this.width;
			this.gl.viewport.height = this.height;
		}

		this.clearScene(this.gl);
		for (var i = 0; i < this.shaderData.length; i++) 
		{
			this.shaderData[i].UpdateProperties(this.gl, time);
			this.drawObject(this.gl, this.shaderData[i].programInfo, this.buffers, this.shaderData[i]);
		}
	}
	

	AddRenderer(shaderData)
	{
		this.shaderData.push(shaderData);
		shaderData.Load(this.gl);
	}

	ClearRenderers()
	{
		this.shaderData = new Array();
	}
	
	//
	// initBuffers
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
		 0.0,  0.0,  1.0,
		 1.0,  0.0,  1.0,
		 1.0,  1.0,  1.0,
		 0.0,  1.0,  1.0,
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
	clearScene(gl) 
	{
		gl.viewport(0, 0, this.width, this.height);
		gl.clearColor(0.0, 0.0, 0.0, 0.0);  // Clear to black, fully opaque
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

		// Clear the canvas before we start drawing on it.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	drawObject(gl, programInfo, buffers, shaderData)
	{
		// Create a perspective matrix, a special matrix that is
		// used to simulate the distortion of perspective in a camera.
		// Our field of view is 45 degrees, with a width/height
		// ratio that matches the display size of the canvas
		// and we only want to see objects between 0.1 units
		// and 100 units away from the camera.

		// let fieldOfView = 45 * Math.PI / 180;   // in radians
		// let aspect = this.width / this.height;
		// let zNear = 0.1;
		// let zFar = 100.0;
		let projectionMatrix = mat4.create();
	
		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
		//mat4.perspective(projectionMatrix,
		//			   fieldOfView,
		//			   aspect,
		//			   zNear,
		//			   zFar);

	  	//Out mat, Left, Right, Bottom, Top, Near, Far
  		mat4.ortho(projectionMatrix, 0, this.width, 0, this.height, 0.1, 100);



  		//mat4.ortho(projectionMatrix, 0.0, 100.0, 0.0, 100.0, 0.1, 100);

		// Set the drawing position to the "identity" point, which is
		// the center of the scene.
		let modelViewMatrix = mat4.create();
	
		// Now move the drawing position a bit to where we want to
		// start drawing the square.
	
		let elBounds = shaderData.element.getBoundingClientRect();
	
		mat4.translate(modelViewMatrix,     // destination matrix
			modelViewMatrix,     // matrix to translate
			[elBounds.x, this.height - (elBounds.y + elBounds.height), -10.0]);  // amount to translate

		mat4.scale(modelViewMatrix, modelViewMatrix, [elBounds.width, elBounds.height, 1.0]);

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
	   {
		 const numComponents = 2;
		 const type = gl.FLOAT;
		 const normalize = false;
		 const stride = 0;
		 const offset = 0;
		 gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
		 gl.vertexAttribPointer(
			 programInfo.attribLocations.textureCoord,
			 numComponents,
			 type,
			 normalize,
			 stride,
			 offset);
		 gl.enableVertexAttribArray(
			 programInfo.attribLocations.textureCoord);
	   }

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
	}
}