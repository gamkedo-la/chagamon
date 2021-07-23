// warning: 4 or more will take very long (no alpha beta pruning)
const AI_MOVES_CONSIDERED = 4; // set to 2 for quicker misc testing or AI console logging, but 3 is playable
const BISCUIT_WIN = -99999;
const CHOCOLATE_WIN = 99999;
const NEGATIVE_INFINITY = -999999;
const POSITIVE_INFINITY = 999999;
var showAIConsoleLogs = false;

var backgroundMusic = new BackgroundMusicClass();
var moveSound = new SoundOverlapsClass("audio/piecemoving");
var winSound = new SoundOverlapsClass("audio/GameWin");
var loseSound = new SoundOverlapsClass("audio/GameLose");
var selectSound = new SoundOverlapsClass("audio/select");
var deselectSound = new SoundOverlapsClass("audio/deselect");
var invalidSound = new SoundOverlapsClass("audio/invalidmove");
var buttonSound = new SoundOverlapsClass("audio/button");
var startSound = new SoundOverlapsClass("audio/GameStart");
var captureSound =  new SoundOverlapsClass("audio/piececaptured");
var keyRestartSound =  new SoundOverlapsClass("audio/keypiecerestart");

var showMenu = false;
var mouseX = 0;
var mouseY = 0;
var selectedIdx = -1;
var tileOverIdx = -1;

//resetBox Configurations
var resetBoxX = 850;
var resetBoxY = 420;
var resetBoxWidth = 100;
var resetBoxHeight = 50;

//tutorialBox Configurations
var tutorialBoxX = 910;
var tutorialBoxY = 320;
var tutorialBoxWidth = 100;
var tutorialBoxHeight = 50;

//menuBox Configurations
var menuBoxX = 980;
var menuBoxY = 420;
var menuBoxWidth = 100;
var menuBoxHeight = 50;

//muteBox Configurations
var muteBoxX = 850;
var muteBoxY = 520;
var muteBoxWidth = 100;
var muteBoxHeight = 50;

//switchBox Configurations
var switchBoxX = 980;
var switchBoxY = 520;
var switchBoxWidth = 100;
var switchBoxHeight = 50;

const AI_PLAY_NONE = -1;
const AI_PLAY_BIS = 0;
const AI_PLAY_CHO = 1;
var aiTeam = AI_PLAY_CHO;
var teamATurn = false;
var turnCount = 0;
var isGameOver = false;

const TILE_W = 72;
const TILE_H = 72;
const TILE_GAP = 1;
const TILE_COLS = 9;
const TILE_ROWS = 11;
const FRAME_SIZE = 31;
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

const WON_BISCUIT = 1;
const WON_NONE = 0;
const WON_CHOCOLATE = -1;

const FRAMES_PER_SECOND = 24;

var enemyPos = [];
var homePos = [];
var tileGrid = [];
captured = false;
var bisPieceScore = 0;
var choPieceScore = 0;
var takenBiscuitPieces = 9;
var takenChocolatePieces = 9;

// One frame delay between starting AI and the AI running, used to display somehow that it's thinking
const AI_THINKING_NO = 0;
const AI_THINKING_NEXT_FRAME = 1;
const AI_THINKING_PROCESSING = 2;
const STARTING_TURN = 3;
const STARTING_TURN_NEXT_FRAME = 4;
var aiCurrentlyThinking = AI_THINKING_NO;
var framesToShowMessage = 0;

var showGridDebugNum = false; // helpful for AI logs

function drawAIMessage() {
    var messageBoxX = 150;
    var messageBoxY = 335;
    canvasContext.globalAlpha = 0.35;
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(messageBoxX,messageBoxY,410,40);
    canvasContext.globalAlpha = 1.0;
    canvasContext.fillStyle = "yellow";
    canvasContext.fillText("Computer is planning next move...",messageBoxX+30,messageBoxY+25);
    
}

function drawPlayerMessage() {
    var messageBoxX = 150;
    var messageBoxY = 335;
    canvasContext.globalAlpha = 0.35;
    canvasContext.fillStyle = "cyan";
    canvasContext.fillRect(messageBoxX,messageBoxY,410,40);
    canvasContext.globalAlpha = 1.0;
    canvasContext.fillStyle = "gold";
    canvasContext.fillText("Next it's " + (teamATurn ? "Chocolate":"Biscuit") + "'s turn",messageBoxX+30,messageBoxY+25);
}

