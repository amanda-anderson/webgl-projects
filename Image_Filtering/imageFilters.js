/*
 * COSC3306 - Assignment 6
 * Image Filtering
 * Amanda Anderson
 */

var converstionType = 0;
var canvas, canvas2;
var ctx, ctx2;

function main(){
	
	canvas = document.getElementById('canvas');
	
    ctx = canvas.getContext('2d');
	if(!ctx){
		console.log('Failed to get 2D drawing context');
		return;
	}

	canvas2 = document.getElementById('canvas2');
    ctx2 = canvas2.getContext('2d');
	if(!ctx2){
		console.log('Failed to get 2D drawing context for second canvas');
		return;
	}

    var img1 = new Image();
	img1.onload = function () {
		canvas.width  = ctx.width  = img1.width;
		canvas.height = ctx.height = img1.height;
		ctx.drawImage(img1, 0, 0);
		conversionType = 0;
		convertImage();
	};

	img1.src = 'color5.jpg';
}

function convertImage(){
	
	var imgData = ctx.getImageData(0, 0, ctx.width, ctx.height);
	
	canvas2.width  = ctx2.width  = ctx.width;
	canvas2.height = ctx2.height = ctx.height;
	ctx2.font = "30px Raleway";
	ctx2.fillStyle = "white";
	
	switch(conversionType){
		case 100: greyAverage(imgData.data); break;
		case 101: lumaGray(imgData.data); break;
		case 102: luminGray(imgData.data); break;
		case 103: desatGray(imgData.data); break;
		case 104: greyMaxRGB(imgData.data); break;
		case 105: greyMinRGB(imgData.data); break;
		case 106: greyRed(imgData.data); break;
		case 107: greyGreen(imgData.data); break;
		case 108: greyBlue(imgData.data); break;
		case 109: redFilter(imgData.data); break;
		case 110: greenFilter(imgData.data); break;
		case 111: blueFilter(imgData.data); break;
		case 112: noRed(imgData.data); break;
		case 113: noGreen(imgData.data); break;
		case 114: noBlue(imgData.data); break;
		case 115: grey4(imgData.data); break;
		case 116: grey16(imgData.data); break;
		case 117: grey32(imgData.data); break;
		case 118: grey50(imgData.data); break;
		case 119: rgb64(imgData.data); break;
		case 120: rgb512(imgData.data); break;
		case 121: rgb4k(imgData.data); break;
		case 122: rgb125k(imgData.data); break;
	}
	
	ctx2.putImageData(imgData, 0, 0);	
}

function applyFilter(type){
	conversionType = type;
	convertImage();
}

// Convert to grey scale using a simple averaging of the RGB values
function greyAverage(pixelData){
	var avg;
	for (var i = 0; i < pixelData.length; i+=4) {
		avg = (pixelData[i] + pixelData[i + 1] + pixelData[i+2]) / 3;
		pixelData[i] = avg;
		pixelData[i + 1] = avg;
		pixelData[i + 2] = avg;
	}
}

// Calculate the lumavalue of each pixel and use this value to form the greys
function lumaGray(pixelData){
	var red = 21.25/100;
	var green = 71.52/100;
	var blue = 7.22/100;
	for(var i = 0; i < pixelData.length; i+=4){
		color = (pixelData[i]*red + pixelData[i+1]*green + pixelData[i+2]*blue);
		pixelData[i] = color;
		pixelData[i+1] = color;
		pixelData[i+2] = color;
	}
}

// Calculate the luminance value of each pixel and use this value to form the greys
function luminGray(pixelData){ 
	var red = 29.9/100;
	var green = 58.7/100;
	var blue = 11.4/100;
	for(var i = 0; i < pixelData.length; i+=4){
		color = (pixelData[i]*red + pixelData[i+1]*green + pixelData[i+2]*blue);
		pixelData[i] = color;
		pixelData[i+1] = color;
		pixelData[i+2] = color;
	}
}

