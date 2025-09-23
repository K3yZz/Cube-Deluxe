import { spawnEnemy } from "./enemy.js";
import { playerStats, player } from "./player.js";
import { spaceTime } from "./main.js";
import { drawDeathOverlay, position } from "./skilltree.js";
import { loadDramaticText } from "./textEffects.js";

let timerInterval, healthInterval, squaresInterval, triangleInterval, bossSquareInterval, checkIfTabInterval, scaleDamageInterval;

export function startIntervals(gameSpeed = 1) {
    gameSpeed = Math.max(gameSpeed, 0.1);

    //timer
    timerInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            player.time += 1;
        }
    }, 1000 * gameSpeed);

    //check if the tab is open
    checkIfTabInterval = setInterval(() => {
        if (document.visibilityState === "visible") {
            spaceTime.offTab = false;
        } else {
            spaceTime.offTab = true;
        }
    }, 1000 * gameSpeed);

    //scale damage based off amount of enemies
    scaleDamageInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            scaleDamage();
        }
    }, 1000 * gameSpeed);

    //base decrease player health
    healthInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            playerStats.health -= playerStats.healthDecreaseInt;

            if (playerStats.health <= 0) {
                console.log("player health is 0");
                drawDeathOverlay();
                position[0] = player.centerX;
                position[1] = player.centerY;
                spaceTime.paused = true;
                stopIntervals();
            }
        }
    }, playerStats.damageTickRate * gameSpeed);

    //spawn enemys
    squaresInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            if (player.time < 45) {
                spawnEnemy("square", "red", 1, 50, 3);
                setTimeout(() => {
                    spawnEnemy("square", "red", 1, 100, 6);
                }, 500 * gameSpeed);
            }
            if (player.time >= 45 && player.time < 150) {
                setTimeout(() => {
                    spawnEnemy("square", "red", 1, 100, 12);
                }, 500 * gameSpeed);
            }
        }
    }, 1000 * gameSpeed);

    triangleInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            if (player.time >= 45) {
                spawnEnemy("triangle", "purple", 1, 50, 15);
            }
            if (player.time >= 70) {
                spawnEnemy("triangle", "gold", 1, 100, 25);
            } 
        }   
    }, 2000 * gameSpeed);

    bossSquareInterval = setInterval(() => {
        //first boss
        if (!spaceTime.offTab) {
            if (player.time === 30) {
                loadDramaticText("Big Cube");
                spawnEnemy("square", "purple", 1, 300, 20, true);
            }
            if (player.time === 60) {
                loadDramaticText("Panic Triangle");
                spawnEnemy("triangle", "gold", 1, 500, 50, true);
            }
        }
    }, 1000 * gameSpeed);
}

export function stopIntervals() {
    clearInterval(timerInterval);
    clearInterval(healthInterval);
    clearInterval(squaresInterval);
    clearInterval(triangleInterval);
    clearInterval(bossSquareInterval);
}