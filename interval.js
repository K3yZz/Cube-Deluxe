import { drawEnemy } from "./enemy.js";
import { playerStats, player } from "./player.js";
import { spaceTime } from "./main.js";
import { drawDeathOverlay, position } from "./skilltree.js";

let timerInterval, healthInterval, smallSquaresInterval, mediumSquaresInterval, bossSquare1Interval, checkIfTabInterval;

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

    //decrease player health
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

    //spawn small squares
    smallSquaresInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            drawEnemy("square", "red", 1, 50);
        }
    }, 1000);

    //spawn medium squares
    mediumSquaresInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            drawEnemy("square", "red", 1, 100);
        }
    }, 1500);

    bossSquare1Interval = setInterval(() => {
        if (!spaceTime.offTab && player.time === 30) {
            drawEnemy("square", "purple", 1, 200);
        }
    }, 100);
}

export function stopIntervals() {
    clearInterval(timerInterval);
    clearInterval(healthInterval);
    clearInterval(smallSquaresInterval);
    clearInterval(mediumSquaresInterval);
    clearInterval(bossSquare1Interval);
}