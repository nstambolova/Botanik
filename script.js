const playerNameForm = document.querySelector("#playernameform");
let resetButton = document.querySelector("#resetbutton");
let totalRoundsSelect = document.querySelector("#playto");
const submitButton = document.querySelector("#submitbutton");
const winnerDivSelect = document.querySelector("#winner");
let scoreFields = document.querySelectorAll(".scorefields");
let scoreLists = document.querySelectorAll(".scorelist");
let playerScoreForms = document.querySelectorAll(".playerscoreforms");
let checkTotalButton = document.querySelector("#checktotal");
let checkTotalAllSelect = document.querySelector("#checktotalall");
const statsButton = document.querySelector("#statsbutton");
const statsDivSelect = document.querySelector("#checkstats");
const womanAvatarImg = document.querySelector("#womanavatar");
const womanAvatarBackImg = document.querySelector("#womanavatarback");
const manAvatarImg = document.querySelector("#manavatar");
const manAvatarBackImg = document.querySelector("#manavatarback");
let scoreInputs = document.querySelectorAll("#score1, #score2");

const p1 = {
  avatar: "Woman Avatar",
  playerName: document.querySelector("#playername1"),
  playerScoreForm: document.querySelector("#player1scoreform"),
  playerScore: document.querySelector("#player1score"),
  score: document.querySelector("#score1"),
  total: document.querySelector("#total1"),
  totalScore: {},
  counter: 0,
};

const p2 = {
  avatar: "Man Avatar",
  playerName: document.querySelector("#playername2"),
  playerScoreForm: document.querySelector("#player2scoreform"),
  playerScore: document.querySelector("#player2score"),
  score: document.querySelector("#score2"),
  total: document.querySelector("#total2"),
  totalScore: {},
  counter: 0,
};

let currentRound = 0;
let totalRounds = function () {
  let value = document.querySelector("select").value;
  return parseInt(value);
};

function counterRounds() {
  currentRound++;
  if (currentRound === totalRounds() || currentRound === 5) {
    p1.playerScoreForm.style.display = "none";
    p2.playerScoreForm.style.display = "none";
    winner();
    flipImageEnd();
  }
}

function flipImageEnd() {
  womanAvatarImg.setAttribute("src", "woman_avatar_back.png");
  womanAvatarImg.classList.toggle("flipped");
  manAvatarImg.setAttribute("src", "man_avatar_back.png");
  manAvatarImg.classList.toggle("flipped");
}

function flipImageStart() {
  womanAvatarImg.setAttribute("src", "woman_avatar.png");
  womanAvatarImg.classList.toggle("flipped");
  manAvatarImg.setAttribute("src", "man_avatar.png");
  manAvatarImg.classList.toggle("flipped");
}

let statsButtonClicks = 0;

statsButton.addEventListener("click", () => {
  if (statsButtonClicks === 0) {
    displayLocalStorageStats(p1);
    displayLocalStorageStats(p2);
    statsButton.innerText = "Hide Stats";
    statsButtonClicks = 1;
  } else {
    statsDivSelect.innerText = "";
    statsButton.innerText = "Check Stats";
    statsButtonClicks = 0;
  }
});

function localStorageStats(player) {
  let playerScores = [];

  let storedPlayerScores = localStorage.getItem(`getScore-${player.avatar}`);
  if (storedPlayerScores) {
    playerScores = JSON.parse(storedPlayerScores);
    if (!Array.isArray(playerScores)) {
      playerScores = [];
    }
  }

  const nestedObject = player.totalScore;
  const nestedValues = Object.values(nestedObject);
  if (nestedValues.length > 0) {
    playerScores.push(...nestedValues);
  }

  localStorage.setItem(
    `getScore-${player.avatar}`,
    JSON.stringify(playerScores)
  );
}

function displayLocalStorageStats(player) {
  let playerScores = [];

  let storedPlayerScores = localStorage.getItem(`getScore-${player.avatar}`);
  if (storedPlayerScores) {
    playerScores = JSON.parse(storedPlayerScores);
    if (!Array.isArray(playerScores)) {
      playerScores = [];
    }
  }

  const newUl = document.createElement("ul");
  if (playerScores.length > 0) {
    newUl.innerText = `${player.avatar} max score: ${Math.max(
      ...playerScores
    )} (min score: ${Math.min(...playerScores)})`;
  } else {
    newUl.innerText = `${player.avatar} has no completed rounds yet.`;
  }

  statsDivSelect.appendChild(newUl);
}

function checkValidScores() {
  if (
    isNaN(p1.score.value) ||
    isNaN(p2.score.value) ||
    p1.score.value === "" ||
    p2.score.value === ""
  ) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
}
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && submitButton.disabled) {
    e.preventDefault();
  }
});

function calcTotalScore(scores) {
  let totalScore = 0;
  Object.values(scores).forEach((score) => {
    totalScore += score;
  });
  return totalScore;
}

function calcTotal() {
  const totalScore1 = calcTotalScore(p1.totalScore);
  const totalScore2 = calcTotalScore(p2.totalScore);
  return [totalScore1, totalScore2];
}

let totalButtonClicks = 0;

