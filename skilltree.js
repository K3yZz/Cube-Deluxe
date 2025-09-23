import { spaceTime } from "./main.js";
import { player, playerStats } from "./player.js";
import { animateText } from "./textEffects.js";
import * as UI from "./UI.js";

const canvas = UI.loadCanvas({ id: 'skillTreeCanvas', zIndex: '-999', pointerEvents: 'none', backgroundColor: 'rgba(21, 29, 58, 1)' });
const ctx = canvas.getContext("2d");

const skills = [
  {
    name: "Vampire",
    pos: [0, 0],
    cost: 1,
    maxAbtainable: 1,
    amountAbtained: 0,
    description: "Siphon health like a vampire.",
    drawLinesTo: ["Damage Increase", "Vampirism Boost"],
    icon: "./assets/vampireIconSkill.png",
    hoveringOverSkill: false,
    unlocked: true,
    costInflation: null,
  },
  {
    name: "Damage Increase",
    pos: [0, -300],
    cost: 5,
    maxAbtainable: 4,
    amountAbtained: 0,
    description: "Deal +1 damage",
    drawLinesTo: ["More Attack Speed", "More Health", "More Money", "Damage Increase II"],
    icon: "./assets/attackIconSkill.png",
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 2.33,
  },
  {
    name: "More Attack Speed",
    pos: [-200, -500],
    cost: 10,
    maxAbtainable: 5,
    amountAbtained: 0,
    description: "Increase Attack Speed",
    drawLinesTo: ["More Attack Speed II"],
    icon: "null",
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 2.33,
  },
  {
    name: "More Attack Speed II",
    pos: [-200, -800],
    cost: 500,
    maxAbtainable: 4,
    amountAbtained: 0,
    description: "Increase Attack Speed even more",
    icon: "null",
    drawLinesTo: [""],
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 3.5,
  },
  {
    name: "More Health",
    pos: [200, -500],
    cost: 20,
    maxAbtainable: 5,
    amountAbtained: 0,
    description: "Increases max health",
    drawLinesTo: ["Slow Damage Taken"],
    icon: "./assets/healthIconSkill.png",
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 2.33,
  },
  {
    name: "Slow Damage Taken",
    pos: [200, -800],
    cost: 1500,
    maxAbtainable: 3,
    amountAbtained: 0,
    description: "Slows down the rate of damage taken by 10%",
    drawLinesTo: [""],
    icon: "./assets/timeIconSkill.png",
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 3,
  },
  {
    name: "More Money",
    pos: [-200, -300],
    cost: 25,
    maxAbtainable: 5,
    amountAbtained: 0,
    description: "Gain more money from enemies",
    drawLinesTo: ["Magnetic"],
    icon: "./assets/moneyIconSkill.png",
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 3.33,
  },
  {
    name: "Damage Increase II",
    pos: [200, -300],
    cost: 135,
    maxAbtainable: 5,
    amountAbtained: 0,
    description: "Deal even more damage",
    drawLinesTo: ["Size Boost"],
    icon: "./assets/attackIconSkill.png",
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 3.5,
  },
  {
    name: "Size Boost",
    pos: [500, -300],
    cost: 15000,
    maxAbtainable: 3,
    amountAbtained: 0,
    description: "Increase player size by 10%",
    drawLinesTo: [""],
    icon: "./assets/sizeIconSkill.png",
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 3.66,
  },
  {
    name: "Magnetic",
    pos: [-500, -300],
    cost: 7500,
    maxAbtainable: 1,
    amountAbtained: 0,
    description: "Attracts money towards you",
    drawLinesTo: [""],
    icon: "./assets/magnetIconSkill.png",
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: null,
  },
  {
    name: "Vampirism Boost",
    pos: [0, 300],
    cost: 500,
    maxAbtainable: 3,
    amountAbtained: 0,
    description: "Increases the amount healed from Vampire by 10%",
    drawLinesTo: [""],
    icon: "./assets/vampireIconSkill.png",
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 3.66,
  },
  {
    name: "???",
    pos: [0, -1000],
    cost: 1000,
    maxAbtainable: 0,
    amountAbtained: 0,
    description: "????",
    drawLinesTo: [""],
    icon: "null",
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 999999,
  },
];

export let position = [player.centerX, player.centerY];
let previous_position = [0, 0];
let drag_position = [0, 0];
let dragging = false;

