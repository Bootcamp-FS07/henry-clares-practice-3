import { Player } from "./constants.js";

export class PlayerState {
  constructor() {
    this.currentPlayer = Player.O;
  }

  togglePlayer() {
    this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
  }

  getPlayerTurnText(name = null) {
    if (name) return `${name} turn (${this.currentPlayer})`;
    return `Player ${this.currentPlayer === Player.O ? 1 : 2} turn (${this.currentPlayer})`;
  }
}
