var backgroundMusic = new BackgroundMusicClass();
var Sound = new SoundOverlapsClass("audio/piecemoving");
var showMenu = false;
var mouseX = 0;
var mouseY = 0;
var selectedIdx = -1;
var tileOverIdx = -1;

//resetBox Configurations
var resetBoxX = 900;
var resetBoxY = 10;
var resetBoxWidth = 100;
var resetBoxHeight = 50;

var teamATurn = true;
var turnCount = 0;

const TILE_W = 72;
const TILE_H = 72;
const TILE_GAP = 1;
const TILE_COLS = 9;
const TILE_ROWS = 11;

const TILE_KEY_START = 90;
const TILE_AKEY_START = 98;
const TILE_KEY_GOAL = TILE_COLS - 1;
const TILE_AKEY_GOAL = 0;

const NO_PIECE = 0;
const KEY = 1;
const ROOK = 2;
const BISHOP = 3;
const KNIGHT = 4;
const KING = 5;
const QUEEN = 6;
const AKEY = -1;
const AROOK = -2;
const ABISHOP = -3;
const AKNIGHT = -4;
const AKING = -5;
const AQUEEN = -6;

var enemyPos = [];
var homePos = [];
var tileGrid = [];

function resetBoard() {
    turnCount = 0;
    tileGrid = [0,-4,-3, 0, 0, 0, 3, 4, 0,
               -4, 0, 0, 0, 0, 0, 0, 0, 4,
               -2, 0, 0, 0, 0, 0, 0, 0, 2,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                4, 0, 0, 0, 0, 0, 0, 0,-4,
                3, 0, 0, 0, 0, 0, 0, 0,-3,
                1, 2, 4, 0, 0, 0,-4,-2,-1
            ];
}

function whoWon() {
    if(tileGrid[TILE_AKEY_GOAL] == AKEY){
        return -1;   
    }
    if (tileGrid[TILE_KEY_GOAL] == KEY) {
        return 1;
    }
    return 0;
}

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
    switch (pieceType) {
        case KEY:
        case AKEY:
            movesList.push([{
                col: 0,
                row: 1
            }]);
            movesList.push([{
                col: 0,
                row: -1
            }]);
            movesList.push([{
                col: 1,
                row: 0
            }]);
            movesList.push([{
                col: -1,
                row: 0
            }]);
            movesList.push([{
                col: 1,
                row: 1
            }]);
            movesList.push([{
                col: -1,
                row: -1
            }]);
            movesList.push([{
                col: 1,
                row: -1
            }]);
            movesList.push([{
                col: -1,
                row: 1
            }]);
            break;
        case KNIGHT:
        case AKNIGHT:
            movesList.push([{
                col: 1,
                row: 2
            }]);
            movesList.push([{
                col: 1,
                row: -2
            }]);
            movesList.push([{
                col: -1,
                row: -2
            }]);
            movesList.push([{
                col: -1,
                row: 2
            }]);

            movesList.push([{
                col: 2,
                row: 1
            }]);
            movesList.push([{
                col: 2,
                row: -1
            }]);
            movesList.push([{
                col: -2,
                row: -1
            }]);
            movesList.push([{
                col: -2,
                row: 1
            }]);
            break;
            break;
        case ROOK:
        case AROOK:
            for (i = 1; i <= 3; i++) {
                subList1.push({
                    col: 0,
                    row: i
                });
                subList2.push({
                    col: 0,
                    row: -i
                });
                subList3.push({
                    col: i,
                    row: 0
                });
                subList4.push({
                    col: -i,
                    row: 0
                });
            }
            movesList = [subList1, subList2, subList3, subList4];
            break;
        case BISHOP:
        case ABISHOP:
            for (i = 1; i <= 3; i++) {
                subList1.push({
                    col: i,
                    row: i
                });
                subList2.push({
                    col: -i,
                    row: -i
                });
                subList3.push({
                    col: -i,
                    row: i
                });
                subList4.push({
                    col: i,
                    row: -i
                });
            }
            movesList = [subList1, subList2, subList3, subList4];
            break;
        case KING:
        case AKING:
            movesList.push([{
                col: 0,
                row: 1
            }]);
            movesList.push([{
                col: 0,
                row: -1
            }]);
            movesList.push([{
                col: 1,
                row: 0
            }]);
            movesList.push([{
                col: -1,
                row: 0
            }]);
            movesList.push([{
                col: 1,
                row: 1
            }]);
            movesList.push([{
                col: -1,
                row: -1
            }]);
            movesList.push([{
                col: 1,
                row: -1
            }]);
            movesList.push([{
                col: -1,
                row: 1
            }]);
            break;
        case QUEEN:
        case AQUEEN:
            for (i = 1; i <= 7; i++) {
                subList1.push({
                    col: i,
                    row: i
                });
                subList2.push({
                    col: -i,
                    row: -i
                });
                subList3.push({
                    col: i,
                    row: 0
                });
                subList4.push({
                    col: -i,
                    row: 0
                });
                subList5.push({
                    col: 0,
                    row: i
                });
                subList6.push({
                    col: 0,
                    row: -i
                });
                subList7.push({
                    col: -i,
                    row: i
                });
                subList8.push({
                    col: i,
                    row: -i
                });
            }
            movesList = [subList1, subList2, subList3, subList4, subList5, subList6, subList7, subList8];
            break;
    }
    return movesList;
}

