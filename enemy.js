import { player, playerStats } from "./player.js";
import { loadEnemyCanvas } from "./UI.js";

const canvas = loadEnemyCanvas();
const ctx = canvas.getContext("2d");

export let enemy = [];

export function spawnEnemy(type, color, amount, size, maxHealth, boss) {
  if (typeof color ==="string" && color.toLowerCase() === "gold") color = "rgba(255, 166, 0, 1)";
  if (typeof color === "string" && color.toLowerCase() === "red") color = "rgba(255, 0, 0, 1)";
  if (typeof color === "string" && color.toLowerCase() === "purple") color = "rgba(128, 0, 128, 1)";

  for (let i = 0; i < amount; i++) {
    enemy.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size,
      type,
      health: maxHealth,
      maxHealth,
      color,
      rotation: 0,
      lastHitTime: 0,
      boss: boss || false,
    });
  }
}

export function drawEnemy(e) {
  ctx.save();
  ctx.translate(e.x + e.size / 2, e.y + e.size / 2);
  ctx.rotate(e.rotation);
  ctx.translate(-e.x - e.size / 2, -e.y - e.size / 2);

  if (e.type === "square") {
    ctx.beginPath();
    ctx.rect(e.x, e.y, e.size + 10, e.size + 10);
    ctx.strokeStyle = e.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    const healthPercent = e.health / e.maxHealth;
    const innerHeight = e.size * healthPercent;

    ctx.beginPath();
    ctx.rect(e.x + 5, e.y + (e.size - innerHeight) + 5, e.size, innerHeight);
    ctx.fillStyle = e.color;

    ctx.shadowColor = e.color;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
  }

  if (e.type === "triangle") {
  const fullSize = e.size + 10;
  const fullHeight = fullSize * Math.sqrt(3) / 2;
  const cx = e.x + fullSize / 2;
  const centroidY = e.y + (2 / 3) * fullHeight;
  const padding = 8;
  const healthPercent = Math.max(0, Math.min(1, e.health / e.maxHealth));
  const innerSize = Math.max(0, fullSize - padding * 2) * healthPercent;
  const innerHalf = innerSize / 2;
  const innerHeight = innerSize * Math.sqrt(3) / 2;
  const innerTopY = centroidY - (2 / 3) * innerHeight;
  const innerBaseY = innerTopY + innerHeight;

  if (innerSize > 0) {
    ctx.beginPath();
    ctx.moveTo(cx, innerTopY);
    ctx.lineTo(cx - innerHalf, innerBaseY);
    ctx.lineTo(cx + innerHalf, innerBaseY);
    ctx.closePath();
    ctx.shadowColor = e.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = e.color;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }

  ctx.beginPath();
  ctx.moveTo(cx, e.y);
  ctx.lineTo(e.x, e.y + fullHeight);
  ctx.lineTo(e.x + fullSize, e.y + fullHeight);
  ctx.closePath();
  ctx.strokeStyle = e.color;
  ctx.lineWidth = 2;
  ctx.stroke();
}



  ctx.restore();
}

export function moveEnemy() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  enemy = enemy.filter(
    (e) => e.x <= canvas.width && e.x >= 0 && e.y <= canvas.height && e.y >= 0
  );

  enemy.forEach((e) => {
    const centerX = player.centerX;
    const centerY = player.centerY;
    const speed = 0.2;

    if (!e.angle) {
      e.angle = Math.atan2(centerY - e.y, centerX - e.x);
    }

    e.x += Math.cos(e.angle) * speed;
    e.y += Math.sin(e.angle) * speed;
    e.rotation += 0.001;

    drawEnemy(e);
  });

  moneyItem.forEach((drop) => {
    drawMoney(drop.x, drop.y);
  });
}

export let moneyItem = [];

// MODIFIED TEST PLEASE VVV
export function enemyDropMoney(enemy) {
    const numDrops = Math.floor(Math.random() * (enemy.maxHealth / 1.5)) + (enemy.maxHealth - 2);
  
    for (let i = 0; i < numDrops; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 200;
  
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

export function moveMoneyItems() {
  if (!playerStats.magnet) return;
  const speed = 1;
  moneyItem.forEach((drop) => {
    const dx = player.x - drop.x;
    const dy = player.y - drop.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      drop.x += (dx / dist) * speed;
      drop.y += (dy / dist) * speed;
    }
  });
}


// scale damage based on enemy count
export function scaleDamage() {
  playerStats.healthDecreaseInt = 1 + (enemy.length * 0.025);
  if (enemy.some(e => e.boss)) {
    playerStats.healthDecreaseInt += 0.05;
  }
}