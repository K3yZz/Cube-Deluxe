import { loadStatsCanvas } from "./UI.js";
import { playerStats, player } from "./player.js";

const canvas = loadStatsCanvas();
const ctx = canvas.getContext("2d");

let moneyDisplay;

function loadMoney(x, y) {
  console.log("drawn");

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

export function drawDisplayMoney(type) {
  if (type === "topright") {
    loadMoney(player.centerX * 2 - 75, 25);
  }
}

export function drawDisplay() {
  moneyDisplay = document.createElement("div");
  moneyDisplay.style.width = "100px";
  moneyDisplay.style.height = "100px";
  moneyDisplay.style.position = "absolute";
  moneyDisplay.style.right = 0;
  moneyDisplay.style.top = "10px";
  moneyDisplay.style.zIndex = "999";
  moneyDisplay.innerText = playerStats.purpleMoney;
  moneyDisplay.style.color = "white";
  moneyDisplay.style.fontFamily = "font";
  moneyDisplay.id = "moneyDisplay";
  document.body.appendChild(moneyDisplay);

  drawDisplayMoney("topright");
}
