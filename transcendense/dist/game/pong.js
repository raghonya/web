"use strict";
function initializePongGame() {
    const canvas = document.getElementById('pongCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    const ctx = canvas.getContext('2d');
    const ASPECT_RATIO = 16 / 9;
    let ballRadius;
    let paddleWidth;
    let paddleHeight;
    let paddleSpeed;
    let ballX;
    let ballY;
    let ballSpeedX;
    let ballSpeedY;
    let leftPaddleY;
    let rightPaddleY;
    let leftPaddlescore = 0;
    let rightPaddlescore = 0;
    let initializeBallSide = "left";
    const activeKeys = {
        w: false,
        s: false,
        ArrowUp: false,
        ArrowDown: false
    };
    const handleMouseMove = (event) => {
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;
        const isInCanvas = (mouseX >= 0 && mouseX <= canvas.width &&
            mouseY >= 0 && mouseY <= canvas.height);
        if (isInCanvas && mouseX < canvas.width / 2) {
            const paddleCenter = leftPaddleY + paddleHeight / 2;
            if (mouseY < paddleCenter)
                leftPaddleY -= paddleSpeed;
            else if (mouseY > paddleCenter)
                leftPaddleY += paddleSpeed;
            if (leftPaddleY < 0)
                leftPaddleY = 0;
            if (leftPaddleY > canvas.height - paddleHeight)
                leftPaddleY = canvas.height - paddleHeight;
        }
    };
    const handleMouseDown = (event) => {
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;
        // Only respond if click is on the left side of the canvas
        if (mouseX >= 0 && mouseX < canvas.width / 2) {
            // Move paddle so its center aligns with the mouse Y
            leftPaddleY = mouseY - paddleHeight / 2;
            // Clamp within canvas
            if (leftPaddleY < 0)
                leftPaddleY = 0;
            if (leftPaddleY > canvas.height - paddleHeight) {
                leftPaddleY = canvas.height - paddleHeight;
            }
        }
    };
    const setupGame = () => {
        resizeCanvas();
        initializeBall(initializeBallSide);
        initializePaddles();
        // handleScore();
    };
    const resizeCanvas = () => {
        const isWideScreen = (window.innerWidth / window.innerHeight) > ASPECT_RATIO;
        if (isWideScreen) {
            canvas.height = Math.min((window.innerHeight - 100) * 0.8, 700);
            canvas.width = canvas.height * ASPECT_RATIO;
        }
        else {
            canvas.width = Math.min(window.innerWidth * 0.8, 1000);
            canvas.height = canvas.width / ASPECT_RATIO;
        }
        ballRadius = canvas.width * 0.01;
        paddleWidth = canvas.width * 0.015;
        paddleHeight = canvas.height * 0.15;
        paddleSpeed = canvas.height * 0.005;
    };
    const initializeBall = (side) => {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        const baseSpeed = canvas.width * 0.005;
        ballSpeedX = baseSpeed * (side == "right" ? 1 : -1);
        ballSpeedY = baseSpeed * (side == "right" ? 1 : -1);
    };
    const initializePaddles = () => {
        const centerPosition = (canvas.height - paddleHeight) / 2;
        leftPaddleY = centerPosition;
        rightPaddleY = centerPosition;
    };
    const handleKeyDown = (e) => {
        if (e.key in activeKeys) {
            activeKeys[e.key] = true;
        }
    };
    const handleKeyUp = (e) => {
        if (e.key in activeKeys) {
            activeKeys[e.key] = false;
        }
    };
    const updateGameState = () => {
        movePaddles();
        moveBall();
        checkCollisions();
        checkWinner();
    };
    const movePaddles = () => {
        if (activeKeys.w && leftPaddleY > 0) {
            leftPaddleY -= paddleSpeed;
        }
        if (activeKeys.s && leftPaddleY < canvas.height - paddleHeight) {
            leftPaddleY += paddleSpeed;
        }
        if (activeKeys.ArrowUp && rightPaddleY > 0) {
            rightPaddleY -= paddleSpeed;
        }
        if (activeKeys.ArrowDown && rightPaddleY < canvas.height - paddleHeight) {
            rightPaddleY += paddleSpeed;
        }
    };
    const moveBall = () => {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    };
    const checkCollisions = () => {
        checkWallCollision();
        checkPaddleCollision();
        checkScoreCondition();
    };
    const checkWinner = () => {
        if (leftPaddlescore == 10 || rightPaddlescore == 10) {
            alert(`Game Over! ${leftPaddlescore == 10 ? 'Left' : 'Right'} player wins!`);
            leftPaddlescore = 0;
            rightPaddlescore = 0;
            resetRound();
        }
    };
    const checkWallCollision = () => {
        1000;
        if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
    };
    const checkPaddleCollision = () => {
        if (ballX - ballRadius < paddleWidth &&
            ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
            handlePaddleHit('left');
        }
        if (ballX + ballRadius > canvas.width - paddleWidth &&
            ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
            handlePaddleHit('right');
        }
    };
    const handlePaddleHit = (side) => {
        const paddleY = side === 'left' ? leftPaddleY : rightPaddleY;
        const hitPosition = (ballY - (paddleY + paddleHeight / 2)) / (paddleHeight / 2);
        ballSpeedX = -ballSpeedX * 1.05;
        ballSpeedY = hitPosition * Math.abs(ballSpeedX);
    };
    const checkScoreCondition = () => {
        if (ballX - ballRadius < 0) {
            rightPaddlescore++;
            initializeBallSide = "right";
            resetRound();
            return;
        }
        if (ballX + ballRadius > canvas.width) {
            leftPaddlescore++;
            initializeBallSide = "left";
            resetRound();
        }
    };
    const resetRound = () => {
        initializeBall(initializeBallSide);
        initializePaddles();
    };
    const renderGame = () => {
        clearCanvas();
        drawCenterLine();
        drawPaddles();
        drawBall();
    };
    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    const drawCenterLine = () => {
        ctx.strokeStyle = '#fff';
        ctx.setLineDash([canvas.height * 0.02, canvas.height * 0.02]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    };
    const drawPaddles = () => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    };
    const drawBall = () => {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    };
    const gameLoop = () => {
        if (location.hash != "#game")
            return;
        updateGameState();
        renderGame();
        handleScore();
        setTimeout(() => {
            requestAnimationFrame(gameLoop); // Adds ~10ms delay
        }, 10); // 10ms sleep
    };
    const handleScore = () => {
        const player1ScoreElement = document.getElementById('player1-score');
        const player2ScoreElement = document.getElementById('player2-score');
        if (player1ScoreElement && player2ScoreElement) {
            player1ScoreElement.textContent = leftPaddlescore.toString();
            player2ScoreElement.textContent = rightPaddlescore.toString();
        }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    // document.addEventListener('keydown', gameLoop, { once: true });
    document.addEventListener("pointermove", handleMouseMove);
    // document.addEventListener("mousedown", handleMouseDown);
    setupGame();
    renderGame();
    let sec = 2;
    const startTimer = (onComplete) => {
        const intervalId = setInterval(() => {
            sec -= 1;
            if (sec <= 0) {
                clearInterval(intervalId);
                onComplete();
            }
        }, 1000);
    };
    // Start the timer, then launch the game
    startTimer(() => {
        gameLoop();
    });
}
// function handleResize() {
// 	setupCanvas();
// 	draw();
// }
// window.addEventListener('resize', handleResize);
// window.addEventListener('orientationchange', handleResize);
