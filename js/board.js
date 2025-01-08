import { Empty } from "./constants.js";

export class Board {
  constructor(size = 3) {
    this.size = size;
    this.board = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Empty),
    );
  }

  resetBoard(size = 3) {
    this.size = size;
    this.board = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Empty),
    );
  }

  setCell(x, y, player) {
    if (this.board[x][y] === Empty) {
      this.board[x][y] = player;
    }
  }

  getCell(x, y) {
    return this.board[x][y];
  }

  isFull() {
    return this.board.every((row) => row.every((cell) => cell !== Empty));
  }

  checkRows(player) {
    const winningIndices = [];

    this.board.forEach((row, rowIndex) => {
      if (row.every((cell) => cell === player)) {
        const rowIndices = row.map((_, colIndex) => [rowIndex, colIndex]);
        winningIndices.push(...rowIndices);
      }
    });

    return winningIndices;
  }

  checkColumns(player) {
    const winningIndices = [];

    for (let colIndex = 0; colIndex < this.board.length; colIndex++) {
      const column = this.board.map((row) => row[colIndex]);

      if (column.every((cell) => cell === player)) {
        const colIndices = column.map((_, rowIndex) => [rowIndex, colIndex]);
        winningIndices.push(...colIndices);
      }
    }

    return winningIndices;
  }

  checkDiagonals(player) {
    const primaryDiagonal = [];
    const secondaryDiagonal = [];

    const size = this.board.length;

    for (let i = 0; i < size; i++) {
      primaryDiagonal.push([i, i]);
    }

    for (let i = 0; i < size; i++) {
      secondaryDiagonal.push([i, size - i - 1]);
    }

    const isPrimaryValid = primaryDiagonal.every(
      ([x, y]) => this.board[x][y] === player,
    );

    const isSecondaryValid = secondaryDiagonal.every(
      ([x, y]) => this.board[x][y] === player,
    );

    if (isPrimaryValid) {
      return primaryDiagonal;
    } else if (isSecondaryValid) {
      return secondaryDiagonal;
    }

    return [];
  }
}
