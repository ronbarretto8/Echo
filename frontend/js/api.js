/**
 * Dual-Mode API Client for Project ECHOES.
 * Connects to Java GameServer at http://localhost:8080 when running,
 * or gracefully routes to LocalGameEngine in web preview environments.
 */
import { LocalGameEngine } from './engine.js';

export class GameAPI {
  constructor(baseUrl = 'http://localhost:8080') {
    this.baseUrl = baseUrl;
    this.isJavaOnline = false;
    this.localEngine = new LocalGameEngine();
    this.statusListeners = [];
  }

  onStatusChange(callback) {
    this.statusListeners.push(callback);
  }

  notifyStatus() {
    const status = {
      isJavaOnline: this.isJavaOnline,
      mode: this.isJavaOnline ? 'JAVA_BACKEND' : 'LOCAL_PREVIEW',
      endpoint: this.baseUrl
    };
    this.statusListeners.forEach(fn => fn(status));
  }

  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${this.baseUrl}/api/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        this.isJavaOnline = data.status === 'ONLINE';
      } else {
        this.isJavaOnline = false;
      }
    } catch (e) {
      this.isJavaOnline = false;
    }
    this.notifyStatus();
    return this.isJavaOnline;
  }

  async getState() {
    if (this.isJavaOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/api/state`);
        if (res.ok) return await res.json();
      } catch (e) {
        this.isJavaOnline = false;
        this.notifyStatus();
      }
    }
    return this.localEngine.getState();
  }

  async getAllEvidence() {
    if (this.isJavaOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/api/evidence`);
        if (res.ok) return await res.json();
      } catch (e) {
        this.isJavaOnline = false;
        this.notifyStatus();
      }
    }
    return this.localEngine.getAllEvidence();
  }

  async startNewGame() {
    if (this.isJavaOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/api/new-game`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {
        this.isJavaOnline = false;
        this.notifyStatus();
      }
    }
    return this.localEngine.startNewGame();
  }

  async inspectObject(roomId, objectId) {
    if (this.isJavaOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/api/inspect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, objectId })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        this.isJavaOnline = false;
        this.notifyStatus();
      }
    }
    return this.localEngine.inspectObject(roomId, objectId);
  }

  async submitPuzzle(puzzleId, solution) {
    if (this.isJavaOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/api/puzzle/solve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ puzzleId, solution })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        this.isJavaOnline = false;
        this.notifyStatus();
      }
    }
    return this.localEngine.submitPuzzle(puzzleId, solution);
  }

  async resetLoop() {
    if (this.isJavaOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/api/loop/reset`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {
        this.isJavaOnline = false;
        this.notifyStatus();
      }
    }
    return this.localEngine.resetLoop();
  }

  async evaluateEnding(endingChoice) {
    if (this.isJavaOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/api/ending/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endingChoice })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        this.isJavaOnline = false;
        this.notifyStatus();
      }
    }
    return this.localEngine.evaluateEnding(endingChoice);
  }

  async saveGame() {
    if (this.isJavaOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/api/save`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {
        this.isJavaOnline = false;
        this.notifyStatus();
      }
    }
    return this.localEngine.saveGame();
  }

  async loadGame() {
    if (this.isJavaOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/api/load`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {
        this.isJavaOnline = false;
        this.notifyStatus();
      }
    }
    return this.localEngine.loadGame();
  }

  hasSavedGame() {
    return this.localEngine.hasSaveGame();
  }

  async setPaused(paused) {
    if (this.isJavaOnline) {
      try {
        await fetch(`${this.baseUrl}/api/pause`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paused })
        });
      } catch (e) {}
    }
    this.localEngine.state.isPaused = paused;
  }
}
