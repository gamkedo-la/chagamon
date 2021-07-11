const menu = new function() {
    let current = 0;
    let cursor = 0;

    let itemsX = 240;
    let topItemY = 200;
    let itemsWidth = 350;
    let itemsHeight = 80;
    let rowHeight = 85;

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
    ];
    let menuText = [
        mainMenuList,
        helpText,
    ];

    this.checkState = function() {
        const selectedItemOnPage = menuText[current][this.cursor];
        for (let i = 0; i < menuText[current].length; i++) {
            if (selectedItemOnPage === menuText[current][i].toString()) {
                colorRect(itemsX, topItemY + rowHeight * i, itemsWidth, itemsHeight, 'grey');
                colorText(
                    menuText[current][i].toString(),
                    itemsX + 14,
                    topItemY + rowHeight * i + 4 + itemsHeight / 1.5,
                    45,
                    "#FFE993"
                );
            }
        }
    }

    this.clickOption = function() {
        const selectedItemOnPage = menuText[current][this.cursor];
        console.log("clicked on menu: " + selectedItemOnPage);
        switch (selectedItemOnPage) {
            case "PLAY":
                showMenu = false;
                startSound.play();
                break;
            case 'VS PLAY':
                
                break;
            case 'HELP':
                for(var i=0;i<helpText.length;i++) {
                    colorRect(itemsX, topItemY + rowHeight * i, itemsWidth, itemsHeight, 'black');
                    colorText(helpText[i].toString(), itemsX + 10, topItemY + rowHeight * i + itemsHeight / 1.5, 45, "#00ffAA");
                }
                break;
            case 'CHANGE TEAM':
                break;
            case 'CREDITS':
                break;
            default:
                console.log("unhandeled menu item");
                break;
        }
        this.cursor = 0;
    }
    this.draw = function() {
        let closeTextHeight = 20
        colorText(
            'Press X to close this menu at any time',
            30,
            closeTextHeight,
            // topItemY - (closeTextHeight * 1.5),
            closeTextHeight,
            "black"
        )
        for (let i = 0; i < menuText[current].length; i++) {
            colorRect(itemsX, topItemY + rowHeight * i, itemsWidth, itemsHeight, '#6b0dad');
            colorText(
                menuText[current][i],
                itemsX + 10,
                topItemY + rowHeight * i + itemsHeight / 1.5,
                40,
                "gold"
            );
        }
        canvasContext.drawImage(logo, itemsX, topItemY - rowHeight, itemsWidth, itemsHeight);
    }
    this.setCursorAndCurrentPage = function(cursor = this.cursor) {
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

    this.menuMouse = function() {
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
    this.update = function() {
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

    this.helpMessage = function() {
        for (let i = 0; i < helpText[current].length; i++) {
            colorRect(itemsX, topItemY + rowHeight * i, itemsWidth, itemsHeight, '#fffeef');
            colorText(
                helpText[current][i],
                itemsX + 10,
                topItemY + rowHeight * i + itemsHeight / 1.5,
                13,
                "black"
            );
        }
    }
    
    this.gameOverMessage = function() {
        this.gameOverBoxColor = hasWon ? "green" : "purple";
        this.gameOverText = hasWon ? "BISCUIT WON" : "CHOCOLATE WON";
        this.gameOverNextText = "PRESS RESET TO PLAY AGIIAN";

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
