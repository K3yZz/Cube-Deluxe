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
    cost: 25,
    maxAbtainable: 4,
    amountAbtained: 0,
    description: "Deal +1 damage",
    drawLinesTo: ["More Atk Speed"],
    hoveringOverSkill: false,
    unlocked: true,
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
    unlocked: true,
  },
  {
    name: "Placeholder",
    pos: [0, 0],
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
  editButton("create");
  draw();
}

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
                    //unlock a skill
                    skillToUnlock = skills.find(s => s.name === "More Atk Speed");
                    skillToUnlock.unlocked = true;
                    //the action when bought
                    playerStats.strength + 1;
            }
        }
      }
    }
  }
};

const startButton = document.createElement("button");
startButton.style.width = "150px";
startButton.style.height = "70px";
startButton.style.position = "absolute";
startButton.style.right = "20px";
startButton.style.bottom = "20px";
startButton.style.border = "1px solid white";
startButton.style.boxShadow = "0px 0px 10px white";
startButton.style.backgroundColor = "black";
startButton.innerText = "Deploy";
startButton.style.color = "white";
startButton.style.fontFamily = "font, arial";
startButton.style.fontSize = "16px";
startButton.style.textAlign = "center";
startButton.style.zIndex = -10;
startButton.onclick = function () {
startGame();
}

export function editButton(type) {
  document.body.appendChild(startButton);

  if (type === "create") {
    startButton.style.zIndex = 10;
  } else if (type === "delete") {
    startButton.style.zIndex = -10;
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
