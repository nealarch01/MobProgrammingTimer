import { Team } from "../models/team_model.js";
import { Person } from "../models/person_model.js";
import { Timer } from "../models/timer_model.js";
import { Stats } from "../models/stats_model.js"; // modules

// const Team = requre("../models/team_model"); // commons

import fs from "fs";


let team = new Team();
team.name = "Mobile";

const keys = team.stats.keys();

let str = team.name;

for (const key of keys) {
    const stats = team.stats.get(key);
    str += ` ${key}: { drivingTime_SEC: ${stats.drivingTime_SEC}, navigatingTime_SEC: ${stats.navigatingTime_SEC}, observingTime_SEC: ${stats.observingTime_SEC}}`;
}
// console.log(str);


let team2 = new Team();
team2.name = "Web";

const keys2 = team2.stats.keys();

let str2 = team2.name;

const teams = [team, team2];

let nealStats = new Stats();
nealStats.drivingTime_SEC = 0;
nealStats.navigatingTime_SEC = 0;
nealStats.observingTime_SEC = 0;

for (const team of teams) {
    console.log(`Checking team: ${team.name}`);
    if (team.stats.has("Irvin")) {
        const stats = team.stats.get("Irvin");
        nealStats.drivingTime_SEC += stats.drivingTime_SEC;
        nealStats.navigatingTime_SEC += stats.navigatingTime_SEC;
        nealStats.observingTime_SEC += stats.observingTime_SEC;
    }
}

console.log(nealStats);




// Create a new file called: "stats.json"
// Write the stats to the file


