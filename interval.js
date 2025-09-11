import { drawEnemy } from "./enemy.js";
import { playerStats, player } from "./player.js";
import { spaceTime } from "./main.js";
import { drawDeathOverlay, position } from "./skilltree.js";
import { loadDramaticText } from "./UI.js";

let timerInterval, healthInterval, smallSquaresInterval, mediumSquaresInterval, bossSquareInterval, checkIfTabInterval;

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
            drawEnemy("square", "red", 1, 50, 3);
        }
    }, 1000);

    //spawn medium squares
    mediumSquaresInterval = setInterval(() => {
        if (!spaceTime.offTab) {
            drawEnemy("square", "red", 1, 100, 6);
        }
    }, 1500);

    bossSquareInterval = setInterval(() => {
        //first boss
        if (!spaceTime.offTab && player.time === 30) {
            loadDramaticText("Big Cube");
            drawEnemy("square", "purple", 1, 300, 20);
        }
    }, 1000);
}

export function stopIntervals() {
    clearInterval(timerInterval);
    clearInterval(healthInterval);
    clearInterval(smallSquaresInterval);
    clearInterval(mediumSquaresInterval);
    clearInterval(bossSquareInterval);
}