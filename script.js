'use strict;'

var model = {

  init: function(gridSize) {
    model.gridSize = gridSize;
    // build array of cells
    model.cells = model.buildGrid();
    // create snake with starting coordinates
    model.snake.spawn();
    // spawn food
    model.food.spawn();
  },

  gridSize: 0,
  score: 0,
  gameover: false,
  cells: [],

  snake: {
    cells: [],
    direction: 'right',
    nextDirection: 'right',

    spawn: function() {
      var startingCell = model.findCellByCoords(3,4);
      model.snake.cells = [startingCell];
      startingCell.snake = true;
    },

    move: function() {
      model.snake.direction = model.snake.nextDirection;
      var newX = model.snake.cells[0].x + model.snake.movementX();
      var newY = model.snake.cells[0].y + model.snake.movementY();
      var newCell = model.findCellByCoords(newX, newY);

      model.gameover = (model.snake.flagWallCollision(newX, newY) || model.snake.flagSnakeCollision(newCell))

      if (!model.gameover) {
        model.snake.cells.unshift(newCell);
        // sets current cell to be part of the snake
        model.snake.cells[0].snake = true;
        
        if (newCell.food) {
          model.food.eaten()
        }

        else {
          // pops off the last cell in the snake if no food is eaten
          model.snake.cells.pop().snake = false;
        }
        return newCell;
      }
    },

    movementX: function () {
      if (model.snake.direction === 'right') {
        return 1
      }

      else if (model.snake.direction === 'left') {
        return -1
      }

      else {
        return 0
      };
    },

    movementY: function () {
      if (model.snake.direction === 'down') {
        return 1
      }

      else if (model.snake.direction === 'up') {
        return -1
      }

      else {
        return 0
      };
    },

    flagWallCollision: function(newX, newY) {
      return (model.outOfBounds(newX) || model.outOfBounds(newY));
    },

    flagSnakeCollision: function(newCell) {
      return !!newCell.snake;
    },

    newDirection: function() {
      // event.which property normalizes event.keyCode and event.charCode
      model.snake.nextDirection = model.snake.filterInput(event.which);
    },

    filterInput: function(input) {
      // if current is left or right, should only accept up or down
      if (model.snake.direction === 'left' || model.snake.direction === 'right') {
        switch (input) {
          case 38:
            return 'up';
            break;
          case 40:
            return 'down';
            break;
          default:
            return model.snake.nextDirection;
        };
      }

      else {
        switch(input) {
          case 37:
            return 'left';
            break;
          case 39:
            return 'right';
            break;
          default:
            return model.snake.nextDirection;
        };
      };
    }

  },

  food: {
    cell: [],

    spawn: function() {
      var sample = model.food.randomSpawn();
      model.food.cell = [sample];
      sample.food = true;
    },

    randomSpawn: function() {
      // grep method removes items from an array so that remaining items pass a provided test
      // return all cells not flagged as containing snake
      var freeCells = $.grep(model.cells, function(cell) {
        return (cell.snake === false);
      });

      // choose random cell for food placement
      return freeCells[Math.floor(freeCells.length * Math.random())];
    },

    eaten: function() {
      model.score += 1;
      model.food.cell[0].food = false;
      model.food.spawn();
    }

  },

  buildGrid: function() {
    var output = [];
    for (var i = 0; i < Math.pow(model.gridSize, 2); i++) {
      var newCell = new model.cellConstructor(i);
      output.push(newCell);
    }
    // returns cells from cellConstructor with id, (x, y) coords, snake and food booleans to determine what the cell contains
    return output;
  },

  cellConstructor: function(i) {
    this.id = i;
    // produce (x, y) coordinates
    this.x = i % model.gridSize;
    this.y = Math.floor(i / model.gridSize);
    this.snake = false;
    this.food = false;
  },

  findCellByCoords: function(x, y) {
    // reproduces cell ID from coordinates to find cell
    var i = y * (model.gridSize) + x;
    return model.cells[i];
  },

  outOfBounds: function(coordinate) {
    // checks if newX or newY coordinates are off the grid
    if (coordinate < 0 || coordinate >= model.gridSize) {
      return true
    };
  },

  getSnakeIDs: function() {
    // translates snake cells to their IDs and returns that array
    return $.map(model.snake.cells, function(cell) {
      return cell.id
    });
  },

  getFoodIDs: function() {
    // only one cell contains food at any time
    return model.food.cell[0].id;
  },

  getSnakeDirection: function() {
    return model.snake.direction;
  },

  nextFrame: function() {
    // simplifies gameloop
    var newCell = model.snake.move();
  }

}

var view = {

  init: function(gridSize) {
    view.buildGrid(gridSize);
    controller.show();
    // checks for keys pressed; newDirection() only responds to up, down, left, right
    $(window).on('keydown', model.snake.newDirection)
  },

  buildGrid: function(size) {
    // creates cells in view based on given gridSize
    for(var i = 0; i < Math.pow(size, 2); i++) {
      $('.board').append("<div class='cell'></div>")
    }
    view.setDimensions(size);
  },

  setDimensions: function(size) {
    // keeps the dimensions of the board and cells proportional to the gridSize when the model and view are initiated
    // integer value is the pixel width of the board
    var cellSizePx = Math.floor(720 / size) + 'px';
    $('.board').css('line-height', cellSizePx);
    $('.cell').css('height', cellSizePx);
    $('.cell').css('width', cellSizePx);
  },

  renderFrame: function(snakeIDs, snakeHeadID, foodID, score, gameover) {
    view.resetFrame();
    view.renderScore(score);
    // get all snake parts
    $.each( snakeIDs, function(i, id) { view.drawSnake(id) } );
    // get snake head
    view.drawSnakeHead(snakeHeadID, gameover);
    // get food location
    view.drawFood(foodID);
  },

  renderScore: function(score) {
    $('.scoreboard em')[0].innerHTML = score;
  },

  renderEndgame: function() {
    $('.board').after("<center><h3>Game Over!</h3></center>");
  },

  resetFrame: function() {
    $('.board').children().removeClass('food snake head left right up down');
  },

  drawFood: function(i) {
    // add food class to appropriate cell given ID
    $('.board').children().eq(i).addClass('food');
  },

  drawSnake: function(i) {
    // add snake class to appropriate cell given ID
    $('.board').children().eq(i).addClass('snake');
  },

  drawSnakeHead: function(i, gameover) {
    // snake head is red if the game is over; else green
    if (gameover) {
      $('.board').children().eq(i).addClass('dead');
    }

    else {
      $('.board').children().eq(i).addClass('head');
    }
  }

}

var controller = {

  init: function(size, speed) {
    controller.size = size;
    controller.speed = speed;
    // setup board
    model.init(controller.size);
    view.init(controller.size);
    // start the loop
    controller.play();

  },

  size: 0,
  speed: 0,
  gameInterval: null,

  show: function() {
    var snakeIDs = model.getSnakeIDs();
    var snakeHeadID = snakeIDs[0];
    var direction = model.getSnakeDirection();
    var foodID = model.getFoodIDs();
    var score = model.score;
    var gameover = model.gameover;
    view.renderFrame(snakeIDs, snakeHeadID, foodID, score, gameover);
  },

  play: function() {
    controller.gameInterval = setInterval(controller.gameloop, controller.speed);
  },

  gameloop: function() {
    // update model
    model.nextFrame();

    controller.show();

    if (model.gameover) {
      controller.endGame();
    }
  },

  endGame: function() {
    clearInterval(controller.gameInterval);
    view.renderEndgame();
  }
}

$(document).ready( function() {
  controller.init(30, 100);
})