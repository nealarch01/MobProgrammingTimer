class Stats {
    constructor(drivingTime_SEC = 0, navigatingTime_SEC = 0, observingTime_SEC = 0) {
        this.drivingTime_SEC = drivingTime_SEC;
        this.navigatingTime_SEC = navigatingTime_SEC;
        this.observingTime_SEC = observingTime_SEC;
    }
}

module.exports = {
    Stats
}