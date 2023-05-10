const { app, BrowserWindow, screen } = require('electron');
const storage = require('electron-json-storage');
const path = require('path');
const { Team } = require('../models/team_model.js');

const fs = require("fs");
const { Person } = require('../models/person_model.js');

class TeamController {
    constructor() {
        this.filepath = path.join(__dirname, "../../configs");

        this.teamName = "";
        this.teamMembers = [];

        this.currentTeamIndex = -1;

        this.allTeams = [];
        this.noneTeam = new Team("None", []);
    }

    async initTeams() {
        storage.setDataPath(this.filepath);
        const jsonData = storage.getSync('teams'); //TODO: change to team configs
        this.currentTeamIndex = jsonData.lastTeamIndex ?? -1;
        this.allTeams = jsonData.teams ?? [];
    }

    writeFile() {
        let filepath = path.join(__dirname, "../../configs/teams.json"); //TODO: Change to teams.json
        const jsonData = {
            "lastTeamIndex": this.currentTeamIndex,
            "teams": this.allTeams
        }
        fs.writeFile(filepath, JSON.stringify(jsonData, null, 4), "utf8", (err) => {
            // console.log(err ?? "Successfully write to file");
        });
    }

    saveTimerConfigs(timerConfig) {
        if (this.currentTeamIndex === -1) {
            this.noneTeam.timerConfig = timerConfig;
            return;
        }
        this.allTeams[this.currentTeamIndex].timerConfig = timerConfig;
        this.writeFile();
    }

    createTeam(teamName, members = []) {
        this.allTeams.push(new Team(teamName, members));
        this.writeFile();
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

    renameTeam(teamName) {
        if (this.currentTeamIndex === -1) {
            return;
        }
        this.allTeams[this.currentTeamIndex].name = teamName;
        this.writeFile();
    }

    removeTeam(teamIndex) { //remove team by name, not index
        console.log(teamIndex);
        if (this.allTeams.count === 0 || this.currentTeamIndex === -1) {
            return;
        }
        this.allTeams.splice(teamIndex, 1);
        if (this.allTeams.length === 0) {
            this.currentTeamIndex = -1;
        }
        this.writeFile();
    }

    retrieveQueue() {
        if (this.currentTeamIndex === -1) {
            return []
        }
        return this.allTeams[this.currentTeamIndex].members;
    }

    addMember(memberName) {
        if (this.currentTeamIndex === -1) {
            return;
        }
        const newMember = new Person(memberName);
        this.allTeams[this.currentTeamIndex].members.push(newMember);
    }

    removeMember(memberName) {
        for (let i = 0; i < this.allTeams[this.currentTeamIndex].members.length; i++) {
            if (this.allTeams[this.currentTeamIndex].members[i].name === memberName) {
                this.allTeams[this.currentTeamIndex].members.splice(i, 1);
                break;
            }
        }
    }
}

module.exports = {
    TeamController
}
