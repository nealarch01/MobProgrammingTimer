const { Stats } = require("./stats_model");

class Person {
    constructor(name, stats = new Stats()) {
        this.name = name;
        this.stats = stats;
    }
}

module.exports = {
    Person
}
