import { spawnEnemy } from "./enemy.js";
import { playerStats, player } from "./player.js";
import { spaceTime } from "./main.js";
import { drawDeathOverlay, position } from "./skilltree.js";
import { loadDramaticText } from "./UI.js";

let timerInterval, healthInterval, squaresInterval, triangleInterval, bossSquareInterval, checkIfTabInterval, scaleDamageInterval;

export function startIntervals() {
    //timer
    timerInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            player.time += 1;
        }
    }, 1000);

    //check if the tab is open
    checkIfTabInterval = setInterval(() => {
        if (document.visibilityState === "visible") {
            spaceTime.offTab = false;
        } else {
            spaceTime.offTab = true;
        }
    }, 1000);

    //^ scale damage based off amount of enemies
    // scaleDamageInterval = setInterval(() => {
    //     if (!spaceTime.offTab) {
    //         scaleDamage();
    //     }
    // }, 1000);

    //base decrease player health
    healthInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            playerStats.health -= 0.01;

            if (playerStats.health <= 0) {
                console.log("player health is 0");
                drawDeathOverlay();
                position[0] = player.centerX;
                position[1] = player.centerY;
                spaceTime.paused = true;
                stopIntervals();
            }
        }
    }, playerStats.damageTickRate);

    //spawn enemys
    squaresInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            spawnEnemy("square", "red", 1, 50, 3);
            setTimeout(() => {
                spawnEnemy("square", "red", 1, 100, 6);
            }, 500);
        }
    }, 1000);

    triangleInterval = setInterval(() => {
        if (!spaceTime.offTab && player.time >= 45) {
            spawnEnemy("triangle", "purple", 3, 50, 15);
        }
    }, 2000);

    bossSquareInterval = setInterval(() => {
        //first boss
        if (!spaceTime.offTab && player.time === 30) {
            loadDramaticText("Big Cube");
            spawnEnemy("square", "purple", 1, 300, 20);
        }
    }, 1000);
}

export function stopIntervals() {
    clearInterval(timerInterval);
    clearInterval(healthInterval);
    clearInterval(squaresInterval);
    clearInterval(triangleInterval);
    clearInterval(bossSquareInterval);
}