// Use the de-saturation value to set the grey value for each pixel (average of min and max component)
function desatGray(pixelData) {
	for(var i = 0; i < pixelData.length; i+=4){
		color = (Math.max(pixelData[i], pixelData[i+1], pixelData[i+2]) 
			  + Math.min(pixelData[i], pixelData[i+1], pixelData[i+2]))/2;
		
		pixelData[i] = color;
		pixelData[i+1] = color;
		pixelData[i+2] = color;
	}
}

// Create the grey scale image using the largest of the three components (max of R G & B)
function greyMaxRGB(pixelData) {
	for(var i = 0; i < pixelData.length; i+=4){
		color = Math.max(pixelData[i], pixelData[i+1], pixelData[i+2]);
		
		pixelData[i] = color;
		pixelData[i+1] = color;
		pixelData[i+2] = color;
	}
}

// Create the grey scale image using the smallest of the three components (min of R G & B)
function greyMinRGB(pixelData) {
	for(var i = 0; i < pixelData.length; i+=4){
		color = Math.min(pixelData[i], pixelData[i+1], pixelData[i+2]);
		
		pixelData[i] = color;
		pixelData[i+1] = color;
		pixelData[i+2] = color;
	}
}

// Create the grey scale image using the Red component for the grey
function greyRed(pixelData){
	for (var i = 0; i < pixelData.length; i+=4) {
		pixelData[i + 1] = pixelData[i];
		pixelData[i + 2] = pixelData[i];
	}
}

// Create the grey scale image using the Green component for the grey
function greyGreen(pixelData) {
	for(var i = 0; i < pixelData.length; i+=4){
		pixelData[i] = pixelData[i+1];
		pixelData[i+2] = pixelData[i+1];
	}
}

// Create the grey scale image using the Blue component for the grey
function greyBlue(pixelData) {
	for(var i = 0; i < pixelData.length; i+=4){
		pixelData[i] = pixelData[i+2];
		pixelData[i+1] = pixelData[i+2];
	}
}

// Filter the image to show only the Red component (ie. Green and Blue are set to zero)
function redFilter(pixelData){
	for (var i = 0; i < pixelData.length; i+=4) {
		pixelData[i + 1] = 0;
		pixelData[i + 2] = 0;
	}
}

// Filter the image to show only the Green component
function greenFilter(pixelData) {
	for(var i = 0; i < pixelData.length; i+=4){
		pixelData[i] = 0;
		pixelData[i+2] = 0;
	}
}

// Filter the image to show only the Blue component
function blueFilter(pixelData) {
	for(var i = 0; i < pixelData.length; i+=4){
		pixelData[i] = 0;
		pixelData[i+1] = 0;
	}	
}

// Filter the image to show only the Green & Blue components – no Red (ie. Set Red to zero).
function noRed(pixelData) {
	for(var i = 0; i < pixelData.length; i+=4){
		pixelData[i] = 0;
	}	
}

// Filter the image to show only the Red & Blue components – no Green
function noGreen(pixelData) {
	for(var i = 0; i < pixelData.length; i+=4){
		pixelData[i+1] = 0;
	}
}

// Filter the image to show only the Red & Green components – no Blue
function noBlue(pixelData) {
	for(var i = 0; i < pixelData.length; i+=4){
		pixelData[i+2] = 0;
	}	
}

//  Convert to grey scale using a simple averaging of the RGB values but limit the grey palette to 4 colours.
function grey4(pixelData) {
	var size = 256/4 - 1;
	
	for(var i = 0; i < pixelData.length; i+=4){
		var avgGrey = (pixelData[i] + pixelData[i+1] + pixelData[i+2])/3;
		color = Math.round((avgGrey / size) + 0.5, 0) * size;
		
		pixelData[i] = color;
		pixelData[i+1] = color;
		pixelData[i+2] = color;
	}
}

