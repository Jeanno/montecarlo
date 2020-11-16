const Player = require("./player.js");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class HumanPlayer extends Player {
    promptMove (callback) {
        this.game.printBoard();
        console.log(this.game.possibleMoves());
        rl.question("Move:", (move) => {
            callback(Number(move));
        });
    }
}

module.exports = HumanPlayer;
