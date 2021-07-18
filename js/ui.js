const menu = new function() {
    let cursor = 0;

    let itemsX = 240;
    let topItemY = 200;
    let itemsWidth = 350;
    let itemsHeight = 80;
    let rowHeight = 85;
    let helpTextBoxWidth = 1000;

    let showHelpText = false;

    let mainMenuList = ["PLAY",
        "VS PLAYER",
        "HELP",
        "CHANGE TEAM",
        "CREDITS"
    ];
    let helpText = ["You should move the small piece(key Piece) in the corner all the way to the other corner ",
        "If you lose your key piece, it will restart from the first place",
        "If either player loses all pieces (except the key piece) or the other player reaches the other corner first",
        "The winner is chosen ",
        "Click anywhere to return to menu"
    ];
    let menuText = [
        mainMenuList,
        helpText,
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
        console.log("clicked on menu: " + selectedItemOnPage);

        if (helpText.includes(selectedItemOnPage)){
            currentMenu = 0;
        }

        switch (selectedItemOnPage) {
            case "PLAY":
                showMenu = false;
                startSound.play();
                break;
            case 'VS PLAY':
                break;
            case 'HELP':
                currentMenu = 1;
                break;
            case 'CHANGE TEAM':
                teamATurn = true;
                break;
            case 'CREDITS':
                break;
            default:
                console.log("unhandeled menu item");
                break;
        }
        this.cursor = 0;
    }
    this.drawHelpText = function() {
        colorRect(0, topItemY, helpTextBoxWidth, itemsHeight * helpText.length * 1.5, "grey");
        for(var i=0;i< helpText.length ;i++) {
            colorText(
                helpText[i].toString(), 
                50, 
                topItemY + rowHeight * i + itemsHeight / 1.5, 
                15, 
                "#00ffAA");
        }
    }

    this.draw = function() {
        let closeTextHeight = 20
        colorText(
            'Press X to close this menu at any time',
            30,
            closeTextHeight,
            closeTextHeight,
            "black"
        )

        if(currentMenu == 0){
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
        }

        if(currentMenu == 1){
            this.drawHelpText();
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
        for (let i = 0; i < menuText[currentMenu].length; i++) {
            if (
                //mouseX > itemsX - 350 && mousePosX + itemsWidth &&
                mouseY > topItemY + i * rowHeight &&
                mouseY < topItemY + i * rowHeight + itemsHeight
            ) {
                this.setCursorAndCurrentPage(i);
            }
        }
    };
    this.update = function() {
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
            let gameOverBoxWidth = 400;
            let gameOverBoxHeight = 200;
            colorRect( 
                canvas.width/2 - gameOverBoxWidth/2, 
                canvas.height/2 - gameOverBoxHeight/2, 
                gameOverBoxWidth,
                gameOverBoxHeight, 
                this.gameOverBoxColor
            );
            let textAlignWas = canvasContext.textAlign;
            canvasContext.textAlign = "center";
            colorText(this.gameOverText, canvas.width/2, canvas.height/2, 50, "gold");
            colorText(this.gameOverNextText, canvas.width/2, canvas.height/2 + 80, 18, "lavender");
            canvasContext.textAlign = textAlignWas;
        }
    }
}
