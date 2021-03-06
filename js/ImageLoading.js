
var button1 = document.createElement("img");
var button2 = document.createElement("img");
var switchButton = document.createElement("img");
var muteButton = document.createElement("img");
var menuButton = document.createElement("img");
var resetButton = document.createElement("img");
var tutorialButton = document.createElement("img")
var KeyPieceB = document.createElement("img");
var KeyPieceC = document.createElement("img");
var BishopB = document.createElement("img");
var BishopC = document.createElement("img");
var RookB = document.createElement("img");
var RookC = document.createElement("img");
var KnightB = document.createElement("img");
var KnightC = document.createElement("img");
var nobleb = document.createElement("img");
var noblec = document.createElement("img");
var eliteb = document.createElement("img");
var elitec = document.createElement("img");
var ChoGoal = document.createElement("img");
var BisGoal = document.createElement("img");
var WTile = document.createElement("img");
var HTile = document.createElement("img");
var woodDecor = document.createElement("img");
var table = document.createElement("img");
var logo = document.createElement("img");
var background = document.createElement("img");
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
    {varName:switchButton, theFile:"switchButton.png"},
    {varName:muteButton, theFile:"muteButton.png"},
    {varName:menuButton, theFile:"menuButton.png"},
    {varName:resetButton, theFile:"resetButton.png"},
    {varName:tutorialButton, theFile:"tutorialButton.png"},
    {varName:KeyPieceB, theFile:"keyPieceB.png"},
    {varName:KeyPieceC, theFile:"keyPieceC.png"},
    {varName:BishopB, theFile:"BishopB.png"},
    {varName:BishopC, theFile:"BishopC.png"},
    {varName:RookB, theFile:"RookB.png"},
    {varName:RookC, theFile:"RookC.png"},
    {varName:KnightB, theFile:"KnightB.png"},
    {varName:KnightC, theFile:"KnightC.png"},
    {varName:nobleb, theFile:"nobleb.png"},
    {varName:noblec, theFile:"noblec.png"},
    {varName:eliteb, theFile:"eliteb.png"},
    {varName:elitec, theFile:"elitec.png"},
    {varName:ChoGoal, theFile:"choGoal.png"},
    {varName:BisGoal, theFile:"BisGoal.png"},
    {varName:WTile, theFile:"WTile.png"},
    {varName:HTile, theFile:"HTile.png"},
    {varName:woodDecor, theFile:"woodDecor.png"},
    {varName:table, theFile:"table.png"},
    {varName:logo, theFile:"logo.png"},
    {varName:background, theFile:"background.png"}
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
