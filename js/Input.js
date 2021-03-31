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

var mousePos;
var mouseUp;
function initInput() {
	document.addEventListener("mousemove", mousemoved);
	document.addEventListener("mousedown", mouseclicked);
	document.addEventListener("mouseup", 
	function(evt) {
		mouseUp = menu.mouseunclicked(evt);
		});
	document.addEventListener("keydown", keyPressed);
	document.addEventListener("keyup", keyReleased);
	document.addEventListener("mousemove", 
		  function(evt) {
		  mousePos = calculateMousePos(evt);
		  });
  }
  
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
	default:
		//console.log("Keycode is: " + thisKey);
	}
}

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function keyPressed(evt) {
	setKeyHoldState(evt.keyCode, true);
	evt.preventDefault(); // without this, arrow keys scroll the browser!
}

function keyReleased(evt) {
	setKeyHoldState(evt.keyCode, false);
}
