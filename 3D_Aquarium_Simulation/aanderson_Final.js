/*
	* COSC3306 - Final Project
	* WebGL Aquarium Simulation
	* Amanda Anderson
	*  
*/
 
// WebGL Attributes
let canvas, gl; 
let vpMatrix, mMatrix, nMatrix, mvpMatrix;
let rotateX = 0.0;
let rotateY = 0.0;
let model;
let autoAngle = 1.0;
let auto = true;
let angle = 0.1;
let texLoaded = [];
let zoom = -10.0;
let counter = 0;
let switchRotate = true;
let rVal = 1.0, gVal = 1.0, bVal = 1.0;
let userAngle = 2.5;
let lightIntensity = 0.6;

let healthUpdate = false;
let healthUpdateCounter = 0;

// Directional Light Colours
let lightToggle = true;
let lightR = 245;
let lightG = 255;
let lightB = 255;

// Fish 1 Attributes
let fish1X = 0.0, fish1Y = 0.0;
let anim1Switch = true;
let fish1Rotate = 180.0;
let marker1 = 0;

// Fish 2 Attributes
let fish2X = 0.0, fish2Y = 0.0;
let anim2Switch = true;
let fish2Rotate = 0.0;
let marker2 = 0;

// Fish 3 Attributes
let fish3X = 0.0, fish3Y = 0.0;
let anim3Switch = true;
let fish3Rotate = 0.0;
let marker3 = 0;

// New Plant Attributes
let plantToggle = false;
let plantUserX = 0.0;
let plantUserY = 0.0;
let plantUserZ = 0.0;
let userMovement = true;
let enterToggle = false;
let enterCount = 0;

// Oyster Attributes
let openOys = false;
let oysterRotate = 0.0;

// Health and Food Attributes
let health = 50;
let prevTime = 0;
let timeBasedVar = 0;

let foodToggle = false;
let foodCounter = 0;
let foodY = 0.0;

function main() {
	
	// Retrieve <canvas> element and get the rendering context for WebGL
	canvas = document.getElementById('webgl');
	if (!(gl = canvas.getContext('webgl'))) {
		console.log('TERMINIATING: Failed to get the rendering context for WebGL');
		return;
	}

	// Retrieve hud <canvas> element and the rendering context for 2D graphics
	hud = document.getElementById('hud');  
	ctx = hud.getContext('2d');
	if (!gl || !ctx) {
		console.log('Failed to get rendering context');
		return;
	}

	if(!genShaderPrograms()){
		console.log('TERMINIATING: Failed to build all the shaders');
		return;
	}

	setAttribUniformLocations();
  
	//Add models from library
	addModels();

	//Set vertex coordinates, color and normals
	if(!initVertexBuffers(gl)){
		console.log('TERMINATED: Failed to set the vertex information');
		return;
	}

	// Load textures
	initTextures();
	setDrawingDefaults()
 
	// Calculate view projection matrix
	vpMatrix = new Matrix4();
	mvpMatrix = new Matrix4();
	mMatrix   = new Matrix4();
	nMatrix   = new Matrix4();

	setView();

	// Change rotation of world with arrow keys
	window.addEventListener("keydown", changeRotation, true);
	
	var tick = function() {
		update();
		drawScene();
		draw2D();
		requestAnimationFrame(tick);
	}
		tick();
}

function changeRotation(e){

	if (e.keyCode == 38) { // Look Up
		userAngle += 0.1;
	}

	if (e.keyCode == 40) { // Look Down
		userAngle -= 0.1;
	}

	if (e.keyCode == 187) { // Zoom Out
		if ((zoom + 2) == 0) {
			zoom = zoom;
		}
		else {
			zoom = zoom + 2;
		}
	}

	if (e.keyCode == 189) { // Zoom In
		if ((zoom - 2) == 0) {
			zoom = zoom;
		}
		else {
			zoom = zoom - 2;
		}
	}

	if (e.keyCode == 65) {// move plant left
		if (userMovement) {
			plantUserX += 0.5;
		}
	}

	if (e.keyCode == 87) {// move plant back
		if (userMovement) {
			plantUserZ += 0.5;
		}
	}

	if (e.keyCode == 83) {// move plant forwards
		if (userMovement) {
			plantUserZ -= 0.5;
		}
	}

	if (e.keyCode == 68) {// move plant right
		if (userMovement){
			plantUserX -= 0.5;
		}
	}

	if (e.keyCode == 81) {// move plant Up
		if (userMovement){
			plantUserY -= 0.5;
		}
	}

	if (e.keyCode == 69) {// move plant down
		if (userMovement){
			plantUserY += 0.5;
		}
	}

	if (e.keyCode == 13) {
		userMovement = false;
		enterToggle = true;
	}

	setView();
}

function setView() {
	vpMatrix = new Matrix4();
	let aspect = canvas.width/canvas.height;
	vpMatrix.setPerspective(30, aspect, 1, 100);
	vpMatrix.lookAt(0.0, userAngle, zoom, 0, 0, 0, 0, 1, 0);
}

