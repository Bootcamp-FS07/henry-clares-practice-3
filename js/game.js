import { PlayerState } from "./player.js";
import { Board } from "./board.js";
import { Player, Empty } from "./constants.js";
import { Modal } from "./modal.js";

class Game {
  constructor() {
    if (Game.instance) {
      return Game.instance;
    }

    Game.instance = this;

    this.playerState = new PlayerState();
    this.board = new Board();

    this.score = {
      [Player.X]: 0,
      [Player.O]: 0,
    };

    this.gameOver = false;
    this.modalInfo = new Modal(
      document.getElementById("modal-info"),
      document.getElementById("info-text"),
    );
    this.modalForm = new Modal(document.getElementById("modal"));
  }

  init() {
    this.updateTitle();
    this.updateScores();
    this.updateSizeInfo();
    this.board.resetBoard();
    this.renderBoard();

    document
      .getElementById("reset")
      .addEventListener("click", () => this.newGame());

    document
      .getElementById("clearGame")
      .addEventListener("click", () => this.resetGame());

    document
      .getElementById("icon-settings")
      .addEventListener("click", (e) => this.modalForm.open());

    document.getElementById("configForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const boardSize = parseInt(document.getElementById("boardSize").value);
      this.board.resetBoard(boardSize);
      this.updateSizeInfo();
      this.renderBoard();
      this.modalForm.close();
    });

    document
      .getElementById("ok-button")
      .addEventListener("click", () => this.modalInfo.close());
  }

  updateTitle() {
    const title = document.getElementById("player");
    title.innerText = this.playerState.getPlayerTurnText();
  }

  updateScores() {
    const scoreElement = document.getElementById("score");
    scoreElement.innerText = `Player 1 (${Player.O}): ${this.score[Player.O]} - Player 2 (${Player.X}): ${this.score[Player.X]}`;
  }

  updateSizeInfo() {
    const sizeInfo = document.getElementById("sizeInfo");
    sizeInfo.innerText = `Board Size: ${this.board.size}x${this.board.size}`;
  }

  renderBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    boardElement.className = "";

    this.board.board.forEach((row, x) => {
      row.forEach((_, y) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.index = `${x}-${y}`;

        this.addCellEvents(cellElement, x, y);

        boardElement.appendChild(cellElement);
      });
    });

    boardElement.classList.add(
      "board",
      `grid-cols-[repeat(${this.board.size},_minmax(100px,1fr))]`,
      `grid-rows-[repeat(${this.board.size},_minmax(100px,1fr))]`,
    );
  }

  addCellEvents(cell, x, y) {
    const handleMouseOver = () => {
      const position = this.board.getCell(x, y);
      if (position === Empty && !this.gameOver) {
        cell.innerText = this.playerState.currentPlayer;
      }
      if (this.playerState.currentPlayer === Player.X && position === Empty) {
        cell.classList.add("cellX");
        cell.classList.remove("cellO");
      }
      if (this.playerState.currentPlayer === Player.O && position === Empty) {
        cell.classList.add("cellO");
        cell.classList.remove("cellX");
      }

      if (position !== Empty || this.gameOver) {
        cell.classList.remove("cellX");
        cell.classList.remove("cellO");
      }
    };

    const handleMouseOut = () => {
      const position = this.board.getCell(x, y);

      if (position === Empty) {
        cell.innerText = "";
      }

      cell.classList.remove("cellX");
      cell.classList.remove("cellO");
    };

    const handleClick = (e) => {
      const position = this.board.getCell(x, y);

      if (position !== Empty || this.gameOver) {
        return;
      }

      this.board.setCell(x, y, this.playerState.currentPlayer);

      e.target.innerText = this.playerState.currentPlayer;
      e.target.classList.add("cellE");

      const win = this.checkWin();

      if (win) {
        this.endGame();
      } else {
        this.playerState.togglePlayer();
        this.updateTitle();
      }
    };

    cell.addEventListener("mouseover", handleMouseOver);
    cell.addEventListener("mouseout", handleMouseOut);
    cell.addEventListener("click", handleClick);
  }

  checkWin() {
    const row = this.board.checkRows(this.playerState.currentPlayer);
    const column = this.board.checkColumns(this.playerState.currentPlayer);
    const diagonal = this.board.checkDiagonals(this.playerState.currentPlayer);

    if (this.board.isFull() && !this.gameOver) {
      this.showDraw();
      return false;
    }

    return [row.length, column.length, diagonal.length].includes(
      this.board.size,
    );
  }

  endGame() {
    this.gameOver = true;
    this.score[this.playerState.currentPlayer]++;
    this.updateScores();

    this.modalInfo.setContent(`Player ${this.playerState.currentPlayer} wins!`);
    this.modalInfo.open();
  }

  showDraw() {
    this.modalInfo.setContent("It's a draw!");
    this.modalInfo.open();
    this.gameOver = true;
  }

  newGame() {
    this.gameOver = false;
    this.board.resetBoard();
    this.playerState.togglePlayer();
    this.renderBoard();
    this.updateTitle();
  }

  showWinner() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    let message =
      this.score[Player.X] === this.score[Player.O]
        ? "It's a draw!"
        : this.score[Player.X] < this.score[Player.O]
          ? `Player 1 (${Player.O}) wins!`
          : `Player 2 (${Player.X}) wins!`;

    this.modalInfo.setContent(message);

    this.modalInfo.open();
  }

  resetGame() {
    this.showWinner();
    this.gameOver = false;
    this.board.resetBoard();
    this.score = { [Player.X]: 0, [Player.O]: 0 };
    this.playerState.currentPlayer = Player.O;
    this.renderBoard();
    this.updateScores();
    this.updateTitle();
  }
}

export const gameInstance = new Game();
