const SOUND_PATH = "https://londonappbrewery.github.io/Simon-Game/sounds/";
const END_GAME_MSG = "Game Over, Press Any Key to Restart";
const cubeColors = ["green", "red", "yellow", "blue"];

const sound = {
  green: new Audio(`${SOUND_PATH}green.mp3`),
  red: new Audio(`${SOUND_PATH}red.mp3`),
  yellow: new Audio(`${SOUND_PATH}yellow.mp3`),
  blue: new Audio(`${SOUND_PATH}blue.mp3`),
  wrong: new Audio(`${SOUND_PATH}wrong.mp3`),
};

document.addEventListener("keydown", (e) => {
  switch (e.key.toUpperCase()) {
    case "A":
      startGame();
  }
});

document.querySelector(".cubes").addEventListener("click", (e) => {
  if (e.target.classList.contains("cube"))
    handleUserInput(e.target.dataset.color);
});

let level;
let userInputs;
let controlInputs;

cubeColors.forEach((color) => {
  const div = document.createElement("div");
  div.classList.add("cube");
  div.dataset.color = color;
  document.querySelector(".cubes").appendChild(div);
});

async function startGame() {
  level = 0;
  userInputs = [];
  controlInputs = [];
  computerMove();
  // while (await runGameLoopIteration()) {}
  // finishGame();
}

async function runGameLoopIteration() {
  setLevel(++level);
  await computerMove();
  return userMove();
}

function computerMove() {
  console.log("computerMove");
  return new Promise((resolve) => {
    setTimeout(async () => {
      const color = cubeColors[Math.floor(Math.random() * 4)];
      playSound(color);
      await cubeAIVisualEffect(color);
      resolve();
    }, 1000);
  });
}

function finishGame() {
  setHeader(END_GAME_MSG);
  setErrorBackground();
  playSound("wrong");
}

function setLevel(level) {
  setHeader(`Level ${level}`);
}

function setHeader(line) {
  document.querySelector("h1").innerHTML = line;
}

function playSound(color) {
  sound[color].play();
}

const cube = {
  green: document.querySelector("[data-color=green]"),
  red: document.querySelector("[data-color=red]"),
  yellow: document.querySelector("[data-color=yellow]"),
  blue: document.querySelector("[data-color=blue]"),
};

function cubePlayerVisualEffect(color) {}

async function cubeAIVisualEffect(color) {
  cube[color].style.visibility = "hidden";
  return new Promise((resolve) => {
    setTimeout(() => {
      cube[color].style.visibility = "visible";
      resolve();
    }, 200);
  });
}

function setErrorBackground() {
  document.body.classList.toggle("error");
  setTimeout(() => document.body.classList.toggle("error"), 200);
}

function handleUserInput(color) {
  console.log(color);
}
