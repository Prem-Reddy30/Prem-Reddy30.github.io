let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
const box = 20;
let snake, direction, food, score, game, playerName;

// Game history
function getHistory() {
    return JSON.parse(localStorage.getItem('snakeHistory') || '{}');
}
function setHistory(history) {
    localStorage.setItem('snakeHistory', JSON.stringify(history));
}
function updateHistory(newScore) {
    let history = getHistory();
    history.gamesPlayed = (history.gamesPlayed || 0) + 1;
    history.bestScore = Math.max(history.bestScore || 0, newScore);
    setHistory(history);
    document.getElementById('gamesPlayed').innerText = history.gamesPlayed;
    document.getElementById('bestScore').innerText = history.bestScore;
}
function loadHistory() {
    let history = getHistory();
    document.getElementById('gamesPlayed').innerText = history.gamesPlayed || 0;
    document.getElementById('bestScore').innerText = history.bestScore || 0;
}

function resetGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
    score = 0;
    document.getElementById('score').innerText = 'Score: 0';
}

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#0f0' : '#fff';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        updateHistory(score);
        setTimeout(() => {
            alert('Game Over! ' + playerName + ', your score: ' + score);
            document.getElementById('player-section').style.display = '';
            canvas.style.display = 'none';
            document.getElementById('score').style.display = 'none';
        }, 100);
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

document.addEventListener('keydown', event => {
    if (canvas.style.display === 'none') return;
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

document.getElementById('startGameBtn').onclick = function() {
    playerName = document.getElementById('playerName').value.trim() || 'Player';
    document.getElementById('player-section').style.display = 'none';
    canvas.style.display = '';
    document.getElementById('score').style.display = '';
    resetGame();
    if (game) clearInterval(game);
    game = setInterval(draw, 200);
};

window.onload = loadHistory; 