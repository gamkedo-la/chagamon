const menu = new function (){
let current = 0;
let cursor = 0;

let itemsX = 240;
let topItemY = 200;
let itemsWidth = 200;
let itemsHeight = 80;
let rowHeight = 85;

let mainMenuList =
[	"play",
	"help",
	"mute",
	"credits"
];
let helpText =
	[	"Player should capture undecided pieces and eliminate the other pieces to be able to capture the elite piece.",
	   "The player start with only a few pieces and can only move one check in either direction until all of the pieces are captured.",
	   "The player can start capturing the elite/king with his own king unless it's capture by the opponent in which",
	    "queen/noble bishop/patrician or knight/trader can capture their own king/elite.",
	   "The game is ended when all undecided pieces are taken and the elite piece has been captured.", 
	   "As long as the player has their pieces, he/she can get the elite piece back."
	];
let menuText = [
	mainMenuList,
	helpText,
];

this.checkState = function() {
	const selectedItemOnPage = menuText[current][this.cursor];
	for (let i = 0; i < menuText[current].length; i++){
		if (selectedItemOnPage === menuText[current][i].toString()) {
			colorRect(itemsX,topItemY + rowHeight *i, itemsWidth, itemsHeight, 'grey');
			colorText(
			menuText[current][i].toString(),
			itemsX + 10,
			topItemY + rowHeight * i + itemsHeight/1.5,
			45,
			"#00ffAA"
			);
		}
this.mouseunclicked = function (){
	//console.log("hello");
	for (let i = 0; i < menuText[current].length; i++){
		if (selectedItemOnPage === menuText[current][i].toString()) {
		switch(selectedItemOnPage)
			{
			case "play":
			showMenu = false;
			break;
			case 'mute':
				backgroundMusic.startOrStopMusic();
			break;
			case 'help':
			colorRect(itemsX,topItemY + rowHeight *i, itemsWidth, itemsHeight, 'black');
			colorText(menuText[helpText][i].toString(),itemsX + 10,topItemY + rowHeight * i + itemsHeight/1.5,45,"#00ffAA");
			break;
			default:
			console.log("unhandeled menu item");
			break;
		}

		}
	}
}
	}
	this.cursor = 0;
	}
	this.draw = function () {
		for (let i = 0; i < menuText[current].length; i++) {
			colorRect(itemsX,topItemY + rowHeight *i, itemsWidth, itemsHeight, '#fffeef');
		  colorText(
			menuText[current][i],
			itemsX + 10,
			topItemY + rowHeight * i + itemsHeight/1.5,
			40,
			"black"
		  );
	  }
	}
	this.setCursorAndCurrentPage = function (cursor = this.cursor) {
		// For now, only allow selection of an option on the main menu page
		if (current !== 0) {
		  return;
		}
	
		this.cursor = cursor;
		// Change page
		currentPage = this.cursor;
	
		// Set the cursor at the first option of the new screen
		this.checkState();
		//selectionSFX.play();
	  };

	  this.menuMouse = function () {
		const selectedItemOnPage = menuText[current][this.cursor];
		for (let i = 0; i < menuText[current].length; i++) {
		  if (
			//mouseX > itemsX - 350 && mousePosX + itemsWidth &&
			mouseY > topItemY + i * rowHeight &&
			mouseY < topItemY + i * rowHeight + itemsHeight
		  ) {
			this.setCursorAndCurrentPage(i);
		  }
		}
	  };
	this.update = function () {
	this.menuMouse();
	// Position arrow at last option on screen
	if (this.cursor < 0) {
		this.cursor = menuText[current].length - 1;
	}

	// Position arrow at first option on screen
	if (this.cursor >= menuText[current].length) {
		this.cursor = 0;
	}
	}

	}
	
	const inGameMenu = new function (){
		
	}
