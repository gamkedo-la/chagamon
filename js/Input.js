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
const KEY_X = 88;
const KEY_Z = 90;
const WOOD_DECOR_OFFSET = 31;

var mouseUp;

function initInput() {
	document.addEventListener("mousemove", mousemoved);
	document.addEventListener("mousedown", mouseclicked);
	document.addEventListener("keydown", keyPressed);
	document.addEventListener("keyup", keyReleased);
  }
  
//keyboard functions
  
function setKeyHoldState(thisKey, setTo) {
	switch (thisKey) {
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
  case KEY_X:
    showMenu = false;
    break; 
  case KEY_T:
    if (setTo == false) {
      if(aiCurrentlyThinking == AI_THINKING_NO) { // block stacked requests
        aiCurrentlyThinking = AI_THINKING_NEXT_FRAME; // leaves time for visual wait feedback
      }
    }
    break;
  case KEY_R:
    resetBoard();
  break;
  case KEY_SPACE:
    if (setTo == false) {
      console.log(scoreBoard(tileGrid, true));
    }
  break;
  case KEY_A:
    if(setTo == false) {
      tileGrid = [0, 4, 3, 0, 0, 0, 0, -4, 0, 0, 0, 0, 0, 0, -3, 0, 1, -4, 2, 0, 4, 0, 0, 0, 0, 0, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, -1, 0, 0, 0, 0, 0, 0, -4, 0, 0, 0, 0, 0, 0, 0, 0, -3, 0, 0, 0, 0, 0, 0, -4, -2, 0];
      teamATurn = false;
    }
    break;
  case KEY_Z:
    if (setTo == false) {
      tileGrid = [0, 4, 3, 0, 0, 0,-3,-4, 0, 4, 0, 0, 0, 0, 0, 0, 0, -4, 2, 0, 0, 0, 0, 0, 0, 0,-2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, 0, 0, -2, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -3, 0, 2, 4, 0, 0, 0, -4, 0, 0];
      teamATurn = false;
    }
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
  if(showMenu) {
    menu.clickOption();
    return;
  }
  if (checkBox(mouseX, mouseY, resetBoxX, resetBoxY,resetBoxWidth, resetBoxHeight)){ //reset button
    resetBoard();
    buttonSound.play();
    backgroundMusic.restartMusic();
    console.log("Board Reset");
    return;
  };

  if (checkBox(mouseX, mouseY, tutorialBoxX, tutorialBoxY,tutorialBoxWidth, tutorialBoxHeight)){ //tutorial button
    buttonSound.play();
    showMenu = true;
    aiCurrentlyThinking = AI_THINKING_NO;
    currentMenu = MENU_PAGE_HELP;
    return;
  };
  
  if (checkBox(mouseX, mouseY, menuBoxX, menuBoxY, menuBoxWidth, menuBoxHeight)){ //menu button
    console.log("Launch menu UI");
    showMenu = true;
    aiCurrentlyThinking = AI_THINKING_NO;
    buttonSound.play();
    return;
  };
  
  if (checkBox(mouseX, mouseY, muteBoxX, muteBoxY, muteBoxWidth, muteBoxHeight)){ //mute button
    muteAll = !muteAll;
    buttonSound.play();
    backgroundMusic.startOrStopMusic();
    return;
  };
  
  if (checkBox(mouseX, mouseY, switchBoxX, switchBoxY, switchBoxWidth, switchBoxHeight)){ //switch team button
    buttonSound.play();
    teamATurn = !teamATurn;
    return;
  };
  
  if(tileOverIdx < 0 || tileOverIdx >= tileGrid.length) { // invalid or off board
    return;
  }


  let selectedPiece = tileGrid[tileOverIdx];
  let chocolatePiece = false;
  let biscuitPiece = false;
  
  if (selectedPiece > 0) {
    chocolatePiece = true;
  } else if (selectedPiece < 0){
    biscuitPiece = true;
  }

  if(teamATurn){
    if(selectedPiece = chocolatePiece && selectedIdx ==-1){
      invalidSound.play();
      return;
    } 
  } 
  if (!teamATurn) {
    if(selectedPiece = biscuitPiece && selectedIdx ==-1){
      invalidSound.play();
      return;
    }
  } 
 
  if((chocolatePiece || biscuitPiece)){
    selectSound.play();
  }

  if (selectedIdx == tileOverIdx) {
    selectedIdx = -1;
  } else if (selectedIdx != -1) {
    var validMoves = validMovesFromTile(tileGrid ,selectedIdx);
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
      moveFromToIdx(selectedIdx, tileOverIdx, tileGrid);
      endTurn();
	    console.log("turn over");
    }
    
    selectedIdx = -1; // forget selection
  } else if(tileGrid[tileOverIdx] != NO_PIECE ) {
    selectedIdx = tileOverIdx;
  }
  if (!moveInList && selectedIdx == -1 && selectedIdx != selectedPiece) {
    deselectSound.play();
  }
}

function mousemoved(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  // account for the margins, canvas position on page, scroll amount, etc.
  mouseX = evt.clientX - rect.left - root.scrollLeft - FRAME_SIZE;
  mouseY = evt.clientY - rect.top - root.scrollTop - FRAME_SIZE;

  var tileOverCol = Math.floor(mouseX / TILE_W);
  var tileOverRow = Math.floor(mouseY / TILE_H);
  tileOverIdx = tileCoordToIndex(tileOverCol,tileOverRow);
}

function checkBox(inpX, inpY, xPos, yPos, width, height){
  let leftSide = xPos - WOOD_DECOR_OFFSET;
  let rightSide = xPos + width - WOOD_DECOR_OFFSET;
  let topSide = yPos - WOOD_DECOR_OFFSET;
  let bottomSide = yPos + height - WOOD_DECOR_OFFSET;
  let inputX = inpX;
  let inputY = inpY;

  //console.log(inputY <= bottomSide)

  if (inputX >= leftSide && inputX <= rightSide && 
      inputY >= topSide && inputY <= bottomSide){
        return true;
  } else {
    return false;
  }
}
