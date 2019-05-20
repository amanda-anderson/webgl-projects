/*
 * Description: An abstract 2D animation scene
 * Assignment 4 - COSC3306
 * Author: Amanda Anderson
 * Date: 2019-03-02
 */

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Colour;\n' +
  'varying   vec4 v_Colour;\n' +
  'uniform   mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  'gl_PointSize = 5.0;\n' +
  '  v_Colour = a_Colour;\n' +
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying   vec4 v_Colour;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Colour;\n' +
  '}\n';
  
let canvas, gl;
let modelMatrix;
let rotateAngle = 0.0;
let tileHoverVal = -0.35;
let tileHoverBool = true;
let craneXVal = -0.8;
let craneYVal = 0.8;
let craneScale = 0.01;
let craneXBool = true;
let incrementer = 0.0;
let timeBasedVar = 0.0;

var time = new Date();

function main() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl");
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  gl.program.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.program.a_Colour = gl.getAttribLocation(gl.program, 'a_Colour');
  gl.program.u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  
  var n = initVertexBuffers();

  gl.clearColor(25/255, 25/255, 25/255, 1);

  modelMatrix = new Matrix4();
  modelMatrix.setIdentity();

  var tick = function() {
    update();
    draw(n);
    requestAnimationFrame(tick);
  }
    tick();
}

function update() {
  
  // Time based element
  time = new Date();
  timeBasedVar = time.getSeconds();

  rotateAngle = rotateAngle - 0.9;
  if (rotateAngle >= 360) {
    rotateAngle = 0;
  }

  // Floating Platform
  if (tileHoverBool) {
    tileHoverVal = tileHoverVal - 0.0005;
    if (tileHoverVal < -0.352) {
      tileHoverBool = false;
    }
  }

  if (!tileHoverBool) {
    tileHoverVal = tileHoverVal + 0.0005;
    if (tileHoverVal >= -0.32) {
      tileHoverBool = true;
    }
  }

  // Crane values
  craneYVal -= 0.002;
  craneScale += 0.002;
  craneXVal += 0.01;
  incrementor = Math.random();

  if (craneXVal > 5.0) {
    craneXVal = -0.8;
    craneYVal = 1.0 - incrementor;
    craneScale = 0.01;
  }
}

function draw(n) {

  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw Cranes
  modelMatrix.setIdentity();
  modelMatrix.setTranslate(craneXVal, craneYVal, 0.0);
  modelMatrix.scale(craneScale * 0.5, craneScale *0.5, 0);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 89, 82);

  modelMatrix.setIdentity();
  modelMatrix.setTranslate(craneXVal - 1.5, craneYVal - 0.2, 0.0);
  modelMatrix.scale(craneScale, craneScale, 0);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 89, 82);

  modelMatrix.setIdentity();
  modelMatrix.setTranslate(craneXVal - 2.9, craneYVal - 1.0, 0.0);
  modelMatrix.scale(craneScale, craneScale, 0);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 89, 82);

  // White tile
  // Draw Static Outline
  modelMatrix.setIdentity();
  modelMatrix.translate(0, -0.35, 0.0);
  modelMatrix.scale(0.85, 0.14, 1.0);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.LINE_LOOP, 85, 4);
  // Draw tile
  modelMatrix.setIdentity();
  modelMatrix.translate(0, tileHoverVal, 0.0);
  modelMatrix.scale(0.8, 0.13, 1.0);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 85, 4);
  
  // Draw orbiting points
  modelMatrix.setIdentity();
  modelMatrix.scale(0.7, 0.7, 0);
  modelMatrix.rotate(rotateAngle, 1, 1, 1);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.POINTS, 81, 4);

  modelMatrix.setIdentity();
  modelMatrix.scale(0.7, 0.7, 0);
  modelMatrix.rotate(rotateAngle + 90, 1, 1, 1);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.POINTS, 81, 4);

  // Shift lines each second
  modelMatrix.setIdentity();
  modelMatrix.setTranslate(0.5, -0.35, 0.0);
  modelMatrix.scale(0.03, 0.03, 0);
  modelMatrix.rotate(timeBasedVar * 200, 0, 0, 1);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.LINES, 81, 4);

  modelMatrix.setIdentity();
  modelMatrix.setTranslate(0.52, -0.35, 0.0);
  modelMatrix.scale(0.03, 0.03, 0);
  modelMatrix.rotate(timeBasedVar * 200, 0, 0, 1);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.LINES, 81, 4);

  modelMatrix.setIdentity();
  modelMatrix.setTranslate(-0.5, -0.35, 0.0);
  modelMatrix.scale(0.03, 0.03, 0);
  modelMatrix.rotate(timeBasedVar * 200, 0, 0, 1);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.LINES, 81, 4);

  modelMatrix.setIdentity();
  modelMatrix.setTranslate(-0.52, -0.35, 0.0);
  modelMatrix.scale(0.03, 0.03, 0);
  modelMatrix.rotate(timeBasedVar * 200, 0, 0, 1);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.LINES, 81, 4);

  // Draw flamingo
  modelMatrix.setIdentity();
  modelMatrix.translate(0, tileHoverVal + 0.4, 0.0);
  modelMatrix.scale(0.45, 0.45, 0);
  modelMatrix.rotate(rotateAngle, 0, 1, 0);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 81);

  // Static Decorative Objects
  modelMatrix.setIdentity();
  modelMatrix.translate(0.0, -0.5, 0.0);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.POINTS, 173, 6);

  modelMatrix.setIdentity();
  modelMatrix.translate(0.42, -0.36, 0.0);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.POINTS, 173, 6);

  modelMatrix.setIdentity();
  modelMatrix.translate(-0.42, -0.36, 0.0);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.POINTS, 173, 6);

  modelMatrix.setIdentity();
  modelMatrix.translate(0.0, -0.88, 0.0);
  modelMatrix.scale(0.05, 0.06, 0.0);
  gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_FAN, 179, 10);
}

