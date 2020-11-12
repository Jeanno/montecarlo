const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

class TicTacToe extends Game {
    static _stateToSign = ["_", "O", "X"];
    constructor() {
        super();
        this.state = Array(9).fill(0);
        this.turn = 0;
        this.score = 0; // 1 => O wins; -1 => X wins;
    }

    possibleMoves () {
        const result = [];
        for (let i = 0; i < this.state.length; i++) {
            if (this.state[i] === 0) {
                result.push(i);
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
        return this.score !== 0 | this.turn >= 9;
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

class TicTacToeController {
    constructor (game, player1, player2) {
        this.game = game;
        this.player1 = player1;
        this.player2 = player2;
        this.player1.setGame(game);
        this.player2.setGame(game);
    }

    start () {
        this._promptNextMove();
    }

    _promptNextMove () {
        if ((this.game.turn % 2) === 0) {
            this.player1.promptMove(this._applyMove.bind(this));
        } else {
            this.player2.promptMove(this._applyMove.bind(this));
        }
    }

    _applyMove (move) {
        this.game.applyMove(move);
        if (this.game.isEnd()) {
            this.game.printBoard();
            console.log(this.game.score);
        } else {
            this._promptNextMove();
        }
    }
}

class Player {
    constructor () {
        this.game = null;
    }

    setGame (game) {
        this.game = game;
    }
    promptMove (callback) {}
}


class HumanPlayer extends Player {
    promptMove (callback) {
        this.game.printBoard();
        console.log(this.game.possibleMoves());
        rl.question("Move:", (move) => {
            callback(Number(move));
        });
    }
}

class BeepBoopPlayer extends Player {
    promptMove (callback) {
        let pm = this.game.possibleMoves();
        let move = pm[Math.floor(Math.random() * pm.length)];
        callback(move);
    }
}

class RandomPlayer extends Player {
    promptMove (callback) {
        let pm = this.game.possibleMoves();
        let move = pm[Math.floor(Math.random() * pm.length)];
        callback(move);
    }
}

const game = new TicTacToe;
const gameController = new TicTacToeController(game, new RandomPlayer, new HumanPlayer);
gameController.start();
/*
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
*/
