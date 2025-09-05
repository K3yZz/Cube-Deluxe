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
    cost: 0,
    maxAbtainable: 1,
    amountAbtained: 0,
    description: "Siphon health like a vampire.",
    drawLinesTo: ["More Damage"],
    hoveringOverSkill: false,
    unlocked: true,
  },
  {
    name: "More Damage",
    pos: [0, -300],
    cost: 10,
    maxAbtainable: 4,
    amountAbtained: 0,
    description: "Deal +1 damage",
    drawLinesTo: ["More Atk Speed", "More Health"],
    hoveringOverSkill: false,
    unlocked: false,
  },
  {
    name: "More Atk Speed",
    pos: [-200, -500],
    cost: 0,
    maxAbtainable: 0,
    amountAbtained: 0,
    description: "Increase Attack Speed",
    drawLinesTo: [""],
    hoveringOverSkill: false,
    unlocked: false,
  },
  {
    name: "More Health",
    pos: [200, -500],
    cost: 0,
    maxAbtainable: 0,
    amountAbtained: 0,
    description: "-",
    drawLinesTo: [""],
    hoveringOverSkill: false,
    unlocked: false,
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
  editButton("create", startButton);
  editButton("delete", toSkillTreeButton);
  editButton("delete", againButton);

  const deathOverlay = document.getElementById("deathOverlay");
    deathOverlay.style.zIndex = "-999";
    deathOverlay.style.cursor = "none";
    deathOverlay.style.pointerEvents = "none";
  draw();
}

export function drawDeathOverlay() {
  const deathOverlay = document.getElementById("deathOverlay");
  deathOverlay.style.zIndex = "5";
  deathOverlay.style.cursor = "auto";
  deathOverlay.style.pointerEvents = "auto";
  editButton("create", toSkillTreeButton);
  editButton("create", againButton);

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

const draw = () => {
  window.requestAnimationFrame(draw);
  ctx.clearRect(-1000, -1000, 10000, 10000);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(position[0], position[1]);

  for (const skill of skills) {
    if (skill.unlocked) {
      //draw lines
      for (const to of skill.drawLinesTo) {
        const to_skill = skills.find((skill) => skill.name == to);

        if (to_skill && to_skill.unlocked) {
          ctx.beginPath();
          ctx.moveTo(skill.pos[0], skill.pos[1]);
          ctx.lineTo(to_skill.pos[0], to_skill.pos[1]);
          ctx.strokeStyle = "rgb(255 ,255 ,255)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

      //draw square
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(skill.pos[0] - 32, skill.pos[1] - 32, 64, 64);

      //draws border
      let borderStrokeColor = "rgb(255, 255, 255)";
      let affordable = skill.cost <= playerStats.purpleMoney;
      let boughtAll = skill.amountAbtained === skill.maxAbtainable;

      if (boughtAll) {
        borderStrokeColor = "rgb(243, 240, 43)";
      } else if (affordable) {
        borderStrokeColor = "rgb(64, 240, 143)";
      } else {
        borderStrokeColor = "rgb(255, 255, 255)";
      }

      ctx.strokeStyle = borderStrokeColor;
      ctx.shadowColor = borderStrokeColor;
      ctx.shadowBlur = 4;
      ctx.strokeRect(skill.pos[0] - 32, skill.pos[1] - 32, 64, 64);

      if (skill.hoveringOverSkill) {

        ctx.shadowColor = "rgb(255, 255, 255)";

        //draw box
        ctx.fillStyle = "rgb(1, 1, 1)";
        ctx.fillRect(skill.pos[0] - 150, skill.pos[1] - 250, 300, 200);

        //draw name
        ctx.font = "24px font";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(skill.name, skill.pos[0], skill.pos[1] - 215);

        //draw line seperating name and discription
        ctx.beginPath();
        ctx.moveTo(skill.pos[0] - 150, skill.pos[1] - 250 + 50);
        ctx.lineTo(skill.pos[0] + 150, skill.pos[1] - 250 + 50);
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.stroke();

        //draw discription
        ctx.font = "14px font";
        ctx.fillText(skill.description, skill.pos[0], skill.pos[1] - 170);

        //draw cost
        ctx.fillText(
          "Cost: " + skill.cost + "$",
          skill.pos[0],
          skill.pos[1] - 100
        );

        //draw max bought
        ctx.fillStyle = borderStrokeColor;
        ctx.fillText(
          skill.amountAbtained + "/" + skill.maxAbtainable,
          skill.pos[0],
          skill.pos[1] - 60
        );
      }
      if (skill.hoveringOverSkill && dragging) {
        if (playerStats.purpleMoney >= skill.cost && skill.amountAbtained < skill.maxAbtainable) {
            let skillToUnlock;
            switch (skill.name) {
                case "Vampire":
                    //alert
                    console.log("buying skill");
                    //increase cost and amount
                    skill.amountAbtained += 1;
                    //unlock a skill
                    skillToUnlock = skills.find(s => s.name === "More Damage");
                    skillToUnlock.unlocked = true;
                    //the action when bought
                    playerStats.vampire = true;
                    break;
                case "More Damage":
                    //alert
                    console.log("buying skill");
                    //increase cost and amount
                    skill.amountAbtained += 1;
                    playerStats.purpleMoney -= skill.cost;
                    //unlock a skill
                    skillToUnlock = ["More Atk Speed", "More Health"];
                    skillToUnlock.forEach(name => {
                      const skillToUnlock = skills.find(s => s.name === name);
                      if (skillToUnlock) skillToUnlock.unlocked = true;
                    });
                    //the action when bought
                    playerStats.strength + 1;
            }
            document.getElementById("moneyDisplay").innerText = playerStats.purpleMoney;
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
  border: "1px solid white",
  boxShadow: "0px 0px 10px white",
  backgroundColor: "black",
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

export function editButton(type, button) {
  if (!document.body.contains(button)) {
    document.body.appendChild(button);
  }

  if (type === "create") {
    button.style.zIndex = 10;
  } else if (type === "delete") {
    button.style.zIndex = -10;
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