function update(){

	// Time Based Health
	time = new Date();
	prevTime = timeBasedVar;
	timeBasedVar = time.getSeconds();

	if (prevTime != timeBasedVar) {
		health--;
	}

	// Animations
	counter++;

	if (counter < 100) {
		angle = -0.05;
		vpMatrix.rotate(angle, 0, 1, 0);
	}

	else if (counter % 550 == 0) {
		switchRotate = !switchRotate;
	}

	else if (switchRotate == true) {
		angle = 0.05;
		vpMatrix.rotate(angle, 0, 1, 0);
	}

	else if (switchRotate == false) {
		angle = -0.05;
		vpMatrix.rotate(angle, 0, 1, 0);
	}

	// Fish 1
	if (counter % 200 == 0) {
		anim1Switch = !anim1Switch;
		fish1Rotate += 180;
	}

	if (anim1Switch == true) {
		fish1X += 0.02;
		fish1Y += 0.02;
	}

	else if (anim1Switch == false) {
		fish1X -= 0.02;
		fish1Y -= 0.02;
	}

	// Fish 2
	if (counter % 350 == 0) {
		anim2Switch = !anim2Switch;
		fish2Rotate += 180;
	}

	if (anim2Switch == true) {
		fish2X -= 0.01;
		fish2Y += 0.01;
	}

	else if (anim2Switch == false) {
		fish2X += 0.01;
		fish2Y -= 0.01;
	}

	// Fish 2
	if (counter % 250 == 0) {
		anim3Switch = !anim3Switch;
		fish3Rotate += 180;
	}

	if (anim3Switch == true) {
		fish3X -= 0.02;
	}

	else if (anim3Switch == false) {
		fish3X += 0.02;
	}

	// Oyster
	if (openOys == true) {

		if (oysterRotate <= 30) {
			oysterRotate += 1;
		}
	}

	// Food
	if (foodToggle == true) {
		foodCounter--;

		if (foodCounter >= 0) {
			foodY -= 0.1;
		}

		if (foodCounter == 0) {
			foodToggle = false;
			foodY = 0.0;
		}
	}

	return;
}

function reset() {
	location.reload();
}

function cleanTank() {
	
	if (health <= 25) {
		lightR = 245;
		lightB = 255;
		lightG = 255;
		setDrawingDefaults();
	}

	health = 50;
	healthUpdate = true;
	healthUpdateCounter = 30;
}

 function updateIntense(value) {
	 lightIntensity = (value / 100);
	 setDrawingDefaults();
 }

function feedFish() {

	if (health <= 25) {
		lightR = 245;
		lightB = 255;
		lightG = 255;
		setDrawingDefaults();
	}

	if (health + 10 > 50) {
		health = 50;
	}
	else {
		health += 10;
	}

	foodToggle = true;
	foodCounter = 50;
	healthUpdate = true;
	healthUpdateCounter = 30;
}

function openOyster() {
	openOys = true;
	document.getElementById('oysterBtn').style.opacity = "0";
}

function toggleLight() {
	if (lightToggle == true) {
		lightR = 0;
		lightG = 0;
		lightB = 0;
		lightToggle = false;
		setDrawingDefaults();
	}
	else {
		lightR = 245;
		lightG = 255;
		lightB = 255;
		lightToggle = true;
		setDrawingDefaults();
	}
}

function addPlant() {
	plantToggle = true;
	document.getElementById('addPlantBtn').style.opacity = "0";
}

// Update Light Colour
function updateR(value) {
	lightR = value;
	setDrawingDefaults();
}

function updateG(value) {
	lightG = value;
	setDrawingDefaults();
}

function updateB(value) {
	lightB = value;
	setDrawingDefaults();
}

