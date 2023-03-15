// import { Timer } from "./timer_model.js";
const { Timer } = require("./timer_model");

class Configs {
    constructor() {
        this.timerConfig = new Timer();
    }
}

module.exports = {
    Configs
}

