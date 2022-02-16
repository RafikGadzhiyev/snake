const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const STROKE_COLOR = '#1A1A40'
const FILL_COLOR =  '#7A0BC0'
const SNAKE_FOOD_COLOR = '#FA58B6'

const GRID_CELL_SIZE = 50;
const ROWS = HEIGHT / GRID_CELL_SIZE;
const COLUMNS = WIDTH / GRID_CELL_SIZE;

const VALID_KEYS = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

ctx.strokeStyle = STROKE_COLOR;
ctx.fillStyle = FILL_COLOR;