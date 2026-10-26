/**
 * Interactive Puzzle UI Controllers for Project ECHOES.
 * Implements interactive visual interfaces for Puzzles A, B, C, and D.
 */

export class PuzzleController {
  constructor(api, audio, onSolveCallback) {
    this.api = api;
    this.audio = audio;
    this.onSolveCallback = onSolveCallback || (() => {});
    this.currentPuzzleId = null;

    // Specimen sequencer state (Puzzle B)
    this.specimenSequence = [];

    // Timeline event state (Puzzle D)
    this.timelineEvents = [
      { id: 'EVENT_2_POWER_SPIKE', text: 'Unscheduled Power Spike in Tachyon Core (+240%)' },
      { id: 'EVENT_5_FIELD_COLLAPSE', text: 'Spacetime Containment Collapse at 09:47:12' },
      { id: 'EVENT_1_EXPERIMENT', text: 'Dr. Vane begins Chrono-Harmonic Resonance Test' },
      { id: 'EVENT_4_VANE_SABOTAGE', text: 'Dr. Vane attempts Manual SCRAM to protect crew' },
      { id: 'EVENT_3_STERLING_OVERRIDE', text: 'Dr. Sterling executes Directive 84 Lockdown' }
    ];
  }

  openPuzzle(puzzleId, state) {
    this.currentPuzzleId = puzzleId;
    const modal = document.getElementById('puzzle-modal');
    const container = document.getElementById('puzzle-content');
    const titleEl = document.getElementById('puzzle-modal-title');
    const descEl = document.getElementById('puzzle-modal-desc');
    const feedbackEl = document.getElementById('puzzle-feedback');

    feedbackEl.innerHTML = '';
    feedbackEl.className = 'puzzle-feedback-box hidden';

    if (puzzleId === 'PUZZLE_A_DRAWER') {
      titleEl.textContent = 'Puzzle A: Security Desk Combination Drawer';
      descEl.textContent = 'Enter the 4-digit security code. (Hint: Check the Security Log and the frozen wall clock).';
      container.innerHTML = this.renderPuzzleA(state);
      this.bindPuzzleA();
    } else if (puzzleId === 'PUZZLE_B_SPECIMEN') {
      titleEl.textContent = 'Puzzle B: Chrono-Resonance Specimen Array';
      descEl.textContent = 'Arrange the three temporal isotopes in atomic decay sequence. (Hint: Review Dr. Vane’s handwritten notes).';
      this.specimenSequence = [];
      container.innerHTML = this.renderPuzzleB(state);
      this.bindPuzzleB();
    } else if (puzzleId === 'PUZZLE_C_ARCHIVE') {
      titleEl.textContent = 'Puzzle C: Project Chronos Classified Vault';
      descEl.textContent = 'Enter the vault alphanumeric authorization code. (Hint: Cross-reference the dossier gap with the UV reading desk).';
      container.innerHTML = this.renderPuzzleC(state);
      this.bindPuzzleC();
    } else if (puzzleId === 'PUZZLE_D_TIMELINE') {
      titleEl.textContent = 'Puzzle D: Temporal Alignment Sequencer';
      descEl.textContent = 'Reconstruct the true chronological order of events that triggered the 10-minute recursion loop at 09:47.';
      container.innerHTML = this.renderPuzzleD(state);
      this.bindPuzzleD();
    }

    modal.classList.remove('hidden');
  }

