/**
 * Web Audio API Sound Synthesizer for Project ECHOES.
 * Pure procedural audio—requires zero external sound files or libraries.
 */
export class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.ambientGain = null;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.isHumming = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(enabled) {
    this.enabled = enabled;
    if (this.enabled) {
      this.init();
      this.startAmbientHum();
    } else {
      this.stopAmbientHum();
    }
    return this.enabled;
  }

  startAmbientHum() {
    if (!this.enabled || !this.ctx || this.isHumming) return;
    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(55.6, this.ctx.currentTime); // subtle beat frequency

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isHumming = true;
    } catch (e) {
      console.warn('Audio hum error:', e);
    }
  }

  stopAmbientHum() {
    if (!this.isHumming || !this.ambientGain || !this.ctx) return;
    try {
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        if (this.ambientOsc1) { this.ambientOsc1.stop(); this.ambientOsc1.disconnect(); }
        if (this.ambientOsc2) { this.ambientOsc2.stop(); this.ambientOsc2.disconnect(); }
        this.isHumming = false;
      }, 500);
    } catch (e) {
      this.isHumming = false;
    }
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playDiscovery() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    try {
      const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + (idx * 0.08);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    try {
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C major chime
      chords.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + (i * 0.05);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.85);
      });
    } catch (e) {}
  }

  playError() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }

  playWarning() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {}
  }

  playLoopReset() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    try {
      // Dramatic reverse sweep + white noise blast
      const sweep = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      sweep.type = 'sawtooth';
      sweep.frequency.setValueAtTime(80, this.ctx.currentTime);
      sweep.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 1.2);

      sweepGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      sweepGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 1.0);
      sweepGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      sweep.connect(sweepGain);
      sweepGain.connect(this.ctx.destination);
      sweep.start();
      sweep.stop(this.ctx.currentTime + 1.8);

      // Low sub boom on collapse
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(110, this.ctx.currentTime + 1.1);
      boom.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 2.2);

      boomGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      boomGain.gain.setValueAtTime(0.3, this.ctx.currentTime + 1.1);
      boomGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

      boom.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boom.start(this.ctx.currentTime + 1.1);
      boom.stop(this.ctx.currentTime + 2.3);
    } catch (e) {}
  }
}