let deathOverlay;
export function loadDeathOverlay() {
    deathOverlay = document.createElement('canvas');
    deathOverlay.width = window.innerWidth;
    deathOverlay.height = window.innerHeight;
    deathOverlay.style.position = "absolute";

    deathOverlay.style.zIndex = '-999'; //5

    deathOverlay.id = 'deathOverlay';
    
    deathOverlay.style.pointerEvents = 'none';

    deathOverlay.style.backgroundColor = "transparent";

    function drawScanlines() {
        const ctx = deathOverlay.getContext('2d');

        const lineHeight = 2;
        const lineSpacing = 2;

        for (let y = 0; y < window.innerHeight; y += (lineHeight + lineSpacing)) {
            ctx.fillStyle = 'rgba(11, 200, 233, 0.28)';
            ctx.fillRect(0, y, window.innerWidth, lineHeight);
        }
    }

    drawScanlines();
    window.addEventListener('resize', drawScanlines);

    document.body.appendChild(deathOverlay);
    return deathOverlay;
}

export function drawSkillTree() {
  const skillTreeCanvas = document.getElementById("skillTreeCanvas");
  skillTreeCanvas.style.zIndex = "3";
  skillTreeCanvas.style.cursor = "auto";
  skillTreeCanvas.style.pointerEvents = "auto";
  spaceTime.skillTreeOpen = true;
  
  UI.editBox("create", UI.startButton);
  UI.editBox("create", UI.moneyBox);
  UI.editBox("delete", UI.toSkillTreeButton);
  UI.editBox("delete", UI.againButton);
  UI.editBox("delete", UI.earningsBox);
  UI.editBox("delete", UI.tipBox);

  const deathOverlay = document.getElementById("deathOverlay");
    deathOverlay.style.zIndex = "-999";
    deathOverlay.style.cursor = "none";
    deathOverlay.style.pointerEvents = "none";

  UI.moneyBox.innerHTML = `
    <p style="font-size: 18px; margin: 5px 0 0 0;">Money</p>
    <div style="display: flex; align-items: center; justify-content: center;">
      <p id="moneyDisplay" style="font-size: 14px; margin: 0;">${playerStats.money}</p>
    </div>
  `;

  setTimeout(() => {
    const iconCanvas = document.getElementById("moneyIcon");
    if (iconCanvas) {
      import("./enemy.js").then(({ drawMoney }) => {
        drawMoney(12, 12, iconCanvas.getContext("2d"));
      });
    }
  }, 0);

  draw();
}

export function drawDeathOverlay() {
  const deathOverlay = document.getElementById("deathOverlay");
  deathOverlay.style.zIndex = "5";
  deathOverlay.style.cursor = "auto";
  deathOverlay.style.pointerEvents = "auto";
  UI.editBox("create", UI.toSkillTreeButton);
  UI.editBox("create", UI.againButton);
  UI.editBox("create", UI.earningsBox);
  UI.editBox("create", UI.tipBox);
  
  UI.tipBox.innerText = randomTipGenerator();
  let earnings = playerStats.moneyThisRun;
  if (playerStats.moneyThisRun === 0) {
  earnings = "Nothing...";
  } else if (playerStats.moneyThisRun >= 1000) {
    earnings = playerStats.moneyThisRun.toLocaleString();
  }

UI.earningsBox.innerHTML = `
  <p id="earnedText" style="font-size: 24px; margin-top: 12px; position: relative;">You Earned</p>
  <div style="display: flex; align-items: center; justify-content: center;">
    <span id="earningsAmount" style="font-size: 16px; margin: 10px 0;">${earnings}</span>
  </div>
`;

if (playerStats.moneyThisRun === 0) {
  let earningsAmount = document.getElementById("earningsAmount");
  earningsAmount.style.color = "rgba(255, 40, 40, 1)";
} 

const el = document.getElementById("earnedText");
animateText(el, { wavy: true, rainbow: true });

setTimeout(() => {
  const iconCanvas = document.getElementById("earningsMoneyIcon");
  if (iconCanvas) {
    import("./enemy.js").then(({ drawMoney }) => {
      drawMoney(12, 12, iconCanvas.getContext("2d"));
    });
  }
}, 0);

  let opacity = 0;
  deathOverlay.style.opacity = opacity;

  const interval = setInterval(() => {
    if (opacity < 1) {
      opacity += 0.02;
      if (opacity > 1) opacity = 1;
      deathOverlay.style.opacity = opacity;
    } else {
      clearInterval(interval);
    }
  }, 16);
};

function randomTipGenerator() {
  const tips = [
    'Tip: You can drag the skill tree around!',
    'Tip: "git gud" - Hornet',
    'Tip: Vampire was free',
    "Tip: you're poor...",
    'Tip: WASD to move the skill tree',
    'Tip: Pressing Y lets you leave the match',
    'Tip: yesnt',
  ];
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
}

function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  ctx.translate(position[0], position[1]);
  drawSkills();

  requestAnimationFrame(draw);
}

