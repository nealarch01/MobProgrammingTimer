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

        this.currentTeamIndex = -1;

        this.allTeams = [];
        this.noneTeam = new Team("None", []);
    }

    async initTeams() {
        storage.setDataPath(this.filepath);
        let res = storage.getSync('mock_teams'); //TODO: change to team configs
        if (res == undefined) {
            this.activeQueue = [];
            this.inactiveQueue = [];
        } else {
            this.activeQueue = [];
            this.inactiveQueue = [];
            this.allTeams = res;
        }
    }

    writeFile() {
        let filepath = path.join(__dirname, "../../configs/placeholder.json"); //TODO: MOVE TO mock_teams*********
        fs.writeFile(filepath, JSON.stringify(this.allTeams, null, 4), "utf8", (err) => {
            console.log(err ?? "Successfully write to file");
        });
    }

    saveTimerConfigs(timerConfig) {
        if (this.currentTeamIndex === -1) {
            this.noneTeam.timerConfig = timerConfig;
            return;
        }
        this.allTeams[this.currentTeamIndex].timerConfigs = timerConfig;
        this.writeFile();
    }

    createTeam(teamName, members = []) {
        this.allTeams.push(new Team(teamName, members));
        this.currentTeamIndex = this.allTeams.length - 1;
        writeFile(this.allTeams);
    }

    getAllTeams() {
        return this.allTeams;
    }

    getCurrentTeam() {
        if (this.currentTeamIndex === -1 || this.allTeams.length === 0) {
            return {
                data: this.noneTeam,
                index: -1
            }
        }
        return {
            data: this.allTeams[this.currentTeamIndex],
            index: this.currentTeamIndex
        }
    }

    setCurrentTeam(teamIndex) {
        this.currentTeamIndex = teamIndex;
    }
}

module.exports = {
    TeamController
}
