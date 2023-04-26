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
        const jsonData = storage.getSync('mock_teams'); //TODO: change to team configs
        this.activeQueue = [];
        this.inactiveQueue = [];
        this.currentTeamIndex = jsonData.last_team_index ?? -1;
        this.allTeams = jsonData.teams ?? [];
    }

    writeFile() {
        let filepath = path.join(__dirname, "../../configs/mock_teams.json"); //TODO: MOVE TO mock_teams*********
        const jsonData = {
            "last_team_index": this.currentTeamIndex,
            "teams": this.allTeams
        }
        fs.writeFile(filepath, JSON.stringify(jsonData, null, 4), "utf8", (err) => {
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
