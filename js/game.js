const Player = {
  X: "X",
  O: "O",
};

const Empty = "-";

const game = {
  player: Player.O,
  board: [],
  gameOver: false,
  sizeBoard: 3,

  score: {
    [Player.X]: 0,
    [Player.O]: 0,
  },

  setTitle() {
    const title = document.getElementById("player");
    title.innerText = `Player ${this.player === Player.O ? 1 : 2} turn (${this.player})`;
  },

  setBoardSize() {
    const boardSize = document.getElementById("settings");
    boardSize.innerText = `Board size: ${this.sizeBoard}x${this.sizeBoard}`;
  },

  showScores() {
    const score = document.getElementById("score");
    score.innerText = `Player 1 (${Player.O}): ${this.score[Player.O]} - Player 2 (${Player.X}): ${this.score[Player.X]}`;
  },

  showInfo(word) {
    const modalInfo = document.getElementById("modal-info");
    modalInfo.classList.remove("hidden");

    const info = document.getElementById("info-text");
    info.innerText = word;

    const closeInfo = document.getElementById("ok-button");
    closeInfo.addEventListener("click", () => {
      modalInfo.classList.add("hidden");
    });
  },

  changePlayer() {
    if (this.player === Player.X) {
      this.player = Player.O;
    } else {
      this.player = Player.X;
    }

    this.setTitle();
  },

  settings() {
    const modal = document.getElementById("modal");
    const configForm = document.getElementById("configForm");

    const buttonSetting = document.getElementById("icon-settings");
    buttonSetting.addEventListener("click", () => {
      modal.classList.remove("hidden");
      document.getElementById("boardSize").value = this.sizeBoard;
    });

    this.setBoardSize();

    configForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const boardSize = parseInt(document.getElementById("boardSize").value);
      this.sizeBoard = boardSize;

      this.setBoardSize();

      modal.classList.add("hidden");
      this.buildBoard(boardSize);
    });
  },

  addEvents(cellDiv, x, y) {
    const handleMouseOver = () => {
      if (this.board[x][y] === Empty && !this.gameOver) {
        cellDiv.innerText = this.player;
      }
      if (this.player === Player.X && this.board[x][y] === Empty) {
        cellDiv.classList.add("cellX");
        cellDiv.classList.remove("cellO");
      }
      if (this.player === Player.O && this.board[x][y] === Empty) {
        cellDiv.classList.add("cellO");
        cellDiv.classList.remove("cellX");
      }

      if (this.board[x][y] !== Empty || this.gameOver) {
        cellDiv.classList.remove("cellX");
        cellDiv.classList.remove("cellO");
      }
    };

    const handleMouseOut = () => {
      if (this.board[x][y] === Empty) {
        cellDiv.innerText = "";
      }
      cellDiv.classList.remove("cellX");
      cellDiv.classList.remove("cellO");
    };

    const handleClick = (e) => {
      if (this.board[x][y] !== Empty || this.gameOver) {
        return;
      }

      this.board[x][y] = this.player;
      e.target.innerText = this.player;
      e.target.classList.add("cellE");

      const win = this.checkWin();

      if (!win) this.changePlayer();
    };

    cellDiv.addEventListener("mouseover", handleMouseOver);
    cellDiv.addEventListener("mouseout", handleMouseOut);
    cellDiv.addEventListener("click", handleClick);
  },

  buildBoard(size = this.sizeBoard) {
    const table = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Empty),
    );

    this.board = [...table];

    const boardGame = document.getElementById("board");
    boardGame.innerHTML = "";
    boardGame.className = "";

    this.board.forEach((row, rowIndex) => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      row.forEach((_, cellIndex) => {
        const colDiv = document.createElement("div");
        colDiv.classList.add("cell");
        colDiv.dataset.index = `${rowIndex}-${cellIndex}`;

        this.addEvents(colDiv, rowIndex, cellIndex);

        boardGame.appendChild(colDiv);
      });
    });

    boardGame.classList.add(
      "board",
      `grid-cols-[repeat(${size},_minmax(100px,1fr))]`,
      `grid-rows-[repeat(${size},_minmax(100px,1fr))]`,
    );
  },

  checkWin() {
    const row = this.checkRows();
    const column = this.checkColumns();
    const { mainDiagonal, secondaryDiagonal } = this.checkDiagonal();

    if (row !== -1) {
      const arrayWin = this.board[row].map((_, index) => [row, index]);
      this.showWinner(arrayWin);
      return true;
    }
    if (column !== -1) {
      const arrayWin = [...this.board].map((_, index) => [index, column]);
      this.showWinner(arrayWin);
      return true;
    }

    if (mainDiagonal.length === this.board.length) {
      this.showWinner(mainDiagonal);
      return true;
    }

    if (secondaryDiagonal.length === this.board.length) {
      this.showWinner(secondaryDiagonal);
      return true;
    }
    if (
      this.board.every((row) => row.every((cell) => cell !== Empty)) &&
      !this.gameOver
    ) {
      this.showInfo("Draw Game");
      return true;
    }
    return false;
  },

  checkRows() {
    return this.board.findIndex((row) =>
      row.every((cell) => cell === this.player),
    );
  },

  checkColumns() {
    for (let i = 0; i < this.board.length; i++) {
      const column = this.board.map((row) => row[i]);
      const valid = column.every((cell) => cell === this.player);
      if (valid) {
        return i;
      }
    }
    return -1;
  },

  checkDiagonal() {
    const n = this.board.length;

    let indexMainDiagonal = [];
    let indexSecondaryDiagonal = [];

    for (let i = 0; i < n; i++) {
      if (this.board[i][i] === this.player) {
        indexMainDiagonal.push([i, i]);
      }

      if (this.board[i][n - 1 - i] === this.player) {
        indexSecondaryDiagonal.push([i, n - 1 - i]);
      }
    }

    return {
      mainDiagonal: indexMainDiagonal,
      secondaryDiagonal: indexSecondaryDiagonal,
    };
  },

  showWinner(arrayWin) {
    console.log(`Ganaste ${this.player}`, arrayWin);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    this.gameOver = true;
    this.score[this.player] += 1;
    this.showScores();
    arrayWin.forEach((cell) => {
      const cellDiv = document.querySelector(
        `[data-index="${cell[0]}-${cell[1]}"]`,
      );
      cellDiv.classList.add("cellWin");
    });
  },

  newGame() {
    this.gameOver = false;
    this.changePlayer();
    this.buildBoard(this.boardSize);
  },

  reset() {
    this.gameOver = false;
    this.sizeBoard = 3;
    this.score = {
      [Player.X]: 0,
      [Player.O]: 0,
    };
    this.player = Player.O;

    this.setTitle();
    this.settings();
    this.showScores();
    this.buildBoard(this.sizeBoard);
  },

  init() {
    this.setTitle();
    this.settings();
    this.buildBoard();
    this.showScores();

    const newGame = document.getElementById("reset");
    newGame.addEventListener("click", () => {
      this.newGame();
    });

    const reset = document.getElementById("clearGame");
    reset.addEventListener("click", () => {
      this.reset();
    });
  },
};

game.init();

function rain() {
  let hrElement;
  let counter = 100;
  for (let i = 0; i < counter; i++) {
    hrElement = document.createElement("HR");
    if (i == counter - 1) {
      // hrElement.className = "thunder";
    } else {
      hrElement.style.left =
        Math.floor(Math.random() * window.innerWidth) + "px";
      hrElement.style.animationDuration = 0.2 + Math.random() * 0.3 + "s";
      hrElement.style.animationDelay = Math.random() * 5 + "s";
    }
    document.body.appendChild(hrElement);
  }
}