function initVertexBuffers() {

  var scene = new Float32Array([
                                    // Coord X, Y      Colour

                                    // Flamingo
                                    //1
                                    -0.52, 0.45, 	219/255, 112/255, 147/255,
                                    //2
                                    -0.62, 0.65,  219/255, 112/255, 147/255, 
                                    //3
                                    -0.53, 0.61,	219/255, 112/255, 147/255,

                                    // 2
                                    -0.62, 0.65,	110/255, 61/255, 80/255,
                                    // 3
                                    -0.53, 0.61,	110/255, 61/255, 80/255,
                                    // 4
                                    -0.57, 0.7, 	110/255, 61/255, 80/255,
                                    // 4
                                    -0.57, 0.7,	  110/255, 61/255, 80/255,
                                    // 3
                                    -0.53, 0.61,	110/255, 61/255, 80/255,
                                    // 5
                                    -0.42, 0.62,  110/255, 61/255, 80/255,

                                    // 4
                                    -0.57, 0.7,	  232/255, 164/255, 186/255,
                                    // 5
                                    -0.42, 0.62,  232/255, 164/255, 186/255,
                                    // 7
                                    -0.38, 0.72,  232/255, 164/255, 186/255,

                                    // 4
                                    -0.57, 0.7,	  219/255, 112/255, 147/255,
                                    // T
                                    -0.57, 0.73,	219/255, 112/255, 147/255,
                                    // 7
                                    -0.38, 0.72,	219/255, 112/255, 147/255,

                                    // T
                                    -0.57, 0.73,	110/255, 61/255, 80/255,
                                    // 6 
                                    -0.47, 0.85,	110/255, 61/255, 80/255,
                                    // 7
                                    -0.38, 0.72,	110/255, 61/255, 80/255,

                                    // 6 
                                    -0.47, 0.85,	232/255, 164/255, 186/255,
                                    // 7
                                    -0.38, 0.72,	232/255, 164/255, 186/255,
                                    // 8
                                    -0.4, 0.9,  	232/255, 164/255, 186/255,

                                    // 7
                                    -0.38, 0.72,	219/255, 112/255, 147/255,
                                    // 8
                                    -0.4, 0.9,  	219/255, 112/255, 147/255,
                                    // 9
                                    -0.28, 0.8, 	219/255, 112/255, 147/255,

                                    // 7
                                    -0.38, 0.72,	110/255, 61/255, 80/255,
                                    // 9
                                    -0.28, 0.8,  	110/255, 61/255, 80/255,
                                    // 10
                                    -0.2, 0.6,	  110/255, 61/255, 80/255,

                                    // 11
                                    -0.47, 0.2, 	232/255, 164/255, 186/255,
                                    // 10
                                    -0.2, 0.6,	  232/255, 164/255, 186/255,
                                    // 13
                                    -0.31, 0.2, 	232/255, 164/255, 186/255,

                                    // 11
                                    -0.47, 0.2, 	219/255, 112/255, 147/255,
                                    // 12
                                    -0.47, 0.1, 	219/255, 112/255, 147/255,
                                    // 13
                                    -0.31, 0.2, 	219/255, 112/255, 147/255,

                                    // 12
                                    -0.47, 0.1, 	110/255, 61/255, 80/255,
                                    // 13
                                    -0.31, 0.2,   110/255, 61/255, 80/255,
                                    // 15
                                    -0.2, -0.05,  110/255, 61/255, 80/255,

                                    // ADDITION
                                    -0.293, 0.16, 	232/255, 164/255, 186/255,
                                    // 15
                                    -0.2, -0.05,  	232/255, 164/255, 186/255,
                                    // 14
                                    -0.22, 0.22,	  232/255, 164/255, 186/255,

                                    // 15
                                    -0.2, -0.05,  219/255, 112/255, 147/255,
                                    // 14
                                    -0.22, 0.22,	219/255, 112/255, 147/255,
                                    // 16
                                    0.0, 0.3,     219/255, 112/255, 147/255,

                                    // 15
                                    -0.2, -0.05, 	110/255, 61/255, 80/255,
                                    // 16
                                    0.0, 0.3,    	110/255, 61/255, 80/255,
                                    // 18
                                    0.4, 0.0,   	110/255, 61/255, 80/255,

                                    // 16
                                    0.0, 0.3, 	232/255, 164/255, 186/255,
                                    // 18
                                    0.4, 0.0,   232/255, 164/255, 186/255,
                                    // 17
                                    0.2, 0.3, 	232/255, 164/255, 186/255,

                                    // 17
                                    0.2, 0.3,    219/255, 112/255, 147/255,
                                    // 19
                                    0.51, 0.0, 	 219/255, 112/255, 147/255,
                                    // 20
                                    0.43, -0.08, 219/255, 112/255, 147/255,

                                    // 21
                                    0.21, -0.015,	110/255, 61/255, 80/255,
                                    // 22
                                    0.186, -0.05,	110/255, 61/255, 80/255,
                                    // 23
                                    0.17, -0.015,	110/255, 61/255, 80/255,

                                    // 23
                                    0.17, -0.015,	  232/255, 164/255, 186/255,
                                    // 24
                                    0.0085, -0.027, 232/255, 164/255, 186/255,
                                    // 28
                                    0.3, -0.3, 	    232/255, 164/255, 186/255,
                                    // 24
                                    0.01, -0.027,   232/255, 164/255, 186/255,
                                    // 28
                                    0.3, -0.3, 	    232/255, 164/255, 186/255,
                                    // 29
                                    0.22, -0.3, 	  232/255, 164/255, 186/255,

                                    // 25
                                    0.043, -0.07, 	219/255, 112/255, 147/255,
                                    // 26
                                    0.0, -0.1, 	    219/255, 112/255, 147/255,
                                    // 27
                                    0.12, -0.17, 	  219/255, 112/255, 147/255,

                                    // 26
                                    0.0, -0.1, 	    110/255, 61/255, 80/255,
                                    // 27
                                    0.12, -0.17,   	110/255, 61/255, 80/255,
                                    // 38
                                    0.0, -0.8,    	110/255, 61/255, 80/255,

                                    // 31
                                    0.1, -0.3, 	  232/255, 164/255, 186/255,
                                    // 30
                                    0.25, -0.37, 	232/255, 164/255, 186/255,
                                    // 28
                                    0.3, -0.3, 	  232/255, 164/255, 186/255,
                                    // 31
                                    0.1, -0.3, 	  232/255, 164/255, 186/255,
                                    // 30
                                    0.25, -0.37, 	232/255, 164/255, 186/255,
                                    // 32
                                    0.09, -0.36, 	232/255, 164/255, 186/255,

                                    // 33
                                    0.0, -0.3, 	  219/255, 112/255, 147/255,
                                    // 34
                                    0.0, -0.35, 	219/255, 112/255, 147/255,
                                    // 36
                                    -0.23, -0.35, 219/255, 112/255, 147/255,
                                    // 36
                                    -0.23, -0.35, 219/255, 112/255, 147/255,
                                    // 33
                                    0.0, -0.3, 	  219/255, 112/255, 147/255,
                                    // 35
                                    -0.25, -0.3,  219/255, 112/255, 147/255,

                                    // 35
                                    -0.25, -0.3, 	110/255, 61/255, 80/255,
                                    // 36
                                    -0.23, -0.35, 110/255, 61/255, 80/255,
                                    // 37
                                    -0.37, -0.4,  110/255, 61/255, 80/255,

                                    // Square
                                    1.0, 1.0,        0.5, 1.0, 1.0,
                                    -1.0, 1.0,       1.0, 0.5, 1.0,
                                    -1.0, -1.0,      1.0, 1.0, 0.5,
                                    1.0, -1.0,       1.0, 1.0, 0.0,

                                    // Tile
                                    -0.5, 0.0,       1.0, 1.0, 1.0,
                                    0.0, 1.0,        1.0, 1.0, 1.0,
                                    0.5, 0.0,        0.6, 0.6, 0.6,
                                    0.0, -1.0,       0.6, 0.6, 0.6,

                                    // Crane
                                   // 1
                                    -0.7, -0.2,       0.9, 0.9, 0.9,
                                    -0.2, 0.0,        0.9, 0.9, 0.9,
                                    0.1, -0.2,        0.9, 0.9, 0.9,
                                    // 2
                                    -0.2, 0.0,        0.9, 0.9, 0.9,
                                    0.1, -0.2,        0.9, 0.9, 0.9,
                                    0.16, -0.15,      0.9, 0.9, 0.9,
                                    // 3
                                    -0.19, 0.01,      0.5, 0.5, 0.5,
                                    -0.29, 0.56,      1.0, 1.0, 1.0,
                                    -0.10, 0.1,       0.5, 0.5, 0.5,
                                    // 4
                                    -0.2, 0.0,        0.5, 0.5, 0.5,
                                    0.0, 0.2,         1.0, 1.0, 1.0,
                                    0.16, -0.15,      0.5, 0.5, 0.5,
                                    // 5
                                    -0.18, -0.2,      0.6, 0.6, 0.6,
                                    -0.12, -0.28,     0.6, 0.6, 0.6,
                                    -0.03, -0.2,      0.6, 0.6, 0.6,
                                    // 6
                                    -0.12, -0.28,     0.6, 0.6, 0.6,
                                    -0.03, -0.2,      0.6, 0.6, 0.6,
                                    -0.01, -0.26,     0.6, 0.6, 0.6,
                                    // 7
                                    -0.03, -0.2,      0.4, 0.4, 0.4,
                                    0.01, -0.2,       0.4, 0.4, 0.4,
                                    -0.01, -0.26,     0.4, 0.4, 0.4,
                                    // 8
                                    0.01, -0.2,       0.4, 0.4, 0.4,
                                    -0.01, -0.26,     0.4, 0.4, 0.4,
                                    0.02, -0.253,     0.4, 0.4, 0.4,
                                    // 9
                                    0.1, -0.2,        0.6, 0.6, 0.6,
                                    0.01, -0.2,       0.6, 0.6, 0.6,
                                    0.02, -0.253,     0.6, 0.6, 0.6,
                                    // 10
                                    0.02, -0.253,     0.6, 0.6, 0.6,
                                    0.1, -0.2,        0.6, 0.6, 0.6,
                                    0.15, -0.28,      0.6, 0.6, 0.6,
                                    // 29
                                    0.33, 0.0,        0.9, 0.9, 0.9,
                                    0.145, 0.15,      0.9, 0.9, 0.9,
                                    0.42, 0.28,       0.9, 0.9, 0.9,
                                    // 11
                                    0.1, -0.2,        0.6, 0.6, 0.6,
                                    0.15, -0.28,      0.6, 0.6, 0.6,
                                    0.16, -0.15,      0.6, 0.6, 0.6,
                                    // 12
                                    0.15, -0.28,      0.4, 0.4, 0.4,
                                    0.16, -0.15,      0.4, 0.4, 0.4,
                                    0.17, -0.28,      0.4, 0.4, 0.4,
                                    // 13
                                    0.17, -0.28,      0.7, 0.7, 0.7,
                                    0.16, -0.15,      0.7, 0.7, 0.7,
                                    0.18, -0.28,      0.7, 0.7, 0.7,
                                    // 14
                                    0.185, 0.195,     0.8, 0.8, 0.8,
                                    0.18, -0.28,      0.8, 0.8, 0.8,
                                    0.16, -0.15,      0.8, 0.8, 0.8,
                                    // 15
                                    0.165, 0.22,      0.8, 0.8, 0.8,
                                    0.16, -0.15,      0.8, 0.8, 0.8,
                                    0.185, 0.195,     0.8, 0.8, 0.8,
                                    // 16
                                    0.16, -0.15,      0.8, 0.8, 0.8,
                                    0.095, -0.01,     0.8, 0.8, 0.8,
                                    0.165, 0.22,      0.8, 0.8, 0.8,
                                    // 17
                                    0.12, 0.07,       0.9, 0.9, 0.9,
                                    0.06, 0.11,       0.9, 0.9, 0.9,
                                    0.145, 0.15,      0.9, 0.9, 0.9,
                                    // 18
                                    0.0, 0.2,         0.4, 0.4, 0.4,
                                    0.095, -0.01,     0.4, 0.4, 0.4,
                                    0.12, 0.07,       0.4, 0.4, 0.4,
                                    // 19
                                    0.19, -0.28,      0.6, 0.6, 0.6,
                                    0.18, -0.28,      0.6, 0.6, 0.6,
                                    0.185, 0.195,     0.6, 0.6, 0.6,
                                    // 20
                                    0.185, 0.195,     0.55, 0.55, 0.55,
                                    0.23, 0.14,       0.55, 0.55, 0.55,
                                    0.19, -0.28,      0.55, 0.55, 0.55,
                                    // 21
                                    0.19, -0.292,     0.4, 0.4, 0.4,
                                    0.21, -0.01,      0.4, 0.4, 0.4,
                                    0.257, -0.02,     0.4, 0.4, 0.4,
                                    // 22
                                    0.21, -0.01,      0.9, 0.9, 0.9,
                                    0.25, -0.065,     0.9, 0.9, 0.9,
                                    0.23, 0.14,       0.9, 0.9, 0.9,
                                    // 23
                                    0.25, -0.07,      0.9, 0.9, 0.9,
                                    0.23, 0.14,       0.9, 0.9, 0.9,
                                    0.33, 0.0,        0.9, 0.9, 0.9,
                                    // 25
                                    0.185, 0.195,     0.6, 0.6, 0.6,
                                    0.23, 0.12,       0.6, 0.6, 0.6,
                                    0.45, -0.04,      0.6, 0.6, 0.6,
                                    // 26
                                    0.162, 0.215,     0.8, 0.8, 0.8,
                                    0.18, 0.23,       0.8, 0.8, 0.8,
                                    0.45, -0.04,      0.8, 0.8, 0.8,
                                    // 27
                                    0.18, 0.23,       0.5, 0.5, 0.5,
                                    0.45, -0.04,      0.5, 0.5, 0.5,
                                    0.21, 0.24,       0.7, 0.7, 0.7,
                                    // 28
                                    0.45, -0.04,      0.8, 0.8, 0.8,
                                    0.21, 0.24,       0.8, 0.8, 0.8,
                                    0.23, 0.245,      0.8, 0.8, 0.8,

                                    // Decorative static points
                                    0.0, 0.0,       219/255, 112/255, 147/255,
                                    0.0, -0.1,      219/255, 112/255, 147/255,
                                    0.0, -0.2,      219/255, 112/255, 147/255,
                                    0.0, -0.3,      219/255, 112/255, 147/255,
                                    0.0, -0.4,      219/255, 112/255, 147/255,
                                    0.0, -0.5,      219/255, 112/255, 147/255,

                                    0.0, 0.15,      35/255, 190/255, 198/255,
                                    0.25, 0.35,     35/255, 190/255, 198/255,
                                    0.45, 0.5,      35/255, 190/255, 198/255,
                                    0.75, 0.35,     35/255, 190/255, 198/255,
                                    1.0, 0.0,       35/255, 190/255, 198/255,
                                    0.0, -1.0,      35/255, 190/255, 198/255,
                                    -1.0, 0.0,      35/255, 190/255, 198/255,
                                    -0.75, 0.35,    35/255, 190/255, 198/255,
                                    -0.45, 0.5,     35/255, 190/255, 198/255,
                                    -0.25, 0.35,    35/255, 190/255, 198/255
  ]);

  var n = scene.length / 6;
  var FSIZE = scene.BYTES_PER_ELEMENT;

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, scene, gl.STATIC_DRAW);
  gl.vertexAttribPointer(gl.program.a_Position, 2, gl.FLOAT, false, 5 * FSIZE, 0);
  gl.enableVertexAttribArray(gl.program.a_Position);
  gl.vertexAttribPointer(gl.program.a_Colour, 3, gl.FLOAT, false, 5 * FSIZE, 2 * FSIZE);
  gl.enableVertexAttribArray(gl.program.a_Colour);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  return n;
}

