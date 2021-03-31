function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function outlineRect(topLeftX, topLeftY, boxWidth, boxHeight, lineColor) {
  canvasContext.beginPath();
  canvasContext.strokeStyle = lineColor;
  canvasContext.lineWidth = "3";
  canvasContext.rect(topLeftX, topLeftY, boxWidth, boxHeight);
  canvasContext.stroke();
}

function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY,withAngle) {
  canvasContext.save(); // allows us to undo translate movement and rotate spin
  canvasContext.translate(atX,atY); // sets the point where our graphic will go
  canvasContext.rotate(withAngle); // sets the rotation
  canvasContext.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
  canvasContext.restore(); // undo the translation movement and rotation since save()
}

function colorText(showWords, textX, textY, fontSize, fillColor) {
  canvasContext.font = font = fontSize + "px Arial";
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}
