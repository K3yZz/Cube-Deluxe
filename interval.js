import { drawEnemy } from "./enemy.js";
import { playerStats, player } from "./player.js";
import { spaceTime } from "./main.js";
import { drawSkillTree, position } from "./skilltree.js";

let timerInterval, healthInterval, smallSquaresInterval;

export function startIntervals() {
    //timer
    timerInterval = setInterval(() => {
        player.time += 1;
    }, 1000);

    //decrease player health
    healthInterval = setInterval(() => {
        playerStats.health -= 0.01;

        if (playerStats.health <= 0) {
            console.log("player health is 0");
            drawSkillTree();
            position[0] = player.centerX;
            position[1] = player.centerY;
            spaceTime.paused = true;
            stopIntervals();
        }
    }, 10);

    //spawn small squares
    smallSquaresInterval = setInterval(() => {
        drawEnemy("square", 1, 50);
    }, 1000);

    //spawn medium squares
    smallSquaresInterval = setInterval(() => {
        drawEnemy("square", 1, 100);
    }, 1500);
}

export function stopIntervals() {
    clearInterval(timerInterval);
    clearInterval(healthInterval);
    clearInterval(smallSquaresInterval);
}