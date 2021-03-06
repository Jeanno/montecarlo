const Player = require("./player.js");

class BeepBoopPlayer extends Player {
    constructor () {
        super();
        this.steps = 0;
        this.stateToScore = {};
    }

    _bestMove () {
        this.steps = 0;
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
        this.steps++;
        if (this.steps >= 10000000) {
            console.log("Steps over limit", this.steps);
            process.exit();
        }
        const pm = game.possibleMoves();
        let minMod = isMin ? -1 : 1
        let bestDiff = isMin ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        let bestScore;
        let bestMove;
        for (const move of pm) {
            const steppedGame = game.clone();
            steppedGame.applyMove(move);
            const steppedScore = this._score(steppedGame, !isMin);
            const diff = Math.abs(steppedScore - this.targetScore);
            if (diff * minMod > bestDiff * minMod) {
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

module.exports = BeepBoopPlayer;
