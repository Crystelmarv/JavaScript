let canvas = document.getElementById("canvas");
let canvasContext = canvas.getContext("2d");



let cellSize = 25;
let lastKeyPressed = "d";
let snake;
let field;

class Snake{
    speed = 100;
    positionY = 0;
    positionX = 0;
}

class Cell
{
    positionX;
    positionY;
    color;

    constructor(x, y, color) {
        this.positionX = x;
        this.positionY =y;
        this.color = color;
      }
}

class Field{
    fieldSize = 15;
    cells = [];
    color; 

    constructor() {
        this.createCells();
      }

        createCells()
    {
        let h  = 0;
        let boolHelp = false;
        let colorHelp;
        for(let i = 0; i < this.fieldSize * this.fieldSize; i++)
        {
            if((this.fieldSize-1) - (i-this.fieldSize * h) == 0)
            {
                h++;
            }
            if(boolHelp)
            {
                colorHelp = "green";
            }
            else
            {
                colorHelp = "blue";
            }
            this.cells.push(new Cell((i-( this.fieldSize * h)) * cellSize, h * cellSize, colorHelp));
            boolHelp = !boolHelp;
        }
        
        console.log("Anzahl Cells: " + this.cells.length);
    }
}


init();

function init()
{
    canvas.width = window.innerWidth-100;
    canvas.height = window.innerHeight-100;
    snake = new Snake();
    field = new Field();
    gameLoop = setInterval(gameLoop, snake.speed);
}



function gameLoop()
{
    calcPosition();
    paint();
}

function calcPosition()
{
    if(lastKeyPressed == "d") snake.positionX = snake.positionX + cellSize ;
    else if(lastKeyPressed == "a") snake.positionX = snake.positionX - cellSize;
    else if(lastKeyPressed == "w") snake.positionY = snake.positionY - cellSize;
    else if(lastKeyPressed == "s") snake.positionY = snake.positionY + cellSize;
    
}

function paint()
{
    canvas.width = canvas.width;
    canvasContext.beginPath();

    for(let i = 0; i < field.fieldSize * field.fieldSize; i++)
    {
        if(field.cells[i].color == "blue")
        {
            canvasContext.rect(field.cells[i].positionX, field.cells[i].positionY, cellSize, cellSize);
        }
    }
    canvasContext.fillStyle = 'blue';
     canvasContext.fill();

     canvasContext.beginPath();

    for(let i = 0; i < field.fieldSize * field.fieldSize; i++)
    {
        if(field.cells[i].color == "green")
        {
            canvasContext.rect(field.cells[i].positionX, field.cells[i].positionY, cellSize, cellSize);
        }
    }
    canvasContext.fillStyle = 'green';
     canvasContext.fill();


    //Snake
    canvasContext.beginPath();
    canvasContext.rect(snake.positionX, snake.positionY, cellSize, cellSize);
    canvasContext.fillStyle = 'yellow';
    canvasContext.fill();
}

document.onkeypress = function(e){
    lastKeyPressed = e.key;

 };