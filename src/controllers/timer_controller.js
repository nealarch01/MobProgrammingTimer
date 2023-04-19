const { BrowserWindow } = require("electron");

const { Timer } = require("../models/timer_model.js");

const path = require("path");

class TimerController {
    #timerConfig;
    #timeRemaining;
    #roundsLeft;
    #timerInterval;

    #activeQueue;
    #inactiveQueue;

    #MainWindow;
    #TimerWidgetWindow;


    constructor(timerConfig = undefined, MainWindow, TimerWidgetWindow) {
        if (TimerController.instance) {
            return TimerController.instance;
        }
        if (timerConfig === undefined) {
            timerConfig = new Timer();
        }
        this.#timerConfig = timerConfig;
		this.#timeRemaining = timerConfig.roundTime_SEC;
        this.#roundsLeft = timerConfig.roundsUntilNextBreak;
        this.#timerInterval = null;

        this.#activeQueue = [];
        this.#inactiveQueue = [];

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
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.#timerInterval);
        this.#timerInterval = null;
    }

    #roundComplete() {
        if (this.#MainWindow.isMinimized()) { 
            this.#MainWindow.restore();
        }
        this.#roundsLeft--;
        if (this.#roundsLeft <= 0) {
            this.startBreak();
        } else {
            this.setTimeRemainingToRoundTime();
            this.redirectToNextRolePage();
        }
    }

    startBreak() {
        this.setTimeRemainingToBreakTime();
        this.redirectToBreakPage();
        this.#timerInterval = setInterval(() => {
            if (this.#timeRemaining <= 0) {
                this.stopBreak();
                return;
            }
            this.#timeRemaining--;
            this.renderTimerText();
        }, 1000);
    }

    stopBreak(postponeBy = undefined) {
        clearInterval(this.#timerInterval);
        this.#timerInterval = null;
        this.setTimeRemainingToRoundTime();
        this.redirectToNextRolePage();
        if (postponeBy === undefined) {
            this.resetRoundsLeft();
        } else {
            this.setRoundsLeft(postponeBy);
        }
        console.log("Rounds until next break: " + this.#roundsLeft);
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

	renderTimerText() {
        const updateTimerTextJS = () => {
            return `document.getElementById("timer-text").innerText = "${this.timeRemainingMMSS()}";`;
        }
		this.#MainWindow.webContents.executeJavaScript(updateTimerTextJS());
		this.#TimerWidgetWindow.webContents.executeJavaScript(updateTimerTextJS());
	}

    setTimeRemainingToRoundTime() {
        this.#timeRemaining = this.#timerConfig.roundTime_SEC;
    }

    setTimeRemainingToBreakTime() {
        this.#timeRemaining = this.#timerConfig.breakTime_SEC;
    }

    resetRoundsLeft() {
        this.#roundsLeft = this.#timerConfig.roundsUntilNextBreak;
    }

    setRoundsLeft(roundsLeft) {
        this.#roundsLeft = roundsLeft;
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

}

module.exports = {
    TimerController
}
