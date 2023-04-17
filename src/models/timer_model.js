class Timer {
    constructor() {
        this.roundTime_SEC = 5; // 10 minutes 
        this.roundsUntilNextBreak = 5;
        this.breakTime_SEC = 5; // 5 minutes
    }
}

module.exports = {
    Timer
}
