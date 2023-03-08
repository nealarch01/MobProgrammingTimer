import { Person } from "./person_model.js";
import { Configs } from "./configs_model.js";

class Team {
    constructor() {
        this.teamName = "";
        this.members = [
            Person("Neal"),
            Person("Irvin"),
            Person("Simon")
        ];
        this.configs = Configs();
    }
}

modules.export = {
    Team
}