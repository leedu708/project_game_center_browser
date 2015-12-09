#Snake
###By Dustin Lee

Use arrow keys to change direction.  Clear food without hitting yourself or the grid.

[Project provided by the Viking Code School](http://www.vikingcodeschool.com)

Overview

Model:
  
  Variable Dictionary:
    - gridSize: size of grid when initiated
    - score: current score (food eaten)
    - gameover: booelean to determine if game is over
    - cells: array containing cell IDs

  Objects:

    Snake:
      - cells: cell IDs that contain the class snake
      - direction: determines current direction movement
      - nextDirection: direction of the next frame

      spawn(): spawns first cell containing snake class

      move(): determines the next cell the snake will move to in the next frame.

      movementX(): returns horizontal direction of next move
      movementY(): returns vertical direction of next move

      flagWallCollision: determines if snake hits the grid
      flagSnakeCollision: determines if snake hits itself

      filterInput: returns a string representing the keyCode that is input
      newDirection: looks for input event and forwards keyCode to filterInput for conversion

    Food:
      - cell: contains ID of food cell

      spawn(): sets the class 'food' to the provided cell
      randomSpawn(): checks for free cells then returns a random free cell to place food in

      eaten(): increments score on food clear. removes food class from cell, initiates next food spawn


  Functions:

    buildGrid(): initiates cellConstructor function to form a grid. returns cells cellConstructor

    cellConstructor(): creates a cell containing the id, (x, y) coordinates, and snake and food booleans to determine what the cell contains

    findCellByCoords(): finds cell by given coordinates

    outOfBounds(): checks newX or newY are off the grid

    getSnakeIDs(): translates snake cells to their IDs and returns array
    getFoodIDs(): grabs food cell ID
    getSnakeDirection(): grabs current direction
    nextFrame(): moves to next frame

View:

  Functions:

    init(): initiates building the grid on the view.  checks for keys pressed

    buildGrid(): appends cell divs to the board and initiates setting the dimensions of the board/cells in styles.css

    setDimensions():  keeps the dimensions of the board and cells proportional to the gridSize when the model and view are initated

    renderFrame():  initiates the drawing of the score, snake, and food cells
    renderScore(): changes innerHTML of '.scoreboard em' to reflect the score
    renderEndgame(): adds "Game Over!" text after the board
    resetFrame(): resets the classes of all the cells
    drawFood(): adds food class to the given cell ID
    drawSnake(): adds snake class to the given cell ID
    drawSnakeHead: adds appropriate snakeHead class based on game state

Controller:

  Variable Dictionary:
    - size: dimensions of the board given in number of cells
    - speed: dictates delay between frames
    - gameInterval: holds the gameloop and speed at which it is looped

  Functions:

    show(): grabs necessary variables and forwards it to the view to display
    play(): sets controller.gameInterval
    gameloop(): updates the model, then gives the view updated game variables. ends game if gameover is true
    endGame(): clears the gameInterval and tells the view to renderEndgame()