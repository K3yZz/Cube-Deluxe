import { drawEnemy, moveEnemy, enemy, moneyItem } from "./enemy.js";
import { drawPlayer, drawPlayerHealthBar, drawTimer, player, playerStats, scaleBackground, scaleTimeoutId } from "./player.js";
import { checkCollision, checkCollisionWithMoney } from "./collision.js";
import { startIntervals, stopIntervals } from "./interval.js";
import { loadBackgroundCanvas, loadDeathOverlay } from "./UI.js";
import { editBox, startButton, toSkillTreeButton, againButton, earningsBox, moneyBox, tipBox } from "./skilltree.js";

//*load backdrop
loadBackgroundCanvas();
loadDeathOverlay();

//*its space and time
export const spaceTime = {
    ranOnce: false,
    paused: false,
    offTab: false,
};

//*woah its only run once!
function runOnce() {
    if(!spaceTime.ranOnce) {
        drawEnemy('square', "red", 1, 50, 3);
        startIntervals();
        scaleBackground();
        spaceTime.ranOnce = true;
    }
}

let gameLoopId;
//*run game loop
function gameLoop() {
    if (!spaceTime.paused || spaceTime.offTab) {
        runOnce();
        drawPlayer();
        drawPlayerHealthBar();
        drawTimer();
        moveEnemy();
        checkCollision();
        checkCollisionWithMoney();
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
    skillTreeCanvas.style.zIndex = "-999";
    skillTreeCanvas.style.cursor = "none";
    skillTreeCanvas.style.pointerEvents = "none";
    const deathOverlay = document.getElementById("deathOverlay");
    deathOverlay.style.zIndex = "-999";
    deathOverlay.style.cursor = "none";
    deathOverlay.style.pointerEvents = "none";

    playerStats.health = playerStats.maxHealth;
    playerStats.moneyThisRun = 0;
    player.time = 0;
    enemy.length = 0;
    moneyItem.length = 0;

    editBox("delete", startButton);
    editBox("delete", toSkillTreeButton);
    editBox("delete", againButton);
    editBox("delete", earningsBox);
    editBox("delete", moneyBox);
    editBox("delete", tipBox);
    gameLoop();
}

startGame();

document.addEventListener("keydown", (e) => {
  if (e.key === "y") {
    playerStats.health = 0;
  }
});
