const BeepBoopPlayer = require("./players/beep_boop_player.js");
const HumanPlayer = require("./players/human_player.js");

class Game {
    stateHash () {
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

    stateHash () {
        return this.state.join();
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
        console.assert(s[move] === 0, "Illegal Move: " + move);
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
        const sts = TicTacToe._stateToSign;
        for (let i = 0; i < 3; i++) {
            const head = i * 3;
            const a = s[head];
            const b = s[head + 1];
            const c = s[head + 2];
            console.log(sts[a], sts[b], sts[c]);
        }
        console.log();
    }

    clone () {
        const ret = new TicTacToe;
        ret.state = this.state.slice();
        ret.turn = this.turn;
        ret.score = this.score;
        return ret;
    }
}

class TicTacToeController {
    constructor (game, player1, player2) {
        this.game = game;
        this.player1 = player1;
        this.player2 = player2;
        this.player1.setGame(game);
        this.player2.setGame(game);
        this.player1.setTargetScore(1);
        this.player2.setTargetScore(-1);
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

class Gomoku extends Game {
    static _stateToSign = ["_", "O", "X"];
    static _lengthToWin = 3;
    constructor(width) {
        super();
        this.width = width;
        const size = width * width;
        this.state = Array(size).fill(0);
        this.turn = 0;
        this.score = 0; // 1 => O wins; -1 => X wins;
    }

    stateHash () {
        return this.state.join("");
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

    _checkWin(move) {
        const piece = (this.turn % 2) + 1; // O piece is 1; X piece is 2;
        const s = this.state;
        const size = this.width * this.width;

        {
            // Check vertical
            let count = 0;
            let idx = move;
            while (idx >= 0 && s[idx] === piece) {
                count++;
                idx -= this.width;
            }
            idx = move + this.width;
            while (idx < size && s[idx] === piece) {
                count++;
                idx += this.width;
            }
            if (count >= Gomoku._lengthToWin) {
                this._setScoreWithWinner(piece);
                return;
            }
        }

        {
            // Check horizontal
            let count = 0;
            let idx = move;
            const left = idx - (idx % this.width);
            const right = left + this.width;
            while (idx >= left && s[idx] === piece) {
                count++;
                idx--;
            }
            idx = move + 1;
            while (idx < right && s[idx] === piece) {
                count++;
                idx++;
            }
            if (count >= Gomoku._lengthToWin) {
                this._setScoreWithWinner(piece);
                return;
            }
        }

        {
            // Check top left to bottom right
            let count = 0;
            let idx = move;
            const left = Math.max(0, idx - (idx % this.width) * (this.width + 1));
            const right = Math.min(size, idx + (this.width - (idx % this.width) - 1) * (this.width + 1) + 1);
            while (idx >= left && s[idx] === piece) {
                count++;
                idx -= this.width + 1;
            }
            idx = move + this.width + 1;
            while (idx < right && s[idx] === piece) {
                count++;
                idx += this.width + 1;
            }
            if (count >= Gomoku._lengthToWin) {
                this._setScoreWithWinner(piece);
                return;
            }
        }

        {
            // Check top right to bottom left 
            let count = 0;
            let idx = move;
            const left = Math.max(0, idx - (this.width - (idx % this.width) - 1) * (this.width - 1));
            const right = Math.min(size, idx + (idx % this.width) * (this.width - 1) + 1);
            while (idx >= left && s[idx] === piece) {
                count++;
                idx -= this.width - 1;
            }
            idx = move + this.width - 1;
            while (idx < right && s[idx] === piece) {
                count++;
                idx += this.width - 1;
            }
            if (count >= Gomoku._lengthToWin) {
                this._setScoreWithWinner(piece);
                return;
            }
        }
    }
    
    applyMove (move) {
        const piece = (this.turn % 2) + 1; // O piece is 1; X piece is 2;
        const s = this.state;
        console.assert(s[move] === 0, "Illegal Move: " + move);
        s[move] = piece;
        this._checkWin(move);
        this.turn++;
    }

    isEnd () {
        return this.score !== 0 | this.turn >= this.width * this.width;
    }

    evaluatedScore () {
        return this.score;
    }

    printBoard () {
        const s = this.state;
        const sts = Gomoku._stateToSign;
        for (let i = 0; i < this.width; i++) {
            const head = i * this.width;
            const row = [];
            for (let j = 0; j < this.width; j++) {
                row.push(sts[s[head + j]]);
            }
            console.log(row.join());
        }
        console.log();
    }

    clone () {
        const ret = new Gomoku(this.width);
        ret.state = this.state.slice();
        ret.turn = this.turn;
        ret.score = this.score;
        return ret;
    }
}

const game = new Gomoku(4);
//game.applyMove(7);
//game.applyMove(2);
//game.applyMove(13);
//game.printBoard();
const gameController = new TicTacToeController(game, new BeepBoopPlayer, new HumanPlayer);
gameController.start();
