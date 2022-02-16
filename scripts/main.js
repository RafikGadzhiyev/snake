let theEnd = false;

class GameField {
    constructor(cellSize) {
        this.size = cellSize;
    }

    draw() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for (let i = 1; i <= COLUMNS; ++i) {
            ctx.moveTo(i * 50, 0);
            ctx.lineTo(i * 50, HEIGHT);
            ctx.stroke();
        }

        for (let j = 1; j <= COLUMNS; ++j) {
            ctx.moveTo(0, j * 50);
            ctx.lineTo(WIDTH, j * 50);
            ctx.stroke();
        }
    }

}


class Snake {
    constructor(rows, columns) {
        this.snake = [
            [
                Math.floor(Math.random() * columns) * GRID_CELL_SIZE,
                Math.floor(Math.random() * rows) * GRID_CELL_SIZE
            ]
        ];
        this.deleteCell = null;
        this.size = 1;
        this.direction;
        this.timeId = null;
    }

    draw() {
        for (let i = 0; i < this.size; ++i) {
            ctx.fillRect(this.snake[i][0], this.snake[i][1], GRID_CELL_SIZE, GRID_CELL_SIZE)
        }
    }

    reset() {
        ctx.clearRect(this.deleteCell[0], this.deleteCell[1], GRID_CELL_SIZE, GRID_CELL_SIZE);
        ctx.moveTo(this.deleteCell[0], this.deleteCell[1]);
        ctx.lineTo(this.deleteCell[0], this.deleteCell[1]);
        ctx.stroke();
    }

    detectColision() {
        if (this.size < 2) return false;
        let snakeHead = this.snake[0].join ``;
        for (let i = 1; i < this.size; ++i) {
            if (snakeHead === this.snake[i].join ``) return true;
        }
        return false
    }

    init(key, f) {
        if (VALID_KEYS.includes(key)) {
            clearTimeout(this.timeId);
            if (theEnd) {
                scoreAfterDeath.textContent = `Score: ${this.size - 1}`;
                scoreAfterDeathContainer.style = `
                    opacity: 1;
                    z-index: 10;
                `
                return;
            }
            this.timeId = setTimeout(() => {
                this.init(key, f)
            }, 100)
            this.move(key, f);
        }
    }

    move(key, f) {
        let tmp = [],
            isCollisionExist = this.detectColision();

        for (let i = 0; i < this.size - 1; ++i) {
            tmp.push([...this.snake[i]])
        }
        this.deleteCell = this.snake[this.size - 1];
        this.reset();

        if (this.direction === 'up' && key === 'ArrowDown') {
            key = 'ArrowUp';
        } else if (this.direction === 'down' && key === 'ArrowUp') {
            key = 'ArrowDown';
        } else if (this.direction === 'right' && key === 'ArrowLeft') {
            key = 'ArrowRight'
        } else if (this.direction === 'left' && key === 'ArrowRight') {
            key = 'ArrowLeft';
        }

        switch (key) {
            case "ArrowUp":
                if (this.direction === 'down') break;
                this.snake[0][1] -= GRID_CELL_SIZE;
                if (this.snake[0][1] < 0) {
                    this.snake[0][1] = HEIGHT - GRID_CELL_SIZE;
                }
                this.direction = 'up';
                break;
            case "ArrowDown":
                if (this.direction === 'up') break;
                this.snake[0][1] += GRID_CELL_SIZE;
                if (this.snake[0][1] >= HEIGHT) {
                    this.snake[0][1] = 0;
                }
                this.direction = 'down';
                break;
            case "ArrowLeft":
                if (this.direction === 'right') break;
                this.snake[0][0] -= GRID_CELL_SIZE;
                if (this.snake[0][0] < 0) {
                    this.snake[0][0] = WIDTH - GRID_CELL_SIZE;
                }
                this.direction = 'left';
                break;
            case "ArrowRight":
                if (this.direction === 'left') break;
                this.snake[0][0] += GRID_CELL_SIZE;
                if (this.snake[0][0] >= WIDTH) {
                    this.snake[0][0] = 0;
                }
                this.direction = 'right';
                break;
        }
        isCollisionExist = this.detectColision();
        this.snake = [
            this.snake[0],
            ...tmp
        ]

        for (let i = 0; i < this.snake.length; ++i) {
            if (this.snake[i][0] === f.x && this.snake[i][1] === f.y) {
                f.generate();
                this.snake.push(tmp);
                this.draw();
                this.size++;
                gameScore.textContent = snake.size - 1;
                break;
            }
        }


        if (isCollisionExist) {
            theEnd = true;
            return;
        }
        this.draw();
    }

}

class SnakeFood {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.y = Math.floor(Math.random() * this.rows) * GRID_CELL_SIZE;
        this.x = Math.floor(Math.random() * this.columns) * GRID_CELL_SIZE;
    }

    generate() {
        this.y = Math.floor(Math.random() * this.rows) * GRID_CELL_SIZE;
        this.x = Math.floor(Math.random() * this.columns) * GRID_CELL_SIZE;
        this.draw();
    }

    draw() {
        ctx.fillStyle = SNAKE_FOOD_COLOR;
        ctx.fillRect(this.x, this.y, GRID_CELL_SIZE, GRID_CELL_SIZE);
        ctx.fillStyle = FILL_COLOR;
    }

}

let gameField = new GameField(GRID_CELL_SIZE);
let snake = new Snake(ROWS, COLUMNS);
let food = new SnakeFood(ROWS, COLUMNS);

const gameScore = document.querySelector('.score_total');
const scoreAfterDeath = document.querySelector('.score');
const scoreAfterDeathContainer = document.querySelector('.current_score-container');
const retryButton = document.querySelector('.current_score-container>button');

let timerId,
    currentKey = undefined;

function drawAll() {
    gameField.draw();
    snake.draw();
    food.draw();
}

retryButton.onclick = () => {
    scoreAfterDeathContainer.style = '';
    gameField = new GameField(GRID_CELL_SIZE);
    snake = new Snake(ROWS, COLUMNS);
    food = new SnakeFood(ROWS, COLUMNS);
    theEnd = false;
    drawAll();
}

drawAll();

window.onkeydown = e => {
    const KEY = e.key;
    if (currentKey !== KEY) {
        currentKey = KEY;
        snake.init(KEY, food);
    }
}