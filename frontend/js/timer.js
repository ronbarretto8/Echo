/**
 * Real-Time Countdown Timer for Project ECHOES.
 * Configurable 10-minute / 2-minute loop duration with pausing, penalties and warning states.
 */
export class LoopTimer {
  constructor(options = {}) {
    this.duration = options.duration || 600; // default 10 mins (600s)
    this.remaining = this.duration;
    this.isPaused = false;
    this.intervalId = null;
    this.onTick = options.onTick || (() => {});
    this.onExpire = options.onExpire || (() => {});
    this.onWarning = options.onWarning || (() => {});
    this.hasWarned = false;
  }

  setMode(durationSeconds) {
    this.duration = durationSeconds;
    this.remaining = Math.min(this.remaining, durationSeconds);
    this.onTick(this.getFormattedTime(), this.getProgressPercent(), this.remaining);
  }

  start(initialSeconds = null) {
    this.stop();
    if (initialSeconds !== null) {
      this.remaining = initialSeconds;
    }
    this.isPaused = false;
    this.hasWarned = this.remaining <= 60;

    this.intervalId = setInterval(() => {
      if (this.isPaused) return;

      this.remaining -= 1;

      if (this.remaining <= 60 && !this.hasWarned) {
        this.hasWarned = true;
        this.onWarning(this.remaining);
      }

      this.onTick(this.getFormattedTime(), this.getProgressPercent(), this.remaining);

      if (this.remaining <= 0) {
        this.stop();
        this.onExpire();
      }
    }, 1000);

    this.onTick(this.getFormattedTime(), this.getProgressPercent(), this.remaining);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  reset(durationSeconds = null) {
    this.stop();
    if (durationSeconds) {
      this.duration = durationSeconds;
    }
    this.remaining = this.duration;
    this.hasWarned = false;
    this.isPaused = false;
    this.start();
  }

  deductTime(seconds) {
    this.remaining = Math.max(0, this.remaining - seconds);
    this.onTick(this.getFormattedTime(), this.getProgressPercent(), this.remaining);
    if (this.remaining <= 0) {
      this.stop();
      this.onExpire();
    }
  }

  getFormattedTime() {
    const mins = Math.floor(this.remaining / 60);
    const secs = this.remaining % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  getProgressPercent() {
    return Math.max(0, Math.min(100, (this.remaining / this.duration) * 100));
  }
}
