const { app, BrowserWindow, screen } = require('electron');
const storage = require('electron-json-storage');
const path = require('path');


class team_controller {
    constructor() {
        this.activeQueue = [];

        this.inactiveQueue = [];

        this.filepath = path.join(__dirname, "../../configs");
    } 
    initQueue(res) {

            //console.log(res); //remove this

            if(res == undefined) {
                this.activeQueue = [];
                this.inactiveQueue = [];
            }
            else {
                let keys = Object.keys(res);
                //console.log(keys);
                //console.log(res);
                this.activeQueue = res[keys[0]];
                console.log("active queue: " + this.activeQueue);
                this.inactiveQueue = [];
            }
            //console.log(this.activeQueue);
    }
    initTeams() { 
        console.log("active queue: " , this.activeQueue);

        storage.setDataPath(this.filepath);

        storage.get('placeholder',function(err, res) { //TODO: placeholder should be team configs
            if (err) console.log(err);

        initQueue(res);

        });

    }
    }

module.exports = {
    team_controller
}
