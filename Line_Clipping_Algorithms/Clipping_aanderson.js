/*
 * Author: Amanda Anderson
 * Description: WebGL program demonstrating clipping algorithms.
 * Date: 2019-02-18
 */

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Colour;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position  = a_Position;\n' +
  '  v_Color = a_Colour;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

let gl, canvas;
  
var refresh = true;
var vertexColourBuffer = null;
var colourPoints = [];
var sizeChanged = false;
var newBuffer = true;
var drawing = false;
var border = 50;
var clipMode = 0;

var x1, x2, y1, y2;
var xMax, xMin, yMax, yMin;
var clip1x, clip1y, clip2x, clip2y;
var useSutherland = true;

function main() {
  canvas = document.getElementById('webgl');
  
  gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  gl.clearColor(219/255, 112/255, 147/255, 1);

  gl.program.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.program.a_Colour = gl.getAttribLocation(gl.program, 'a_Colour');
  if (gl.program.a_Position < 0 || gl.program.a_colour < 0) {
    console.log('Failed to get the storage location of an attribute variable');
    return -1;
  }

  canvas.onmousedown = function(ev){ click(ev); };
  canvas.onmouseup =   function(ev){ unclick(ev); };
  canvas.onmousemove = function(ev){ moved(ev); };
  window.addEventListener("keydown", changeAlgo, true);
  
  initVertexArray();
  
  var tick = function (){
	if( refresh == true ){ 
		var n = initVertexBuffers();
		if (n < 0) {
			console.log('Failed to set the positions of the vertices');
			return;
		}
		draw(n);
	}
    requestAnimationFrame(tick);
  }; 
  tick();  
}

// Function to change clipping algorithm on shift key
function changeAlgo(e){
  if(e.keyCode == 16) {

    useSutherland = !useSutherland;
    var algorithmUsed = document.getElementById("algorithmUsed");

    if(useSutherland){
      algorithmUsed.innerHTML = "Cohen-Sutherland being used.";
    }

    else{
      algorithmUsed.innerHTML = "Liang-Barsky being used.";
    }
  }
}

function draw(n){
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINE_LOOP, 0, 4);
  gl.drawArrays(gl.LINES, 4, n);
  
  refresh = false;
}

// Default colours for use by other methods	
var red   = { r:0.7, g:0.0, b:0.0 }; 
var gray  = { r:0.1, g:0.1, b:0.1 }; 		
var cyan  = { r:0, g:1, b:1 }; 		
var white   = { r:1.0, g:1.0, b:1.0 };

function initVertexArray(){
  
  // Add clipping rectangle
  addPoint(colourPoints, border, border, white);
  addPoint(colourPoints, border, canvas.height - border, white);
  addPoint(colourPoints, canvas.width - border, canvas.height - border, white);
  addPoint(colourPoints, canvas.width - border, border, white);
  
  // Define the box
  xMax = canvas.width - border;
  xMin = border;
  yMin = border;
  yMax = canvas.height - border;
}

function initVertexBuffers() {

  var webGL_PointsColours = convertToWebGL(colourPoints);
  var verticesColors = new Float32Array( webGL_PointsColours );
  
  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  
  if(sizeChanged){
	
	gl.disableVertexAttribArray(gl.program.a_Position);
	gl.disableVertexAttribArray(gl.program.a_Colour);

	gl.deleteBuffer(vertexColourBuffer);
	vertexColourBuffer = null;

	sizeChanged = false;	
  }
  
  if(!vertexColourBuffer){
    vertexColourBuffer = gl.createBuffer();
    newBuffer = true;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColourBuffer);
  
  if(newBuffer){
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STREAM_DRAW);
    gl.vertexAttribPointer(gl.program.a_Position, 2, gl.FLOAT, false, 5 * FSIZE, 0);
    gl.vertexAttribPointer(gl.program.a_Colour, 3, gl.FLOAT, false, 5 * FSIZE, 2 * FSIZE);
  }
  
  else {
	  gl.bufferSubData(gl.ARRAY_BUFFER, 0, verticesColors);
  }

  gl.enableVertexAttribArray(gl.program.a_Position);
  gl.enableVertexAttribArray(gl.program.a_Colour);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  newBuffer = false;
  return colourPoints.length / 5 - 4;
}
 
function addPoint(pcArray, x, y, colour){
	pcArray.push(x);
	pcArray.push(y);
	pcArray.push(colour.r);
	pcArray.push(colour.g);
	pcArray.push(colour.b);

	return pcArray;
}

function convertToWebGL( pcArray){

	var webglArray = [];
	
	var halfWidth = canvas.width/2;
	var halfHeight = canvas.height/2;
	
	for(var i = 0; i < pcArray.length; i+=5){
		webglArray.push(pcArray[i]/halfWidth - 1);
		webglArray.push(1 - pcArray[i+1]/halfHeight);
		webglArray.push(pcArray[i+2]);				
		webglArray.push(pcArray[i+3]);			
		webglArray.push(pcArray[i+4]);
	}
	return webglArray;
}

