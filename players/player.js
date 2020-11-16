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

module.exports = Player;