// Convert to grey scale using a simple averaging of the RGB values but limit the grey palette to 16 colours
function grey16(pixelData) {
	var size = 256/16 - 1;
	
	for(var i = 0; i < pixelData.length; i+=4){
		var avgGrey = (pixelData[i] + pixelData[i+1] + pixelData[i+2])/3;
		color = Math.round((avgGrey / size) + 0.5, 0) * size;
		
		pixelData[i] = color;
		pixelData[i+1] = color;
		pixelData[i+2] = color;
	}
}

// Convert to grey scale using a simple averaging of the RGB values but limit the grey palette to 32 colours.
function grey32(pixelData) {
	var size = 256/32 - 1
	
	for(var i = 0; i < pixelData.length; i+=4){
		var avgGrey = (pixelData[i] + pixelData[i+1] + pixelData[i+2])/3;
		color = Math.round((avgGrey / size) + 0.5, 0) * size;
		
		pixelData[i] = color;
		pixelData[i+1] = color;
		pixelData[i+2] = color;
	}
}

// Convert to grey scale using a simple averaging of the RGB values but limit the grey palette to 50 colours
function grey50(pixelData) {
	var size = 256/50 -1;
	
	for(var i = 0; i < pixelData.length; i+=4){
		var avgGrey = (pixelData[i] + pixelData[i+1] + pixelData[i+2])/3;
		color = Math.round((avgGrey / size) + 0.5, 0) * size;
		
		pixelData[i] = color;
		pixelData[i+1] = color;
		pixelData[i+2] = color;
	}	
}

// Limit each of the RGB values to 4 colours so the colour combinations would be 4x4x4 = 64 combinations.
function rgb64(pixelData) {
	var size = 256/4 -1;
	for(var i = 0; i < pixelData.length; i+=4){
		var r	= Math.round((pixelData[i] / size) + 0.5, 0) * size;
		var g	= Math.round((pixelData[i+1] / size) + 0.5, 0) * size;
		var b	= Math.round((pixelData[i+2] / size) + 0.5, 0) * size;

		pixelData[i] = r;
		pixelData[i+1] = g;
		pixelData[i+2] = b;
	}
}

// Limit each of the RGB values to 4 colours so the colour combinations would be 8x8x8 = 512 combinations
function rgb512(pixelData) {
	var size = 256/8 -1;
	for(var i = 0; i < pixelData.length; i+=4){
		var r	= Math.round((pixelData[i] / size) + 0.5, 0) * size;
		var g	= Math.round((pixelData[i+1] / size) + 0.5, 0) * size;
		var b   = Math.round((pixelData[i+2] / size) + 0.5, 0) * size;

		pixelData[i] = r;
		pixelData[i+1] = g;
		pixelData[i+2] = b;
	}
}

// Limit each of the RGB values to 4 colours so the colour combinations would be 16x16x16 = 4K combinations
function rgb4k(pixelData) {
	var size = 256/16 -1;
	for(var i = 0; i < pixelData.length; i+=4){
		var r	= Math.round((pixelData[i] / size) + 0.5, 0) * size;
		var g	= Math.round((pixelData[i+1] / size) + 0.5, 0) * size;
		var b   = Math.round((pixelData[i+2] / size) + 0.5, 0) * size;

		pixelData[i] = r;
		pixelData[i+1] = g;
		pixelData[i+2] = b;
	}
}

//  Limit each of the RGB values to 4 colours so the colour combinations would be 50x50x50 = 125000 combinations
function rgb125k(pixelData) {
	var size = 256/50 -1;
	for(var i = 0; i < pixelData.length; i+=4){
		var r	= Math.round((pixelData[i] / size) + 0.5, 0) * size;
		var g	= Math.round((pixelData[i+1] / size) + 0.5, 0) * size;
		var b   = Math.round((pixelData[i+2] / size) + 0.5, 0) * size;

		pixelData[i] = r;
		pixelData[i+1] = g;
		pixelData[i+2] = b;
	}
}
