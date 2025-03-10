import { drawEnemy, moveEnemy, enemy, moneyItem } from "./enemy.js";
import { drawPlayer, drawPlayerHealthBar, drawTimer, player, playerStats, scaleBackground, scaleTimeoutId } from "./player.js";
import { checkCollision, checkCollisionWithCashCashMoney } from "./collision.js";
import { startIntervals, stopIntervals } from "./interval.js";
import { loadBackgroundCanvas } from "./UI.js";
import { editButton } from "./skilltree.js";
import { drawDisplay, drawDisplayMoney } from "./loadMoneyIcon.js";

//*load backdrop
loadBackgroundCanvas();
drawDisplay();

//*bah its space and time!

export const spaceTime = {
    ranOnce: false,
    paused: false,
};

//*woah its only run once!
function runOnce() {
    if(!spaceTime.ranOnce) {
        drawEnemy('square', 1, 50);
        startIntervals();
        scaleBackground();
        spaceTime.ranOnce = true;
    }
}

let gameLoopId;
//*run game loop
function gameLoop() {
    if (!spaceTime.paused) {
        runOnce();
        drawPlayer();
        drawPlayerHealthBar();
        drawTimer();
        moveEnemy();
        checkCollision();
        checkCollisionWithCashCashMoney();
    }
    gameLoopId = requestAnimationFrame(gameLoop);
}

export function startGame() {
    cancelAnimationFrame(gameLoopId);
    clearTimeout(scaleTimeoutId);
    stopIntervals();

    spaceTime.paused = false;
    spaceTime.ranOnce = false;

    document.body.style.overflow = 'hidden';
    document.body.style.cursor = 'none';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    const skillTreeCanvas = document.getElementById("skillTreeCanvas");
    skillTreeCanvas.style.zIndex = "-10";
    skillTreeCanvas.style.cursor = "none";
    skillTreeCanvas.style.pointerEvents = "none";

    playerStats.health = playerStats.maxHealth;
    player.time = 0;
    enemy.length = 0;
    moneyItem.length = 0;

    editButton("delete");
    gameLoop();
}

startGame();