function drawWhichTeamMessage() {
    var messageBoxX = 150;
    var messageBoxY = 335;
    canvasContext.globalAlpha = 0.95;
    canvasContext.fillStyle = "purple";
    canvasContext.fillRect(messageBoxX,messageBoxY-40,510,100);
    canvasContext.globalAlpha = 1.0;
    canvasContext.fillStyle = "gold";
    canvasContext.fillText(aiTeam == AI_PLAY_CHO ? "Player is team Biscuit" : "Player is team Chocolate",messageBoxX+30,messageBoxY+25);  
}

function resetBoard() {
    turnCount = 0;
    teamATurn = false;
    tileGrid = [0, 4, 3, 0, 0, 0,-3,-4, 0,
                4, 0, 0, 0, 0, 0, 0, 0,-4,
                2, 0, 0, 0, 0, 0, 0, 0,-2,
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

function whoWon(onBoard) {
    if(onBoard[TILE_AKEY_GOAL] == AKEY){
        return WON_CHOCOLATE;  
    }
    if (onBoard[TILE_KEY_GOAL] == KEY) {
        return WON_BISCUIT;
    }
    return WON_NONE;
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

function validMovesFromTile(onBoard ,tileIdx) {
    var selectedPiece = onBoard[tileIdx];
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
            var targetPiece = onBoard[targetIdx];

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
            }
            if ((targetIdx == TILE_AKEY_GOAL || targetIdx == TILE_KEY_GOAL)) {
                if (selectedPiece != KEY && selectedPiece != AKEY) {
                    ii = validMoves[i].length;
                    continue;
                }  else {
                    returnMoves.push(moveToConsider);
                    ii = validMoves[i].length; //skipp
                    continue;
                }
            }  else {
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
    
    // startSound.play() // no sound until after player interacts, so moved into ui.js menu code
    //backgroundMusic.loopSong("audio/calm");
    //reset();
}

function update() {
    if (showMenu) {
        menu.draw();
        menu.update();
    } else switch(aiCurrentlyThinking) {
        case AI_THINKING_NO:
            resizeCanvas();
            drawEverything();
            // ai takes next turn
            if( (teamATurn == false && aiTeam == AI_PLAY_BIS) || 
                (teamATurn == true && aiTeam == AI_PLAY_CHO)) {
                aiCurrentlyThinking = AI_THINKING_NEXT_FRAME;
            }
            break;
        case AI_THINKING_NEXT_FRAME:
            drawAIMessage();
            aiCurrentlyThinking = AI_THINKING_PROCESSING;
            break;
        case AI_THINKING_PROCESSING:
            aiMoveAB(tileGrid,teamATurn,AI_MOVES_CONSIDERED);
            aiCurrentlyThinking = STARTING_TURN;
            break;
        case STARTING_TURN:
            framesToShowMessage = 20;
            aiCurrentlyThinking = AI_THINKING_NO;
            break;
        case STARTING_TURN_NEXT_FRAME:
            aiCurrentlyThinking = AI_THINKING_NO;
            break;
        
    }
    //variableDisplay();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


var canvas, canvasContext;

function tileCoordToIndex(tileCol, tileRow) {
    if(tileCol<0 || tileCol>=TILE_COLS || tileRow<0 || tileRow>=TILE_ROWS) {
        return -1; // out of bounds
    }
    return (tileCol + TILE_COLS * tileRow);
}

function drawTiles() {
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
        for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
            var tileLeftEdgeX = FRAME_SIZE + (eachCol * TILE_W);
            var tileTopEdgeY = FRAME_SIZE + (eachRow * TILE_H);
            var idxHere = tileCoordToIndex(eachCol, eachRow);
            if (idxHere == TILE_AKEY_GOAL) {
                colorRect(tileLeftEdgeX, tileTopEdgeY,
                    TILE_W - TILE_GAP, TILE_H - TILE_GAP, '#222222');//Chocolate corner
                    canvasContext.drawImage(ChoGoal, tileLeftEdgeX, tileTopEdgeY,TILE_W - TILE_GAP, TILE_H - TILE_GAP);
            } else if (idxHere == TILE_KEY_GOAL) {
                colorRect(tileLeftEdgeX, tileTopEdgeY,
                    TILE_W - TILE_GAP, TILE_H - TILE_GAP, '#DDDDDD');
                    canvasContext.drawImage(BisGoal, tileLeftEdgeX, tileTopEdgeY,TILE_W - TILE_GAP, TILE_H - TILE_GAP);//Biscuit corner
            } else if ((eachCol + eachRow) % 2 == 0) { // splitting even sums from odd
                colorRect(tileLeftEdgeX, tileTopEdgeY,
                    TILE_W - TILE_GAP, TILE_H - TILE_GAP, '#888888');
                    canvasContext.drawImage(HTile, tileLeftEdgeX, tileTopEdgeY,TILE_W - TILE_GAP, TILE_H - TILE_GAP);
            } else {
                colorRect(tileLeftEdgeX, tileTopEdgeY,
                    TILE_W - TILE_GAP, TILE_H - TILE_GAP, '#aaaaaa');
                    canvasContext.drawImage(WTile, tileLeftEdgeX, tileTopEdgeY,TILE_W - TILE_GAP, TILE_H - TILE_GAP);
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
                    canvasContext.drawImage(KeyPieceB, tileLeftEdgeX +  17, tileTopEdgeY + 10);
                    break;
                case AKEY:
                    pieceName += "Key";
                    canvasContext.drawImage(KeyPieceC, tileLeftEdgeX + 17, tileTopEdgeY + 10);
                    break;
                case ROOK:
                    pieceName += "Rook";
                    canvasContext.drawImage(RookB, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case AROOK:
                    pieceName += "Rook";
                    canvasContext.drawImage(RookC, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case BISHOP:
                    pieceName += "Bishop";
                    canvasContext.drawImage(BishopB, tileLeftEdgeX, tileTopEdgeY);
                    break;
                case ABISHOP:
                    pieceName += "Bishop";
                    canvasContext.drawImage(BishopC, tileLeftEdgeX, tileTopEdgeY);
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

            //canvasContext.fillText(pieceName,
                //tileLeftEdgeX + TILE_W / 2, tileTopEdgeY + TILE_H / 2);
            if (tileGrid[idxHere] != 0 && tileOverIdx != idxHere ) {
                colorCircle(tileLeftEdgeX + TILE_W / 2 ,  tileTopEdgeY + TILE_H / 2 + 4, 8, 'purple')
            }
            if (tileOverIdx != idxHere) {
                canvasContext.font = "14px Times new roman";
                canvasContext.fillStyle = 'gold';
                canvasContext.fillText(pieceName.charAt(0),
                    tileLeftEdgeX + TILE_W / 2, tileTopEdgeY + TILE_H / 1.8 + 5);
            }

            // not a super efficient way to do this, but c'mon, it's a boardgame!
            // based on exercises you've already done you could optimize this :)
            if (tileOverIdx == idxHere) {
                canvasContext.fillStyle = 'yellow';
                canvasContext.fillText(pieceName,
                    tileLeftEdgeX + TILE_W / 2, tileTopEdgeY + TILE_H / 2);
                outlineRect(tileLeftEdgeX, tileTopEdgeY,
                    TILE_W - TILE_GAP, TILE_H - TILE_GAP, 'green');
            }
            if (selectedIdx == idxHere) {
                // cutting extra margin from each edge so it won't overlap mouseover tile
                outlineRect(tileLeftEdgeX + 3, tileTopEdgeY + 3,
                    TILE_W - TILE_GAP - 6, TILE_H - TILE_GAP - 6, 'yellow');
            }
            if(showGridDebugNum) {
                canvasContext.fillStyle = "white";
                canvasContext.fillText(eachCol+","+eachRow, tileLeftEdgeX+10, tileTopEdgeY+TILE_H-7);
            }
        } // end of for eachRow
    } // end of for eachCol

    if (selectedIdx != -1) {
        var validMoves = validMovesFromTile(tileGrid ,selectedIdx);
        for (var i = 0; i < validMoves.length; i++) {
            var tileLeftEdgeX = FRAME_SIZE + (validMoves[i].col * TILE_W);
            var tileTopEdgeY = FRAME_SIZE + (validMoves[i].row * TILE_H);
            outlineRect(tileLeftEdgeX + 3, tileTopEdgeY + 3,
                TILE_W - TILE_GAP - 6, TILE_H - TILE_GAP - 6, 'pink');
        }
    }
 
} // end of drawTiles()

function flattenedMovesForBoard(boardState, turnNow) {
    var moveOptions = [];
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
        for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
            var tileIdx = tileCoordToIndex(eachCol, eachRow);
            var pieceHere = boardState[tileIdx];
            if ((pieceHere > 0 && turnNow == false) || (pieceHere < 0 && turnNow)) {
                //console.log(pieceHere);
                var validMoves = validMovesFromTile(boardState, tileIdx);
                for (var eachMove=0; eachMove<validMoves.length; eachMove++) {
                    moveOptions.push({source:tileIdx,destC: validMoves[eachMove].col,destR:validMoves[eachMove].row});
                }
               /* moveOptions.push({
                    source: tileIdx,
                    movesList: validMoves
                });*/
            } //end of if
        } //end of for row
    } //end of for column
    return moveOptions;
    
}

function alphaBeta(node, depth, alpha, beta, maximizingPlayer) {
    var victor = whoWon(node);
    if (depth == 0 || victor != WON_NONE) {
        return scoreBoard(node);
    }
    var value;
    var nodeChildren = flattenedMovesForBoard(node, maximizingPlayer);
    if (maximizingPlayer) {
        value = NEGATIVE_INFINITY;
        for(var eachMove = 0; eachMove < nodeChildren.length; eachMove++){
            var thisMove = nodeChildren[eachMove];
            var moveDest = tileCoordToIndex(thisMove.destC, thisMove.destR);
            var moveBoard = node.slice(); // copy of the current board to apply possible move to
            moveFromToIdx(thisMove.source, moveDest, moveBoard);
            value = Math.max(value, alphaBeta(moveBoard,depth-1, alpha, beta, false));
            alpha = Math.max(alpha, value);
            if (value >= beta) {
                break;
            }
        }
        return value;
    } else {
        value = POSITIVE_INFINITY;
        for(var eachMove = 0; eachMove < nodeChildren.length; eachMove++){
            var thisMove = nodeChildren[eachMove];
            var moveDest = tileCoordToIndex(thisMove.destC, thisMove.destR);
            var moveBoard = node.slice(); // copy of the current board to apply possible move to
            moveFromToIdx(thisMove.source, moveDest, moveBoard);
            value = Math.min(value, alphaBeta(moveBoard,depth-1, alpha, beta, true));
            beta = Math.min(beta, value);
            if (value <= alpha) {
                break;
            }
           
        }
        return value;
    }
}
function movesForBoard(boardState, turnNow) {
    var moveOptions = [];
    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
        for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
            var tileIdx = tileCoordToIndex(eachCol, eachRow);
            var pieceHere = boardState[tileIdx];
            if ((pieceHere > 0 && turnNow == false) || (pieceHere < 0 && turnNow)) {
                //console.log(pieceHere);
                var validMoves = validMovesFromTile(boardState, tileIdx);
                moveOptions.push({
                    source: tileIdx,
                    movesList: validMoves
                });
            } //end of if
        } //end of for row
    } //end of for column
    return moveOptions;
    
}

function aiMoveAB(boardState, turnNow, movesDeep) {
    var moveOptions = movesForBoard(boardState, turnNow);
    var scoredMoves = []; 
    for(var eachPiece = 0; eachPiece < moveOptions.length; eachPiece++){
        for(var eachMove = 0; eachMove < moveOptions[eachPiece].movesList.length; eachMove++){
            var thisMove = moveOptions[eachPiece].movesList[eachMove];
            var moveDest = tileCoordToIndex(thisMove.col, thisMove.row);
            var moveBoard = boardState.slice(); // copy of the current board to apply possible move to
            moveFromToIdx(moveOptions[eachPiece].source, moveDest, moveBoard);
            var moveScore = alphaBeta(moveBoard, movesDeep, NEGATIVE_INFINITY, POSITIVE_INFINITY, !turnNow);
            scoredMoves.push({score:moveScore, fromIdx:moveOptions[eachPiece].source, toIdx:moveDest});
        }
    }
    var bestMove = scoredMoves[0];
    if(turnNow == false) { // biscuit, favor highest
        for(var i=1;i<scoredMoves.length;i++) { // skip 0 (default best move)
            if(bestMove.score > scoredMoves[i].score) {
                bestMove = scoredMoves[i];
            }
        }
    } else { // chocolate, favor lowest
        for(var i=1;i<scoredMoves.length;i++) { // skip 0 (default best move)
            if(bestMove.score < scoredMoves[i].score) {
                bestMove = scoredMoves[i];
            }
        }
    }
    moveFromToIdx(bestMove.fromIdx, bestMove.toIdx, tileGrid);
    endTurn();
}

function aiMove(boardState, turnNow, movesDeep) {
    var moveOptions = movesForBoard(boardState, turnNow);
    // console.log("Pieces with moves " + moveOptions.length);
/*
    var randPiece = Math.floor(Math.random() * moveOptions.length);
    console.log("Piece " + randPiece + " with moves " + moveOptions[randPiece].movesList.length);
    var randMove = Math.floor(Math.random() * moveOptions[randPiece].movesList.length);
    var destIdx = tileCoordToIndex(moveOptions[randPiece].movesList[randMove].col,
        moveOptions[randPiece].movesList[randMove].row);
*/
    var scoredMoves = []; 
    for(var eachPiece = 0; eachPiece < moveOptions.length; eachPiece++){
        for(var eachMove = 0; eachMove < moveOptions[eachPiece].movesList.length; eachMove++){
            var thisMove = moveOptions[eachPiece].movesList[eachMove];
            var moveDest = tileCoordToIndex(thisMove.col, thisMove.row);
            var moveBoard = boardState.slice(); // copy of the current board to apply possible move to
            moveFromToIdx(moveOptions[eachPiece].source, moveDest, moveBoard);
            var moveScore = 0;
            if(movesDeep > 0) {
                var victor = whoWon(moveBoard);
                if(victor == WON_NONE) {
                    var bestCounterMove = aiMove(moveBoard, !turnNow, movesDeep-1);
                    moveScore = bestCounterMove.score;
                } else {
                    moveScore = scoreBoard(moveBoard); // terminal, game winning, no counter possible
                    // prefer a win in fewer moves by tipping the huge win bonus in direction the team favors
                    if(turnNow) {
                        moveScore += movesDeep;
                    } else {
                        moveScore -= movesDeep;
                    }
                }
                scoredMoves.push({score:moveScore, fromIdx:moveOptions[eachPiece].source, toIdx:moveDest});
            } else {
                moveScore = scoreBoard(moveBoard);
                scoredMoves.push({score:moveScore, fromIdx:moveOptions[eachPiece].source, toIdx:moveDest});
            }
            
            //console.log(moveScore, moveOptions[eachPiece].source, moveDest);
        }
    }
   
    // no need to fully sort the whole list, we just need highest/lowest value, so scan once in O(n)
    /*scoredMoves.sort(function compare(m1, m2){return m1.score - m2.score});
    var bestMove;
    if(turnNow == false) { 
        bestMove = scoredMoves[0];
    } else {
        bestMove = scoredMoves[scoredMoves.length-1];
    }*/
    var bestMove = scoredMoves[0];
    if(turnNow == false) { // biscuit, favor highest
        for(var i=1;i<scoredMoves.length;i++) { // skip 0 (default best move)
            if(bestMove.score > scoredMoves[i].score) {
                bestMove = scoredMoves[i];
            }
        }
    } else { // chocolate, favor lowest
        for(var i=1;i<scoredMoves.length;i++) { // skip 0 (default best move)
            if(bestMove.score < scoredMoves[i].score) {
                bestMove = scoredMoves[i];
            }
        }
    }
    if(showAIConsoleLogs) {
       console.log(movesDeep +" " + stringMove(boardState, bestMove) + "  score:" + bestMove.score + " " + (turnNow ? "cho" : "bis"));
    }
    if(movesDeep == AI_MOVES_CONSIDERED){
        moveFromToIdx(bestMove.fromIdx, bestMove.toIdx, tileGrid);
        endTurn();

        return null;
    } else {
        return bestMove;
    }
    
} //end of function

function stringMove(board, move) {
    var piece = board[move.fromIdx];
    var pieceName = "";
    if(piece < 0) {
        pieceName = "Cho.";
    } else if (piece > 0){
        pieceName = "Bis.";
    }
    switch (piece) {
        case NO_PIECE:
            pieceName += "Empty";
            break;
        case KEY: 
        case AKEY:
            pieceName += "Key";
            break;
        case ROOK:
        case AROOK:
            pieceName += "Rook";
            break;
        case BISHOP:
        case ABISHOP:
            pieceName += "Bishop";
            break;
        case KNIGHT:
        case AKNIGHT:
            pieceName += "Knight";
            break;
        case KING:
        case AKING:
            pieceName += "King";
            break;
        case QUEEN:
        case AQUEEN:
            pieceName += "Queen";
            break;
    }
    var sourceC = move.fromIdx % TILE_COLS;
    var sourceR = Math.floor(move.fromIdx / TILE_COLS);
    var destC = move.toIdx % TILE_COLS;
    var destR = Math.floor(move.toIdx / TILE_COLS);
   return (pieceName + ":" + sourceC + "," + sourceR + " to " + destC + "," + destR);
}

function playSoundIfNotJustAI(whichSound,onBoard) {
    if(onBoard == tileGrid) {
        whichSound.play();
    }
}

function moveFromToIdx(fromIdx, toIdx, onBoard) {
    if(whoWon(onBoard) != WON_NONE) {
        // console.log("MOVE REJECTED, GAME ENDED");
        return;
    }
    var takenTile = onBoard[toIdx];
    if (takenTile != 0) {
        playSoundIfNotJustAI(captureSound,onBoard);
        // console.log("Captured Value : " + takenTile);
        if (takenTile == KEY && onBoard[TILE_KEY_START] == KEY || takenTile == AKEY && onBoard[TILE_KEY_START] == KEY) {
            return;
        }
        if (takenTile == KEY) {
            onBoard[TILE_KEY_START] = KEY;
            playSoundIfNotJustAI(keyRestartSound,onBoard);
        } else if (takenTile == AKEY) {
            onBoard[TILE_AKEY_START] = AKEY;
            playSoundIfNotJustAI(keyRestartSound,onBoard);
        }
        if  (takenTile ==  ROOK || takenTile == BISHOP || takenTile == KNIGHT) {
            takenBiscuitPieces--;
            if( takenBiscuitPieces == 1) {
                menu.gameOverMessage();
                canvasContext.fillText("Biscuit Lost everyone",  canvas.width/2, canvas.height/2);
            }
        } else if  (takenTile ==  AROOK || takenTile == ABISHOP || takenTile == AKNIGHT) {
            takenChocolatePieces--;
            if( takenChocolatePieces == 1) {
                menu.gameOverMessage();
                canvasContext.fillText("Chocolate Lost everyone", canvas.width/2, canvas.height/2);
            }
        } 
    }
    onBoard[toIdx] = onBoard[fromIdx]; // put the piece here (overwrite)
    onBoard[fromIdx] = NO_PIECE; // clear the spot where it was sitting
}

function scoreBoard(onBoard, showDebug = false) {
    var bisKeyDist = 0;
    var choKeyDist = 0;
    var bisPieceScore = 0;
    var choPieceScore = 0;

    var victor = whoWon(onBoard);
    if(victor == WON_BISCUIT) {
        return BISCUIT_WIN;// very bad for chocolate
    } else if(victor == WON_CHOCOLATE) {
        return CHOCOLATE_WIN;// very good for chocolate
    }

    for (var eachCol = 0; eachCol < TILE_COLS; eachCol++) {
        for (var eachRow = 0; eachRow < TILE_ROWS; eachRow++) {
            var tileLeftEdgeX = eachCol * TILE_W;
            var tileTopEdgeY = eachRow * TILE_H;
            var idxHere = tileCoordToIndex(eachCol, eachRow);
            var pieceHere = onBoard[idxHere];
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
    if(showDebug){ // warning: there will be a TON of this unless AI_MOVES_CONSIDERED is very low
        console.log("choScore " + choPieceScore + " " +  "bisScore " + bisPieceScore);
        console.log("choKey Steps  " + choKeyDist + " " +  "bisKey Steps " + bisKeyDist);
    }
    
    const MAXKEYSCORE = 18;
    const CAPTUREBIAS = 3; // could try this as 2, now that AI can plan more moves ahead
    var choTotalScore = choPieceScore * CAPTUREBIAS + (MAXKEYSCORE - choKeyDist);
    var bisTotalScore = bisPieceScore * CAPTUREBIAS + (MAXKEYSCORE - bisKeyDist);
    var choOutcome = choTotalScore - bisTotalScore;
    //console.log(choOutcome + " board's favors chocolate score"); 
    return choOutcome;
}

function endTurn(){
    moveSound.play();
    teamATurn = !teamATurn;
    turnCount++;
    //console.log("==end of turn "+turnCount+"==");
    var victor = whoWon(tileGrid);
    if (victor != WON_NONE) {
        isGameOver = true;
        if(victor == WON_BISCUIT) {
            winSound.play();
            hasWon = true;
        } 
        
        if(victor == WON_CHOCOLATE) {
            loseSound.play();
            hasWon = false;
        } 
    }
}

function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    canvasContext.textAlign = "center";
    drawTiles();

    canvasContext.textAlign = "left";
    canvasContext.fillStyle = 'white';
    
    let leftIndent = 10;
    var rightAreaX = FRAME_SIZE*2 + TILE_W * TILE_COLS + leftIndent;
    
    canvasContext.drawImage(table, rightAreaX - 10, 0);
    canvasContext.drawImage(woodDecor, 0, 0);
    drawResetButton();
    drawTutorialButton();
    drawMenuButton();
    drawMuteButton();
    drawSwitchButton();

    if(framesToShowMessage > 0) {
        framesToShowMessage--;
        drawPlayerMessage();
    }
    var lineY = 180;
    var lineSkip = 15;
    var lineIndent = 120;
    canvasContext.fillText("Click any piece to select", rightAreaX + lineIndent, lineY);
    lineY += lineSkip;
    canvasContext.fillText("Then click spot to move to", rightAreaX + lineIndent, lineY);
    lineY += lineSkip*2.5;
    canvasContext.fillText("Next Turn: ", rightAreaX + lineIndent, lineY);
    lineY += lineSkip*2;
    canvasContext.font = "30px Arial";
    canvasContext.fillText((teamATurn ? "Chocolates" : "Biscuits"), rightAreaX + lineIndent, lineY);
    lineY += lineSkip*2.5;
    canvasContext.font = "15px Arial";
    canvasContext.fillText("Turn Count: " + turnCount, rightAreaX + lineIndent, lineY);
    lineY += lineSkip;

    var victor = whoWon(tileGrid);
    if(victor == WON_BISCUIT) {
        menu.gameOverMessage();
        canvasContext.fillText("Biscuit Team Won", rightAreaX + lineIndent, lineY);
    }
    if(victor == WON_CHOCOLATE) {
        canvasContext.fillText("Chocolate Team Won", rightAreaX + lineIndent, lineY);
        menu.gameOverMessage();
    }
    
}

function drawResetButton(){
  canvasContext.drawImage(resetButton, resetBoxX, resetBoxY);
  colorText("Reset", resetBoxX + 32, resetBoxY + 30, 15, "white");
}

function drawTutorialButton(){
  canvasContext.drawImage(tutorialButton, tutorialBoxX, tutorialBoxY);
  colorText("Tutorial", tutorialBoxX + 25, tutorialBoxY + 30, 15, "white")
}

function drawMenuButton(){
    canvasContext.drawImage(menuButton, menuBoxX, menuBoxY);
    colorText("Menu", menuBoxX + 25, menuBoxY + 30, 15, "white")
}

function drawMuteButton(){
    canvasContext.drawImage(muteButton, muteBoxX, muteBoxY);
    colorText("Mute", muteBoxX + 25, muteBoxY + 30, 15, "white")
}

function drawSwitchButton(){
    canvasContext.drawImage(switchButton, switchBoxX, switchBoxY);
    colorText("Pass turn", switchBoxX + 25, switchBoxY + 30, 15, "white")
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    resetBoard();
    initInput();
    loadImages();
}