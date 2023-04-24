class Timer {
    constructor() {
        this.roundTime_SEC = 600; // 10 minutes 
        this.roundsUntilNextBreak = 2;
        this.breakTime_SEC = 300; // 5 minutes
    }
}

module.exports = {
    Timer
}
