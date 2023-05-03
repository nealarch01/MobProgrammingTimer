class Timer {
    constructor(roundTime_SEC = 600, roundsUntilNextBreak = 2, breakTime_SEC = 300) {
        this.roundTime_SEC = roundTime_SEC;
        this.roundsUntilNextBreak = roundsUntilNextBreak
        this.breakTime_SEC = breakTime_SEC;
    }
}

module.exports = {
    Timer
}
