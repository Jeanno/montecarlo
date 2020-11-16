const Player = require("./player.js");

class RandomPlayer extends Player {
    promptMove (callback) {
        let pm = this.game.possibleMoves();
        let move = pm[Math.floor(Math.random() * pm.length)];
        callback(move);
    }
}

module.exports = RandomPlayer;
