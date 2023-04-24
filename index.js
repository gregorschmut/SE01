// Init the game variables
var gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var gameEnded = false;
var scoreX = 0;
var scoreO = 0;
var rounds = 1; // Stores how many games have been played in total
var round = 0; // Stores the rounds inside one game
var huPlayer = "";
var aiPlayer = "";
var currentPlayer = ""; // Stores the current player in case it is a PvP
var isPvp = false; // Checks if it is PvP or Human vs ai
var lastMoveElement; // Stores the last move in case the human player did the last move and the game mode switches to non pvp then

// Get the html elements
const container = document.querySelector(".board");
const roundsElement = document.querySelector(".rounds");
const humanElement = document.getElementById("human");
const aiElement = document.getElementById("ai");
const xSelector = document.querySelector(".xSelector");
const oSelector = document.querySelector(".oSelector");
const beforeGameView = document.querySelector(".beforeGameView");
const inGameView = document.querySelector(".inGameView");
const pvpToggleButtonElement = document.querySelector(".pvpToggleButton");
const pvpToggleLabelElement = document.querySelector(".pvpToggleLabel");
const currentPlayerHeaderElement = document.querySelector(
  ".currentPlayerHeader"
);
const currentPlayerValue = document.querySelector(".currentPlayerValue");

const winningCombos = [
  // horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonal
  [0, 4, 8],
  [2, 4, 6],
];

// Check for winning using a for loop IMPROVEMENT
function winning(board, player) {
  for (var i = 0; i < winningCombos.length; i++) {
    const combo = winningCombos[i];
    if (
      board[combo[0]] == player &&
      board[combo[1]] == player &&
      board[combo[2]] == player
    ) {
      return true;
    }
  }
  return false;
}

// Winning function unimproved
// function winning(board, player) {
//   if (
//     (board[0] == player && board[1] == player && board[2] == player) ||
//     (board[3] == player && board[4] == player && board[5] == player) ||
//     (board[6] == player && board[7] == player && board[8] == player) ||
//     (board[0] == player && board[3] == player && board[6] == player) ||
//     (board[1] == player && board[4] == player && board[7] == player) ||
//     (board[2] == player && board[5] == player && board[8] == player) ||
//     (board[0] == player && board[4] == player && board[8] == player) ||
//     (board[2] == player && board[4] == player && board[6] == player)
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// }

// Switch players if it is pvp
function switchPlayers() {
  currentPlayer = currentPlayer == huPlayer ? aiPlayer : huPlayer;
  // if(currentPlayer == huPlayer) {
  //   currentPlayer = aiPlayer;
  // } else {
  //   currentPlayer = huPlayer;
  // }
  currentPlayerValue.innerHTML = currentPlayer;
}

// Initialize the game
function initTicTacToe() {
  // Event listeners
  xSelector.addEventListener("click", () => {
    huPlayer = "X";
    aiPlayer = "O";
    humanElement.innerHTML = "Human (X): <span class='scoreX score'>0</span>";
    aiElement.innerHTML = "AI (O): <span class='scoreO score'>0</span>";
    beforeGameView.style.display = "none";
    inGameView.style.display = "flex";
  });
  oSelector.addEventListener("click", () => {
    huPlayer = "O";
    aiPlayer = "X";
    humanElement.innerHTML = "Human (O): <span class='scoreO score'>0</span>";
    aiElement.innerHTML = "AI (X): <span class='scoreX score'>0</span>";
    beforeGameView.style.display = "none";
    inGameView.style.display = "flex";
  });
  pvpToggleButtonElement.addEventListener("click", () => {
    isPvp = isPvp ? false : true; // IMPROVEMENT: isPvp = !isPvp
    pvpToggleLabelElement.style.textDecoration = isPvp
      ? "none"
      : "line-through";
    currentPlayerHeaderElement.style.display = isPvp ? "block" : "none";
    if (isPvp) {
      humanElement.innerHTML = `Player 1 (${huPlayer}): <span class='${
        huPlayer == "X" ? "scoreX" : "scoreO"
      } score'>${huPlayer == "O" ? scoreO : scoreX}</span>`;
      aiElement.innerHTML = `Player 2 (${aiPlayer}): <span class='${
        aiPlayer == "X" ? "scoreX" : "scoreO"
      } score'>${aiPlayer == "O" ? scoreO : scoreX}</span>`;
      currentPlayer = huPlayer;
      currentPlayerValue.innerHTML = currentPlayer;
    } else {
      humanElement.innerHTML = `Human (${huPlayer}): <span class='scoreO score'>${
        huPlayer == "O" ? scoreO : scoreX
      }</span>`;
      aiElement.innerHTML = `AI (${aiPlayer}): <span class='scoreX score'>${
        aiPlayer == "O" ? scoreO : scoreX
      }</span>`;
      if (
        gameBoard.filter((s) => s == "X").length !=
        gameBoard.filter((s) => s == "O").length
      ) {
        move(lastMoveElement, huPlayer, true);
      }
    }
  });

  // Create game board consisting of 9 boxes (3x3)
  for (var i = 0; i < 9; i++) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.id = i;
    container.appendChild(box);

    // Handle "click" on box aka make a move
    box.addEventListener("click", () => {
      move(box, isPvp ? currentPlayer : huPlayer, false);
    });
  }
}