function drawScene(){

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor(116/255, 71/255, 108/255, 1.0);

	/****************************************************************************************************/
	// Fish #1
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.2, 0.12, 0.08);
	mMatrix.translate(0.0 + fish1X, 4.0 + fish1Y, 0.0);
	mMatrix.rotate(fish1Rotate, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[3]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 3);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawFish();

	/****************************************************************************************************/
	// Fish #2
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.15, 0.1, 0.08);
	mMatrix.translate(2.0 + fish2X, 7.0 + fish2Y, 2.0 + fish2X);
	mMatrix.rotate(fish2Rotate, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[5]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 5);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawFish();

	/****************************************************************************************************/
	// Fish #3
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.23, 0.1, 0.08);
	mMatrix.translate(0.0 + fish3X, 14.0 + fish3Y, 2.0 + fish3X);
	mMatrix.rotate(fish3Rotate, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[6]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 6);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawFish();

	/****************************************************************************************************/
	// Plant Group #1
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.03, 0.2, 0.03);
	mMatrix.translate(30, 1.2, 1.5);
	mMatrix.rotate(90, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[8]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 8);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawPlant1();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.05, 0.3, 0.05);
	mMatrix.translate(20, 1.2, 1.5);
	mMatrix.rotate(90, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[8]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 8);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawPlant1();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.03, 0.15, 0.03);
	mMatrix.translate(37, 1.2, 1.5);
	mMatrix.rotate(90, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[8]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 8);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawPlant1();

	/****************************************************************************************************/
	// Plant #2 and #3
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.3, 0.4, 0.2);
	mMatrix.translate(-2.5, 0.1, 2);
	mMatrix.rotate(10, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[8]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 8);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawPlant2();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.2, 0.3, 0.2);
	mMatrix.translate(6, 0.1, -2.5);
	mMatrix.rotate(10, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[8]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 8);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawPlant2();

	/****************************************************************************************************/
	// User Plant
	/****************************************************************************************************/

	if (plantToggle) {
	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.3, 0.4, 0.2);
	mMatrix.translate(0.0 + plantUserX, 0.2 + plantUserY, -3 + plantUserZ);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[8]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 8);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawPlant2();
	}

	/****************************************************************************************************/
	// Oyster and Pearl
	/****************************************************************************************************/
	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.2, 0.3, 0.2);
	mMatrix.translate(-0.8, 0.2, 1.3);
	mMatrix.rotate(10 + oysterRotate, 1, 0, 0);
	mMatrix.rotate(180, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[9]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 9);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawOyster();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.2, 0.3, 0.2);
	mMatrix.translate(-0.8, 0.2, 1.35);
	mMatrix.rotate(180, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[9]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 9);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawOyster();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.02, 0.02, 0.02);
	mMatrix.translate(-8, 2.5, 9);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[10]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 10);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawPearl();

	/****************************************************************************************************/
	// Fish Food [Animation]
	/****************************************************************************************************/
	if (foodToggle) {

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.02, 0.02, 0.02);
	mMatrix.translate(-8, 80 + foodY, 9);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[11]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 11);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawFood();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.02, 0.02, 0.02);
	mMatrix.translate(-5, 70 + foodY, 9);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[11]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 11);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawFood();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.02, 0.02, 0.02);
	mMatrix.translate(-4, 93 + foodY, 9);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[11]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 11);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawFood();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.02, 0.02, 0.02);
	mMatrix.translate(4, 85 + foodY, 9);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[11]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 11);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawFood();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.02, 0.02, 0.02);
	mMatrix.translate(4, 75 + foodY, 9);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[11]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 11);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawFood();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.02, 0.02, 0.02);
	mMatrix.translate(3, 60 + foodY, 9);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[11]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 11);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawFood();
}

	/****************************************************************************************************/
	// Decorative Rocks
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.5, 0.5, 0.5);
	mMatrix.translate(2.0, 0.2, 1.0);
	mMatrix.rotate(250, 1, 0, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[12]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 12);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawPolyhedron();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.3, 0.3, 0.2);
	mMatrix.translate(1.4, 0.2, 2.5);
	mMatrix.rotate(250, 1, 0, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[12]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 12);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawPolyhedron();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.2, 0.3, 0.2);
	mMatrix.translate(-4.5, 0.0, -1.3);
	mMatrix.rotate(80, 1, 0, 0);
	mMatrix.rotate(-20, 0, 1, 0);
	mMatrix.rotate(-25, 0, 0, 1);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[14]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 14);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawBoat();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.rotate(0, 1, 0, 0);
	mMatrix.rotate(0, 0, 1, 0);
	mMatrix.rotate(-25, 0, 0, 1);
	mMatrix.scale(0.015, 0.5, 0.015);
	mMatrix.translate(-60, 0.0, -23.0);

	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[14]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 14);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawCube();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.1, 0.3, 0.1);
	mMatrix.translate(13.7, 1.0, 10.0);
	mMatrix.rotate(0, 1, 0, 0);
	mMatrix.rotate(20, 0, 1, 0);
	mMatrix.rotate(5, 0, 0, 1);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[14]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 14);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawCube();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.rotate(0, 1, 0, 0);
	mMatrix.rotate(0, 0, 1, 0);
	mMatrix.rotate(-25, 0, 0, 1);
	mMatrix.scale(0.015, 0.35, 0.015);
	mMatrix.translate(-56, -0.5, -15.0);

	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[14]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 14);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawCube();

	/****************************************************************************************************/
	// Decorative Objects
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(0.15, 0.45, 0.04);
	mMatrix.translate(-7.5, 0.0, 4.0);
	mMatrix.rotate(-25, 0, 1, 0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[8]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 8);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}

	drawPlant2();


	/****************************************************************************************************/
	// Fish Tank Sides - Inside
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(1.5, 1.0, 1.0);
	mMatrix.translate(0.0, 1.0, 0.0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[2]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 2);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawAquariumSides();

	/****************************************************************************************************/
	// Fish Tank Top - Inside
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(1.5, 1.0, 1.0);
	mMatrix.translate(0.0, 1.0, 0.0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[2]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 2);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawAquariumTop();

	/****************************************************************************************************/
	// Fish Tank Bottom - Inner
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(1.5, 1.0, 1.0);
	mMatrix.translate(0.0, 1.0, 0.0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[0]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 0);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawAquariumBottom();

	/****************************************************************************************************/
	// Fish Tank Sides - Black
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(1.501, 1.001, 1.001);
	mMatrix.translate(0.0, 1.0, 0.0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[0]){
		gl.useProgram(gl.program3);
		gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
		gl.uniform1i(gl.program3.u_Sampler, 2);
		gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
		}
		else {
		gl.useProgram(gl.program1);
			gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
			gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
			gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
		}
	
	drawAquariumSides();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(1.501, 1.001, 1.001);
	mMatrix.translate(0.0, 1.0, 0.0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[0]){
	gl.useProgram(gl.program3);
	gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
	gl.uniform1i(gl.program3.u_Sampler, 2);
	gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
	}
	else {
	gl.useProgram(gl.program1);
		gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
		gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
	}
	drawAquariumTop();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(1.501, 1.001, 1.001);
	mMatrix.translate(0.0, 1.0, 0.0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[0]){
		gl.useProgram(gl.program3);
		gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
		gl.uniform1i(gl.program3.u_Sampler, 2);
		gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
		}
		else {
		gl.useProgram(gl.program1);
			gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
			gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
			gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
		}

	drawAquariumBottom();

	/****************************************************************************************************/
	// Fish Tank Black Bottom
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(1.5, 0.055, 0.95);
	mMatrix.translate(0.0, 0.05, -0.005);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[2]){
		gl.useProgram(gl.program3);
		gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
		gl.uniform1i(gl.program3.u_Sampler, 4);
		gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
		}
		else {
		gl.useProgram(gl.program1);
			gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
			gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
			gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
		}

	drawCube();

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(1.51, 0.05, 1.0);
	mMatrix.translate(0.0, 0.05, -0.005);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[2]){
		gl.useProgram(gl.program3);
		gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
		gl.uniform1i(gl.program3.u_Sampler, 2);
		gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
		}
		else {
		gl.useProgram(gl.program1);
			gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
			gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
			gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
		}

	drawCube();
	/****************************************************************************************************/
	// Fish Tank Stand
	/****************************************************************************************************/

	gl.useProgram(gl.program3);
	mvpMatrix.set(vpMatrix);			
	mMatrix.setIdentity();			
	mMatrix.scale(1.5, 1.0, 1.0);
	mMatrix.translate(0.0,  -1.0001, 0.0);
	mvpMatrix.multiply(mMatrix);
	nMatrix.setInverseOf(mMatrix);
	nMatrix.transpose();

	if(texLoaded[1]){
		gl.useProgram(gl.program3);
		gl.uniformMatrix4fv(gl.program3.u_MvpMatrix, false, mvpMatrix.elements);
		gl.uniformMatrix4fv(gl.program3.u_NormalMatrix, false, nMatrix.elements);
		gl.uniform1i(gl.program3.u_Sampler, 1);
		gl.uniform4f(gl.program3.u_MatColor, 1.0, 1.0, 1.0, 1.0); 
		}
		else {
		gl.useProgram(gl.program1);
			gl.uniformMatrix4fv(gl.program1.u_MvpMatrix, false, mvpMatrix.elements);
			gl.uniformMatrix4fv(gl.program1.u_NormalMatrix, false, nMatrix.elements);
			gl.uniformMatrix4fv(gl.program1.u_ModelMatrix, false, mMatrix.elements);
		}

	drawCube();

}