const bgCanvas = UI.loadCanvas({
  id: 'skillTreeBackground',
  zIndex: '-999',
  pointerEvents: 'none',
});
bgCanvas.style.imageRendering = 'pixelated';

const bgCtx = bgCanvas.getContext('2d');

let offset = 0;

function preRenderBackground() {
  const lineSpacing = 80;
  const waveAmplitude = 40;
  const waveFrequency = 0.05;
  const lineThickness = 16;

  bgCtx.fillStyle = 'rgb(18, 16, 50)';
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  bgCtx.fillStyle = 'rgb(60, 60, 160)';

  for (let y = -bgCanvas.height; y < bgCanvas.height; y += lineSpacing) {
    for (let x = 0; x <= bgCanvas.width; x += 4) {
      const wave = Math.sin(x * waveFrequency + offset) * waveAmplitude;
      const px = Math.round(x);
      const py = Math.round(y + x * 0.5 + wave);
      bgCtx.fillRect(px, py, 4, lineThickness);
    }
  }
}

function drawBackground() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(bgCanvas, 0, 0);

  offset += 0.02;
  preRenderBackground();
}

function drawSkills() {
  let hovering = false;

  for (const skill of skills) {
    if (!skill.unlocked) continue;

    drawSkillConnections(skill);
    drawSkillBox(skill);

    if (skill.hoveringOverSkill && spaceTime.skillTreeOpen) {
      updateSkillDescriptionBox(skill);
      hovering = true;
    }

    handleSkillPurchase(skill);
  }

  if (!hovering) hideSkillDescriptionBox();
}

