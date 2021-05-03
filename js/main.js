var backgroundMusic = new BackgroundMusicClass();
var Sound = new SoundOverlapsClass("audio/move");
var showMenu = true;
var mouseX = 0;
var mouseY = 0;
var selectedIdx = -1;
var tileOverIdx = -1;

const TILE_W = 80;
const TILE_H = 80;
const TILE_GAP = 1;
const TILE_COLS = 9;
const TILE_ROWS = 10;
var tileGrid =
    [ 0, 4, 1, 0, 0, 0,-1,-4, 0,
      3, 2, 0, 0, 0, 0, 0,-2,-3,
      1, 0, 0, 0, 0, 0, 0, 0,-1,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
     -1, 0, 0, 0, 0, 0, 0, 0, 1,
     -3,-2, 0, 0, 0, 0, 0, 2, 3,
      0,-4,-1, 0, 0, 0, 1, 4, 0];
const NO_PIECE = 0;
const PAWN = 1;
const ROOK = 2;
const BISHOP = 3;
const KNIGHT = 4;
const KING = 5;
const QUEEN = 6;
const APAWN = -1;
const AROOK = -2;
const ABISHOP = -3;
const AKNIGHT = -4;
const AKING = -5;
const AQUEEN = -6;
var enemyPos = [];
var homePos = [];
function validMovesForType(pieceType) {
    var movesList = [];
    var subList1 = [];
    var subList2 = [];
    var subList3 = [];
    var subList4 = [];
    var subList5 = [];
    var subList6 = [];
    var subList7 = [];
    var subList8 = [];
 switch(pieceType){
     case PAWN:
      movesList.push([{ col: 0, row:1}]);
      //movesList.push({ col: 0, row: 2 });
    break;

    case APAWN:
       movesList.push([{col:0, row:-1}]);
       //movesList.push({col:0, row:-2});
    break;
     case KNIGHT:
     case AKNIGHT:
        movesList.push([{col:1, row:2}]);
        movesList.push([{col:1, row:-2}]);
        movesList.push([{col:-1, row:-2}]);
        movesList.push([{col:-1, row:2}]);

        movesList.push([{col:2, row:1}]);
        movesList.push([{col:2, row:-1}]);
        movesList.push([{col:-2, row:-1}]);
        movesList.push([{col:-2, row:1}]);
         break; 
         break; 
     case ROOK:
     case AROOK:
         for (i = 1; i <= 7; i++) {
             subList1.push({ col: 0, row: i });
             subList2.push({ col: 0, row: -i });
             subList3.push({ col: i, row: 0 });
             subList4.push({ col: -i, row: 0 });
         }
         movesList = [subList1, subList2, subList3, subList4];
      break;
     case BISHOP:
     case ABISHOP:
         for (i = 1; i <= 7; i++) {
             subList1.push({ col: i, row: i });
             subList2.push({ col: -i, row: -i });
             subList3.push({ col: -i, row: i });
             subList4.push({ col: i, row: -i });
         }
         movesList = [subList1, subList2, subList3, subList4];
    break; 
     case KING:
     case AKING:
        movesList.push([{col:0, row:1}]);
        movesList.push([{col:0, row:-1}]);
        movesList.push([{col:1, row:0}]);
        movesList.push([{col:-1, row:0}]);
        movesList.push([{col:1, row:1}]);
        movesList.push([{col:-1, row:-1}]);
        movesList.push([{col:1, row:-1}]);
        movesList.push([{col:-1, row:1}]);
      break;
     case QUEEN:
     case AQUEEN:
         for (i = 1; i <= 7; i++) {
             subList1.push({ col: i, row: i });
             subList2.push({ col:-i, row:-i });
             subList3.push({ col: i, row: 0 });
             subList4.push({ col:-i, row: 0 });
             subList5.push({ col: 0, row: i });
             subList6.push({ col: 0, row:-i });
             subList7.push({ col:-i, row: i });
             subList8.push({ col: i, row: -i });
         }
         movesList = [subList1, subList2, subList3, subList4, subList5, subList6, subList7, subList8];
      break;
 }
 return movesList;
}

