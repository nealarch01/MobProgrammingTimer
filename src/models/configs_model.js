import { Timer } from "./timer_model.js";

class Configs {
    constructor() {
        this.timerConfig = Timer();
    }
}

modules.export = {
    Configs
}