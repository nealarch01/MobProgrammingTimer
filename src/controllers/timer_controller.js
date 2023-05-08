const { BrowserWindow } = require("electron");

const { Timer } = require("../models/timer_model.js");
const { Person } = require("../models/person_model.js");

const path = require("path");

class TimerController {
    #timerConfig;
    #timeRemaining;
    #totalTime;
    #roundsLeft;
    #timerInterval;

    #activeQueue;
    #inactive;

    #MainWindow;
    #TimerWidgetWindow;


    constructor(MainWindow, TimerWidgetWindow, timerConfig, teamMembers = []) {
        if (TimerController.instance) {
            return TimerController.instance;
        }
        this.#timerConfig = timerConfig;
		this.#timeRemaining = timerConfig.roundTime_SEC;
        this.#totalTime = timerConfig.roundTime_SEC;
        this.#roundsLeft = timerConfig.roundsUntilNextBreak;
        this.#timerInterval = null;

        this.#activeQueue = teamMembers;
        this.#inactive = [];

        this.#MainWindow = MainWindow;
        this.#TimerWidgetWindow = TimerWidgetWindow;
        TimerController.instance = this;
    }

    startTimer() {
        if (this.#timerInterval !== null) {
            return;
        }
        this.#timerInterval = setInterval(() => {
            if (this.#timeRemaining <= 0) {
                this.stopTimer();
                this.#roundComplete();
                return;
            }
            this.#timeRemaining--;
            this.renderTimerText();
            this.renderCircleTimer();
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.#timerInterval);
        this.#timerInterval = null;
    }

    #roundComplete() {
        this.updateRoles();
        if (this.#MainWindow.isMinimized()) { 
            this.#MainWindow.restore();
        }
        this.#roundsLeft--;
        if (this.#roundsLeft === 0) {
            this.setTimeRemainingToBreakTime();
            this.redirectToBreakPage();
            return;
        }  
        this.resetRoundsLeft();
        this.setTimeRemainingToRoundTime();
        this.redirectToNextRolePage();
    }

    updateRoles() {
        // Move the top person to the back of the queue
        if (this.#activeQueue.length === 0 || this.#activeQueue.length === 1) {
            return;
        }
        const topPerson = this.#activeQueue.shift();
        this.#activeQueue.push(topPerson);
    }

    resetTimer() {
        this.#timeRemaining = this.#totalTime;
        this.renderTimerText();
        this.renderCircleTimer();
    }

    skipBreak(postponeBy = undefined) {
        if (postponeBy === undefined) {
            this.resetRoundsLeft();
        } else {
            this.setRoundsLeft(postponeBy);
        }
        this.setTimeRemainingToRoundTime();
        this.redirectToNextRolePage();
    }

    redirectToBreakPage() {
        console.log("Redirecting to break page..")
        this.#MainWindow.webContents.executeJavaScript(`
            window.location.href = "./break_page.html";
        `);
    }

    redirectToNextRolePage() {
        this.#MainWindow.webContents.executeJavaScript(`
            window.location.href = "./next_role.html";
        `);
    }

    isActive() {
        return this.#timerInterval !== null;
    }

    getAllMembers() {
        return {
            active: this.#activeQueue,
            inactive: this.#inactive
        }
    }

	renderTimerText() {
        const updateTimerTextJS = () => {
            return `
                timerText.innerText = "${this.timeRemainingMMSS()}";
            `;
        }
        this.#MainWindow.webContents.executeJavaScript(updateTimerTextJS());
        this.#TimerWidgetWindow.webContents.executeJavaScript(updateTimerTextJS());
	}

    renderCircleTimer() { // In case the total time is a break
        const js = `
            percentageComplete = ${this.#timeRemaining / this.#totalTime};
            offset = maxStrokeDash - (percentageComplete * maxStrokeDash);
            circleTimer.style.strokeDashoffset = offset;
        `
        this.#MainWindow.webContents.executeJavaScript(js);
        this.#TimerWidgetWindow.webContents.executeJavaScript(js);
    }

    setTimeRemainingToRoundTime() {
        this.#timeRemaining = this.#timerConfig.roundTime_SEC;
        this.#totalTime = this.#timerConfig.roundTime_SEC;
    }

    setTimeRemainingToBreakTime() {
        this.#timeRemaining = this.#timerConfig.breakTime_SEC;
        this.#totalTime = this.#timerConfig.breakTime_SEC;
    }

    resetRoundsLeft() {
        this.#roundsLeft = this.#timerConfig.roundsUntilNextBreak;
    }

    setRoundsLeft(roundsLeft) {
        this.#roundsLeft = roundsLeft;
    }

    setActiveQueue(members = []) {
        this.#activeQueue = members;
    }

    addToInactive(memberName) {
        const index1 = this.#activeQueue.map(member => member.name).indexOf(memberName);
        if (index1 === -1) {
            console.log("Could not find member in active queue");
            return;
        }
        const member = this.#activeQueue[index1];
        this.#inactive.push(member);
        this.#activeQueue.splice(index1, 1);
    }

    removeFromInactive(memberName) {
        const index1 = this.#inactive.map(member => member.name).indexOf(memberName);
        if (index1 === -1) {
            console.log("Could not find member in inactive queue");
            return;
        }
        const member = this.#inactive[index1];
        this.#activeQueue.push(member);
        this.#inactive.splice(index1, 1);
    }

    swapMembers(member1, member2) {
        const index1 = this.#activeQueue.map(member => member.name).indexOf(member1);
        const index2 = this.#activeQueue.map(member => member.name).indexOf(member2);
        if (index1 === -1 || index2 === -1) {
            console.log("Could not find member in active queue");
            return;
        }
        // console.log(`Old order: ${this.#activeQueue.map(member => member.name)}`);
        const tempMember = this.#activeQueue[index1];
        this.#activeQueue[index1] = this.#activeQueue[index2];
        this.#activeQueue[index2] = tempMember;
        // console.log(`New order: ${this.#activeQueue.map(member => member.name)}`);
    }

	timeRemainingMMSS() {
		const minutes = Math.floor(this.#timeRemaining / 60);
		const seconds = this.#timeRemaining % 60;
		if (seconds < 10) {
			return `${minutes}:0${seconds}`; 
		}
		return `${minutes}:${seconds}`;
	}

    timeRemaining() {
        return this.#timeRemaining;
    }

    updateSelectedTeam(timerConfig, teamMembers) {
        this.updateConfigs(timerConfig);
        this.updateMembers(teamMembers);
    }

    updateConfigs(timerConfig) {
        this.#timerConfig = timerConfig;
        this.setTimeRemainingToRoundTime();
        this.resetRoundsLeft();
    }

    updateMembers(members) {
        this.#activeQueue = members;
        this.#inactive = [];
    }

}

module.exports = {
    TimerController
}