function validMovesFromTile(tileIdx){
    var selectedPiece = tileGrid[tileIdx];
    var selectedCol = tileIdx%TILE_COLS;
    var selectedRow = Math.floor(tileIdx/TILE_COLS);
    var validMoves = validMovesForType(selectedPiece);
    var returnMoves = [];
    for (var i = validMoves.length - 1; i >= 0; i--) {//backwards so we can splice
        for (var ii = 0; ii < validMoves[i].length; ii++) {
            var moveToConsider = validMoves[i][ii];
            moveToConsider.col += selectedCol;
            moveToConsider.row += selectedRow;
            if (moveToConsider.col < 0 || moveToConsider.col >= TILE_COLS ||
                moveToConsider.row < 0 || moveToConsider.row >= TILE_ROWS) {
                //can't go out of bound
                continue;
            }
            //blocking landing on our own pieces
            var targetIdx = tileCoordToIndex(moveToConsider.col, moveToConsider.row);
            var targetPiece = tileGrid[targetIdx];

            if (targetPiece < 0) {
                if (selectedPiece < 0) {
                    //can't land on our own team
                    ii = validMoves[i].length;//skipping the rest of inner for loop(to not go through the piece/block)
                    continue;
                } else {
                    //Positive team can attack Negative team
                    returnMoves.push(moveToConsider);
                    ii = validMoves[i].length;//skipping the rest of inner for loop(to not go through the piece/block)
                    continue;
                }
            } else if (targetPiece > 0) {
                if (selectedPiece > 0) {
                    //can't land on our own team
                    ii = validMoves[i].length;//skipping the rest of inner for loop(to not go through the piece/block)
                    continue;
                } else {
                   returnMoves.push(moveToConsider);
                    // Negative team can attack Positive team
                    ii = validMoves[i].length;//skipping the rest of inner for loop(to not go through the piece/block)
                    continue;
                } 
            } else {
                returnMoves.push(moveToConsider);
            }
        }
    }
    return returnMoves;
}

function startGame() {
  // these next few lines set up our game logic and render to happen 30 times per second
   setInterval(function() {
     update();
     }, 1000/FRAMES_PER_SECOND);
   //backgroundMusic.loopSong("audio/calm");
   //reset();
 }
 
 function update() {
   drawEverything();
   resizeCanvas();
   //variableDisplay();
 }

function resizeCanvas() {
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;

 if (showMenu == true) {
   menu.draw();
   menu.update();
   } 
   else {
   drawEverything();
   showMenu = false;
   }
}

function mouseclicked(evt) {
  if(tileOverIdx < 0 || tileOverIdx >= tileGrid.length) { // invalid or off board
    return;
  }

  if (selectedIdx == tileOverIdx) {
    selectedIdx = -1;
  } else if (selectedIdx != -1) {
    var validMoves = validMovesFromTile(selectedIdx);
    var moveInList = false;
    var tileOverCol = tileOverIdx % TILE_COLS;
    var tileOverRow = Math.floor(tileOverIdx / TILE_COLS);
    for (var i = 0; i < validMoves.length; i++) {
      if (validMoves[i].col == tileOverCol && validMoves[i].row == tileOverRow) {
        moveInList = true;
        break;
      }
    }
    if (moveInList) {
      tileGrid[tileOverIdx] = tileGrid[selectedIdx]; // put the piece here (overwrite)
      tileGrid[selectedIdx] = NO_PIECE; // clear the spot where it was sitting
    }
    
    selectedIdx = -1; // forget selection
  } else if(tileGrid[tileOverIdx] != NO_PIECE ) {
    selectedIdx = tileOverIdx;
  }
}

function mousemoved(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  // account for the margins, canvas position on page, scroll amount, etc.
  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;

  var tileOverCol = Math.floor(mouseX / TILE_W);
  var tileOverRow = Math.floor(mouseY / TILE_H);  
  tileOverIdx = tileCoordToIndex(tileOverCol,tileOverRow);
}

var canvas, canvasContext;

function tileCoordToIndex(tileCol, tileRow) {
  return (tileCol + TILE_COLS*tileRow);
}



