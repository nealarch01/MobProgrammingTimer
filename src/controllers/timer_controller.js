const { BrowserWindow } = require("electron");

const { Timer } = require("../models/timer_model.js");

class TimerController {
    #timerConfig;
    #timeRemaining;
    #roundsLeft;
    #timerInterval;
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
        this.#roundsLeft = timerConfig.roundsBeforeBreak;
        this.#timerInterval = null;
        this.#MainWindow = MainWindow;
        this.#TimerWidgetWindow = TimerWidgetWindow;
        TimerController.instance = this;
    }

    startTimer() {
        const oneSecondInMilliseconds = 1000;
        this.timerInterval = setInterval(() => {
            if (this.#timeRemaining === 0) {
                this.stopTimer();
                this.#roundComplete();
                return;
            }
            this.#timeRemaining--;
            this.setTimerText();
        }, oneSecondInMilliseconds);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    #roundComplete() {
        if (this.#roundsLeft === 0) {
            this.#roundsLeft = this.#timerConfig.roundsBeforeBreak;
            this.#timeRemaining = this.#timerConfig.breakTime_SEC;
        } else {
            this.#roundsLeft--;
            this.#timeRemaining = this.#timerConfig.roundTime_SEC;
        }
    }

    isActive() {
        return this.#timerInterval !== null;
    }

    setTimerConfig(timerConfig) {
        this.#timerConfig = timerConfig;
        this.#timeRemaining = timerConfig.roundTime_SEC;
    }

	setTimerText() {
        const updateTimerTextJS = () => {
            return `document.getElementById("timer-text").innerText = "${this.timeRemainingMMSS()}";`;
        }
		this.#MainWindow.webContents.executeJavaScript(updateTimerTextJS());
		this.#TimerWidgetWindow.webContents.executeJavaScript(updateTimerTextJS());
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
