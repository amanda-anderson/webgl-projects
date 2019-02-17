/*
 *  Assignment #2 - COSC 3306
 *  Author: Amanda Anderson
 *  Description: WebGL Visualization of an Origami Crane
 *
 */

// Vertex shader program
const VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  v_Color = a_Color;\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 25.0;\n' +
  '}\n';

// Fragment shader program
const FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  'gl_FragColor = v_Color;\n' +
  '}\n';

let canvas,
    gl;

function main() {

  // Retrieve <canvas> element and the rendering context
  canvas = document.getElementById('webgl');
  gl = getWebGLContext(canvas);
  if (!gl) {  //optional
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders using the cuon-utils library
  //returns gl.program object
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  gl.program.u_Width = gl.getUniformLocation(gl.program, 'u_Width');
  gl.program.u_Height = gl.getUniformLocation(gl.program, 'u_Height');
  gl.program.a_Color = gl.getAttribLocation(gl.program, 'a_Color');

  // Pass vertex position to attribute variable
  gl.program.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(gl.program.a_Position < 0){
    console.log('Failed to find the attribute variable a_Position');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var numOfVertices = initVertexBuffers();

  // Specify the color for clearing <canvas>
  gl.clearColor(219/255, 112/255, 147/255, 1.0);

  draw(numOfVertices);
}

function draw(numVertices){
  //clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // Draw Elements
  gl.uniform1f(gl.program.u_Width, canvas.width);
  gl.uniform1f(gl.program.u_Height, canvas.height);

  // Background tri 1
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
  
  // Background tri 2
  gl.drawArrays(gl.TRIANGLE_STRIP, 3, 3);
  
  // Diamond Line Loops
  gl.drawArrays(gl.LINE_LOOP, 6, 4);
  gl.drawArrays(gl.LINE_LOOP, 10, 4);

  // Points
  gl.drawArrays(gl.POINTS, 14, 4);

  // Thin Diagonal Lines
  gl.drawArrays(gl.LINE_STRIP, 18, 2);
  gl.drawArrays(gl.LINES, 20, 2);
  
  // Crane
  gl.drawArrays(gl.TRIANGLES, 22, numVertices - 22);
}

function initVertexBuffers() {

    const canvasDrawing = [	 
                          // Background Triangles
                          -1.0, 1.0, 0.0,          219/255, 112/255, 147/255,
                          -1.0, -1.0, 0.0,         1.0, 1.0, 1.0,
                           1.0, 1.0, 0.0,          219/255, 112/255, 147/255,

                           1.0, 1.0, 0.0,          1.0, 1.0, 1.0,
                          -1.0, -1.0, 0.0,         219/255, 112/255, 147/255,
                           1.0, -1.0, 1.0,         219/255, 112/255, 147/255,

                          // Line Loop Diamond
                          0.0, 1.0, 0.0,           1.0, 1.0, 1.0,
                          -1.0, 0.0, 0.0,          1.0, 1.0, 1.0,
                          0.0, -1.0, 0.0,          1.0, 1.0, 1.0,
                          1.0, 0.0, 0.0,           1.0, 1.0, 1.0,

                          // Line Loop Diamond Thickness
                          0.0, 0.995, 0.0,         1.0, 1.0, 1.0,
                          -0.995, 0.0, 0.0,        1.0, 1.0, 1.0,
                          0.0, -0.995, 0.0,        1.0, 1.0, 1.0,
                          0.995, 0.0, 0.0,         1.0, 1.0, 1.0,
                          
                          // Points
                          0.0, 1.0, 0.0,           99/255, 50/255, 66/255,
                          -1.0, 0.0, 0.0,          99/255, 50/255, 66/255,
                          0.0, -1.0, 0.0,          99/255, 50/255, 66/255,
                          1.0, 0.0, 0.0,           99/255, 50/255, 66/255,

                          // Diagonal Line 1
                          -1.0, 1.0, 0.0,          0.2, 0.2, 0.2,
                          1.0, -1.0, 0.0,          0.2, 0.2, 0.2,

                          // Diagonal Line 2
                          -1.0, -1.0, 0.0,         0.2, 0.2, 0.2,
                          1.0, 1.0, 0.0,           0.2, 0.2, 0.2,

                          // Crane
                          // 1
                           -0.7, -0.2, 0.0,        0.9, 0.9, 0.9,
                           -0.2, 0.0, 0.0,         0.9, 0.9, 0.9,
                            0.1, -0.2, 0.0,        0.9, 0.9, 0.9,
                           // 2
                            -0.2, 0.0, 0.0,        0.9, 0.9, 0.9,
                            0.1, -0.2, 0.0,        0.9, 0.9, 0.9,
                            0.16, -0.15, 0.0,      0.9, 0.9, 0.9,
                            // 3
                            -0.19, 0.01, 0.0,      0.5, 0.5, 0.5,
                            -0.29, 0.56, 0.0,      1.0, 1.0, 1.0,
                            -0.10, 0.1, 0.0,       0.5, 0.5, 0.5,
                            // 4
                            -0.2, 0.0, 0.0,        0.5, 0.5, 0.5,
                             0.0, 0.2, 0.0,        1.0, 1.0, 1.0,
                             0.16, -0.15, 0.0,     0.5, 0.5, 0.5,
                            // 5
                            -0.18, -0.2, 0.0,      0.6, 0.6, 0.6,
                            -0.12, -0.28, 0.0,     0.6, 0.6, 0.6,
                            -0.03, -0.2, 0.0,      0.6, 0.6, 0.6,
                            // 6
                            -0.12, -0.28, 0.0,     0.6, 0.6, 0.6,
                            -0.03, -0.2, 0.0,      0.6, 0.6, 0.6,
                             -0.01, -0.26, 0.0,    0.6, 0.6, 0.6,
                            // 7
                            -0.03, -0.2, 0.0,      0.4, 0.4, 0.4,
                            0.01, -0.2, 0.0,       0.4, 0.4, 0.4,
                            -0.01, -0.26, 0.0,     0.4, 0.4, 0.4,
                            // 8
                            0.01, -0.2, 0.0,       0.4, 0.4, 0.4,
                            -0.01, -0.26, 0.0,     0.4, 0.4, 0.4,
                            0.02, -0.253, 0.0,     0.4, 0.4, 0.4,
                            // 9
                            0.1, -0.2, 0.0,        0.6, 0.6, 0.6,
                            0.01, -0.2, 0.0,       0.6, 0.6, 0.6,
                            0.02, -0.253, 0.0,     0.6, 0.6, 0.6,
                            // 10
                            0.02, -0.253, 0.0,     0.6, 0.6, 0.6,
                            0.1, -0.2, 0.0,        0.6, 0.6, 0.6,
                            0.15, -0.28, 0.0,      0.6, 0.6, 0.6,
                            // 29 - Layering
                            0.33, 0.0, 0.0,        0.9, 0.9, 0.9,
                            0.145, 0.15, 0.0,      0.9, 0.9, 0.9,
                            0.42, 0.28, 0.0,       0.9, 0.9, 0.9,
                            // 11
                            0.1, -0.2, 0.0,        0.6, 0.6, 0.6,
                            0.15, -0.28, 0.0,      0.6, 0.6, 0.6,
                            0.16, -0.15, 0.0,      0.6, 0.6, 0.6,
                            // 12
                            0.15, -0.28, 0.0,      0.4, 0.4, 0.4,
                            0.16, -0.15, 0.0,      0.4, 0.4, 0.4,
                            0.17, -0.28, 0.0,      0.4, 0.4, 0.4,
                            // 13
                            0.17, -0.28, 0.0,      0.7, 0.7, 0.7,
                            0.16, -0.15, 0.0,      0.7, 0.7, 0.7,
                            0.18, -0.28, 0.0,      0.7, 0.7, 0.7,
                            // 14
                            0.185, 0.195, 0.0,     0.8, 0.8, 0.8,
                            0.18, -0.28, 0.0,      0.8, 0.8, 0.8,
                            0.16, -0.15, 0.0,      0.8, 0.8, 0.8,
                            // 15
                            0.165, 0.22, 0.0,      0.8, 0.8, 0.8,
                            0.16, -0.15, 0.0,      0.8, 0.8, 0.8,
                            0.185, 0.195, 0.0,     0.8, 0.8, 0.8,
                            // 16
                            0.16, -0.15, 0.0,      0.8, 0.8, 0.8,
                            0.095, -0.01, 0.0,     0.8, 0.8, 0.8,
                            0.165, 0.22, 0.0,      0.8, 0.8, 0.8,
                            // 17
                            0.12, 0.07, 0.0,       0.9, 0.9, 0.9,
                            0.06, 0.11, 0.0,       0.9, 0.9, 0.9,
                            0.145, 0.15, 0.0,      0.9, 0.9, 0.9,
                            // 18
                            0.0, 0.2, 0.0,         0.4, 0.4, 0.4,
                            0.095, -0.01, 0.0,     0.4, 0.4, 0.4,
                            0.12, 0.07, 0.0,       0.4, 0.4, 0.4,
                            // 19
                            0.19, -0.28, 0.0,      0.6, 0.6, 0.6,
                            0.18, -0.28, 0.0,      0.6, 0.6, 0.6,
                            0.185, 0.195, 0.0,     0.6, 0.6, 0.6,
                            // 20
                            0.185, 0.195, 0.0,     0.55, 0.55, 0.55,
                            0.23, 0.14, 0.0,       0.55, 0.55, 0.55,
                            0.19, -0.28, 0.0,      0.55, 0.55, 0.55,
                            // 21
                            0.19, -0.292, 0.0,     0.4, 0.4, 0.4,
                            0.21, -0.01, 0.0,      0.4, 0.4, 0.4,
                            0.257, -0.02, 0.0,     0.4, 0.4, 0.4,
                            // 22
                            0.21, -0.01, 0.0,      0.9, 0.9, 0.9,
                            0.25, -0.065, 0.0,     0.9, 0.9, 0.9,
                            0.23, 0.14, 0.0,       0.9, 0.9, 0.9,
                            // 23
                            0.25, -0.07, 0.0,      0.9, 0.9, 0.9,
                            0.23, 0.14, 0.0,       0.9, 0.9, 0.9,
                            0.33, 0.0, 0.0,        0.9, 0.9, 0.9,
                            // 24
                            // Removed for layering
                            // 25
                            0.185, 0.195, 0.0,     0.6, 0.6, 0.6,
                            0.23, 0.12, 0.0,       0.6, 0.6, 0.6,
                            0.45, -0.04, 0.0,      0.6, 0.6, 0.6,
                            // 26
                            0.162, 0.215, 0.0,     0.8, 0.8, 0.8,
                            0.18, 0.23, 0.0,       0.8, 0.8, 0.8,
                            0.45, -0.04, 0.0,      0.8, 0.8, 0.8,
                            // 27
                            0.18, 0.23, 0.0,       0.5, 0.5, 0.5,
                            0.45, -0.04, 0.0,      0.5, 0.5, 0.5,
                            0.21, 0.24, 0.0,       0.7, 0.7, 0.7,
                            // 28
                            0.45, -0.04, 0.0,      0.8, 0.8, 0.8,
                            0.21, 0.24, 0.0,       0.8, 0.8, 0.8,
                            0.23, 0.245, 0.0,      0.8, 0.8, 0.8
                           ];

  // Create a buffer object
  const vertexBuffer = gl.createBuffer();
  // Bind buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write data into buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(canvasDrawing), gl.STATIC_DRAW);
  // Define buffer object connection to a_Position variable
  gl.vertexAttribPointer(gl.program.a_Position, 3, gl.FLOAT, false, 24, 0);
  gl.vertexAttribPointer(gl.program.a_Color, 3, gl.FLOAT, false, 24, 12);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(gl.program.a_Postion);
  gl.enableVertexAttribArray(gl.program.a_Color);

  return canvasDrawing.length / 6;
}