function click(ev) {
  // Get x & y of mouse
  x1 = ev.clientX;   
  y1 = ev.clientY; 

  rect = ev.target.getBoundingClientRect() ;

  // Convert x & y from window coordinates to canvas coordinates
  x1 = (x1 - rect.left);
  y1 = (y1 - rect.top);

  addPoint(colourPoints, x1,  y1, cyan);
  addPoint(colourPoints, x1, y1, cyan);
  
  sizeChanged = true;	

  drawing = true;
  refresh = true;
  
  update("Clicked: x = " + x1 + ", y = " + y1);
}

function moved(ev) {
  if(!drawing) return;
  
  x1_move = ev.clientX;   
  y1_move = ev.clientY; 
  rect = ev.target.getBoundingClientRect() ;

  x1_move = (x1_move - rect.left);
  y1_move = (y1_move - rect.top);
  
  colourPoints[colourPoints.length - 5] = x1_move;
  colourPoints[colourPoints.length - 4] = y1_move;

  refresh = true;
  update("Moved: x = " + x1_move + ", y = " + y1_move);

}

function unclick(ev) {
  x2 = ev.clientX;
  y2 = ev.clientY;
  rect = ev.target.getBoundingClientRect() ;

  x2 = (x2 - rect.left);
  y2 = (y2 - rect.top);

  if (useSutherland) {
      clipSutherland();
  }

  else {
    clipLiang();
  }

  // Original Line
  addPoint(colourPoints, x1, y1, gray);
  addPoint(colourPoints, x2, y2, gray);

  // Clipped Line
  addPoint(colourPoints, clip1x, clip1y, red);
  addPoint(colourPoints, clip2x, clip2y, red);

  sizeChanged = true;
  drawing = false;
  refresh = true;
  update("Unclicked: x = " + x2 + ", y = " + y2)
}

var INSIDE = 0; // 0000
var LEFT   = 1; // 0001
var RIGHT  = 2; // 0010
var BOTTOM = 4; // 0100
var TOP    = 8; // 1000

// Function for Cohen-Sutherland Clipping
// This implementation inspired by explanation on the Cohen-Sutherland Wikipedia article
// URL: https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
function clipSutherland() { 

  clip1x = x1;
  clip1y = y1;
  clip2x = x2;
  clip2y = y2;

  var x = 0;
  var y = 0;
  var m = (clip2y - clip1y) / (clip2x - clip1x);

  var code1 = getCode(clip1x, clip1y);
  var code2 = getCode(clip2x, clip2y);

  while (code1 != INSIDE || code2 != INSIDE) {

    var clipCode;

    if ((code1 & code2) != INSIDE) {
      return false;
    }
    if (code1 == INSIDE) {
      clipCode = code2;
    }
    else { 
      clipCode = code1
    }
    if ((clipCode & LEFT) != INSIDE) {
      x = xMin;
      y = (x - clip1x) * m + clip1y;
    }
    else if ((clipCode & RIGHT) != INSIDE) {
      x = xMax;
      y = (x - clip1x) * m + clip1y;
    }
    else if ((clipCode & BOTTOM) != INSIDE) {
      y = yMin;
      x = (y - clip1y) / m + clip1x;
    }
    else if ((clipCode & TOP) != INSIDE) {
      y = yMax;
      x = (y - clip1y) / m + clip1x;
    }
    if (clipCode == code1) {
      clip1x = x;
      clip1y = y;
      code1  = getCode(clip1x, clip1y);
    }
    else {
      clip2x = x;
      clip2y = y;
      code2 = getCode(clip2x, clip2y);
    }
  }
  return true;
}

// Function to calculate and return location code
function getCode(x, y) {
  var code;

  code = INSIDE;
  if (x < xMin) code |= LEFT; // | bitwise
  else if (x > xMax) code |= RIGHT;
  if (y < yMin) code |= BOTTOM;
  else if (y > yMax) code |= TOP;

  return code;
}

// Function for Liang-Barskey Clipping
// This implementation based on pseudocode from Lecture 7
function clipLiang() {
  var t0 = 0;
  var t1 = 1;
  dx = x2 - x1;
  dy = y2 - y1;
  var p, q, r;
  
  for(var e = 0; e < 4; e++){
    switch(e){
      case 0:   p = dx * -1;
                q = -1 * (xMin - x1);
                break;

      case 1:   p = dx;
                q = (xMax - x1);
                break;

      case 2:   p = dy * -1;
                q = -1 * (yMin - y1);
                break;
                
      case 3:   p = dy;
                q = (yMax - y1);
                break;
    }
	  
    r = q / p;
    if(p == 0 && q < 0){
      return 0;
    }
    if(p < 0){
      if(r > t1){
        return 0;
      }
      else if(r > t0){
        t0 = r;
      }
    }
	  
    else if(p > 0){
      if(r < t0){
        return 0;
      }
      else if(r < t1){
        t1 = r;
      }
    }
  }

  clip1x = x1 + t0 * dx;
  clip1y = y1 + t0 * dy;
  clip2x = x1 + t1 * dx;
  clip2y = y1 + t1 * dy;

  return 1;
}

function update(msg){
	var pTag = document.getElementById("update");
  pTag.innerHTML = msg;
}

function reset(e){
	drawing = false;
	refresh = true;
  colourPoints = [];
  initVertexArray();
  var algorithmUsed = document.getElementById("algorithmUsed");
  algorithmUsed.innerHTML = "Cohen-Sutherland being used.";
  update("Drawing field reset.");
}