function validMovesFromTile(tileIdx) {
    var selectedPiece = tileGrid[tileIdx];
    var selectedCol = tileIdx % TILE_COLS;
    var selectedRow = Math.floor(tileIdx / TILE_COLS);
    var validMoves = validMovesForType(selectedPiece);
    var returnMoves = [];
    for (var i = validMoves.length - 1; i >= 0; i--) { //backwards so we can splice
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
                    ii = validMoves[i].length; //skipping the rest of inner for loop(to not go through the piece/block)
                    continue;
                } else {
                    //Positive team can attack Negative team
                    returnMoves.push(moveToConsider);
                    ii = validMoves[i].length; //skipping the rest of inner for loop(to not go through the piece/block)
                    continue;
                }
            } else if (targetPiece > 0) {
                if (selectedPiece > 0) {
                    //can't land on our own team
                    ii = validMoves[i].length; //skipping the rest of inner for loop(to not go through the piece/block)
                    continue;
                } else {
                    returnMoves.push(moveToConsider);
                    // Negative team can attack Positive team
                    ii = validMoves[i].length; //skipping the rest of inner for loop(to not go through the piece/block)
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
    }, 1000 / FRAMES_PER_SECOND);
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
    } else {
        drawEverything();
        showMenu = false;
    }
}


var canvas, canvasContext;

function tileCoordToIndex(tileCol, tileRow) {
    return (tileCol + TILE_COLS * tileRow);
}


