import { periodicallyAuthCheck } from "./auth";

export class Timer {
  timerObj = null;

  start(time) {
    this.timerObj = setInterval(periodicallyAuthCheck, time);
  }

  stop() {
    clearInterval(this.timerObj);
    this.timerObj = null;
  }
}
