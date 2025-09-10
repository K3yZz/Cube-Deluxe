import { player } from "./player.js";
import { loadEnemyCanvas } from "./UI.js";

const canvas = loadEnemyCanvas();
const ctx = canvas.getContext("2d");

export let enemy = [];

export function drawEnemy(type, color, amount, size) {
  
  if (typeof color === "string" && color.toLowerCase() === "red") color = "rgba(255, 0, 0, 1)";
  if (typeof color === "string" && color.toLowerCase() === "purple") color = "rgba(128, 0, 128, 1)";

  //create enemy
  for (let i = 0; i < amount; i++) {
    enemy.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: size,
      type: type,
      health: size * 0.06,
      color: color,
      rotation: 0,
      hit: false,
    });
  }

  //draw enemy
  if (type === "square") {
    enemy.forEach((e) => {
      ctx.save();
      ctx.translate(e.x + e.size / 2, e.y + e.size / 2);
      ctx.rotate(e.rotation);
      ctx.translate(-e.x - e.size / 2, -e.y - e.size / 2);

      ctx.beginPath();
      ctx.rect(e.x, e.y, e.size + 10, e.size + 10);
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      //health display
      ctx.beginPath();
      ctx.rect(e.x + 5, e.y + 5, e.size, e.health / 0.06);
      ctx.fillStyle = e.color;
      let rgb = [255, 0, 0];
      if (typeof e.color === "string" && e.color.startsWith("rgba")) {
        rgb = e.color.match(/\d+/g).map(Number);
      }
      const secondColor = `rgba(${Math.max(rgb[0] - 5, 0)}, ${Math.min(rgb[1] + 31, 255)}, ${Math.min(rgb[2] + 31, 255)}, 0.8)`;
      ctx.shadowColor = secondColor; 
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.closePath();

      ctx.restore();
    });
  }
}

export function moveEnemy() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //vanish or spanish the cube
  enemy = enemy.filter(
    (e) => e.x <= canvas.width && e.x >= 0 && e.y <= canvas.height && e.y >= 0
  );

  //if the cube did its spanish move
  enemy.forEach((e) => {
    const centerX = player.centerX;
    const centerY = player.centerY;
    const speed = 0.2;

    if (!e.angle) {
      e.angle = Math.atan2(centerY - e.y, centerX - e.x);
    }

    e.x += Math.cos(e.angle) * speed;
    e.y += Math.sin(e.angle) * speed;

    e.rotation = (e.rotation || 0) + 0.001;
  });

  drawEnemy("square", 0, 0);

  moneyItem.forEach((drop) => {
    drawMoney(drop.x, drop.y);
  });
}

export let moneyItem = [];

export function enemyDropMoney(enemy) {
    const numDrops = Math.floor(Math.random() * 3) + 2;
  
    for (let i = 0; i < numDrops; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 20 + 1;
  
      const dropX = enemy.x + Math.cos(angle) * distance;
      const dropY = enemy.y + Math.sin(angle) * distance;
  
      moneyItem.push({ x: dropX, y: dropY });
    }
}

export function drawMoney(x, y, targetCtx = ctx) {
  targetCtx.save();
  targetCtx.beginPath();
  targetCtx.arc(x, y, 10, 0, Math.PI * 2);
  targetCtx.shadowColor = "rgba(255, 255, 0, 0.8)";
  targetCtx.shadowBlur = 20;
  targetCtx.fillStyle = "yellow";
  targetCtx.fill();
  targetCtx.closePath();
  targetCtx.restore();
}
