// import { Person } from "./person_model.js";
// import { Stats } from "./stats_model.js";
// import { Configs } from "./configs_model.js";

const { Person } = require("./person_model");
const { Stats } = require("./stats_model");
const { Configs } = require("./configs_model");

class Team {
    constructor() {
        this.name = "";
        this.members = [ // Including active and inactive members
            new Person("Neal"),
            new Person("Irvin"),
            new Person("Simon")
        ];
    }
}

module.exports = {
    Team
}