/**
 * Main Application Coordinator & Game State Machine for Project ECHOES.
 * Pure Vanilla JavaScript — zero external frameworks or dependencies.
 */
import { GameAPI } from './api.js';
import { SoundController } from './audio.js';
import { LoopTimer } from './timer.js';
import { ROOMS } from './rooms.js';
import { PuzzleController } from './puzzles.js';
import { NotebookController } from './notebook.js';

class EchoesGameApp {
  constructor() {
    this.api = new GameAPI();
    this.audio = new SoundController();
    this.state = null;
    this.allEvidence = [];
    this.currentView = 'TITLE_MENU'; // 'TITLE_MENU' | 'PLAYING' | 'ENDING'

    this.timer = new LoopTimer({
      duration: 600, // 10 minutes default
      onTick: (formatted, percent, remaining) => this.updateTimerDisplay(formatted, percent, remaining),
      onExpire: () => this.handleLoopExpired(),
      onWarning: () => this.handleTimerWarning()
    });

    this.puzzleController = new PuzzleController(this.api, this.audio, (puzzleId, evidenceId, state) => {
      this.handlePuzzleSolved(puzzleId, evidenceId, state);
    });

    this.notebookController = new NotebookController(this.api, this.audio);
  }

  async init() {
    // Check Java backend status
    await this.api.checkHealth();
    this.api.onStatusChange((status) => this.renderBackendStatus(status));
    this.renderBackendStatus({
      isJavaOnline: this.api.isJavaOnline,
      mode: this.api.isJavaOnline ? 'JAVA_BACKEND' : 'LOCAL_PREVIEW',
      endpoint: this.api.baseUrl
    });

    // Load static evidence catalog
    this.allEvidence = await this.api.getAllEvidence();

    // Check if a saved game exists to enable Continue button
    this.updateMenuButtons();

    // Bind all UI listeners
    this.bindUIEventListeners();
  }

  updateMenuButtons() {
    const continueBtn = document.getElementById('btn-continue-game');
    const hasSave = this.api.hasSavedGame();
    if (continueBtn) {
      continueBtn.disabled = !hasSave;
      if (!hasSave) {
        continueBtn.classList.add('opacity-40', 'cursor-not-allowed');
      } else {
        continueBtn.classList.remove('opacity-40', 'cursor-not-allowed');
      }
    }
  }

  renderBackendStatus(status) {
    const pill = document.getElementById('backend-status-pill');
    if (!pill) return;

    if (status.isJavaOnline) {
      pill.innerHTML = `
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
        <span class="text-emerald-300 font-mono text-[11px]">Java Server (port 8080)</span>
      `;
      pill.className = 'flex items-center px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-600/60 cursor-pointer';
    } else {
      pill.innerHTML = `
        <span class="inline-block w-2 h-2 rounded-full bg-sky-400 mr-1.5"></span>
        <span class="text-sky-300 font-mono text-[11px]">Local Engine (Preview Mode)</span>
      `;
      pill.className = 'flex items-center px-2.5 py-1 rounded bg-slate-900 border border-slate-700 cursor-pointer';
    }
  }

