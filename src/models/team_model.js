const { Person } = require("./person_model");
const { Stats } = require("./stats_model");

class Team {
    constructor(name, members) {
        this.name = "";
        this.members = members;
    }
}

module.exports = {
    Team
}