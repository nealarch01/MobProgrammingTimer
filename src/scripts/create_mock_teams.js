const { Team } = require ("../models/team_model");
const { Person } = require("../models/person_model");

const fs = require("fs");
const path = require("path");

function writeToFile(data) {
    let filepath = path.join(__dirname, "../../configs/mock_teams.json");
    console.log("Writing to file");
    let teamDataExcludingStats = data.map(team => {
        return {
            name: team.name,
            members: team.members.map(member => {
                return {
                    name: member.name
                }
            })
        }
    });
    // Replace teamDataExcludingStats with data to include stats
    fs.writeFile(filepath, JSON.stringify(teamDataExcludingStats, null, 4), "utf8", (err) => {
        console.log(err ?? "Successfully write to file");
    });
}

function createTeams() {
    let webTeam = new Team("Web Dev", [new Person("Neal"), new Person("Irvin"), new Person("John")])
    let mobileTeam = new Team("Mobile Dev", [new Person("Joe"), new Person("Chris"), new Person("Alex")])
    return [webTeam, mobileTeam];
}

writeToFile(createTeams());

