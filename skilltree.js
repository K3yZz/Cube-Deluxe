import { loadSkillTreeCanvas } from "./UI.js";
import { startGame } from "./main.js";
import { player, playerStats } from "./player.js";

const canvas = loadSkillTreeCanvas();
const ctx = canvas.getContext("2d");

const myFont = new FontFace("font", "url('assets/font.ttf')");

myFont.load().then((loadedFont) => {
  document.fonts.add(loadedFont);
});

const skills = [
  {
    name: "Vampire",
    pos: [0, 0],
    cost: 1,
    maxAbtainable: 1,
    amountAbtained: 0,
    description: "Siphon health like a vampire.",
    drawLinesTo: ["Damage Increase", "Vampirism Boost"],
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
    drawLinesTo: [""],
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 2.33,
  },
  {
    name: "More Health",
    pos: [200, -500],
    cost: 20,
    maxAbtainable: 5,
    amountAbtained: 0,
    description: "Increases max health",
    drawLinesTo: ["Slow Damage Taken"],
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 2.33,
  },
  {
    name: "Slow Damage Taken",
    pos: [200, -800],
    cost: 75,
    maxAbtainable: 3,
    amountAbtained: 0,
    description: "Slows down the rate of damage taken by 10%",
    drawLinesTo: [""],
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 3,
  },
  {
    name: "More Money",
    pos: [-200, -300],
    cost: 25,
    maxAbtainable: 10,
    amountAbtained: 0,
    description: "Gain more money from enemies",
    drawLinesTo: ["Magnetic"],
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 3.33,
  },
  {
    name: "Damage Increase II",
    pos: [200, -300],
    cost: 100,
    maxAbtainable: 5,
    amountAbtained: 0,
    description: "Deal even more damage",
    drawLinesTo: [""],
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 3.5,
  },
  {
    name: "Magnetic",
    pos: [-500, -300],
    cost: 0,
    maxAbtainable: 1,
    amountAbtained: 0,
    description: "Attracts money towards you",
    drawLinesTo: ["Close enough?"],
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: null,
  },
  {
    name: "Close enough?",
    pos: [-800, -500],
    cost: 0,
    maxAbtainable: 1,
    amountAbtained: 0,
    description: "Gives money on hit",
    drawLinesTo: [""],
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
    hoveringOverSkill: false,
    unlocked: false,
    costInflation: 999999,
  },
];

export let position = [player.centerX, player.centerY];
let previous_position = [0, 0];
let drag_position = [0, 0];
let dragging = false;

