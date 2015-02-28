// CreateJS Boilerplate for COMP397
var Button = (function () {
    function Button(path, x, y) {
        this._x = x;
        this._y = y;
        this._image = new createjs.Bitmap(path);
        this._image.x = this._x;
        this._image.y = this._y;

        this._image.addEventListener("mouseover", this._buttonOver);
        this._image.addEventListener("mouseout", this._buttonOut);
    }
    // PUBLIC PROPERTIES
    Button.prototype.setX = function (x) {
        this._x = x;
    };

    Button.prototype.getX = function () {
        return this._x;
    };

    Button.prototype.setY = function (y) {
        this._y = y;
    };

    Button.prototype.getY = function () {
        return this._y;
    };

    Button.prototype.getImage = function () {
        return this._image;
    };

    // PRIVATE EVENT HANDLERS
    Button.prototype._buttonOut = function (event) {
        event.currentTarget.alpha = 1; // 100% Alpha
    };

    Button.prototype._buttonOver = function (event) {
        event.currentTarget.alpha = 0.5;
    };
    return Button;
})();

// VARIABLES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var canvas;
var stage;
var tiles = [];
var reelContainers = [];

// GAME CONSTANTS
var NUM_REELS = 3;

// GAME VARIABLES
maxbet = 5;
var playerMoney = 1000;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 0;
var winNumber = 0;
var lossNumber = 0;
var spinResult;
var fruits = "";
var winRatio = 0;

/* Tally Variables */
var pineapples = 0;
var bananas = 0;
var strawberrys = 0;
var cherries = 0;
var tomatos = 0;
var oranges = 0;
var apples = 0;
var blanks = 0;

// GAME OBJECTS
var game;
var background;
var spinButton;
var betMaxButton;
var betOneButton;
var resetButton;
var powerButton;

// FUNCTIONS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas); // Parent Object
    stage.enableMouseOver(20); // Turn on Mouse Over events

    createjs.Ticker.setFPS(60); // Set the frame rate to 60 fps
    createjs.Ticker.addEventListener("tick", gameLoop);

    main();
}

// GAMELOOP
function gameLoop() {
    stage.update();
}

/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    pineapples = 0;
    bananas = 0;
    strawberrys = 0;
    cherries = 0;
    tomatos = 0;
    oranges = 0;
    apples = 0;
    blanks = 0;
}

/* Utility function to reset the player stats */
function resetAll() {
    maxbet = 5;
    playerMoney = 1000;
    winnings = 0;
    jackpot = 5000;
    turn = 0;
    playerBet = 0;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    } else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "blank";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "apple";
                apples++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "banana";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "orange";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "tomato";
                tomatos++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "pineapple";
                pineapples++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "strwberry";
                strawberrys++;
                break;
        }
    }
    return betLine;
}

/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blanks == 0) {
        if (apples == 3) {
            winnings = playerBet * 10;
        }
        else if (bananas == 3) {
            winnings = playerBet * 20;
        }
        else if (oranges == 3) {
            winnings = playerBet * 30;
        }
        else if (cherries == 3) {
            winnings = playerBet * 40;
        }
        else if (tomatos == 3) {
            winnings = playerBet * 50;
        }
        else if (pineapples == 3) {
            winnings = playerBet * 75;
        }
        else if (strawberrys == 3) {
            winnings = playerBet * 100;
        }
        else if (apples == 2) {
            winnings = playerBet * 2;
        }
        else if (bananas == 2) {
            winnings = playerBet * 2;
        }
        else if (oranges == 2) {
            winnings = playerBet * 3;
        }
        else if (cherries == 2) {
            winnings = playerBet * 4;
        }
        else if (tomatos == 2) {
            winnings = playerBet * 5;
        }
        else if (pineapples == 2) {
            winnings = playerBet * 10;
        }
        else if (strawberrys == 2) {
            winnings = playerBet * 20;
        }
        else {
            winnings = playerBet * 1;
        }

        if (strawberrys == 1) {
            winnings = playerBet * 5;
        }
        winNumber++;
        //showWinMessage();
    }
    else {
        lossNumber++;
        //showLossMessage();
    }

}

// MAIN MEAT of my code goes here
function spinButtonClicked(event) {
    spinResult = Reels();
    fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index].removeAllChildren();
        tiles[index] = new createjs.Bitmap("assets/images/" + spinResult[index] + ".png");
        reelContainers[index].addChild(tiles[index]);
        
    }
    
    
}
function resetButtonClicked(event) {
   
    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index].removeAllChildren();
        tiles[index] = new createjs.Bitmap("assets/images/blank.png");
        reelContainers[index].addChild(tiles[index]);
    }
}
function powerButtonClicked(event) {

    
    createUI();
        
}
function betOneButtonClicked(event) {

    playerBet = 1;

    if(spinButtonClicked==true)
    {
        playerBet--;
    }

}




function createUI() {
    background = new createjs.Bitmap("assets/images/nikharBackground.png");
    game.addChild(background); // Add the background to the game container

    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index] = new createjs.Container();
        game.addChild(reelContainers[index]);
    }
    reelContainers[0].x = 54;
    reelContainers[0].y = 129;
    reelContainers[1].x = 157;
    reelContainers[1].y = 127;
    reelContainers[2].x = 260;
    reelContainers[2].y = 128;

    // Spin Button
    spinButton = new Button("assets/images/spinButton.png", 301, 342);
    game.addChild(spinButton.getImage());

    // Spin Button Event Listeners
    spinButton.getImage().addEventListener("click", spinButtonClicked);

    // Bet Max Button
    betMaxButton = new Button("assets/images/betMaxButton.png", 222, 341);
    game.addChild(betMaxButton.getImage());
    betMaxButton.getImage().addEventListener("click", spinButtonClicked);

    // Bet One Button
    betOneButton = new Button("assets/images/betOneButton.png", 145, 342);
    game.addChild(betOneButton.getImage());
    betOneButton.getImage().addEventListener("click", betOneButtonClicked);

    // Reset Button
    resetButton = new Button("assets/images/resetButton.png", 75, 342);
    game.addChild(resetButton.getImage());
    resetButton.getImage().addEventListener("click", resetButtonClicked);

    // Power Button
    powerButton = new Button("assets/images/powerButton.png", 6, 340);
    game.addChild(powerButton.getImage());
    powerButton.getImage().addEventListener("click", powerButtonClicked);
}

function main() {
    game = new createjs.Container(); // Instantiates the Game Container

    createUI();

    stage.addChild(game); // Adds the Game Container to the Stage
}
