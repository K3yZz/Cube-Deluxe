import * as UI from './UI.js';
import * as skilltree from './skilltree.js';
import * as playerMod from './player.js';
import * as enemyMod from './enemy.js';
import * as intervalMod from './interval.js';
import * as collision from './collision.js';
import * as textEffects from './textEffects.js';

let backgroundCanvas;
function loadBackgroundCanvas() {
    backgroundCanvas = document.createElement('canvas');

    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;

    backgroundCanvas.style.position = 'absolute';
    backgroundCanvas.style.zIndex = '0';
    backgroundCanvas.style.backgroundColor = 'rgb(8, 8, 8)';

    function loadBackgroundEffect() {
        const ctx = backgroundCanvas.getContext('2d');
        const stars = [];
    
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * backgroundCanvas.width,
                y: Math.random() * backgroundCanvas.height,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.5,
            });
        }
    
        function drawStars() {
            ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
            stars.forEach(star => {
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(drawStars);
        }
        drawStars();
    }

    loadBackgroundEffect();

    document.body.appendChild(backgroundCanvas);
    return backgroundCanvas;
}
//*load backdrop
skilltree.loadDeathOverlay();
loadBackgroundCanvas();

//*its space and time
export const spaceTime = {
    ranOnce: false,
    paused: false,
    offTab: false,
    skillTreeOpen: false,
};

//*woah its only run once!
function runOnce() {
    if(!spaceTime.ranOnce) {
        enemyMod.spawnEnemy('square', "red", 1, 50, 3);
        intervalMod.startIntervals();
        playerMod.scaleBackground();
        spaceTime.ranOnce = true;
    }
}

let gameLoopId;
//*run game loop
function gameLoop() {
    if (!spaceTime.paused || spaceTime.offTab) {
        runOnce();
        playerMod.drawPlayer();
        playerMod.drawPlayerHealthBar();
        playerMod.drawTimer();
        enemyMod.moveEnemy();
        enemyMod.moveMoneyItems();
        collision.checkCollision();
        collision.checkCollisionWithMoney();
    }
    gameLoopId = requestAnimationFrame(gameLoop);
}

export function startGame() {
    cancelAnimationFrame(gameLoopId);
    clearTimeout(playerMod.scaleTimeoutId);
    intervalMod.stopIntervals();

    spaceTime.paused = false;
    spaceTime.ranOnce = false;
    spaceTime.skillTreeOpen = false;

    document.body.style.overflow = 'hidden';
    document.body.style.cursor = 'none';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    const skillTreeCanvas = document.getElementById("skillTreeCanvas");
    skillTreeCanvas.style.zIndex = "-999";
    skillTreeCanvas.style.cursor = "none";
    skillTreeCanvas.style.pointerEvents = "none";
    const deathOverlay = document.getElementById("deathOverlay");
    deathOverlay.style.zIndex = "-999";
    deathOverlay.style.cursor = "none";
    deathOverlay.style.pointerEvents = "none";

    playerMod.playerStats.health = playerMod.playerStats.maxHealth;
    playerMod.playerStats.moneyThisRun = 0;
    playerMod.playerStats.healthDecreaseInt = 0.01;
    playerMod.player.time = 0;
    enemyMod.enemy.length = 0;
    enemyMod.moneyItem.length = 0;

    UI.editBox("delete", UI.startButton);
    UI.editBox("delete", UI.toSkillTreeButton);
    UI.editBox("delete", UI.againButton);
    UI.editBox("delete", UI.earningsBox);
    UI.editBox("delete", UI.moneyBox);
    UI.editBox("delete", UI.tipBox);
    gameLoop();
}

startGame();

document.addEventListener("keydown", (e) => {
  if (e.key === "y") {
    playerMod.playerStats.health = 0;
  }
});
