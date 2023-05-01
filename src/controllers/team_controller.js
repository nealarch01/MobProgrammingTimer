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

        let res = storage.getSync('mock_teams'); //TODO: change to team configs

        if (res == undefined) {
            this.activeQueue = [];
            this.inactiveQueue = [];
        }
        else {
            let keys = Object.keys(res);
            this.activeQueue = res[keys[0]];
            this.inactiveQueue = [];

            this.allTeams = res;
        }

    }
    writeFile(data) {
        let filepath = path.join(__dirname, "../../configs/placeholder.json"); //TODO: MOVE TO mock_teams*********
        fs.writeFile(filepath, JSON.stringify(data, null, 4), "utf8", (err) => {
            console.log(err ?? "Successfully write to file");
        });
    }
    saveTimerConfigs(data) {
        this.writeFile(data);
    }
    addTeam(teamName, members = []) {
        this.allTeams.push(new Team(teamName, members));
        this.currentTeamIndex = this.allTeams.length - 1;
        writeFile(this.allTeams);
    }
    removeTeam(teamName) { //remove team by name, not index
        let index = this.allTeams.indexOf(teamName);
        this.allTeams.splice(index, 1);
        this.writeFile(this.allTeams);
        console.log(this.allTeams);
    }
    retrieveQueue() {
        return this.activeQueue;
    }
}

module.exports = {
    TeamController
}