checkTotalButton.addEventListener("click", () => {
  if (totalButtonClicks === 0) {
    const totalScore1 = calcTotalScore(p1.totalScore);
    const totalScore2 = calcTotalScore(p2.totalScore);
    checkTotalAllSelect.innerText = `${totalScore1} for ${p1.playerName.textContent} vs ${totalScore2} for ${p2.playerName.textContent}`;
    checkTotalButton.innerText = "Hide Total";
    totalButtonClicks = 1;
  } else {
    checkTotalAllSelect.innerText = "";
    checkTotalButton.innerText = "Current Total";
    totalButtonClicks = 0;
  }
});

function winner() {
  const totalScore1 = calcTotalScore(p1.totalScore);
  const totalScore2 = calcTotalScore(p2.totalScore);
  if (totalScore1 > totalScore2) {
    winnerDivSelect.innerHTML = `Game over! ${p1.playerName.textContent} is better Mecha-Botanist - ${totalScore1} points vs ${totalScore2} for ${p2.playerName.textContent}!`;
  } else if (totalScore1 < totalScore2) {
    winnerDivSelect.innerHTML = `Game over! ${p2.playerName.textContent} is better Mecha-Botanist - ${totalScore2} points vs ${totalScore1} for ${p1.playerName.textContent}!`;
  } else if (totalScore1 === totalScore2) {
    winnerDivSelect.innerHTML = `Game over! ${p1.playerName.textContent} and ${p2.playerName.textContent} are equally skilled Mecha-Botanists - ${totalScore1} vs ${totalScore2} points!`;
  }
  checkTotalButton.disabled = true;
  checkTotalAllSelect.innerText = "";
}

let idCounter = 0;

function updateScores(player) {
  idCounter++;
  const ul = document.createElement("ul");
  ul.setAttribute("contenteditable", "true");
  ul.setAttribute("id", `newScore${idCounter}`);
  ul.innerText = player.score.value;

  player.playerScore.appendChild(ul);

  let key = ul.getAttribute("id");
  let score = parseInt(ul.innerText);
  player.totalScore[key] = score;

  ul.addEventListener("input", function (e) {
    const input = e.target;

    const selection = window.getSelection();
    const selectionEnd = selection.focusOffset;

    input.innerText = input.innerText.replace(/[^0-9]/g, "");
    if (input.innerText === "") {
      input.innerText = "0";
    }

    const cursorPosition =
      selectionEnd + (input.innerText.length - input.textContent.length);
    const maxCursorPosition = input.innerText.length;

    selection.setPosition(
      input.firstChild,
      Math.min(cursorPosition, maxCursorPosition)
    );

    let score = parseInt(input.innerText);
    player.totalScore[key] = score;
    checkValidScores();
    calcTotal();
  });

  player.playerScoreForm.reset();
  checkValidScores();
  calcTotal();
}

function onlyNumbers(e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
}

score1.addEventListener("input", onlyNumbers);
score2.addEventListener("input", onlyNumbers);

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  updateScores(p1);
  updateScores(p2);
  counterRounds();
  enableReset();
  localStorageStats(p1);
  localStorageStats(p2);
});

function updateScoresEnter() {
  updateScores(p1);
  updateScores(p2);
  counterRounds();
  enableReset();
  localStorageStats(p1);
  localStorageStats(p2);
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    if (playerNameForm.contains(e.target)) {
      e.preventDefault();
      let inputName = document.querySelector("#inputname").value;
      if (selectplayername1.checked) {
        p1.playerName.textContent = inputName;
        playerNameForm.reset();
      }
      if (selectplayername2.checked) {
        p2.playerName.textContent = inputName;
        playerNameForm.reset();
      }
    }

    let isFormValid = true;
    scoreInputs.forEach(function (scoreInput) {
      if (isNaN(scoreInput.value) || scoreInput.value === "") {
        isFormValid = false;
      }
    });
    if (isFormValid) {
      e.preventDefault();
      updateScoresEnter();
    }
  }
});

scoreInputs.forEach((input, index) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const nextInput = scoreInputs[index + 1];
      if (nextInput) {
        nextInput.focus();
      } else {
        scoreInputs[0].focus();
      }
    }
  });
});

p1.score.addEventListener("input", checkValidScores);
p2.score.addEventListener("input", checkValidScores);

function enableReset() {
  if (
    Object.keys(p1.totalScore).length === 0 ||
    Object.keys(p2.totalScore).length === 0
  ) {
    resetButton.disabled = true;
  } else {
    resetButton.disabled = false;
  }
}

resetButton.addEventListener("click", () => {
  const dynamicUl = document.querySelectorAll("ul");
  dynamicUl.forEach((ul) => {
    ul.remove();
    p1.playerName.innerHTML = "Woman Avatar";
    p2.playerName.innerHTML = "Man Avatar";
    p1.playerScoreForm.style.display = "inline";
    p2.playerScoreForm.style.display = "inline";
    p1.counter = 0;
    p2.counter = 0;
    p1.total.innerHTML = "";
    p2.total.innerHTML = "";
    p1.totalScore = {};
    p2.totalScore = {};
    idCounter = 0;
    winnerDivSelect.innerHTML = "";
    currentRound = 0;
    checkTotalButton.disabled = false;
    checkTotalAllSelect.innerText = "";
    checkTotalButton.innerText = "Current Total";
    totalRoundsSelect.value = "-";
  });
  flipImageStart();
  enableReset();
});
