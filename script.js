const SOUND_PATH = "https://londonappbrewery.github.io/Simon-Game/sounds/";
const END_GAME_MSG = "Game Over, Press Any Key to Restart";
const cubeColors = ["green", "red", "yellow", "blue"];
const effectTimeout = 200;

const sound = {
  green: new Audio(`${SOUND_PATH}green.mp3`),
  red: new Audio(`${SOUND_PATH}red.mp3`),
  yellow: new Audio(`${SOUND_PATH}yellow.mp3`),
  blue: new Audio(`${SOUND_PATH}blue.mp3`),
  wrong: new Audio(`${SOUND_PATH}wrong.mp3`),
};

document.addEventListener("keydown", (e) => {
  if (level === -1 || (level === 0 && e.key.toUpperCase() === "A")) startGame();
});

document.querySelector(".cubes").addEventListener("click", (e) => {
  if (level < 1) return;
  if (e.target.classList.contains("cube"))
    handleUserInput(e.target.dataset.color);
});

let level = 0;
let userInputs;
let controlInputs;
let setUserMovesCheckResult;
let computerMoveTimeout;
let lastSound;

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
  while (await runGameLoopIteration()) {}
  finishGame();
}

async function runGameLoopIteration() {
  setLevel(++level);
  await computerMove();
  return userMove();
}

function computerMove() {
  return new Promise((resolve) => {
    computerMoveTimeout = setTimeout(async () => {
      const random = Math.floor(Math.random() * 4);
      controlInputs.push(random);
      const color = cubeColors[random];
      playSound(color);
      await cubeAIVisualEffect(color);
      resolve();
    }, 1000);
  });
}

async function userMove() {
  userInputs = [];
  return new Promise((resolve) => (setUserMovesCheckResult = resolve));
}

function finishGame() {
  setHeader(END_GAME_MSG);
  document.body.classList.toggle("error");
  setTimeout(() => document.body.classList.toggle("error"), effectTimeout);
  playSound("wrong");
  computerMoveTimeout && clearTimeout(computerMoveTimeout);
  level = -1;
}

function setLevel(level) {
  setHeader(`Level ${level}`);
}

function setHeader(line) {
  document.querySelector("h1").innerHTML = line;
}

function playSound(color) {
  if (lastSound) {
    lastSound.currentTime = 0;
    lastSound.pause();
  }
  lastSound = sound[color];
  lastSound.play();
}

const cube = {
  green: document.querySelector("[data-color=green]"),
  red: document.querySelector("[data-color=red]"),
  yellow: document.querySelector("[data-color=yellow]"),
  blue: document.querySelector("[data-color=blue]"),
};

async function cubeAIVisualEffect(color) {
  cube[color].style.visibility = "hidden";
  return new Promise((resolve) => {
    setTimeout(
      () => resolve((cube[color].style.visibility = "visible")),
      effectTimeout
    );
  });
}

function handleUserInput(color) {
  cube[color].classList.add("highlighted");
  setTimeout(() => cube[color].classList.remove("highlighted"), effectTimeout);
  playSound(color);
  userInputs.push(cubeColors.indexOf(color));

  if (!setUserMovesCheckResult) finishGame();
  else if (!userInputs.every((input, idx) => input === controlInputs[idx]))
    finishGame();
  else if (userInputs.length === controlInputs.length)
    setUserMovesCheckResult(true);
}