function drawTiles() {
  for(var eachCol=0; eachCol<TILE_COLS; eachCol++) {
    for(var eachRow=0; eachRow<TILE_ROWS; eachRow++) {
      var tileLeftEdgeX = eachCol * TILE_W;
      var tileTopEdgeY = eachRow * TILE_H;

      if( (eachCol + eachRow) % 2 == 0 ) { // splitting even sums from odd
        colorRect(tileLeftEdgeX, tileTopEdgeY,
                 TILE_W - TILE_GAP, TILE_H - TILE_GAP, '#888888' );
      } else {
        colorRect(tileLeftEdgeX, tileTopEdgeY,
                 TILE_W - TILE_GAP, TILE_H - TILE_GAP, '#aaaaaa' );
      }

      var idxHere = tileCoordToIndex(eachCol,eachRow);
      var pieceHere = tileGrid[idxHere];
      var pieceName = "";

      if( pieceHere < 0 ) {
        canvasContext.fillStyle = 'white';
          pieceName = "Whi.";
      } else if( pieceHere > 0 ) {
        canvasContext.fillStyle = 'black';
          pieceName = "Blk.";
      } 

      switch(Math.abs(pieceHere)) {
        case NO_PIECE:
          break;
        case PAWN:
          pieceName += "Pawn";
          canvasContext.drawImage(laborb, tileLeftEdgeX+25, tileTopEdgeY+10);
          break;
          case APAWN:
            pieceName += "APawn";
            canvasContext.drawImage(laborc, tileLeftEdgeX, tileTopEdgeY+10);
            break;
        case ROOK:
          pieceName += "Rook";
          canvasContext.drawImage(maestrob,  tileLeftEdgeX, tileTopEdgeY);
          break;
        case AROOK:
          pieceName += "ARook";
          canvasContext.drawImage(maestroc,  tileLeftEdgeX, tileTopEdgeY);
          break;
        case BISHOP:
          pieceName += "Bishop";
          canvasContext.drawImage(patricianb,  tileLeftEdgeX, tileTopEdgeY);
          break;
        case ABISHOP:
          pieceName += "ABishop";
          canvasContext.drawImage(patricianc,  tileLeftEdgeX, tileTopEdgeY);
          break;
        case KNIGHT:
          pieceName += "Knight";
          canvasContext.drawImage(traderb,  tileLeftEdgeX, tileTopEdgeY);
          break;
        case AKNIGHT:
          pieceName += "AKnight";
          canvasContext.drawImage(traderc,  tileLeftEdgeX, tileTopEdgeY);
          break;
        case KING:
          pieceName += "King";
          canvasContext.drawImage(eliteb,  tileLeftEdgeX, tileTopEdgeY);
          break;
        case AKING:
          pieceName += "AKing";
          canvasContext.drawImage(elitec,  tileLeftEdgeX, tileTopEdgeY);
          break;
        case QUEEN:
          pieceName += "Queen";
          canvasContext.drawImage(nobleb,  tileLeftEdgeX, tileTopEdgeY);
          break;
        case AQUEEN:
          pieceName += "AQueen";
          canvasContext.drawImage(noblec,  tileLeftEdgeX, tileTopEdgeY);
          break;
      }
      
      canvasContext.fillText(pieceName,
                tileLeftEdgeX+TILE_W/2, tileTopEdgeY+TILE_H/2);

      // not a super efficient way to do this, but c'mon, it's a boardgame!
      // based on exercises you've already done you could optimize this :)
      if(tileOverIdx == idxHere) {
        outlineRect(tileLeftEdgeX, tileTopEdgeY,
                 TILE_W - TILE_GAP, TILE_H - TILE_GAP, 'green' );
      }
      if(selectedIdx == idxHere) {
        // cutting extra margin from each edge so it won't overlap mouseover tile
        outlineRect(tileLeftEdgeX+3, tileTopEdgeY+3,
                 TILE_W - TILE_GAP-6, TILE_H - TILE_GAP-6, 'yellow' );
      }
    } // end of for eachRow
  } // end of for eachCol

  if(selectedIdx != -1){
    var validMoves = validMovesFromTile(selectedIdx);
    for(var i=0; i<validMoves.length; i++){
      var tileLeftEdgeX = validMoves[i].col * TILE_W;
      var tileTopEdgeY = validMoves[i].row * TILE_H;
      outlineRect(tileLeftEdgeX+3, tileTopEdgeY+3,
        TILE_W - TILE_GAP-6, TILE_H - TILE_GAP-6, 'pink' );
    }
  }
} // end of drawTiles()

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  canvasContext.textAlign="center";
  drawTiles();
  
  canvasContext.textAlign="left";
  canvasContext.fillStyle = 'white';
  var rightAreaX = TILE_W*TILE_COLS;
  var lineSkip = 15;
  var lineY = 20;
  canvasContext.fillText("Click any piece to select",rightAreaX,lineY);
  lineY += lineSkip;
  canvasContext.fillText("Then click spot to move to",rightAreaX,lineY);
  lineY += lineSkip;
  canvasContext.fillText("Turns and legal moves not enforced.",rightAreaX,lineY);
  lineY += lineSkip;
  canvasContext.fillText("That'd be a good exercise, though!",rightAreaX,lineY);
}
const FRAMES_PER_SECOND = 30;

  window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    initInput();
    loadImages();
  }
  
 