function drawSkillConnections(skill) {
  ctx.shadowBlur = 0;
  for (const to of skill.drawLinesTo) {
    const to_skill = skills.find((s) => s.name === to);
    if (to_skill && to_skill.unlocked) {
      ctx.beginPath();
      ctx.moveTo(skill.pos[0], skill.pos[1]);
      ctx.lineTo(to_skill.pos[0], to_skill.pos[1]);
      ctx.strokeStyle = "rgb(255,255,255)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
}

function drawSkillBox(skill) {
  const icon = new Image();
  icon.src = skill.icon;

  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(skill.pos[0] - 32, skill.pos[1] - 32, 64, 64);
  ctx.drawImage(icon, skill.pos[0] - 32, skill.pos[1] - 32, 64, 64);

  let borderStrokeColor = "rgb(255, 255, 255)";
  let affordable = skill.cost <= playerStats.money;
  let boughtAll = skill.amountAbtained === skill.maxAbtainable;

  if (boughtAll) borderStrokeColor = "rgb(243, 240, 43)";
  else if (affordable) borderStrokeColor = "rgb(64, 240, 143)";

  ctx.strokeStyle = borderStrokeColor;
  ctx.shadowColor = borderStrokeColor;
  ctx.shadowBlur = 2;
  ctx.strokeRect(skill.pos[0] - 32, skill.pos[1] - 32, 64, 64);
}

function updateSkillDescriptionBox(skill) {
  let box = document.getElementById("skillDescriptionBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "skillDescriptionBox";
    document.body.appendChild(box);

    Object.assign(box.style, {
      position: "absolute",
      top: "50%",
      left: "20px",
      transform: "translateY(-50%)",
      width: "250px",
      padding: "15px",
      backgroundColor: "rgba(10,10,10,0.9)",
      color: "white",
      border: "1px solid white",
      fontFamily: "font, sans-serif",
      fontSize: "14px",
      lineHeight: "18px",
      borderRadius: "8px",
      boxShadow: "0 0 5px rgba(255,255,255,0.5)",
      zIndex: "1000",
    });
  }

  let borderStrokeColor = skill.amountAbtained === skill.maxAbtainable ? "rgb(243, 240, 43)" : skill.cost <= playerStats.money ? "rgb(64, 240, 143)" : "rgb(255, 255, 255)";

  box.innerHTML = `
    <h3 style="margin:0; text-align:center; font-size:18px;">${skill.name}</h3>
    <hr style="border:1px solid white; margin:8px 0;">
    <p>${skill.description}</p>
    <p>Cost: ${skill.cost}$</p>
    <p style="color:${borderStrokeColor};">${skill.amountAbtained}/${skill.maxAbtainable}</p>
  `;
  box.style.display = "block";
}

function hideSkillDescriptionBox() {
  const box = document.getElementById("skillDescriptionBox");
  if (box) box.style.display = "none";
}

function handleSkillPurchase(skill) {
  if (!skill.hoveringOverSkill || !dragging) return;

  if (typeof window.skillPurchaseCooldown === "undefined") window.skillPurchaseCooldown = false;

  if (playerStats.money >= skill.cost && skill.amountAbtained < skill.maxAbtainable && !window.skillPurchaseCooldown) {
    window.skillPurchaseCooldown = true;
    setTimeout(() => {
      window.skillPurchaseCooldown = false;
    }, 500);

    unlockSkillEffects(skill);

    skill.amountAbtained = Math.min(skill.amountAbtained + 1, skill.maxAbtainable);
    playerStats.money -= skill.cost;
    skill.cost = Math.floor(skill.cost * skill.costInflation);

    document.getElementById("moneyDisplay").innerText = playerStats.money;
  }
}

function unlockSkillEffects(skill) {
  let skillToUnlock;
  switch (skill.name) {
    case "Vampire":
      skillToUnlock = skills.find(s => s.name === "Damage Increase");
      skillToUnlock.unlocked = true;
      playerStats.vampire = true;
      break;
      //! aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    case "Damage Increase":
      const unlockList = ["More Attack Speed", "More Health", "More Money", "Damage Increase II"];
      unlockList.forEach(name => {
        const s = skills.find(sk => sk.name === name);
        if (s.name == "Damage Increase II") {
          if (skill.amountAbtained === 3) s.unlocked = true;
        } else if (s.name == "More Money") {
          if (skill.amountAbtained === 2) s.unlocked = true;
        } else if (s.name == "More Health" || s.name == "More Attack Speed") {
          s.unlocked = true;
        }
      });
      playerStats.strength += 1;
      break;
      case "Damage Increase II":
      skillToUnlock = skills.find(s => s.name === "Size Boost");
      if (skill.amountAbtained === 4) skillToUnlock.unlocked = true;
      playerStats.strength += 1;
      break;
      //todo aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    case "More Attack Speed":
      playerStats.attackSpeed -= 0.1;
      playerStats.attackSpeed.toFixed(1);
      player.backgroundOpacityChangeSpeed = 100 * playerStats.attackSpeed;
      skillToUnlock = skills.find(s => s.name === "More Attack Speed II");
      if (skill.amountAbtained == 4) skillToUnlock.unlocked = true;
      break;
    case "More Attack Speed II":
      playerStats.attackSpeed -= 0.1;
      playerStats.attackSpeed.toFixed(1);
      player.backgroundOpacityChangeSpeed = 100 * playerStats.attackSpeed;
      break;
      //^ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    case "More Health":
      skillToUnlock = skills.find(s => s.name === "Slow Damage Taken");
      if (skill.amountAbtained == 4) skillToUnlock.unlocked = true;
      playerStats.maxHealth += 5;
      break;
      //* aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    case "Slow Damage Taken":
      playerStats.damageTickRate *= 0.9;
      break;
      //? aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    case "More Money":
      skillToUnlock = skills.find(s => s.name === "Magnetic");
      if (skill.amountAbtained == 4) skillToUnlock.unlocked = true;
      playerStats.moneyMultiplier += 0.2;
      playerStats.moneyMultiplier.toFixed(1);
      break;
      //~ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      //& aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    case "Magnetic":
      playerStats.magnet = true;
      break;
      //! aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    case "Vampirism Boost":
      playerStats.vamprismBuff += 0.1;
      break;
      //todo aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    case "Size Boost":
      player.size *= 1.1;
      player.size.toFixed(1);
      break;
      //^ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    case "???":
      break;
  }
}
//for movable area
document.addEventListener("mousedown", (e) => {
  dragging = true;
  previous_position[0] = position[0];
  previous_position[1] = position[1];
  drag_position[0] = e.clientX;
  drag_position[1] = e.clientY;
});

document.addEventListener("mousemove", (e) => {
  if (dragging) {
    position[0] = previous_position[0] - (drag_position[0] - e.clientX);
    position[1] = previous_position[1] - (drag_position[1] - e.clientY);
  }
});

document.addEventListener("mouseup", (e) => {
  dragging = false;
});

//for skill tooltip
document.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const transformedX = mouseX - position[0];
  const transformedY = mouseY - position[1];

  skills.forEach((skill) => {
    const left = skill.pos[0] - 32;
    const right = skill.pos[0] + 32;
    const top = skill.pos[1] - 32;
    const bottom = skill.pos[1] + 32;
    const onHitBox =
      transformedX >= left &&
      transformedX <= right &&
      transformedY >= top &&
      transformedY <= bottom;

    if (onHitBox) {
      skill.hoveringOverSkill = true;
    } else {
      skill.hoveringOverSkill = false;
    }
  });
});

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function updateKeyboardMovement() {
  const speed = 8;
  if (keys["w"]) position[1] += speed;
  if (keys["s"]) position[1] -= speed;
  if (keys["a"]) position[0] += speed;
  if (keys["d"]) position[0] -= speed;
  requestAnimationFrame(updateKeyboardMovement);
}
updateKeyboardMovement();