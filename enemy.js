import { player } from "./player.js";
import { loadEnemyCanvas } from "./UI.js";

const canvas = loadEnemyCanvas();
const ctx = canvas.getContext("2d");

export let enemy = [];

export function drawEnemy(type, amount, size) {
  //create enemy
  for (let i = 0; i < amount; i++) {
    enemy.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: size,
      type: type,
      health: size * 0.06,
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
      ctx.strokeStyle = "rgb(255, 0, 0)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      //health display
      ctx.beginPath();
      ctx.rect(e.x + 5, e.y + 5, e.size, e.health / 0.06);
      ctx.fillStyle = "rgb(255, 0, 0)";
      ctx.shadowColor = "rgba(250, 31, 31, 0.8)";
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
    loadMoney(drop.x, drop.y);
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

function loadMoney(x, y) {
  ctx.save();
  ctx.strokeStyle = "rgb(177, 65, 177)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgb(177, 65, 177)";
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 10, y - 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 10, y);
  ctx.lineTo(x + 20, y - 10);
  ctx.stroke();

  ctx.restore();
}