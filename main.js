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
    const ctx = backgroundCanvas.getContext('2d');

    const simplex = new SimplexNoise();
    const stars = [];
    const shootingStars = [];

    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * backgroundCanvas.width,
            y: Math.random() * backgroundCanvas.height,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.5,
            delta: (Math.random() * 0.01 + 0.002) * (Math.random() < 0.5 ? -1 : 1),
            colorOffset: Math.random() * 55
        });
    }

    const nebulaCanvas = document.createElement('canvas');
    nebulaCanvas.width = backgroundCanvas.width;
    nebulaCanvas.height = backgroundCanvas.height;
    const nebCtx = nebulaCanvas.getContext('2d');
    const nebImage = nebCtx.createImageData(nebulaCanvas.width, nebulaCanvas.height);
    const nebData = nebImage.data;
    const scale = 0.005;

    for (let y = 0; y < nebulaCanvas.height; y++) {
        for (let x = 0; x < nebulaCanvas.width; x++) {
            const value = simplex.noise2D(x * scale, y * scale);
            const alpha = (value + 1) / 2 * 0.085; //0.03 maybe
            const index = (y * nebulaCanvas.width + x) * 4;
            nebData[index] = 200;
            nebData[index + 1] = 200;
            nebData[index + 2] = 255;
            nebData[index + 3] = alpha * 255;
        }
    }
    nebCtx.putImageData(nebImage, 0, 0);

    function maybeCreateShootingStar() {
        if (Math.random() < 0.003) {
            const angle = Math.PI / 4;
            const speed = Math.random() * 10 + 5;
            shootingStars.push({
                x: Math.random() * backgroundCanvas.width,
                y: Math.random() * backgroundCanvas.height / 2,
                length: Math.random() * 150 + 50,
                speed: speed,
                dx: Math.cos(angle) * speed,
                dy: Math.sin(angle) * speed
            });
        }
    }

    function drawShootingStars() {
        shootingStars.forEach((star, index) => {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x - star.length * Math.cos(Math.PI / 4), star.y - star.length * Math.sin(Math.PI / 4));
            ctx.stroke();

            star.x += star.dx;
            star.y += star.dy;

            if (star.x > backgroundCanvas.width || star.y > backgroundCanvas.height) {
                shootingStars.splice(index, 1);
            }
        });
    }

    function drawStars() {
        ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        ctx.drawImage(nebulaCanvas, 0, 0);

        stars.forEach(star => {
            star.opacity += star.delta;
            if (star.opacity > 1) { star.opacity = 1; star.delta *= -1; }
            if (star.opacity < 0.3) { star.opacity = 0.3; star.delta *= -1; }

            star.x += 0.02;
            if (star.x > backgroundCanvas.width) star.x = 0;

            ctx.fillStyle = `rgba(${200 + star.colorOffset}, ${200 + star.colorOffset}, 255, ${star.opacity})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        maybeCreateShootingStar();
        drawShootingStars();

        requestAnimationFrame(drawStars);
    }

    drawStars();
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
    gameSpeed: 1,
};

//*woah its only run once!
function runOnce() {
    if(!spaceTime.ranOnce) {
        enemyMod.spawnEnemy('square', "red", 1, 50, 3, [1, 1]);
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
        collision.ccPlayerToEnemy();
        collision.ccPlayerToMoney();
        collision.ccMoneyToMoney();
    }
    gameLoopId = requestAnimationFrame(gameLoop);
}

export function startGame() {
    cancelAnimationFrame(gameLoopId);
      cancelAnimationFrame(skilltree.drawSkillTreeAnimation);
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

window.addEventListener('DOMContentLoaded', () => {
startGame();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "y") {
    playerMod.playerStats.health = 0;
  }
});
