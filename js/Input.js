const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_SPACE = 32;
const KEY_A = 65;
const KEY_D = 68;
const KEY_W = 87;
const KEY_M = 77;
const KEY_ESC= 27;
const KEY_TILDE = 192;
const KEY_PLUS = 61;
const KEY_MINUS = 173;
const KEY_T = 84;
const KEY_R = 82;

var mousePos;
var mouseUp;

function initInput() {
	document.addEventListener("mousemove", mousemoved);
	document.addEventListener("mousedown", mouseclicked);
	document.addEventListener("keydown", keyPressed);
	document.addEventListener("keyup", keyReleased);
	document.addEventListener("mousemove", 
		  function(evt) {mousePos = calculateMousePos(evt);
		  });
  }
  
//keyboard functions
  
function setKeyHoldState(thisKey, setTo) {
	switch (thisKey) {
	case KEY_LEFT_ARROW:
	case KEY_A: 
		break;
	case KEY_RIGHT_ARROW:
	case KEY_D: 
		break;
	case KEY_UP_ARROW:
	case KEY_SPACE:
	case KEY_W:
		break;
	case KEY_TILDE:
		break;
	case KEY_PLUS:
		radiusIncrease = setTo;
		break;
	case KEY_MINUS:
		//TODO: Create delay?
		radiusDecrease = setTo;
		break;
	case KEY_M:
		backgroundMusic.startOrStopMusic();
		break;
	case KEY_ESC:
		showMenu = true;
		break;
  case KEY_T:
    if (setTo == false) {
      setInterval(function() {
        randomMove();
    }, 1000 / FRAMES_PER_SECOND);
    }
    break;
  case KEY_R:
    resetBoard();
  break;
	default:
		//console.log("Keycode is: " + thisKey);
	}
}



function keyPressed(evt) {
	setKeyHoldState(evt.keyCode, true);
	evt.preventDefault(); // without this, arrow keys scroll the browser!
}

function keyReleased(evt) {
	setKeyHoldState(evt.keyCode, false);
}

//mouse functions


function mouseclicked(evt) {
  if (checkBox(mouseX, mouseY, resetBoxX, resetBoxY,resetBoxWidth, resetBoxHeight)){ //reset button
    resetBoard();
    console.log("Board Reset");
    return;
  };
  
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
      moveFromToIdx(selectedIdx, tileOverIdx);
	    console.log("turn over");
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


function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect(), root = document.documentElement; 

  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
 return {
    x: mouseX,
    y: mouseY
  };
}

function checkBox(inpX, inpY, xPos, yPos, width, height){
  let leftSide = xPos;
  let rightSide = xPos + width;
  let topSide = yPos;
  let bottomSide = yPos + height;
  let inputX = inpX;
  let inputY = inpY;

  console.log(inputY <= bottomSide)

  if (inputX >= leftSide && inputX <= rightSide && 
      inputY >= topSide && inputY <= bottomSide){
        return true;
  } else {
    return false;
  }
}
