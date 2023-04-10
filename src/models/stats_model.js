class Stats {
    constructor() {
        this.drivingTime_SEC = 0;
        this.navigatingTime_SEC = 0;
        this.observingTime_SEC = 0;
    }

    // TODO: Delete this later 
    constructor(drivingTime_SEC, navigatingTime_SEC, observingTime_SEC) {
        this.drivingTime_SEC = drivingTime_SEC;
        this.navigatingTime_SEC = navigatingTime_SEC;
        this.observingTime_SEC = observingTime_SEC;
    }
}

module.exports = {
    Stats
}