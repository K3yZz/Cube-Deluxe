import { enemy, enemyDropMoney, moneyItem } from "./enemy.js";
import { player, playerStats } from "./player.js";

export function checkCollision() {
  for (let i = 0; i < enemy.length; i++) {
    const dx = player.x - (enemy[i].x + enemy[i].size / 2);
    const dy = player.y - (enemy[i].y + enemy[i].size / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.size / 2 + enemy[i].size / 2) {
      if (player.backgroundScalingOpacity >= 1) {
        if (!enemy[i].hit) {
          enemy[i].health -= playerStats.strength;
          enemy[i].hit = true;
          setTimeout(() => {
            enemy[i].hit = false;
          }, playerStats.attackSpeed * 1000);
        }
      }

      if (enemy[i].health <= 0) {
        enemy.splice(i, 1);
        enemyDropMoney(enemy[i]);
        if (playerStats.vampire) {
          playerStats.health = Math.min(playerStats.health + 1, playerStats.maxHealth);
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
          playerStats.money += 1 * playerStats.moneyMultiplier;
          playerStats.moneyThisRun += 1 * playerStats.moneyMultiplier;
        }
    }
}
