import { Person } from "./person_model.js";
import { Stats } from "./stats_model.js";
import { Configs } from "./configs_model.js";

class Team {
    constructor() {
        this.name = "";
        this.members = [
            new Person("Neal"),
            new Person("Irvin"),
            new Person("Simon")
        ];
        this.configs = new Configs();
        this.stats = new Map(); // Map<Person, Stats>
        for (let person of this.members) {
            this.stats.set(person.name, new Stats());
        }
    }
}

export {
    Team
}