const { app, BrowserWindow, screen } = require('electron');
const storage = require('electron-json-storage');
const path = require('path');


class TeamController {
    constructor() {
        this.activeQueue = [];

        this.inactiveQueue = [];

        this.filepath = path.join(__dirname, "../../configs");
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
    }

module.exports = {
    TeamController
}