function drawTiles() {
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
        for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
            var tileLeftEdgeX = eachCol * TILE_W;
            var tileTopEdgeY = eachRow * TILE_H;
            var idxHere = tileCoordToIndex(eachCol, eachRow);
            if (idxHere == TILE_AKEY_GOAL) {
                colorRect(tileLeftEdgeX, tileTopEdgeY,
                    TILE_W - TILE_GAP, TILE_H - TILE_GAP, '#222222');//white corner
            } else if (idxHere == TILE_KEY_GOAL) {
                colorRect(tileLeftEdgeX, tileTopEdgeY,
                    TILE_W - TILE_GAP, TILE_H - TILE_GAP, '#DDDDDD');//black corner
            } else if ((eachCol + eachRow) % 2 == 0) { // splitting even sums from odd
                colorRect(tileLeftEdgeX, tileTopEdgeY,
                    TILE_W - TILE_GAP, TILE_H - TILE_GAP, '#888888');
            } else {
                colorRect(tileLeftEdgeX, tileTopEdgeY,
                    TILE_W - TILE_GAP, TILE_H - TILE_GAP, '#aaaaaa');
            }

            
            var pieceHere = tileGrid[idxHere];
            var pieceName = "";

            if (pieceHere < 0) {
                canvasContext.fillStyle = 'white';
                pieceName = "Cho.";
            } else if (pieceHere > 0) {
                canvasContext.fillStyle = 'black';
                pieceName = "Bis.";
            }

            switch (pieceHere) {
                case NO_PIECE:
                    break;
                case KEY:
                    pieceName += "Key";
                    canvasContext.drawImage(KeyPieceB, tileLeftEdgeX + 15, tileTopEdgeY + 10);
                    break;
                case AKEY:
                    pieceName += "Key";
                    canvasContext.drawImage(KeyPieceC, tileLeftEdgeX + 15, tileTopEdgeY + 10);
                    break;
                case ROOK:
                    pieceName += "Rook";
                    canvasContext.drawImage(maestrob, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case AROOK:
                    pieceName += "Rook";
                    canvasContext.drawImage(maestroc, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case BISHOP:
                    pieceName += "Bishop";
                    canvasContext.drawImage(patricianb, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case ABISHOP:
                    pieceName += "Bishop";
                    canvasContext.drawImage(patricianc, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case KNIGHT:
                    pieceName += "Knight";
                    canvasContext.drawImage(KnightB, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case AKNIGHT:
                    pieceName += "Knight";
                    canvasContext.drawImage(KnightC, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case KING:
                    pieceName += "King";
                    canvasContext.drawImage(eliteb, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case AKING:
                    pieceName += "King";
                    canvasContext.drawImage(elitec, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case QUEEN:
                    pieceName += "Queen";
                    canvasContext.drawImage(nobleb, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case AQUEEN:
                    pieceName += "Queen";
                    canvasContext.drawImage(noblec, tileLeftEdgeX, tileTopEdgeY);
                    break;
            }

            canvasContext.fillText(pieceName,
                tileLeftEdgeX + TILE_W / 2, tileTopEdgeY + TILE_H / 2);

            // not a super efficient way to do this, but c'mon, it's a boardgame!
            // based on exercises you've already done you could optimize this :)
            if (tileOverIdx == idxHere) {
                outlineRect(tileLeftEdgeX, tileTopEdgeY,
                    TILE_W - TILE_GAP, TILE_H - TILE_GAP, 'green');
            }
            if (selectedIdx == idxHere) {
                // cutting extra margin from each edge so it won't overlap mouseover tile
                outlineRect(tileLeftEdgeX + 3, tileTopEdgeY + 3,
                    TILE_W - TILE_GAP - 6, TILE_H - TILE_GAP - 6, 'yellow');
            }
        } // end of for eachRow
    } // end of for eachCol

    if (selectedIdx != -1) {
        var validMoves = validMovesFromTile(selectedIdx);
        for (var i = 0; i < validMoves.length; i++) {
            var tileLeftEdgeX = validMoves[i].col * TILE_W;
            var tileTopEdgeY = validMoves[i].row * TILE_H;
            outlineRect(tileLeftEdgeX + 3, tileTopEdgeY + 3,
                TILE_W - TILE_GAP - 6, TILE_H - TILE_GAP - 6, 'pink');
        }
    }

    drawResetButton();
} // end of drawTiles()

function randomMove() {

    console.log("taking a random move");
    var moveOptions = [];
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
        for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
            var tileIdx = tileCoordToIndex(eachCol, eachRow);
            var pieceHere = tileGrid[tileIdx];
            if ((pieceHere > 0 && teamATurn) || (pieceHere < 0 && teamATurn == false)) {
                console.log(pieceHere);
                var validMoves = validMovesFromTile(tileIdx);
                moveOptions.push({
                    source: tileIdx,
                    movesList: validMoves
                });
            } //end of if
        } //end of for row
    } //end of for column
    console.log("Pieces with moves " + moveOptions.length);
    var randPiece = Math.floor(Math.random() * moveOptions.length);
    console.log("Piece " + randPiece + " with moves " + moveOptions[randPiece].movesList.length);
    var randMove = Math.floor(Math.random() * moveOptions[randPiece].movesList.length);
    var destIdx = tileCoordToIndex(moveOptions[randPiece].movesList[randMove].col,
        moveOptions[randPiece].movesList[randMove].row);
    moveFromToIdx(moveOptions[randPiece].source, destIdx);
} //end of function

function moveFromToIdx(fromIdx, toIdx) {
    if(whoWon() != 0) {
        console.log("GAME OVER");
        return;
    }
    turnCount++;
    var takenTile = tileGrid[toIdx];
    if (takenTile != 0) {
        console.log("Captured Value : " + takenTile);
        if (takenTile == KEY) {
            tileGrid[TILE_KEY_START] = KEY;
        } else if (takenTile == AKEY) {
            tileGrid[TILE_AKEY_START] = AKEY;
        }
    }
    tileGrid[toIdx] = tileGrid[fromIdx]; // put the piece here (overwrite)
    Sound.play("piecemoving");
    tileGrid[fromIdx] = NO_PIECE; // clear the spot where it was sitting
    teamATurn = !teamATurn;
}

function scoreBoard() {
    var bisPieceScore = 0;
    var choPieceScore = 0;
    var bisKeyDist = 0;
    var choKeyDist = 0;
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
        for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
            var tileLeftEdgeX = eachCol * TILE_W;
            var tileTopEdgeY = eachRow * TILE_H;
            var idxHere = tileCoordToIndex(eachCol, eachRow);
            var pieceHere = tileGrid[idxHere];
            if (pieceHere > 0 ) {
                if(pieceHere == KEY) {
                    bisKeyDist  = eachRow + Math.abs(eachCol-TILE_KEY_GOAL);
                } else {
                    bisPieceScore+=1;  
                }
                
            }//end of Bis Piece
            if (pieceHere < 0 ) {
                if(pieceHere == AKEY) {
                    choKeyDist  = eachRow + Math.abs(eachCol-TILE_AKEY_GOAL);
                } else {
                    choPieceScore+=1;  
                }
            }//end of Cho Piece
        }
    }
    console.log("choScore " + choPieceScore + " " +  "bisScore " + bisPieceScore);
    console.log("choKey Steps  " + choKeyDist + " " +  "bisKey Steps " + bisKeyDist);
}
function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    canvasContext.textAlign = "center";
    drawTiles();

    canvasContext.textAlign = "left";
    canvasContext.fillStyle = 'white';
    var rightAreaX = TILE_W * TILE_COLS;
    var lineSkip = 15;
    var lineY = 20;
    canvasContext.fillText("Click any piece to select", rightAreaX, lineY);
    lineY += lineSkip;
    canvasContext.fillText("Then click spot to move to", rightAreaX, lineY);
    lineY += lineSkip;
    canvasContext.fillText("Next Turn: ", rightAreaX, lineY);
    lineY += lineSkip;
    canvasContext.fillText((teamATurn ? "Chocolates" : "Biscuits"), rightAreaX, lineY);
    lineY += lineSkip;
    canvasContext.fillText("Turn Count: " + turnCount, rightAreaX, lineY);
    lineY += lineSkip;
    if(whoWon() == 1) {
        canvasContext.fillText("Biscuit Team Won", rightAreaX, lineY);
    }
    if(whoWon() == -1) {
        canvasContext.fillText("Chocolate Team Won", rightAreaX, lineY);
    }
    
}

function drawResetButton(){
  canvasContext.drawImage(resetButton, resetBoxX, resetBoxY);
  colorText("Reset", resetBoxX + 50, resetBoxY + 30, 15, "white");
}

const FRAMES_PER_SECOND = 30;

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    resetBoard();
    initInput();
    loadImages();
}