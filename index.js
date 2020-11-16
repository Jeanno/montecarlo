const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

class Player {
    constructor () {
        this.game = null;
        this.targetScore = 0;
    }

    setGame (game) {
        this.game = game;
    }

    setTargetScore (score) {
        this.targetScore = score;
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
    constructor () {
        super();
        this.stateToScore = {};
    }

    _bestMove () {
        const pm = this.game.possibleMoves();
        let minDiff = 10000;
        let minScore;
        let bestMove;
        // if current diff to target is 0, return null;
        for (const move of pm) {
            const steppedGame = this.game.clone();
            steppedGame.applyMove(move);
            const steppedScore = this._score(steppedGame, false);
            const diff = Math.abs(steppedScore - this.targetScore);
            if (diff < minDiff) {
                minDiff = diff;
                minScore = steppedScore;
                bestMove = move;
            }
        }
        return bestMove;
    }

    _score(game, isMin) {
        if (game.isEnd()) {
            return game.evaluatedScore();
        }
        const hash = game.stateHash();
        if (hash in this.stateToScore) {
            return this.stateToScore[hash];
        }
        const pm = game.possibleMoves();
        let minMod = isMin ? -1 : 1
        let bestDiff = isMin ? Number.MAX_VALUE : Number.MIN_VALUE;
        let bestScore;
        let bestMove;
        for (const move of pm) {
            const steppedGame = game.clone();
            steppedGame.applyMove(move);
            const steppedScore = this._score(steppedGame, !isMin);
            const diff = Math.abs(steppedScore - this.targetScore);
            if (diff * minMod  > bestDiff * minMod) {
                bestDiff = diff;
                bestScore = steppedScore;
                bestMove = move;
            }
        }
        this.stateToScore[hash] = bestScore;
        return bestScore;
    }

    promptMove (callback) {
        const move = this._bestMove();
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
const gameController = new TicTacToeController(game, new BeepBoopPlayer, new HumanPlayer);
gameController.start();