/****************************************************************************************************/
// Draw HUD
/****************************************************************************************************/

function draw2D() {
	ctx.clearRect(0, 0, 400, 400); // Clear <hud>
	ctx.font = '16px "Raleway"';
	ctx.fillStyle = 'rgba(255, 255, 255, 1)';
	ctx.fillText('Aquarium Health', 10, 30); 

	if (healthUpdate == true || healthUpdateCounter >= 0){
		ctx.font = '18px "Raleway"';
		ctx.fillStyle = 'rgba(255, 241, 96, 1)';
		healthUpdate = false;
		healthUpdateCounter--;
	}
	
	ctx.fillText(health + ' / 50', 10, 50); 

	if (health < 35 && health > 20) {
		ctx.fillStyle = 'rgba(255, 140, 0, 1)';
		ctx.fillText('Consider cleaning the tank.', 10, 70); 
	}

	if (health <= 20 && health > 0) {
		ctx.fillStyle = 'rgba(255, 50, 50, 1)';
		ctx.fillText('Critical health! Clean the tank!', 10, 70); 

		lightR = 15;
		lightG = 150;
		lightB = 15;
		setDrawingDefaults();
	}

	if (health <= 0) {
		health = 0;
		ctx.fillStyle = 'rgba(219, 112, 147, 1)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.font = '50px "Raleway"';
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		ctx.fillText('Your fish died :(', 160, 300);
		ctx.font = '25px "Raleway"';
		ctx.fillText('Click reset to try again', 200, 350);
	}

	if (plantToggle && !enterToggle) {
		ctx.font = '14pt "Raleway"';
		ctx.fillStyle = 'rgba(250, 250, 250, 1)';
		ctx.fillText('Place your new plant using A,W,S,D.', 170, 415);
		ctx.fillText('Use "Enter" to lock the final position!', 170, 445);
	}

	if (enterToggle) {
		if (enterCount == 0) {
			ctx.clearRect(0, 100, 600, 600);
			enterCount++;
		}
	}
}
	

