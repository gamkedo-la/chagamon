
var button1 = document.createElement("img");
var button2 = document.createElement("img");
var KeyPieceB = document.createElement("img");
var KeyPieceC = document.createElement("img");
var patricianb = document.createElement("img");
var patricianc = document.createElement("img");
var maestrob = document.createElement("img");
var maestroc = document.createElement("img");
var KnightB = document.createElement("img");
var KnightC = document.createElement("img");
var nobleb = document.createElement("img");
var noblec = document.createElement("img");
var eliteb = document.createElement("img");
var elitec = document.createElement("img");
var tilePics = [];

var picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
  picsToLoad--;
  if(picsToLoad == 0) { // last image loaded?
    startGame();
  }
}

function beginLoadingImage(imgVar, fileName) {
  imgVar.onload=countLoadedImageAndLaunchIfReady;
  imgVar.src="images/"+fileName;
}

function loadImageForTileCode(tileCode, fileName) {
  tilePics[tileCode] = document.createElement("img");
  beginLoadingImage(tilePics[tileCode],fileName);
}

function loadImages() {

  var imageList = [
    {varName:button1, theFile:"accept.png"},
    {varName:button2, theFile:"reject.png"},
    {varName:KeyPieceB, theFile:"KeyPieceB.png"},
    {varName:KeyPieceC, theFile:"KeyPieceC.png"},
    {varName:patricianb, theFile:"patricianb.png"},
    {varName:patricianc, theFile:"patricianc.png"},
    {varName:maestrob, theFile:"maestrob.png"},
    {varName:maestroc, theFile:"maestroc.png"},
    {varName:KnightB, theFile:"KnightB.png"},
    {varName:KnightC, theFile:"KnightC.png"},
    {varName:nobleb, theFile:"nobleb.png"},
    {varName:noblec, theFile:"noblec.png"},
    {varName:eliteb, theFile:"eliteb.png"},
    {varName:elitec, theFile:"elitec.png"}
    ];

  picsToLoad = imageList.length;

  for(var i=0;i<imageList.length;i++) {
    if(imageList[i].tileType != undefined) {
      loadImageForTileCode(imageList[i].tileType, imageList[i].theFile);
    } else {
      beginLoadingImage(imageList[i].varName, imageList[i].theFile);
    } // end of else
  } // end of for imageList

} // end of function loadImages
