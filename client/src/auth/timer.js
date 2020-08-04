import { periodicallyAuthCheck } from "./auth";

function Timer(t) {
	var timerObj = setInterval(periodicallyAuthCheck, t);

	this.stop = function () {
		if (timerObj) {
			clearInterval(timerObj);
			timerObj = null;
		}
		return this;
	};

	this.start = function () {
		if (!timerObj) {
			this.stop();
			timerObj = setInterval(periodicallyAuthCheck, t);
		}
		return this;
	};
}

export const timer = new Timer(10000);
