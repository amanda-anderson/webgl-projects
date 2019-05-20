function util_AddAttribute(gl, program, attributeName) {
	
	var attributeRef = gl.getAttribLocation(program, attributeName);
	if(attributeRef <0){
		console.log('ERROR: Failed to acquire attribute variable "' + attributeName + '".' )
		return null;
	}
	
	return attributeRef;
}


function util_AddUniform(gl, program, uniformName) {
	
	var uniformRef = gl.getUniformLocation(program, uniformName);
	if(!uniformRef){
		console.log('ERROR: Failed to acquire uniform variable "' + uniformName + '".' )
		return null;
	}
	
	return uniformRef;
}


function util_InitArrayBuffer (gl, a_attribute, data, num) {
  var floatData = new Float32Array(data);
 
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, floatData, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  gl.vertexAttribPointer(a_attribute, num, gl.FLOAT, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return buffer;
}

function util_AttachAttribToVBO(gl, a_attribute, buffer, num){
	
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Connect to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Assign the buffer object to the attribute variable
  gl.vertexAttribPointer(a_attribute, num, gl.FLOAT, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
  return true;
}

function util_InitShaders(gl, VSHADER, FSHADER){
	
	if(!VSHADER || VSHADER.length <= 0){
		Console.log('Vertex shader code missing');
		return null;
	}
	
	if(!FSHADER || FSHADER.length <= 0){
		Console.log('Fragment shader code missing');
		return null;
	}
	
	let vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, VSHADER);
	gl.compileShader(vertShader);
	if(gl.getShaderInfoLog(vertShader)) console.log("Vertex compile: " + gl.getShaderInfoLog(vertShader));
	
	let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader, FSHADER);
	gl.compileShader(fragShader);
	if(gl.getShaderInfoLog(fragShader)) console.log("Fragment compile: " + gl.getShaderInfoLog(fragShader));
	
	let program = gl.createProgram();
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);
	
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.log('Could not initialize shaders');
		return null;
	}
	
	gl.useProgram(program);
	
	return program;
}