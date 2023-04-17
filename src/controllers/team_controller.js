const { app, BrowserWindow, screen } = require('electron');
const storage = require('electron-json-storage');
const path = require('path');
const { Team } = require('../models/team_model.js');

const fs = require("fs");

class TeamController {
    constructor() {
        this.activeQueue = [];

        this.inactiveQueue = [];

        this.filepath = path.join(__dirname, "../../configs");

        this.teamName = "";
        this.teamMembers = [];

        this.currentTeamIndex = 0; //TODO: EQUAL TO LOADED IN TEAM

        this.allTeams = [new Team(this.teamName, this.teamMembers)];
    }

    async initTeams() { 

        storage.setDataPath(this.filepath);

        let res = storage.getSync('placeholder'); //TODO: change to team configs

        if(res == undefined) {
            this.activeQueue = [];
            this.inactiveQueue = [];
        }
        else {
            let keys = Object.keys(res);
            this.activeQueue = res[keys[0]];
            this.inactiveQueue = [];
        }

    }
    writeFile(params) {
        console.log("SAVE CLICKED");
        console.log(params);
        let filepath = path.join(__dirname, "../../configs/mock_teams.json");
        fs.writeFile(filepath, JSON.stringify(params, null, 4), "utf8", (err) => {
            console.log(err ?? "Successfully write to file");
        });
    }
    saveTimerConfigs(params) {
        this.writeFile(params);
        console.log("SAVE CLICKED");
    }
    }

module.exports = {
    TeamController
}
