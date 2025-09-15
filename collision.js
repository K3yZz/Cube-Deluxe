import { enemy, enemyDropMoney, moneyItem } from "./enemy.js";
import { player, playerStats } from "./player.js";

export function checkCollision() {
  for (let i = enemy.length - 1; i >= 0; i--) {
    const playerLeft = player.x - player.size / 2;
    const playerRight = player.x + player.size / 2;
    const playerTop = player.y - player.size / 2;
    const playerBottom = player.y + player.size / 2;

    const enemyLeft = enemy[i].x;
    const enemyRight = enemy[i].x + enemy[i].size;
    const enemyTop = enemy[i].y;
    const enemyBottom = enemy[i].y + enemy[i].size;

    const isColliding =
      playerRight > enemyLeft &&
      playerLeft < enemyRight &&
      playerBottom > enemyTop &&
      playerTop < enemyBottom;

    if (isColliding && player.backgroundScalingOpacity >= 1) {
      const now = performance.now();

      if (
        !enemy[i].lastHitTime ||
        now - enemy[i].lastHitTime >= playerStats.attackSpeed * 1000
      ) {
        enemy[i].health -= playerStats.strength;
        enemy[i].lastHitTime = now;
      }

      if (enemy[i].health <= 0) {
        enemyDropMoney(enemy[i]);
        enemy.splice(i, 1);

        if (playerStats.vampire) {
          playerStats.health = Math.min(
            playerStats.health + 0.5 * playerStats.vamprismBuff,
            playerStats.maxHealth
          );
        }
      }
    }
  }
}

export function checkCollisionWithMoney() {
    for (let i = 0; i < moneyItem.length; i++) {
        const dx = player.x - moneyItem[i].x;
        const dy = player.y - moneyItem[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance < player.size / 2 + 10) {
          moneyItem.splice(i, 1);
          playerStats.money += Math.ceil(1 * playerStats.moneyMultiplier);
          playerStats.moneyThisRun += Math.ceil(1 * playerStats.moneyMultiplier);
        }
    }
}
