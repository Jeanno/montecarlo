
class Game {
    currentStateHash () {
    }

    possibleMoves () {
    }

    applyMove (move) {
    }

    isEnd () {
    }

    evaluatedScore () {
    }
}

class Agent {
    suggestNextMove() {
    }
}

class TicTacToe extends Game {
    constructor() {
        super();
        this.state = Array(9).fill(0);
        this.turn = 0;
        this.score = 0; // 1 => O wins; -1 => X wins;
        this._stateToSign = ["_", "O", "X"];
    }

    possibleMoves () {
        const result = [];
        for (let i = 0; i < this.state.legnth; i++) {
            if (this.state[i] === 0) {
                ret.push(i);
            }
        }
        return result;
    }

    _setScoreWithWinner (winner) {
        this.score = winner * -2 + 3
    }

    applyMove (move) {
        const piece = (this.turn % 2) + 1; // O piece is 1; X piece is 2;
        const s = this.state;
        console.assert(s[move] === 0, "Illegal Move");
        s[move] = piece;
        this.turn++;

        // Check
        for (let i = 0; i < 3; i++) {
            const head = i * 3;
            const a = s[head];
            const b = s[head + 1];
            const c = s[head + 2];
            if (a !== 0 && a === b && a === c) {
                this._setScoreWithWinner(a);
                return;
            }
        }
        for (let i = 0; i < 3; i++) {
            const head = i;
            const a = s[head];
            const b = s[head + 3];
            const c = s[head + 6];
            if (a !== 0 && a === b && a === c) {
                this._setScoreWithWinner(a);
                return;
            }
        }
        {
            const a = s[0];
            const b = s[4];
            const c = s[8];
            if (a !== 0 && a === b && a === c) {
                this._setScoreWithWinner(a);
                return;
            }
        }
        {
            const a = s[2];
            const b = s[4];
            const c = s[6];
            if (a !== 0 && a === b && a === c) {
                this._setScoreWithWinner(a);
                return;
            }
        }
    }

    isEnd () {
        return this.score !== 0;
    }

    evaluatedScore () {
        return this.score;
    }

    printBoard () {
        const s = this.state;
        const sts = this._stateToSign;
        for (let i = 0; i < 3; i++) {
            const head = i * 3;
            const a = s[head];
            const b = s[head + 1];
            const c = s[head + 2];
            console.log(sts[a], sts[b], sts[c]);
        }
        console.log();
    }
}

let game = new TicTacToe;
game.printBoard();
game.applyMove(0);
game.printBoard();
game.applyMove(4);
game.printBoard();
game.applyMove(8);
game.printBoard();
game.applyMove(2);
game.printBoard();
game.applyMove(6);
game.printBoard();
game.applyMove(3);
game.printBoard();
game.applyMove(7);
game.printBoard();
console.log(game.score);