  bindUIEventListeners() {
    // Title Menu buttons
    const newGameBtn = document.getElementById('btn-new-game');
    const continueBtn = document.getElementById('btn-continue-game');
    const howToPlayBtn = document.getElementById('btn-how-to-play');
    const creditsBtn = document.getElementById('btn-credits');
    const backendStatusBtn = document.getElementById('backend-status-pill');

    if (newGameBtn) {
      newGameBtn.onclick = () => {
        this.audio.playClick();
        if (this.api.hasSavedGame()) {
          this.showModal('confirm-new-game-modal');
        } else {
          this.startInvestigation();
        }
      };
    }

    const confirmNewYes = document.getElementById('btn-confirm-new-yes');
    if (confirmNewYes) {
      confirmNewYes.onclick = () => {
        this.audio.playClick();
        this.hideModal('confirm-new-game-modal');
        this.startInvestigation();
      };
    }

    if (continueBtn) {
      continueBtn.onclick = async () => {
        this.audio.playClick();
        const res = await this.api.loadGame();
        if (res.success && res.state) {
          this.state = res.state;
          this.launchGameView();
        }
      };
    }

    if (howToPlayBtn) {
      howToPlayBtn.onclick = () => {
        this.audio.playClick();
        this.showModal('how-to-play-modal');
      };
    }

    if (creditsBtn) {
      creditsBtn.onclick = () => {
        this.audio.playClick();
        this.showModal('credits-modal');
      };
    }

    if (backendStatusBtn) {
      backendStatusBtn.onclick = () => {
        this.audio.playClick();
        this.showModal('backend-modal');
      };
    }

    // Header buttons
    const audioToggleBtn = document.getElementById('btn-toggle-audio');
    if (audioToggleBtn) {
      audioToggleBtn.onclick = () => {
        const isMuted = !this.audio.enabled;
        this.audio.toggle(isMuted);
        audioToggleBtn.textContent = isMuted ? 'AUDIO: ON' : 'AUDIO: OFF';
        audioToggleBtn.classList.toggle('text-teal-300', isMuted);
      };
    }

    const pauseBtn = document.getElementById('btn-pause-game');
    if (pauseBtn) {
      pauseBtn.onclick = () => {
        this.audio.playClick();
        const paused = this.timer.togglePause();
        pauseBtn.textContent = paused ? 'RESUME' : 'PAUSE';
        document.getElementById('pause-overlay').classList.toggle('hidden', !paused);
      };
    }

    const resumeBtn = document.getElementById('btn-resume-overlay');
    if (resumeBtn) {
      resumeBtn.onclick = () => {
        this.audio.playClick();
        this.timer.resume();
        pauseBtn.textContent = 'PAUSE';
        document.getElementById('pause-overlay').classList.add('hidden');
      };
    }

    const forceResetBtn = document.getElementById('btn-force-reset');
    if (forceResetBtn) {
      forceResetBtn.onclick = () => {
        this.audio.playClick();
        this.showModal('confirm-reset-modal');
      };
    }

    const confirmResetYes = document.getElementById('btn-confirm-reset-yes');
    if (confirmResetYes) {
      confirmResetYes.onclick = () => {
        this.audio.playClick();
        this.hideModal('confirm-reset-modal');
        this.executeLoopReset();
      };
    }

    // Dev 2-Minute loop toggle
    const devTimerToggle = document.getElementById('dev-timer-toggle');
    if (devTimerToggle) {
      devTimerToggle.onchange = (e) => {
        const isFast = e.target.checked;
        const dur = isFast ? 120 : 600;
        this.timer.setMode(dur);
      };
    }

    // Navigation drawers & modals
    const openNotebookBtn = document.getElementById('btn-open-notebook');
    if (openNotebookBtn) {
      openNotebookBtn.onclick = () => {
        this.audio.playClick();
        this.openNotebook();
      };
    }

    const openMapBtn = document.getElementById('btn-open-map');
    if (openMapBtn) {
      openMapBtn.onclick = () => {
        this.audio.playClick();
        this.showModal('facility-map-modal');
      };
    }

    // Modal close buttons (all elements with .modal-close)
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.onclick = () => {
        this.audio.playClick();
        const modal = btn.closest('.modal-backdrop');
        if (modal) modal.classList.add('hidden');
      };
    });

    // Facility map room fast-travel clicks
    document.querySelectorAll('[data-map-room]').forEach(el => {
      el.onclick = () => {
        const targetRoom = el.dataset.mapRoom;
        this.hideModal('facility-map-modal');
        this.navigateToRoom(targetRoom);
      };
    });

    // Loop Reset Debrief continue button
    const debriefContinueBtn = document.getElementById('btn-debrief-continue');
    if (debriefContinueBtn) {
      debriefContinueBtn.onclick = () => {
        this.audio.playClick();
        this.hideModal('loop-debrief-modal');
      };
    }

    // Final choices submission
    const submitEndingBtn = document.getElementById('btn-execute-ending');
    if (submitEndingBtn) {
      submitEndingBtn.onclick = () => {
        const selectedRadio = document.querySelector('input[name="ending_selection"]:checked');
        if (selectedRadio) {
          this.executeEnding(selectedRadio.value);
        }
      };
    }

    // Replay button on ending screen
    const replayBtn = document.getElementById('btn-replay-game');
    if (replayBtn) {
      replayBtn.onclick = () => {
        this.audio.playClick();
        document.getElementById('ending-screen').classList.add('hidden');
        document.getElementById('title-screen').classList.remove('hidden');
        this.currentView = 'TITLE_MENU';
        this.updateMenuButtons();
      };
    }

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop:not(.hidden)').forEach(m => {
          if (m.id !== 'loop-transition-overlay' && m.id !== 'ending-screen') {
            m.classList.add('hidden');
          }
        });
      } else if (e.key === ' ' && this.currentView === 'PLAYING') {
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag !== 'INPUT' && activeTag !== 'BUTTON') {
          e.preventDefault();
          pauseBtn?.click();
        }
      } else if ((e.key === 'n' || e.key === 'N') && this.currentView === 'PLAYING') {
        this.openNotebook();
      } else if ((e.key === 'm' || e.key === 'M') && this.currentView === 'PLAYING') {
        this.showModal('facility-map-modal');
      }
    });
  }

  async startInvestigation() {
    this.state = await this.api.startNewGame();
    this.launchGameView();
  }

  launchGameView() {
    this.currentView = 'PLAYING';
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    const devToggle = document.getElementById('dev-timer-toggle');
    const duration = devToggle && devToggle.checked ? 120 : 600;
    this.timer.reset(duration);

    this.renderCurrentRoom();
    this.updateHUD();
  }

  renderCurrentRoom() {
    const room = ROOMS[this.state.currentRoom] || ROOMS.SECURITY_OFFICE;
    const bannerTitle = document.getElementById('room-banner-title');
    const bannerSector = document.getElementById('room-banner-sector');
    const bannerDesc = document.getElementById('room-banner-desc');
    const sceneContainer = document.getElementById('room-scene-container');

    if (bannerTitle) bannerTitle.textContent = room.name;
    if (bannerSector) bannerSector.textContent = room.sector;
    if (bannerDesc) bannerDesc.textContent = room.description;

    if (sceneContainer) {
      sceneContainer.innerHTML = room.renderScene(this.state);
      this.bindRoomHotspots(sceneContainer);
    }

    this.updateAdjacentNav(room);
  }

  bindRoomHotspots(container) {
    const hotspots = container.querySelectorAll('.interactive-hotspot');
    hotspots.forEach(hs => {
      hs.onclick = () => {
        this.audio.playClick();
        const action = hs.dataset.action;
        if (action === 'navigate') {
          const target = hs.dataset.target;
          this.navigateToRoom(target);
        } else if (action === 'inspect') {
          const obj = hs.dataset.object;
          this.inspectObject(obj);
        } else if (action === 'puzzle') {
          const puzzleId = hs.dataset.puzzle;
          this.puzzleController.openPuzzle(puzzleId, this.state);
        } else if (action === 'ending_choice') {
          this.openEndingModal();
        }
      };
    });
  }

  updateAdjacentNav(room) {
    const navContainer = document.getElementById('room-adjacent-nav');
    if (!navContainer) return;

    navContainer.innerHTML = `
      <div class="text-[11px] text-slate-400 font-mono mb-1">Adjacent Portals:</div>
      <div class="flex flex-wrap gap-2">
        ${room.adjacentRoomIds.map(roomId => {
          const adj = ROOMS[roomId];
          const isBulkheadLocked = roomId === 'CONTROL_ROOM' && !this.state.unlockedDoors.includes('CORRIDOR_BULKHEAD') && !this.state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN');
          return `
            <button type="button" class="px-2.5 py-1 text-xs rounded border transition-colors ${isBulkheadLocked ? 'bg-slate-900 border-rose-900/60 text-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-teal-300'}" data-nav-room="${roomId}" ${isBulkheadLocked ? 'disabled' : ''}>
              &rarr; ${adj.name} ${isBulkheadLocked ? '[LOCKED BULKHEAD]' : ''}
            </button>
          `;
        }).join('')}
      </div>
    `;

    navContainer.querySelectorAll('[data-nav-room]').forEach(btn => {
      btn.onclick = () => {
        this.audio.playClick();
        this.navigateToRoom(btn.dataset.navRoom);
      };
    });
  }

  async navigateToRoom(roomId) {
    if (roomId === 'CONTROL_ROOM') {
      const isUnlocked = this.state.unlockedDoors.includes('CORRIDOR_BULKHEAD') || this.state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN');
      if (!isUnlocked) {
        this.showInspectionModal({
          title: 'Secured Bulkhead Interlock',
          category: 'SECURITY BARRIER',
          description: 'The heavy magnetic blast door to the Control Room is sealed. Stabilize the Chrono-Resonance Specimen Array in the Research Lab to release the magnetic clamp.',
          quote: 'Interlock status: ENGAGED'
        });
        this.audio.playError();
        return;
      }
    }

    this.state.currentRoom = roomId;
    this.renderCurrentRoom();
    this.updateHUD();
  }

  async inspectObject(objectId) {
    const res = await this.api.inspectObject(this.state.currentRoom, objectId);
    this.state = res.state;

    if (res.discoveredEvidenceId) {
      this.audio.playDiscovery();
      const item = this.allEvidence.find(e => e.id === res.discoveredEvidenceId);
      this.showInspectionModal({
        title: item ? item.title : 'New Discovery',
        category: item ? item.category : 'EVIDENCE',
        description: res.narrative,
        quote: item ? item.quote : null,
        isNew: true
      });
    } else {
      this.showInspectionModal({
        title: 'Area Inspection',
        category: 'OBSERVATION',
        description: res.narrative,
        quote: null,
        isNew: false
      });
    }

    this.renderCurrentRoom();
    this.updateHUD();
  }

  showInspectionModal(data) {
    const modal = document.getElementById('inspection-modal');
    document.getElementById('inspect-modal-title').textContent = data.title;
    document.getElementById('inspect-modal-category').textContent = data.category;
    document.getElementById('inspect-modal-desc').textContent = data.description;

    const quoteEl = document.getElementById('inspect-modal-quote');
    if (data.quote) {
      quoteEl.textContent = `"${data.quote}"`;
      quoteEl.classList.remove('hidden');
    } else {
      quoteEl.classList.add('hidden');
    }

    const banner = document.getElementById('inspect-modal-new-badge');
    if (data.isNew) {
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }

    modal.classList.remove('hidden');
  }

  handlePuzzleSolved(puzzleId, evidenceId, state) {
    this.state = state;
    this.renderCurrentRoom();
    this.updateHUD();
    setTimeout(() => {
      this.hideModal('puzzle-modal');
    }, 1200);
  }

  updateHUD() {
    const loopCounter = document.getElementById('hud-loop-counter');
    const evidenceCount = document.getElementById('hud-evidence-count');
    const objectiveText = document.getElementById('hud-active-objective');

    if (loopCounter) loopCounter.textContent = `LOOP 0${this.state.loopNumber}`;
    if (evidenceCount) evidenceCount.textContent = `${this.state.discoveredEvidenceIds.length}/${this.allEvidence.length}`;

    if (objectiveText) {
      if (!this.state.solvedPuzzleIds.includes('PUZZLE_A_DRAWER')) {
        objectiveText.textContent = 'Decipher the 4-digit code to open the security drawer in the Security Office.';
      } else if (!this.state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN')) {
        objectiveText.textContent = 'Harmonize the 3 isotope cylinders in the Research Lab to unlock the Control Room.';
      } else if (!this.state.solvedPuzzleIds.includes('PUZZLE_C_ARCHIVE')) {
        objectiveText.textContent = 'Crack the Project CHRONOS vault in the Archive Room to uncover Directive 84.';
      } else if (!this.state.solvedPuzzleIds.includes('PUZZLE_D_TIMELINE')) {
        objectiveText.textContent = 'Access the Master Terminal in the Control Room to reconstruct the incident timeline.';
      } else {
        objectiveText.textContent = 'All coordinates verified! Interact with the Resolution Console in the Control Room to decide the facility\'s fate.';
      }
    }
  }

  updateTimerDisplay(formatted, percent, remaining) {
    const timerDisplay = document.getElementById('hud-timer-display');
    const progressBar = document.getElementById('hud-timer-progress');

    if (timerDisplay) {
      timerDisplay.textContent = formatted;
      if (remaining <= 60) {
        timerDisplay.classList.add('text-amber-400', 'animate-pulse');
      } else {
        timerDisplay.classList.remove('text-amber-400', 'animate-pulse');
      }
    }

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
      if (remaining <= 60) {
        progressBar.className = 'h-1 bg-amber-500 transition-all duration-1000';
      } else {
        progressBar.className = 'h-1 bg-teal-400 transition-all duration-1000';
      }
    }
  }

  handleTimerWarning() {
    this.audio.playWarning();
  }

  handleLoopExpired() {
    this.executeLoopReset();
  }

  async executeLoopReset() {
    this.timer.stop();
    this.audio.playLoopReset();

    // Trigger dramatic visual transition overlay
    const transitionOverlay = document.getElementById('loop-transition-overlay');
    transitionOverlay.classList.remove('hidden');

    setTimeout(async () => {
      const res = await this.api.resetLoop();
      this.state = res.state;

      transitionOverlay.classList.add('hidden');

      // Show loop debrief
      const debriefModal = document.getElementById('loop-debrief-modal');
      document.getElementById('debrief-loop-title').textContent = `Loop 0${res.resetResult.newLoopNumber} Initiated — 09:47:12 AM`;
      document.getElementById('debrief-narrative').textContent = res.resetResult.narrativeMessage;

      const changesList = document.getElementById('debrief-changes-list');
      changesList.innerHTML = res.resetResult.environmentalChanges.map(c => `
        <li class="flex items-center gap-2 text-xs text-teal-300">
          <span class="text-teal-400">&bull;</span>
          <span>${c}</span>
        </li>
      `).join('');

      debriefModal.classList.remove('hidden');

      // Restart timer & re-render
      const devToggle = document.getElementById('dev-timer-toggle');
      const dur = devToggle && devToggle.checked ? 120 : 600;
      this.timer.reset(dur);

      this.renderCurrentRoom();
      this.updateHUD();
    }, 1800);
  }

  openNotebook() {
    this.notebookController.renderNotebook(this.state, this.allEvidence);
    this.showModal('notebook-modal');
  }

  openEndingModal() {
    const isTimelineSolved = this.state.solvedPuzzleIds.includes('PUZZLE_D_TIMELINE');
    if (!isTimelineSolved) {
      this.showInspectionModal({
        title: 'Timeline Interlock Armed',
        category: 'CONTROL TERMINAL',
        description: 'The master resolution mechanisms are locked. You must reconstruct the chronological order of the 5 incident events at the central terminal before executing a resolution directive.',
        quote: null
      });
      return;
    }

    // Check secret ending eligibility
    const hasEcho = this.state.discoveredEvidenceIds.includes('EVID_ECHO_REFLECTION');
    const hasVaneSecret = this.state.discoveredEvidenceIds.includes('EVID_SECRET_CONCORDANCE') || this.state.discoveredEvidenceIds.includes('EVID_RESONANCE_DATA');
    const hasDirective84 = this.state.discoveredEvidenceIds.includes('EVID_STERLING_CONFESSION');
    const secretUnlocked = hasEcho && hasVaneSecret && hasDirective84;

    const secretEndingOption = document.getElementById('ending-option-3-wrapper');
    const secretEndingRadio = document.getElementById('ending-choice-3');
    if (secretEndingOption && secretEndingRadio) {
      if (secretUnlocked) {
        secretEndingOption.classList.remove('opacity-40');
        secretEndingRadio.disabled = false;
        document.getElementById('ending-3-badge').textContent = '[SECRET HARMONIC FREQUENCY UNLOCKED]';
        document.getElementById('ending-3-badge').className = 'text-[10px] font-mono text-teal-400';
      } else {
        secretEndingOption.classList.add('opacity-40');
        secretEndingRadio.disabled = true;
        document.getElementById('ending-3-badge').textContent = '[REQUIRES ECHO REFLECTION + VANE SECRET TRANSMISSION + DIRECTIVE 84]';
        document.getElementById('ending-3-badge').className = 'text-[10px] font-mono text-slate-500';
      }
    }

    this.showModal('ending-choice-modal');
  }

  async executeEnding(endingChoice) {
    this.timer.stop();
    this.audio.playSuccess();
    this.hideModal('ending-choice-modal');

    const res = await this.api.evaluateEnding(endingChoice);
    const ending = res.ending;
    this.state = res.state;

    this.renderEndingScreen(ending);
  }

  renderEndingScreen(ending) {
    this.currentView = 'ENDING';
    document.getElementById('game-screen').classList.add('hidden');
    const screen = document.getElementById('ending-screen');
    screen.classList.remove('hidden');

    document.getElementById('ending-screen-title').textContent = ending.title;
    document.getElementById('ending-screen-subtitle').textContent = ending.subtitle;
    document.getElementById('ending-screen-narrative').textContent = ending.narrative;

    document.getElementById('ending-stat-loops').textContent = ending.loopsUsed;
    document.getElementById('ending-stat-evidence').textContent = `${ending.evidenceDiscovered}/${this.allEvidence.length}`;
    document.getElementById('ending-stat-puzzles').textContent = `${ending.totalPuzzlesSolved}/4`;
  }

  showModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('hidden');
  }

  hideModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('hidden');
  }
}

// Instantiate and start on window load
window.addEventListener('DOMContentLoaded', () => {
  const app = new EchoesGameApp();
  app.init();
});
