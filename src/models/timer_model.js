class Timer {
    constructor() {
        this.roundTime_SEC = 5; // 10 minutes 
        this.roundsUntilNextBreak = 1;
        this.breakTime_SEC = 600; // 5 minutes
    }
}

module.exports = {
    Timer
}
