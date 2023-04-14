const { app, BrowserWindow, screen } = require('electron');
const storage = require('electron-json-storage');
const path = require('path');


class TeamController {
    constructor() {
        this.activeQueue = [];

        this.inactiveQueue = [];

        this.filepath = path.join(__dirname, "../../configs");
    } 
    initQueue(err, res) {

            //console.log(res); //remove this

            if(res == undefined) {
                this.activeQueue = [];
                this.inactiveQueue = [];
            }
            else {
                let keys = Object.keys(res);
                this.activeQueue = res[keys[0]];
                this.inactiveQueue = [];
            }
            console.log(this.activeQueue);
    }
    initTeams() { 

        storage.setDataPath(this.filepath);

        storage.get('placeholder',this.initQueue.bind(this)); //TODO: change to team configs

    }
    }

module.exports = {
    TeamController
}