/****************************************************************************************************/
// Add models and specify custom draw functions
/****************************************************************************************************/

function addModels(){
	model = modelCollection_EmptyModel();
	modelCollection_AddModel(model, modelCollection_Cube);	
	modelCollection_AddModel(model, modelCollection_Tetrahedron);
	modelCollection_AddModel(model, modelCollection_Polyhedron);
	modelCollection_AddModel(model, modelCollection_Fish);
	modelCollection_AddModel(model, modelCollection_Plant1);
	modelCollection_AddModel(model, modelCollection_Plant2);
	modelCollection_AddModel(model, modelCollection_OysterBtm);
	modelCollection_AddModel(model, modelCollection_Boat);
	modelCollection_AddModel(model, modelCollection_Sphere20);
}

function drawCube(){
	var base = 0
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, base*2);
};

function drawAquariumSides(){
	var base = 12
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, base*2);
	
	var base = 6
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, base*2);
};

function drawAquariumTop(){
	var base = 18
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, base*2);
};

function drawAquariumBottom(){
	var base = 0
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, base*2);
};

function drawTetrahedron(){
	var base = 72;
	gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, base);	
};

function drawPolyhedron(){
	var base = 96;
	gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, base);
};

function drawFish() {
	var base = 144;
	gl.drawElements(gl.TRIANGLES, 47, gl.UNSIGNED_SHORT, base);
};

function drawPlant1() {
	var base = 238;
	gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, base);
};

function drawPlant2() {
	var base = 262;
	gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, base);
};

function drawOyster() {
	var base = 286;
	gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, base);
};

function drawPearl() {
	var base = 292;
	gl.drawElements(gl.TRIANGLES, 2400, gl.UNSIGNED_SHORT, base);
};

function drawBoat() {
	var base = 292;
	gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_SHORT, base);
};

function drawFood() {
	var base = 412;
	gl.drawElements(gl.TRIANGLES, 2400, gl.UNSIGNED_SHORT, base);
};


/****************************************************************************************************/
// Initialize VBO'S and attach attributes
/****************************************************************************************************/
function initVertexBuffers(gl) {
 
	// Indices of the vertices
	var indices = new Uint16Array(model.indices);

	gl.useProgram(gl.program1);
	// Program 1: Write the vertex property to buffers (coordinates, colors and normals)
	if (!(gl.program1.vboVertices = util_InitArrayBuffer(gl, gl.program1.a_Position, model.vertices, 3))) return -1;
	if (!(gl.program1.vboColors   = util_InitArrayBuffer(gl, gl.program1.a_Color,    model.colors,   3))) return -1;
	if (!(gl.program1.vboNormals  = util_InitArrayBuffer(gl, gl.program1.a_Normal,   model.normals,  3))) return -1;
  
	gl.useProgram(gl.program3);
	// Program 2: connect second program attributes to existing VBOS
	gl.program2.vboVertices = util_AttachAttribToVBO(gl, gl.program2.a_Position, gl.program1.vboVertices, 3);
	gl.program2.vboVertices = util_AttachAttribToVBO(gl, gl.program2.a_Normal, gl.program1.vboNormals, 3);
  
	gl.useProgram(gl.program3);
	// Program 3: connect third program attributes to existing VBO's plus Texels
	gl.program3.vboVertices      = util_AttachAttribToVBO(gl, gl.program2.a_Position, gl.program1.vboVertices, 3);
	gl.program3.vboVertices      = util_AttachAttribToVBO(gl, gl.program2.a_Normal, gl.program1.vboNormals, 3);
	if (!(gl.program3.vboTexels  = util_InitArrayBuffer(gl, gl.program3.a_TexCoord, model.texels,   2))){
	console.log("issue with texel loading");
	return -1;  
	} 

	// Write the indices to the buffer object
	var indexBuffer = gl.createBuffer();
	if (!indexBuffer) {
		console.log('Failed to create the buffer object');
		return false;
	}

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	return indices.length;
}

/****************************************************************************************************/
// Initialize Textures
/****************************************************************************************************/

