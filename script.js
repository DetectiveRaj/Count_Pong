const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 18;
const BALL_SPEED = 6;
const PADDLE_SPEED = 6;
const COMPUTER_SPEED = 5;

let collisionCount = 0;

// Player paddle (left)
const player = {
    x: 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

// Computer paddle (right)
const computer = {
    x: canvas.width - 20,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: BALL_SPEED,
    dy: BALL_SPEED,
    radius: BALL_SIZE
};

// Keyboard controls
const keys = {
    ArrowUp: false,
    ArrowDown: false
};

// Mouse control
let mouseY = canvas.height / 2;

// Event listeners
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = true;
    if (e.key === 'ArrowDown') keys.ArrowDown = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = false;
    if (e.key === 'ArrowDown') keys.ArrowDown = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle position (mouse or keyboard)
function updatePlayerPaddle() {
    // Keyboard control
    if (keys.ArrowUp) {
        player.y -= PADDLE_SPEED;
    }
    if (keys.ArrowDown) {
        player.y += PADDLE_SPEED;
    }

    // Mouse control (smoothly follow mouse)
    const targetY = mouseY - PADDLE_HEIGHT / 2;
    player.y += (targetY - player.y) * 0.1;

    // Boundary checking
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Update computer paddle (AI)
function updateComputerPaddle() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;

    if (computerCenter < ballCenter - 35) {
        computer.y += COMPUTER_SPEED;
    } else if (computerCenter > ballCenter + 35) {
        computer.y -= COMPUTER_SPEED;
    }

    // Boundary checking
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top and bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }
}

// Collision detection - Paddles
function checkPaddleCollision() {
    // Player paddle collision
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.radius;
        collisionCount++;
        // Add slight spin based on where ball hits paddle
        const deltaY = ball.y - (player.y + player.height / 2);
        ball.dy += deltaY * 0.05;
    }

    // Computer paddle collision
    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.radius;
        collisionCount++;
        // Add slight spin based on where ball hits paddle
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy += deltaY * 0.05;
    }
}

// Scoring and ball reset
function checkScore() {
    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() - 0.5);
}

// Drawing functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = '#00cc00';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawPlayerName() {
    ctx.save();
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.translate(player.x + player.width / 2, player.y - 15);
    ctx.fillText('Vishal Raj', 0, 0);
    ctx.restore();
}

function drawBall() {
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw collision count on ball
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(collisionCount, ball.x, ball.y);
}

function drawCenterLine() {
    ctx.strokeStyle = '#ffffff';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawCenterLine();
    drawPaddle(player);
    drawPlayerName();
    drawPaddle(computer);
    drawBall();
}

function updateUI() {
    document.getElementById('playerScore').textContent = player.score;
    document.getElementById('computerScore').textContent = computer.score;
    document.getElementById('collisionCount').textContent = collisionCount;
}

// Main game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    checkPaddleCollision();
    checkScore();
    draw();
    updateUI();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();