const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i');

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert('Você Perdeu!! Clique em OK para reiniciar...');
    location.reload();
}

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const getDistance = (x1, y1, x2, y2) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const findNextMove = () => {
    let possibleMoves = [
        { x: 0, y: -1, key: "ArrowUp" },
        { x: 0, y: 1, key: "ArrowDown" },
        { x: -1, y: 0, key: "ArrowLeft" },
        { x: 1, y: 0, key: "ArrowRight" }
    ];

    let bestMove = possibleMoves[0];
    let bestDistance = getDistance(snakeX + bestMove.x, snakeY + bestMove.y, foodX, foodY);

    for (let move of possibleMoves) {
        let newX = snakeX + move.x;
        let newY = snakeY + move.y;
        let distance = getDistance(newX, newY, foodX, foodY);

        // Verificar se o movimento não faz a cobra bater nas bordas ou no próprio corpo
        if (newX > 0 && newX <= 30 && newY > 0 && newY <= 30 && distance < bestDistance) {
            let collision = false;
            for (let segment of snakeBody) {
                if (segment[0] === newX && segment[1] === newY) {
                    collision = true;
                    break;
                }
            }
            if (!collision) {
                bestMove = move;
                bestDistance = distance;
            }
        }
    }

    return bestMove;
}

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem('high-score', highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    let nextMove = findNextMove();
    snakeX += nextMove.x;
    snakeY += nextMove.y;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;

        if (i != 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener('keyup', changeDirection);