function initTextures() {
	
// Aquarium Background
		texLoaded[0] = false;
	var textureObject0 = gl.createTexture();

	var image0 = new Image();					
	image0.onload 	
			= function() { loadTexture(textureObject0, image0, gl.TEXTURE0, 0); };
	image0.src = '../resources/background.jpg';

	// Concrete Tank Stand
		texLoaded[1] = false;
	var textureObject1 = gl.createTexture();	

	var image1 = new Image();			
	image1.onload 			
			= function() { loadTexture(textureObject1, image1, gl.TEXTURE1, 1); };
	image1.src = '../resources/concrete.jpg';	

	// Black Plastic
	texLoaded[2] = false;
	var textureObject2 = gl.createTexture();

	var image2 = new Image();				
	image2.onload 								
			= function() { loadTexture(textureObject2, image2, gl.TEXTURE2, 2); };
	image2.src = '../resources/black_sides.jpg';

	// Fish Scales 1
	texLoaded[3] = false;
	var textureObject3 = gl.createTexture();

	var image3 = new Image();				
	image3.onload 								
			= function() { loadTexture(textureObject3, image3, gl.TEXTURE3, 3); };
	image3.src = '../resources/scales_1.jpg';

	// Aquarium Rocks
	texLoaded[4] = false;
	var textureObject4 = gl.createTexture();

	var image4 = new Image();				
	image4.onload 								
			= function() { loadTexture(textureObject4, image4, gl.TEXTURE4, 4); };
	image4.src = '../resources/rocks.jpg';

	// Fish Scales 2
	texLoaded[5] = false;
	var textureObject5 = gl.createTexture();

	var image5 = new Image();				
	image5.onload 								
			= function() { loadTexture(textureObject5, image5, gl.TEXTURE5, 5); };
	image5.src = '../resources/scales_2.jpg';

	// Fish Scales 3
	texLoaded[6] = false;
	var textureObject6 = gl.createTexture();

	var image6 = new Image();				
	image6.onload 								
			= function() { loadTexture(textureObject6, image6, gl.TEXTURE6, 6); };
	image6.src = '../resources/scales_3.jpg';

	// Plant 1
	texLoaded[7] = false;
	var textureObject7 = gl.createTexture();

	var image7 = new Image();				
	image7.onload 								
			= function() { loadTexture(textureObject7, image7, gl.TEXTURE7, 7); };
	image7.src = '../resources/plant.jpg';

	// Plant 2
	texLoaded[8] = false;
	var textureObject8 = gl.createTexture();

	var image8 = new Image();				
	image8.onload 								
			= function() { loadTexture(textureObject8, image8, gl.TEXTURE8, 8); };
	image8.src = '../resources/plant2.jpg';

	// Oyster
	texLoaded[9] = false;
	var textureObject9 = gl.createTexture();

	var image9 = new Image();				
	image9.onload 								
			= function() { loadTexture(textureObject9, image9, gl.TEXTURE9, 9); };
	image9.src = '../resources/oyster.jpg';

	// Pearl
	texLoaded[10] = false;
	var textureObject10 = gl.createTexture();

	var image10 = new Image();				
	image10.onload 								
			= function() { loadTexture(textureObject10, image10, gl.TEXTURE10, 10); };
	image10.src = '../resources/pearl.jpg';

	// Food
	texLoaded[11] = false;
	var textureObject11 = gl.createTexture();

	var image11 = new Image();				
	image11.onload 								
			= function() { loadTexture(textureObject11, image11, gl.TEXTURE11, 11); };
	image11.src = '../resources/food.jpg';

	// Rock Texture
	texLoaded[12] = false;
	var textureObject12 = gl.createTexture();

	var image12 = new Image();				
	image12.onload 								
			= function() { loadTexture(textureObject12, image12, gl.TEXTURE12, 12); };
	image12.src = '../resources/rock.jpg';

	// Cyan Texture
	texLoaded[13] = false;
	var textureObject13 = gl.createTexture();

	var image13 = new Image();				
	image13.onload 								
			= function() { loadTexture(textureObject13, image13, gl.TEXTURE13, 13); };
	image13.src = '../resources/cyan.jpg';

	// Cyan Texture
	texLoaded[14] = false;
	var textureObject14 = gl.createTexture();

	var image14 = new Image();				
	image14.onload 								
			= function() { loadTexture(textureObject14, image14, gl.TEXTURE14, 14); };
	image14.src = '../resources/wood.jpg';

	return;
}

function loadTexture(texObj, image, texUnit, num) {
	
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(texUnit);
	gl.bindTexture(gl.TEXTURE_2D, texObj);  		
	
	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); 
	
	// If image is not in power of 2, turn off mips and set wrapping to clamp to edge
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	//indicate texture is loaded
	texLoaded[num] = true;
  
	drawScene();
}

/****************************************************************************************************/
// Attribute and uniform locations for shaders, default values
/****************************************************************************************************/