  // PUZZLE A — 4-Digit Combination Tumbler
  renderPuzzleA(state) {
    const isSolved = state.solvedPuzzleIds.includes('PUZZLE_A_DRAWER');
    return `
      <div class="keypad-wrapper">
        <div class="display-screen font-mono" id="puzzle-a-display">
          ${isSolved ? '7490' : '----'}
        </div>
        <div class="keypad-grid">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'CLEAR', 0, 'ENTER'].map(k => `
            <button type="button" class="keypad-btn ${k === 'ENTER' ? 'btn-enter' : ''}" data-val="${k}" ${isSolved ? 'disabled' : ''}>
              ${k}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  bindPuzzleA() {
    let currentInput = '';
    const display = document.getElementById('puzzle-a-display');
    const buttons = document.querySelectorAll('.keypad-btn');

    buttons.forEach(btn => {
      btn.onclick = () => {
        this.audio.playClick();
        const val = btn.dataset.val;
        if (val === 'CLEAR') {
          currentInput = '';
          display.textContent = '----';
        } else if (val === 'ENTER') {
          if (currentInput.length === 4) {
            this.submitAnswer('PUZZLE_A_DRAWER', currentInput);
          } else {
            this.showFeedback('Enter all 4 digits before pressing ENTER.', 'error');
            this.audio.playError();
          }
        } else {
          if (currentInput.length < 4) {
            currentInput += val;
            display.textContent = currentInput.padEnd(4, '-');
          }
        }
      };
    });
  }

  // PUZZLE B — Specimen Sequence
  renderPuzzleB(state) {
    const isSolved = state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN');
    return `
      <div class="specimen-puzzle-wrapper">
        <p class="text-xs text-slate-400 mb-3">Click each specimen cylinder in sequence to load into the resonance chamber:</p>
        <div class="specimen-selection-row">
          <button type="button" class="specimen-card" data-isotope="ALPHA" ${isSolved ? 'disabled' : ''}>
            <div class="specimen-icon bg-sky-500/20 border border-sky-400">
              <span class="text-sky-400 font-bold font-mono">α</span>
            </div>
            <div class="text-xs font-semibold text-slate-200">Chronite-Alpha</div>
            <div class="text-[11px] text-slate-400">Half-life: 142.8 hr</div>
          </button>
          <button type="button" class="specimen-card" data-isotope="GAMMA" ${isSolved ? 'disabled' : ''}>
            <div class="specimen-icon bg-amber-500/20 border border-amber-400">
              <span class="text-amber-400 font-bold font-mono">γ</span>
            </div>
            <div class="text-xs font-semibold text-slate-200">Flux-Gamma</div>
            <div class="text-[11px] text-slate-400">Half-life: 48.2 hr</div>
          </button>
          <button type="button" class="specimen-card" data-isotope="BETA" ${isSolved ? 'disabled' : ''}>
            <div class="specimen-icon bg-teal-500/20 border border-teal-400">
              <span class="text-teal-400 font-bold font-mono">β</span>
            </div>
            <div class="text-xs font-semibold text-slate-200">Tachyon-Beta</div>
            <div class="text-[11px] text-slate-400">Half-life: 0.14 hr</div>
          </button>
        </div>

        <div class="chamber-queue mt-4 p-3 bg-slate-900 border border-slate-700 rounded">
          <div class="text-xs text-slate-400 mb-1">Loaded Sequence Chamber:</div>
          <div class="font-mono text-sm tracking-wider text-teal-400" id="specimen-sequence-display">
            ${isSolved ? 'ALPHA -> GAMMA -> BETA [STABLE]' : '[EMPTY]'}
          </div>
        </div>

        <div class="mt-4 flex gap-2 justify-end">
          <button type="button" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded" id="btn-reset-specimens" ${isSolved ? 'disabled' : ''}>
            Clear Chamber
          </button>
          <button type="button" class="px-4 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white font-medium rounded" id="btn-verify-specimens" ${isSolved ? 'disabled' : ''}>
            Energize Coils
          </button>
        </div>
      </div>
    `;
  }

  bindPuzzleB() {
    const cards = document.querySelectorAll('.specimen-card');
    const display = document.getElementById('specimen-sequence-display');
    const resetBtn = document.getElementById('btn-reset-specimens');
    const verifyBtn = document.getElementById('btn-verify-specimens');

    cards.forEach(card => {
      card.onclick = () => {
        this.audio.playClick();
        const isotope = card.dataset.isotope;
        if (!this.specimenSequence.includes(isotope)) {
          this.specimenSequence.push(isotope);
          display.textContent = this.specimenSequence.join(' -> ');
          card.classList.add('opacity-40');
        }
      };
    });

    if (resetBtn) {
      resetBtn.onclick = () => {
        this.audio.playClick();
        this.specimenSequence = [];
        display.textContent = '[EMPTY]';
        cards.forEach(c => c.classList.remove('opacity-40'));
      };
    }

    if (verifyBtn) {
      verifyBtn.onclick = () => {
        if (this.specimenSequence.length !== 3) {
          this.showFeedback('Please select all 3 isotope cylinders before energizing coils.', 'error');
          this.audio.playError();
          return;
        }
        this.submitAnswer('PUZZLE_B_SPECIMEN', this.specimenSequence.join(','));
      };
    }
  }

  // PUZZLE C — Archive Vault Alphanumeric Code
  renderPuzzleC(state) {
    const isSolved = state.solvedPuzzleIds.includes('PUZZLE_C_ARCHIVE');
    return `
      <div class="archive-puzzle-wrapper">
        <div class="display-screen font-mono text-center mb-3" id="puzzle-c-display">
          ${isSolved ? 'ASTRA-842' : 'ENTER CODE'}
        </div>

        <div class="flex gap-2 mb-3">
          <button type="button" class="prefix-btn px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700" data-prefix="ASTRA-">
            ASTRA-
          </button>
          <button type="button" class="prefix-btn px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700" data-prefix="CHRONO-">
            CHRONO-
          </button>
          <button type="button" class="prefix-btn px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700" data-prefix="VECTOR-">
            VECTOR-
          </button>
        </div>

        <div class="keypad-grid">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'CLEAR', 0, 'SUBMIT'].map(k => `
            <button type="button" class="keypad-btn ${k === 'SUBMIT' ? 'btn-enter' : ''}" data-cval="${k}" ${isSolved ? 'disabled' : ''}>
              ${k}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  bindPuzzleC() {
    let inputStr = '';
    const display = document.getElementById('puzzle-c-display');
    const prefixBtns = document.querySelectorAll('.prefix-btn');
    const keys = document.querySelectorAll('[data-cval]');

    prefixBtns.forEach(btn => {
      btn.onclick = () => {
        this.audio.playClick();
        inputStr = btn.dataset.prefix;
        display.textContent = inputStr;
      };
    });

    keys.forEach(k => {
      k.onclick = () => {
        this.audio.playClick();
        const val = k.dataset.cval;
        if (val === 'CLEAR') {
          inputStr = '';
          display.textContent = 'ENTER CODE';
        } else if (val === 'SUBMIT') {
          if (inputStr.length >= 6) {
            this.submitAnswer('PUZZLE_C_ARCHIVE', inputStr);
          } else {
            this.showFeedback('Select a department prefix and file index numbers.', 'error');
            this.audio.playError();
          }
        } else {
          inputStr += val;
          display.textContent = inputStr;
        }
      };
    });
  }

  // PUZZLE D — Timeline Alignment Sequencer
  renderPuzzleD(state) {
    const isSolved = state.solvedPuzzleIds.includes('PUZZLE_D_TIMELINE');
    return `
      <div class="timeline-puzzle-wrapper">
        <p class="text-xs text-slate-400 mb-2">Reorder the 5 critical events in chronological order from earliest to latest:</p>
        <div class="timeline-event-list space-y-1.5" id="timeline-list">
          ${this.timelineEvents.map((evt, idx) => `
            <div class="timeline-event-item p-2 bg-slate-900 border border-slate-700 rounded flex items-center justify-between text-xs" data-event-id="${evt.id}">
              <div class="flex items-center gap-2">
                <span class="font-mono text-slate-500">${idx + 1}.</span>
                <span class="text-slate-200">${evt.text}</span>
              </div>
              <div class="flex gap-1 shrink-0">
                <button type="button" class="btn-move-up p-1 hover:bg-slate-800 text-slate-400 rounded" data-idx="${idx}" ${isSolved || idx === 0 ? 'disabled' : ''}>▲</button>
                <button type="button" class="btn-move-down p-1 hover:bg-slate-800 text-slate-400 rounded" data-idx="${idx}" ${isSolved || idx === this.timelineEvents.length - 1 ? 'disabled' : ''}>▼</button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="mt-4 flex justify-end">
          <button type="button" class="px-4 py-2 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium rounded" id="btn-submit-timeline" ${isSolved ? 'disabled' : ''}>
            Lock Spacetime Coordinates
          </button>
        </div>
      </div>
    `;
  }

  bindPuzzleD() {
    const listContainer = document.getElementById('timeline-list');
    const submitBtn = document.getElementById('btn-submit-timeline');

    const updateUI = () => {
      const items = listContainer.querySelectorAll('.timeline-event-item');
      items.forEach((item, idx) => {
        const numSpan = item.querySelector('.font-mono');
        if (numSpan) numSpan.textContent = `${idx + 1}.`;
      });
    };

    listContainer.onclick = (e) => {
      const upBtn = e.target.closest('.btn-move-up');
      const downBtn = e.target.closest('.btn-move-down');
      if (upBtn) {
        this.audio.playClick();
        const idx = parseInt(upBtn.dataset.idx, 10);
        if (idx > 0) {
          const temp = this.timelineEvents[idx];
          this.timelineEvents[idx] = this.timelineEvents[idx - 1];
          this.timelineEvents[idx - 1] = temp;
          document.getElementById('puzzle-content').innerHTML = this.renderPuzzleD({ solvedPuzzleIds: [] });
          this.bindPuzzleD();
        }
      } else if (downBtn) {
        this.audio.playClick();
        const idx = parseInt(downBtn.dataset.idx, 10);
        if (idx < this.timelineEvents.length - 1) {
          const temp = this.timelineEvents[idx];
          this.timelineEvents[idx] = this.timelineEvents[idx + 1];
          this.timelineEvents[idx + 1] = temp;
          document.getElementById('puzzle-content').innerHTML = this.renderPuzzleD({ solvedPuzzleIds: [] });
          this.bindPuzzleD();
        }
      }
    };

    if (submitBtn) {
      submitBtn.onclick = () => {
        const sequence = this.timelineEvents.map(e => e.id).join(',');
        this.submitAnswer('PUZZLE_D_TIMELINE', sequence);
      };
    }
  }

  async submitAnswer(puzzleId, solution) {
    const feedbackEl = document.getElementById('puzzle-feedback');
    feedbackEl.innerHTML = '<span class="text-slate-400">Verifying code coordinates...</span>';
    feedbackEl.classList.remove('hidden');

    const res = await this.api.submitPuzzle(puzzleId, solution);
    const result = res.puzzleResult;

    if (result.success) {
      this.audio.playSuccess();
      feedbackEl.className = 'puzzle-feedback-box bg-emerald-950/70 border border-emerald-600/60 text-emerald-300 p-3 rounded text-xs';
      feedbackEl.innerHTML = `
        <div class="font-bold mb-1">SUCCESS</div>
        <div>${result.message}</div>
      `;
      this.onSolveCallback(puzzleId, result.unlockedEvidenceId, res.state);
    } else {
      this.audio.playError();
      feedbackEl.className = 'puzzle-feedback-box bg-rose-950/70 border border-rose-600/60 text-rose-300 p-3 rounded text-xs';
      let html = `<div class="font-bold mb-1">VERIFICATION FAILED</div><div>${result.message}</div>`;
      if (result.hint) {
        html += `<div class="mt-2 pt-2 border-t border-rose-800/50 text-amber-300 font-sans"><span class="font-semibold">Hint (Tier ${result.hintTier}):</span> ${result.hint}</div>`;
      }
      feedbackEl.innerHTML = html;
    }
  }

  showFeedback(message, type = 'error') {
    const feedbackEl = document.getElementById('puzzle-feedback');
    feedbackEl.className = type === 'error'
      ? 'puzzle-feedback-box bg-rose-950/70 border border-rose-600/60 text-rose-300 p-2.5 rounded text-xs'
      : 'puzzle-feedback-box bg-emerald-950/70 border border-emerald-600/60 text-emerald-300 p-2.5 rounded text-xs';
    feedbackEl.textContent = message;
    feedbackEl.classList.remove('hidden');
  }
}
