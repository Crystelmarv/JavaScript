let canvas = document.getElementById("canvas");
let canvasContext = canvas.getContext("2d");

let cellSize = 25;
let firstColor = "#41ab53";
let secondColor = "#6eeb83";
let borderColor = "#61aec9";
let snakeColor = "#f2e44b";
let redColor = "#e05e43";
let lastKeyPressed = "d";
let keyPressed = "d";
let snake;
let field;
let red;

class Snake {
    speed = 100;
    positionY = 5 * cellSize;
    positionX = 5 * cellSize;
    cells = [];
    lastPositionX;
    lastPositionY;
}

class Cell {
    positionX;
    positionY;
    color;

    constructor(x, y, color) {
        this.positionX = x;
        this.positionY = y;
        this.color = color;
    }
}

class Field {
    fieldSize = 15;
    cells = [];
    border = [];

    constructor() {
        this.createCells();
        this.createBorder();
    }

    createBorder() {

        //top
        for (let i = 0; i < this.fieldSize + 2; i++) {
            this.border.push(new Cell(i * cellSize, 0, borderColor));
        }

        //bottom
        for (let i = 0; i < this.fieldSize + 2; i++) {
            this.border.push(new Cell(i * cellSize, (this.fieldSize + 1) * cellSize, borderColor));
        }

        //left
        for (let i = 1; i < this.fieldSize + 1; i++) {
            this.border.push(new Cell(0, i * cellSize, borderColor));
        }

        //right
        for (let i = 1; i < this.fieldSize + 1; i++) {
            this.border.push(new Cell((this.fieldSize + 1) * cellSize, i * cellSize, borderColor));
        }

        console.log("Border: " + this.border.length);
    }

    createCells() {

        let h = 0;
        let boolHelp = false;
        let colorHelp;
        for (let i = 0; i < this.fieldSize * this.fieldSize; i++) {

            if (boolHelp) {
                colorHelp = firstColor;
            }
            else {
                colorHelp = secondColor;
            }
            this.cells.push(new Cell(((i + 1) - (this.fieldSize * h)) * cellSize, (h + 1) * cellSize, colorHelp));
            boolHelp = !boolHelp;

            if ((this.fieldSize - 1) - (i - this.fieldSize * h) == 0) {
                h++;
            }
        }
        console.log("Anzahl Cells: " + this.cells.length);
    }
}

init();

function init() {
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;
    snake = new Snake();
    field = new Field();
    spawnRed();
    gameLoop = setInterval(gameLoop, snake.speed);
}

function spawnRed() {

    red = new Cell(((Math.floor(Math.random() * field.fieldSize)) + 1) * cellSize, ((Math.floor(Math.random() * field.fieldSize)) + 1) * cellSize, redColor);
}

function gameLoop() {
    calcPosition();
    paint();
}


function calcPosition() {
    snake.lastPositionX = snake.positionX;
    snake.lastPositionY = snake.positionY;

    if (keyPressed == "d") snake.positionX = snake.positionX + cellSize;
    else if (keyPressed == "a") snake.positionX = snake.positionX - cellSize;
    else if (keyPressed == "w") snake.positionY = snake.positionY - cellSize;
    else if (keyPressed == "s") snake.positionY = snake.positionY + cellSize;

    let snakeLength = snake.cells.length;
    for (let i = 0; i < snakeLength; i++) {
        let x = snake.cells[i].positionX;
        let y = snake.cells[i].positionY;
        snake.cells[i].positionX = snake.lastPositionX;
        snake.cells[i].positionY = snake.lastPositionY;

        snake.lastPositionX = x;
        snake.lastPositionY = y;
    }

    calcBorderCrash();


    if (snake.positionX == red.positionX && snake.positionY == red.positionY) {
        snake.cells.push(new Cell(snake.lastPositionX, snake.lastPositionY, snakeColor));
        spawnRed();
    }
    calcSnakeCrash();

}

function calcSnakeCrash() {
    let snakeLength = snake.cells.length;
    for (let i = 0; i < snakeLength; i++) {
        if (snake.positionX == snake.cells[i].positionX && snake.positionY == snake.cells[i].positionY) {
            init();
        }
    }
}

function calcBorderCrash() {
    if (snake.positionX < cellSize || snake.positionX > cellSize * field.fieldSize || snake.positionY < cellSize || snake.positionY > cellSize * field.fieldSize) {
        init();
    }
}

function paint() {

    //Clear Canvas
    canvas.width = canvas.width;

    //Field Color 1
    canvasContext.beginPath();

    for (let i = 0; i < field.fieldSize * field.fieldSize; i++) {
        if (field.cells[i].color == firstColor) {
            canvasContext.rect(field.cells[i].positionX, field.cells[i].positionY, cellSize, cellSize);
        }
    }
    canvasContext.fillStyle = firstColor;
    canvasContext.fill();

    //Field color 2
    canvasContext.beginPath();

    for (let i = 0; i < field.fieldSize * field.fieldSize; i++) {
        if (field.cells[i].color == secondColor) {
            canvasContext.rect(field.cells[i].positionX, field.cells[i].positionY, cellSize, cellSize);
        }
    }
    canvasContext.fillStyle = secondColor;
    canvasContext.fill();

    //Border
    canvasContext.beginPath();
    let borderLength = field.border.length;
    for (let i = 0; i < borderLength; i++) {
        canvasContext.rect(field.border[i].positionX, field.border[i].positionY, cellSize, cellSize);
    }
    canvasContext.fillStyle = borderColor;
    canvasContext.fill();

    //Red
    canvasContext.beginPath();
    canvasContext.rect(red.positionX, red.positionY, cellSize, cellSize);
    canvasContext.fillStyle = red.color;
    canvasContext.fill();


    //Snake
    canvasContext.beginPath();
    canvasContext.rect(snake.positionX, snake.positionY, cellSize, cellSize);

    //Snake Body
    let snakeLength = snake.cells.length;
    for (let i = 0; i < snakeLength; i++) {
        canvasContext.rect(snake.cells[i].positionX, snake.cells[i].positionY, cellSize, cellSize);
    }
    canvasContext.fillStyle = snakeColor;
    canvasContext.fill();
}

document.onkeypress = function (e) {
    if (e.key != keyPressed) {
        if (keyPressed == "a" && e.key != "d" || keyPressed == "d" && e.key != "a" || keyPressed == "w" && e.key != "s" || keyPressed == "s" && e.key != "w") {
            keyPressed = e.key;
        }
    }
};