function setAttribUniformLocations(){
	
	// Program 1
	gl.useProgram(gl.program1)

	gl.program1.a_Position   = util_AddAttribute(gl, gl.program1, 'a_Position');
	gl.program1.a_Color      = util_AddAttribute(gl, gl.program1, 'a_Color');
	gl.program1.a_Normal     = util_AddAttribute(gl, gl.program1, 'a_Normal');

	gl.program1.u_MvpMatrix     = util_AddUniform(gl, gl.program1, 'u_MvpMatrix');
	gl.program1.u_NormalMatrix  = util_AddUniform(gl, gl.program1, 'u_NormalMatrix');
	gl.program2.u_ModelMatrix   = util_AddUniform(gl, gl.program1, 'u_ModelMatrix');
	gl.program1.u_LightColor    = util_AddUniform(gl, gl.program1, 'u_LightColor');
	gl.program1.u_LightPosition = util_AddUniform(gl, gl.program1, 'u_LightPosition');
	gl.program1.u_AmbientLight  = util_AddUniform(gl, gl.program1, 'u_AmbientLight');

	// Program 2
	gl.useProgram(gl.program2)

	gl.program2.a_Position   = util_AddAttribute(gl, gl.program2, 'a_Position');
	gl.program2.a_Normal     = util_AddAttribute(gl, gl.program2, 'a_Normal');

	gl.program2.u_MvpMatrix     = util_AddUniform(gl, gl.program2, 'u_MvpMatrix');
	gl.program2.u_NormalMatrix  = util_AddUniform(gl, gl.program2, 'u_NormalMatrix');
	gl.program2.u_ModelMatrix   = util_AddUniform(gl, gl.program2, 'u_ModelMatrix');
	gl.program2.u_MatColor      = util_AddUniform(gl, gl.program2, 'u_MatColor');
	gl.program2.u_LightColor    = util_AddUniform(gl, gl.program2, 'u_LightColor');
	gl.program2.u_LightPosition = util_AddUniform(gl, gl.program2, 'u_LightPosition');
	gl.program2.u_AmbientLight  = util_AddUniform(gl, gl.program2, 'u_AmbientLight');

	
	// Program 3
	gl.useProgram(gl.program3)

	gl.program3.a_Position   = util_AddAttribute(gl, gl.program3, 'a_Position');
	gl.program3.a_Normal     = util_AddAttribute(gl, gl.program3, 'a_Normal');
	gl.program3.a_TexCoord   = util_AddAttribute(gl, gl.program3, 'a_TexCoord');

	gl.program3.u_MvpMatrix      = util_AddUniform(gl, gl.program3, 'u_MvpMatrix');
	gl.program3.u_NormalMatrix   = util_AddUniform(gl, gl.program3, 'u_NormalMatrix');
	gl.program3.u_MatColor       = util_AddUniform(gl, gl.program3, 'u_MatColor');
	gl.program3.u_LightColor     = util_AddUniform(gl, gl.program3, 'u_LightColor');
	gl.program3.u_LightDirection = util_AddUniform(gl, gl.program3, 'u_LightDirection');
	gl.program3.u_AmbientLight   = util_AddUniform(gl, gl.program3, 'u_AmbientLight');
	gl.program3.u_Sampler        = util_AddUniform(gl, gl.program3, 'u_Sampler');
	
}

function setDrawingDefaults() {

	gl.enable(gl.DEPTH_TEST);
	var lightPosition = new Vector3([500.0, 800.0, 700.0]);
	lightPosition.normalize();

	// Program 1 specific defaults / initial settings 
	gl.useProgram(gl.program1);
	gl.uniform3f(gl.program1.u_LightColor, lightR/255, lightG/255, lightB/255);
	gl.uniform3fv(gl.program1.u_LightPosition, lightPosition.elements);
	gl.uniform3f(gl.program3.u_AmbientLight, lightIntensity, lightIntensity, lightIntensity);

	// Program 2 specific defaults / initial settings
	gl.useProgram(gl.program2);
	gl.uniform4f(gl.program2.u_MatColor, 1.0, 1.0, 0.0, 1.0);
	gl.uniform3f(gl.program2.u_LightColor, lightR/255, lightG/255, lightB/255);
	gl.uniform3fv(gl.program2.u_LightPosition, lightPosition.elements);
	gl.uniform3f(gl.program3.u_AmbientLight, lightIntensity, lightIntensity, lightIntensity);

	// Program 3 specific defaults / initial settings
	gl.useProgram(gl.program3);
	gl.uniform3f(gl.program3.u_LightColor, lightR/255, lightG/255, lightB/255);
	gl.uniform3fv(gl.program3.u_LightDirection, lightPosition.elements);
	gl.uniform3f(gl.program3.u_AmbientLight, lightIntensity, lightIntensity, lightIntensity);
		
	return;
}

/****************************************************************************************************/
// Generate the shader programs
/****************************************************************************************************/
function genShaderPrograms(){

	if(!(gl.program1 = util_InitShaders(gl, VSHADER_SOURCE1, FSHADER_SOURCE1))) {
		console.log("Error building program 1");
		return false;
	}

	if(!(gl.program2 = util_InitShaders(gl, VSHADER_SOURCE2, FSHADER_SOURCE2))) {
		console.log("Error building program 2");
		return false;
	}
  
	if(!(gl.program3 = util_InitShaders(gl, VSHADER_SOURCE3, FSHADER_SOURCE3))) {
		console.log("Error building program 3");
		return false;
	}

	return true;
}


