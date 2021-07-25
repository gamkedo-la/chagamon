const MENU_PAGE_MAIN = 0;
const MENU_PAGE_HELP = 1;
const MENU_PAGE_CREDITS = 2;

let currentMenu = MENU_PAGE_MAIN; // outside of class for how help is accessed from game

const menu = new function() {
    let cursor = 0;

    let itemsX = 240;
    let topItemY = 200;
    let itemsWidth = 350;
    let itemsHeight = 80;
    let rowHeight = 85;
    let helpTextBoxWidth = 930;

    let showHelpText = false;

    let mainMenuList = ["VS COMPUTER",
        "VS HUMAN",
        "HOW TO PLAY",
        "CHANGE TEAM",
        "CREDITS"
    ];
    let helpText = ["To win, move your small Key Piece from your corner all the way to the opposite corner. ",
        "If you lose your Key Piece, it will reset back to the start place.",
        "Avoid losing all your non-Key pieces and stop the other player from reaching their corner first.",
        "Game piece movements are inspired by chess but have less range.",
        " ",
        "Click anywhere to return to menu"
    ];
    let creditsText = ["Vaan Hope Khani: Project lead, original board game design, core gameplay, computer player AI and related optimizations, piece art,",
	"table art, win and lose conditions, sounds", " ",
"Farah Rizal: Tutorial integration, menu toggle, instruction improvements, tooltip correction", " ",
"Vince McKeown: Input refactor, UI fixes, reset button, button graphic, turn change", " ",
"Chris DeLeon: Debug display, goal tile contrast change, AI help, turn menu options", " ",
"Patrick McKeown: Dashboard layout update", " ",
"Filipe Dottori: Team letter indicator", " ",
" ",
"Game developed by members in HomeTeamGameDev.com Outpost Community"
    ];
    let menuText = [
        mainMenuList,
        helpText,
        creditsText
    ];

    this.checkState = function() {
        const selectedItemOnPage = menuText[currentMenu][this.cursor];
        for (let i = 0; i < menuText[currentMenu].length; i++) {
            if (selectedItemOnPage === menuText[currentMenu][i].toString()) {
                colorRect(itemsX, topItemY + rowHeight * i, itemsWidth, itemsHeight, 'grey');
                colorText(
                    menuText[currentMenu][i].toString(),
                    itemsX + 14,
                    topItemY + rowHeight * i + 4 + itemsHeight / 1.5,
                    45,
                    "#FFE993"
                );
            }
        }
    }

    this.clickOption = function() {
        const selectedItemOnPage = menuText[currentMenu][this.cursor];
        // console.log("clicked on menu: " + selectedItemOnPage);

        if (currentMenu != MENU_PAGE_MAIN){
            currentMenu = MENU_PAGE_MAIN;
        } else switch (selectedItemOnPage) {
            case "VS COMPUTER":
                if(aiTeam == AI_PLAY_NONE) {
                    aiTeam = AI_PLAY_BIS;
                }
                showMenu = false;
                startSound.play();
                break;
            case "VS HUMAN":
                aiTeam = AI_PLAY_NONE;
                showMenu = false;
                startSound.play();
                break;
            case 'HOW TO PLAY':
                currentMenu = MENU_PAGE_HELP;
                break;
            case 'CHANGE TEAM':
                if(aiTeam != AI_PLAY_CHO) {
                    aiTeam = AI_PLAY_CHO;
                } else {
                    aiTeam = AI_PLAY_BIS;
                }

                framesToShowMessage = 30;
                break;
            case 'CREDITS':
                currentMenu = MENU_PAGE_CREDITS;
                break;
            default:
                console.log("unhandeled menu item");
                break;
        }
        this.cursor = 0;
    }
    this.drawHelpText = function() {
        var drawX = 50;
        var helpItemHeight = 20;
        var helpItemTop = topItemY+50;
        colorRect(0, 0, canvas.width, canvas.height, "#444444");
        for(var i=0;i< helpText.length ;i++) {
            colorText(
                helpText[i].toString(), 
                drawX, 
                helpItemTop + helpItemHeight * i, 
                15, 
                "#00ffAA");
        }
        var drawY = helpItemTop + helpItemHeight * (helpText.length);
        var textOffY = 40;
        var goalOffX = 180;
        canvasContext.drawImage(KeyPieceB, drawX, drawY+10);
        colorText("wins by reaching", drawX+50, drawY+textOffY, 15, "#00ffAA");
        canvasContext.drawImage(BisGoal, drawX+goalOffX, drawY);
        drawY += 100;
        canvasContext.drawImage(KeyPieceC, drawX, drawY+10);
        colorText("wins by reaching", drawX+50, drawY+textOffY, 15, "#00ffAA");
        canvasContext.drawImage(ChoGoal, drawX+goalOffX, drawY);
    }

    this.drawCredits = function() {
		var creditsHeight = 20;
		var creditsTopItemY = topItemY + creditsHeight;
        colorRect(40, topItemY, helpTextBoxWidth, creditsHeight * (creditsText.length+1), "grey");
        for(var i=0;i< creditsText.length ;i++) {
            colorText(
                creditsText[i].toString(), 
                50, 
                creditsTopItemY + creditsHeight * i, 
                15, 
                "#00ffAA");
        }
    }

    this.draw = function() {
        let closeTextHeight = 20

        canvasContext.globalAlpha = 0.05;
        canvasContext.fillStyle = "#222222";
        canvasContext.fillRect(0,0,canvas.width,canvas.height);
        canvasContext.globalAlpha = 1.0;

        colorText(
            'X key will close this menu',
            30,
            closeTextHeight,
            closeTextHeight,
            "#dddddd"
        )

        switch(currentMenu) {
            case MENU_PAGE_MAIN:
                for (let i = 0; i < menuText[currentMenu].length; i++) {
                    colorRect(itemsX, topItemY + rowHeight * i, itemsWidth, itemsHeight, '#6b0dad');
                    colorText(
                        menuText[currentMenu][i],
                        itemsX + 10,
                        topItemY + rowHeight * i + itemsHeight / 1.5,
                        40,
                        "gold"
                    );
                }
                break;
            case MENU_PAGE_HELP:
                this.drawHelpText();
                break;
            case MENU_PAGE_CREDITS:
                this.drawCredits();
                break;
        }

        if(framesToShowMessage > 0) {
            framesToShowMessage--;
            drawWhichTeamMessage();
        }
        canvasContext.drawImage(logo, itemsX, topItemY - rowHeight, itemsWidth, itemsHeight);
    }
    this.setCursorAndCurrentPage = function(cursor = this.cursor) {
        // For now, only allow selection of an option on the main menu page
        if (currentMenu !== 0) {
            return;
        }

        this.cursor = cursor;
        // Change page
        currentPage = this.cursor;

        // Set the cursor at the first option of the new screen
        this.checkState();
        //selectionSFX.play();

    };

    this.menuMouse = function() {
        const selectedItemOnPage = menuText[currentMenu][this.cursor];
        var offsetY = 30;
        for (let i = 0; i < menuText[currentMenu].length; i++) {
            if (
                //mouseX > itemsX - 350 && mousePosX + itemsWidth &&
                mouseY > topItemY + i * rowHeight - offsetY &&
                mouseY < topItemY + i * rowHeight + itemsHeight - offsetY
            ) {
                this.setCursorAndCurrentPage(i);
            }
        }
    };
    this.update = function() {
        if(framesToShowMessage > 0) {
            return;
        }
        this.menuMouse();
        // Position arrow at last option on screen
        if (this.cursor < 0) {
            this.cursor = menuText[currentMenu].length - 1;
        }

        // Position arrow at first option on screen
        if (this.cursor >= menuText[currentMenu].length) {
            this.cursor = 0;
        }
    }

    this.gameOverMessage = function() {
        this.gameOverBoxColor = hasWon ? "green" : "purple";
        this.gameOverText = hasWon ? "BISCUIT WON" : "CHOCOLATE WON";
        this.gameOverNextText = "Press R or click on Reset button to play again";

        if (isGameOver){
            let gameOverBoxWidth = 500;
            let gameOverBoxHeight = 200;
            canvasContext.globalAlpha = 0.3;
            colorRect( 
                canvas.width/2 - gameOverBoxWidth/2, 
                canvas.height/2 - gameOverBoxHeight/2, 
                gameOverBoxWidth,
                gameOverBoxHeight, 
                this.gameOverBoxColor
            );
            canvasContext.globalAlpha = 1.0;
            let textAlignWas = canvasContext.textAlign;
            canvasContext.textAlign = "center";
            colorText(this.gameOverText, canvas.width/2, canvas.height/2, 50, "gold");
            colorText(this.gameOverNextText, canvas.width/2, canvas.height/2 + 80, 18, "lavender");
            canvasContext.textAlign = textAlignWas;
        }
    }
}
