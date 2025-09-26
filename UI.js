import { startGame } from './main.js';
import { drawSkillTree } from './skilltree.js';

const myFont = new FontFace("font", "url('assets/font.ttf')");

myFont.load().then((loadedFont) => {
  document.fonts.add(loadedFont);
});

export function loadCanvas({ id = '', zIndex = '0', pointerEvents = 'auto', backgroundColor = 'transparent'} = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.style.position = 'absolute';
    canvas.style.zIndex = zIndex;
    canvas.style.pointerEvents = pointerEvents;
    canvas.style.backgroundColor = backgroundColor;

    if (id) canvas.id = id;

    document.body.appendChild(canvas);
    return canvas;
}

export const startButton = document.createElement("button");
Object.assign(startButton.style, {
  width: "150px",
  height: "70px",
  position: "absolute",
  right: "20px",
  bottom: "20px",
  border: "1px solid rgba(255, 255, 255, 1)",
  borderRadius: "8px",
  backgroundColor: "rgba(30, 36, 37, 0.75)",
  color: "white",
  fontFamily: "font, arial",
  fontSize: "16px",
  textAlign: "center",
  zIndex: -10,
});
startButton.innerText = "-->";
startButton.onclick = startGame;
startButton.onmouseover = () => {startButton.style.backgroundColor = "rgba(30, 36, 37, 0.9)";}
startButton.onmouseout = () => {startButton.style.backgroundColor = "rgba(30, 36, 37, 0.75)";}

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
toSkillTreeButton.onmouseover = () => {toSkillTreeButton.style.backgroundColor = "rgba(11, 200, 233, 0.9)";}
toSkillTreeButton.onmouseout = () => {toSkillTreeButton.style.backgroundColor = "rgba(11, 200, 233, 0.75)";}

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
againButton.innerText = "-->";
againButton.onclick = startGame;
againButton.onmouseover = () => {againButton.style.backgroundColor = "rgba(11, 200, 233, 0.9)";}
againButton.onmouseout = () => {againButton.style.backgroundColor = "rgba(11, 200, 233, 0.75)";}

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

export const moneyBox = document.createElement("div");
Object.assign(moneyBox.style, {
  width: "140px",
  height: "50px",
  position: "absolute",
  right: "20px",
  top: "20px",
  border: "1px solid rgba(255, 255, 255, 1)",
  borderRadius: "8px",
  backgroundColor: "rgba(30, 36, 37, 0.75)",
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