/****************************************************************************************************/
// Shader Definitions
/****************************************************************************************************/

var VSHADER_SOURCE1 = 
	'attribute vec4 a_Position;\n' + 
	'attribute vec4 a_Normal;\n' + 
	'attribute vec4 a_Color;\n' + 

	'uniform mat4 u_MvpMatrix;\n' +
	'uniform mat4 u_ModelMatrix;\n' +
	'uniform mat4 u_NormalMatrix;\n' +
	'uniform vec3 u_LightColor;\n' +
	'uniform vec3 u_LightPosition;\n' +
	'uniform vec3 u_AmbientLight;\n' +

	'varying vec4 v_Color;\n' +

	'void main() {\n' +
	'  gl_Position = u_MvpMatrix * a_Position ;\n' +
	'  vec4 color = a_Color;\n' +
	'  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	'  vec4 vertexPosition = u_ModelMatrix * a_Position;\n' +
	'  vec3 LightDirection = normalize(u_LightPosition - vec3(vertexPosition));\n' +
	'  float nDotL = max(dot(LightDirection, normal), 0.0);\n' +
	'  vec3 diffuse = u_LightColor * color.rgb * nDotL ;\n' +
	'  vec3 ambient = u_AmbientLight * color.rgb;\n' +

	'  v_Color = vec4((diffuse+ambient), color.a);\n' +
	'}\n';

var FSHADER_SOURCE1 = 
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
	'varying   vec4 v_Color;\n' +
	'void main() {\n' +
'  gl_FragColor = v_Color;\n' +
	'}\n';

var VSHADER_SOURCE2 = 
	'attribute vec4 a_Position;\n' + 
	'attribute vec4 a_Normal;\n' + 
 
	'uniform mat4 u_MvpMatrix;\n' +
	'uniform mat4 u_ModelMatrix;\n' +
	'uniform mat4 u_NormalMatrix;\n' +
	'uniform vec3 u_LightPosition;\n' +

	'varying vec4 v_Normal;\n' +
	'varying vec3 v_LightDirection;\n' +
 
	'void main() {\n' +
	'  gl_Position = u_MvpMatrix * a_Position ;\n' +
	'  v_Normal = vec4(normalize(vec3(u_NormalMatrix * a_Normal)), 1.0);\n' +
	'  vec4 vertexPosition = u_ModelMatrix * a_Position;\n' +
	'  v_LightDirection = normalize(u_LightPosition - vec3(vertexPosition));\n' +
	'}\n';


var FSHADER_SOURCE2 = 
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +

	'uniform vec3 u_LightColor;\n' +
	'uniform vec3 u_AmbientLight;\n' +
	'uniform vec4 u_MatColor;\n' +

	'varying vec4 v_Normal;\n' +
	'varying vec3 v_LightDirection;\n' +

	'void main() {\n' +
	'  vec4 color = u_MatColor;\n' +
	'  vec3 normal = normalize(v_Normal.xyz);\n' +
	'  float nDotL = max(dot(v_LightDirection, normal), 0.0);\n' +
	'  vec3 diffuse = u_LightColor * color.rgb * nDotL ;\n' +
	'  vec3 ambient = u_AmbientLight * color.rgb;\n' +

	'  gl_FragColor = vec4((diffuse+ambient), color.a);\n' +
	'}\n';

var VSHADER_SOURCE3 = 
	'attribute vec4 a_Position;\n' + 
	'attribute vec4 a_Normal;\n' + 
	'attribute vec2 a_TexCoord;\n' +

	'uniform mat4 u_MvpMatrix;\n' +
	'uniform mat4 u_NormalMatrix;\n' +
	'uniform vec3 u_LightColor;\n' +
	'uniform vec3 u_LightDirection;\n' +
	'uniform vec3 u_AmbientLight;\n' +
	'uniform vec4 u_MatColor;\n' +  

	'varying vec4 v_Color;\n' +
	'varying vec2 v_TexCoord;\n' +

	'void main() {\n' +
	'  gl_Position = u_MvpMatrix * a_Position ;\n' +
	'  vec4 color = u_MatColor;\n' +
	'  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	'  float nDotL = max(dot(u_LightDirection, normal), 0.0);\n' +
	'  vec3 diffuse = u_LightColor * color.rgb * nDotL ;\n' +
	'  vec3 ambient = u_AmbientLight * color.rgb;\n' +

	'  v_Color = vec4((diffuse+ambient), color.a);\n' +
	'  v_TexCoord = a_TexCoord;\n' +
	'}\n';

var FSHADER_SOURCE3 = 
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
	'uniform sampler2D u_Sampler;\n' +

	'varying vec4 v_Color;\n' +
	'varying vec2 v_TexCoord;\n' +

	'void main() {\n' +
	'  vec4 texelColor = texture2D(u_Sampler, v_TexCoord);\n' +
	'  gl_FragColor = texelColor * v_Color;\n' +
	'}\n';