// Make a move
function move(element, player, isCompensation) {
  if (isCompensation) {
    computerMove();
    return;
  }
  if (
    !gameEnded &&
    gameBoard[element.id] != "X" &&
    gameBoard[element.id] != "O"
  ) {
    // Store the last element
    lastMoveElement = element;

    // The human does its move
    round++;
    gameBoard[element.id] = player;
    element.innerHTML = player;

    // Checking if this has been the last human move due to tie or win
    if (winning(gameBoard, player)) {
      gameEnded = true;
      setTimeout(() => {
        addPointsToPlayer(player);
        alert(
          `WINNER WINNER CHICKEN DINNER 🐔 - THE ${
            isPvp ? `PLAYER ${currentPlayer}` : "HUMAN"
          } WINS 🎉!`
        );
        refreshGame();
      }, 500);
      return;
    } else if (round > 8) {
      setTimeout(() => {
        alert("No winner, but also no loser 🤘🏼!");
        refreshGame();
      }, 500);
      return;
    } else if (isPvp) {
      switchPlayers();
    } else {
      // Now, the computer does its counter move
      computerMove();
    }
  }
}

// Computer move
function computerMove() {
  round++;
  var bestField = minimax(gameBoard, aiPlayer).index;
  gameBoard[bestField] = aiPlayer;
  const boardElement = document.getElementById(`${bestField}`);
  boardElement.innerHTML = aiPlayer;
  if (winning(gameBoard, aiPlayer)) {
    gameEnded = true;
    setTimeout(() => {
      addPointsToPlayer(aiPlayer);
      alert("THE AI HAS DONE IT AGAIN. YOU LOSE..");
      refreshGame();
    }, 500);
    return;
  }
}

// Restores the default game board
function refreshGame() {
  gameEnded = false;
  round = 0;
  gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const boxes = document.querySelectorAll(".box");
  for (var i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    box.innerHTML = "";
  }
  rounds++;
  roundsElement.innerHTML = rounds;
}

// Adds points to the winner
function addPointsToPlayer(winningPlayer) {
  if (winningPlayer == "X") {
    scoreX++;
    const scoreXElement = document.querySelector(".scoreX");
    scoreXElement.innerHTML = scoreX;
    //console.log(`add points to ${winningPlayer}. He now has ${scoreX} points`);
  } else if (winningPlayer == "O") {
    scoreO++;
    const scoreOElement = document.querySelector(".scoreO");
    scoreOElement.innerHTML = scoreO;
    //console.log(`add points to ${winningPlayer}. He now has ${scoreO} points`);
  }
}

// Get fields that are empty yet
function availableFields(reboard) {
  return reboard.filter((f) => f != "O" && f != "X");
}

// Minimax function to get the best possible move for the AI
function minimax(reboard, player) {
  var availFields = availableFields(reboard);

  if (winning(reboard, huPlayer)) {
    return {
      score: -10,
    };
  } else if (winning(reboard, aiPlayer)) {
    return {
      score: 10,
    };
  } else if (availFields.length === 0) {
    return {
      score: 0,
    };
  }

  var moves = [];
  for (var i = 0; i < availFields.length; i++) {
    var move = {};
    move.index = reboard[availFields[i]];
    reboard[availFields[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(reboard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(reboard, aiPlayer);
      move.score = result.score;
    }
    reboard[availFields[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -11;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 11;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

// Actually init the game
initTicTacToe();

echo "# SE01_tictactoe" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/gregorschmut/SE01_tictactoe.git
git push -u origin main