export function drawSkillTree() {
  const skillTreeCanvas = document.getElementById("skillTreeCanvas");
  skillTreeCanvas.style.zIndex = "3";
  skillTreeCanvas.style.cursor = "auto";
  skillTreeCanvas.style.pointerEvents = "auto";
  editBox("create", startButton);
  editBox("create", moneyBox);
  editBox("delete", toSkillTreeButton);
  editBox("delete", againButton);
  editBox("delete", earningsBox);
  editBox("delete", tipBox);

  const deathOverlay = document.getElementById("deathOverlay");
    deathOverlay.style.zIndex = "-999";
    deathOverlay.style.cursor = "none";
    deathOverlay.style.pointerEvents = "none";

  moneyBox.innerHTML = `
    <p style="font-size: 18px; margin: 5px 0 0 0;">Money</p>
    <div style="display: flex; align-items: center; justify-content: center;">
      <p id="moneyDisplay" style="font-size: 14px; margin: 0;">${playerStats.money}</p>
      <canvas id="moneyIcon" width="24" height="24" style="margin-left: 8px; vertical-align: middle;"></canvas>
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
  editBox("create", toSkillTreeButton);
  editBox("create", againButton);
  editBox("create", earningsBox);
  editBox("create", tipBox);

earningsBox.innerHTML = `
  <p style="font-size: 24px; margin-top: 10px;">You Earned</p>
  <div style="display: flex; align-items: center; justify-content: center;">
    <span id="earningsAmount" style="font-size: 16px; margin: 10px 0;">
      ${playerStats.moneyThisRun}
    </span>
    <canvas id="earningsMoneyIcon" width="24" height="24" style="margin-left: 8px; vertical-align: middle;"></canvas>
  </div>
`;

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
  ];
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
}

const draw = () => {
  window.requestAnimationFrame(draw);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";

  const tileSize = 64;
  const cols = Math.ceil(ctx.canvas.width / tileSize) + 1;
  const rows = Math.ceil(ctx.canvas.height / tileSize) + 1;
  const offsetX = -(position[0] % tileSize);
  const offsetY = -(position[1] % tileSize);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "rgba(33, 73, 132, 0.2)" : "rgba(22, 48, 86, 0.2)";
      ctx.fillRect(offsetX + x * tileSize, offsetY + y * tileSize, tileSize, tileSize);
    }
  }

  ctx.translate(position[0], position[1]);

  for (const skill of skills) {
    if (skill.unlocked) {
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

      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(skill.pos[0] - 32, skill.pos[1] - 32, 64, 64);

      let borderStrokeColor = "rgb(255, 255, 255)";
      let affordable = skill.cost <= playerStats.money;
      let boughtAll = skill.amountAbtained === skill.maxAbtainable;

      if (boughtAll) borderStrokeColor = "rgb(243, 240, 43)";
      else if (affordable) borderStrokeColor = "rgb(64, 240, 143)";

      ctx.strokeStyle = borderStrokeColor;
      ctx.shadowColor = borderStrokeColor;
      ctx.shadowBlur = 4;
      ctx.strokeRect(skill.pos[0] - 32, skill.pos[1] - 32, 64, 64);

      if (skill.hoveringOverSkill) {
        ctx.shadowColor = "rgb(255,255,255)";
        ctx.fillStyle = "rgb(1,1,1)";
        ctx.fillRect(skill.pos[0] - 150, skill.pos[1] - 250, 300, 200);

        ctx.textAlign = "center";
        let fontSize = 24;
        ctx.font = `${fontSize}px font`;
        let maxWidth = 280;

        while (ctx.measureText(skill.name).width > maxWidth && fontSize > 10) {
          fontSize -= 1;
          ctx.font = `${fontSize}px font`;
        }
        ctx.fillStyle = "white";
        ctx.fillText(skill.name, skill.pos[0], skill.pos[1] - 215);

        ctx.beginPath();
        ctx.moveTo(skill.pos[0] - 150, skill.pos[1] - 200);
        ctx.lineTo(skill.pos[0] + 150, skill.pos[1] - 200);
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.stroke();

        ctx.font = "14px font";
        ctx.fillStyle = "white";
        const descLines = [];
        const words = skill.description.split(" ");
        let line = "";
        const maxDescWidth = 280;
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          if (ctx.measureText(testLine).width > maxDescWidth && line !== "") {
            descLines.push(line.trim());
            line = words[i] + " ";
          } else {
            line = testLine;
          }
        }
        if (line) descLines.push(line.trim());
        descLines.forEach((l, idx) => {
          ctx.fillText(l, skill.pos[0], skill.pos[1] - 170 + idx * 18);
        });

        ctx.fillText("Cost: " + skill.cost + "$", skill.pos[0], skill.pos[1] - 100);
        ctx.fillStyle = borderStrokeColor;
        ctx.fillText(skill.amountAbtained + "/" + skill.maxAbtainable, skill.pos[0], skill.pos[1] - 60);
      }

      if (skill.hoveringOverSkill && dragging) {
        if (typeof window.skillPurchaseCooldown === "undefined") {
          window.skillPurchaseCooldown = false;
        }

        if (playerStats.money >= skill.cost && skill.amountAbtained < skill.maxAbtainable && !window.skillPurchaseCooldown) {
          let skillToUnlock;
          window.skillPurchaseCooldown = true;
          setTimeout(() => {
            window.skillPurchaseCooldown = false;
          }, 500);

          switch (skill.name) {
            case "Vampire":
              skillToUnlock = skills.find(s => s.name === "Damage Increase");
              skillToUnlock.unlocked = true;
              playerStats.vampire = true;
              break;
            case "Damage Increase":
              skillToUnlock = ["More Attack Speed", "More Health", "More Money", "Damage Increase II"];
              skillToUnlock.forEach(name => {
                const s = skills.find(sk => sk.name === name);
                if (s.name == "Damage Increase II") {
                  if (skill.amountAbtained === 4) s.unlocked = true;
                } else if (s.name == "More Money") {
                  if (skill.amountAbtained === 2) s.unlocked = true;
                } else if (s.name == "More Health" || s.name == "More Attack Speed") {
                  s.unlocked = true;
                }
              });
              playerStats.strength += 1;
              break;
            case "More Attack Speed":
              playerStats.attackSpeed -= 0.1;
              break;
            case "More Health":
              skillToUnlock = skills.find(s => s.name === "Slow Damage Taken");
              if (skill.amountAbtained == 4) skillToUnlock.unlocked = true;
              playerStats.maxHealth += 5;
              break;
            case "Slow Damage Taken":
              playerStats.damageTickRate *= 0.9;
              break;
            case "More Money":
              skillToUnlock = skills.find(s => s.name === "Magnetic");
              if (skill.amountAbtained == 10) skillToUnlock.unlocked = true;
              playerStats.moneyMultiplier += 0.1;
              break;
            case "Damage Increase II":
              playerStats.strength += 1;
              break;
            case "Magnetic":
              skillToUnlock = skills.find(s => s.name === "Close enough?");
              skillToUnlock.unlocked = true;
              playerStats.magnet = true;
              break;
            case "Close enough?":
              playerStats.moneyOnHit = true;
              break;
            case "Vampirism Boost":
              playerStats.vamprismBuff += 0.1;
              break;
            case "???":
              break;
          }

          skill.amountAbtained = Math.min(skill.amountAbtained + 1, skill.maxAbtainable);
          playerStats.money -= skill.cost;
          skill.cost = Math.floor(skill.cost * skill.costInflation);

          document.getElementById("moneyDisplay").innerText = playerStats.money;
        }
      }
    }
  }
};


export const startButton = document.createElement("button");
Object.assign(startButton.style, {
  width: "150px",
  height: "70px",
  position: "absolute",
  right: "20px",
  bottom: "20px",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  color: "white",
  fontFamily: "font, arial",
  fontSize: "16px",
  textAlign: "center",
  zIndex: -10,
});
startButton.innerText = "Deploy";
startButton.onclick = startGame;

export const toSkillTreeButton = document.createElement("button");
Object.assign(toSkillTreeButton.style, {
  width: "150px",
  height: "70px",
  position: "absolute",
  left: "40%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  border: "1px solid white",
  boxShadow: "0px 0px 5px white",
  backgroundColor: "rgba(11, 200, 233, 0.75)",
  color: "white",
  fontFamily: "font, arial",
  fontSize: "16px",
  textAlign: "center",
  zIndex: -10,
});
toSkillTreeButton.innerText = "Upgrade";
toSkillTreeButton.onclick = drawSkillTree;

export const againButton = document.createElement("button");
Object.assign(againButton.style, {
  width: "150px",
  height: "70px",
  position: "absolute",
  left: "60%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  border: "1px solid white",
  boxShadow: "0px 0px 5px white",
  backgroundColor: "rgba(11, 200, 233, 0.75)",
  color: "white",
  fontFamily: "font, arial",
  fontSize: "16px",
  textAlign: "center",
  zIndex: -10,
});
againButton.innerText = "Deploy";
againButton.onclick = startGame;

export const earningsBox = document.createElement("div");
Object.assign(earningsBox.style, {
  width: "300px",
  height: "140px",
  position: "absolute",
  left: "50%",
  top: "30%",
  transform: "translate(-50%, -50%)",
  border: "1px solid white",
  boxShadow: "0px 0px 5px white",
  backgroundColor: "rgba(11, 200, 233, 0.75)",
  color: "white",
  fontFamily: "font, arial",
  fontSize: "16px",
  textAlign: "center",
  zIndex: -10,
});

export const tipBox = document.createElement("div");
Object.assign(tipBox.style, {
  width: "300px",
  height: "40px",
  position: "absolute",
  display: "flex",
  left: "50%",
  top: "90%",
  transform: "translate(-50%, -50%)",
  border: "1px solid white",
  boxShadow: "0px 0px 5px white",
  backgroundColor: "rgba(11, 200, 233, 0.75)",
  color: "white",
  fontFamily: "font, arial",
  fontSize: "16px",
  textAlign: "center",
  alignItems: "center",
  justifyContent: "center",
  zIndex: -10,
});
tipBox.innerText = randomTipGenerator();

export const moneyBox = document.createElement("div");
Object.assign(moneyBox.style, {
  width: "140px",
  height: "50px",
  position: "absolute",
  right: "20px",
  top: "20px",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  color: "white",
  fontFamily: "font, arial",
  fontSize: "16px",
  textAlign: "center",
  zIndex: -10,
});

export function editBox(type, box) {
  if (!document.body.contains(box)) {
    document.body.appendChild(box);
  }

  if (type === "create") {
    box.style.zIndex = 10;
  } else if (type === "delete") {
    box.style.zIndex = -10;
  }
};

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