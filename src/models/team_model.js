const { Person } = require("./person_model");
const { Stats } = require("./stats_model");
const { Timer } = require("./timer_model");

class Team {
    constructor(name, members) {
        this.name = name;
        this.members = members;
        this.timerConfig = new Timer();
    }
}

module.exports = {
    Team
}