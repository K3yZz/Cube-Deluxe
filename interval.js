import { spawnEnemy, scaleDamage } from "./enemy.js";
import { playerStats, player } from "./player.js";
import { spaceTime } from "./main.js";
import { drawDeathOverlay, position } from "./skilltree.js";
import { loadDramaticText } from "./textEffects.js";

let timerTimeout, healthTimeout, squaresTimeout, triangleTimeout, hexagonTimeout, bossSquareTimeout, checkIfTabInterval, scaleDamageInterval;

export function startIntervals() {    
    function timerTick() {
        if (!spaceTime.offTab) {
            player.time += 1;
        }
        timerTimeout = setTimeout(timerTick, 1000 * spaceTime.gameSpeed);
    }

    function healthTick() {
        if (!spaceTime.offTab) {
            playerStats.health -= playerStats.healthDecreaseInt;

            if (playerStats.health <= 0) {
                drawDeathOverlay();
                position[0] = player.centerX;
                position[1] = player.centerY;
                spaceTime.paused = true;
                stopIntervals();
                return;
            }
        }
        healthTimeout = setTimeout(healthTick, playerStats.damageTickRate * spaceTime.gameSpeed);
    }

    function squaresTick() {
        if (!spaceTime.offTab) {
            if (player.time < 45) {
                spawnEnemy("square", "red", 1, 50, 3, [1, 2]);

                setTimeout(() => {
                    spawnEnemy("square", "red", 1, 100, 6, [3, 5]);
                }, 500 * spaceTime.gameSpeed);

            } else if (player.time >= 45 && player.time < 150) {

                setTimeout(() => {
                    spawnEnemy("square", "red", 1, 100, 12, [6, 10]);
                }, 500 * spaceTime.gameSpeed);

            }
        }
        squaresTimeout = setTimeout(squaresTick, 1000 * spaceTime.gameSpeed);
    }

    function triangleTick() {
        if (!spaceTime.offTab) {
            if (player.time >= 45) spawnEnemy("triangle", "purple", 1, 50, 15, [11, 15]);
            if (player.time >= 70) spawnEnemy("triangle", "gold", 1, 100, 25, [16, 25]);
        }
        triangleTimeout = setTimeout(triangleTick, 2000 * spaceTime.gameSpeed);
    }

    function hexagonTick() {
        if (!spaceTime.offTab) {
            if (player.time >= 120) spawnEnemy("hexagon", "blue", 1, 100, 40, [26, 30]);
        }
        hexagonTimeout = setTimeout(hexagonTick, 3000 * spaceTime.gameSpeed);
    }

    function bossSquareTick() {
        if (!spaceTime.offTab) {
            if (player.time === 30) {
                loadDramaticText("Big Cube");
                spawnEnemy("square", "purple", 1, 300, 20, [20, 40], true);
            }
            if (player.time === 60) {
                loadDramaticText("Panic Triangle");
                spawnEnemy("triangle", "gold", 1, 500, 50, [40, 60], true);
            }
            if (player.time === 90) {
                loadDramaticText("Hexagonal Horror");
                spawnEnemy("hexagon", "blue", 1, 400, 100, [100, 100], true);
            }
        }
        bossSquareTimeout = setTimeout(bossSquareTick, 1000 * spaceTime.gameSpeed);
    }

    // start all ticks
    timerTick();
    healthTick();
    squaresTick();
    triangleTick();
    hexagonTick();
    bossSquareTick();
}

export function stopIntervals() {
    clearTimeout(timerTimeout);
    clearTimeout(healthTimeout);
    clearTimeout(squaresTimeout);
    clearTimeout(triangleTimeout);
    clearTimeout(bossSquareTimeout);
}

scaleDamageInterval = setInterval (() => {
    if (!spaceTime.offTab) {
    scaleDamage();
    }
}, 1000);

checkIfTabInterval = setInterval(() => {
    spaceTime.offTab = document.visibilityState !== "visible";
}, 1000);