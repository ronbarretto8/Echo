/**
 * Investigation Notebook & Evidence Registry for Project ECHOES.
 * Features categorized evidence tabs, suspect dossiers, timeline records, and clue connection networks.
 */

export class NotebookController {
  constructor(api, audio) {
    this.api = api;
    this.audio = audio;
    this.activeTab = 'evidence'; // 'evidence' | 'timeline' | 'suspects' | 'connections'
    this.activeFilter = 'ALL'; // 'ALL' | 'SECURITY_OFFICE' | 'RESEARCH_LAB' | 'ARCHIVE_ROOM' | 'OBSERVATION_CORRIDOR' | 'CONTROL_ROOM'
  }

  renderNotebook(state, allEvidence) {
    const container = document.getElementById('notebook-content');
    if (!container) return;

    const totalClues = allEvidence.length;
    const discoveredClues = allEvidence.filter(e => state.discoveredEvidenceIds.includes(e.id));
    const completionPercent = Math.round((discoveredClues.length / totalClues) * 100);

    container.innerHTML = `
      <div class="notebook-inner flex flex-col h-full">
        <!-- Notebook Header & Tab Bar -->
        <div class="notebook-header border-b border-slate-700/80 pb-3 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-4">
            <h2 class="text-base font-bold text-slate-100 tracking-wide uppercase">Investigation Dossier</h2>
            <div class="text-xs text-slate-400 font-mono">
              Progress: <span class="text-teal-400 font-bold">${completionPercent}%</span> (${discoveredClues.length}/${totalClues} Clues)
            </div>
          </div>

          <div class="notebook-nav-tabs flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800">
            <button type="button" class="tab-btn px-3 py-1 text-xs rounded transition-colors ${this.activeTab === 'evidence' ? 'bg-slate-700 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}" data-tab="evidence">
              Evidence Log
            </button>
            <button type="button" class="tab-btn px-3 py-1 text-xs rounded transition-colors ${this.activeTab === 'timeline' ? 'bg-slate-700 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}" data-tab="timeline">
              Chronology
            </button>
            <button type="button" class="tab-btn px-3 py-1 text-xs rounded transition-colors ${this.activeTab === 'suspects' ? 'bg-slate-700 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}" data-tab="suspects">
              Suspects & Lore
            </button>
            <button type="button" class="tab-btn px-3 py-1 text-xs rounded transition-colors ${this.activeTab === 'connections' ? 'bg-slate-700 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}" data-tab="connections">
              Deduction Web
            </button>
          </div>
        </div>

        <!-- Tab Body -->
        <div class="notebook-body overflow-y-auto flex-1 pr-1 custom-scrollbar">
          ${this.renderTabBody(state, allEvidence, discoveredClues)}
        </div>
      </div>
    `;

    this.bindEvents(state, allEvidence);
  }

  renderTabBody(state, allEvidence, discoveredClues) {
    if (this.activeTab === 'evidence') {
      return this.renderEvidenceTab(state, allEvidence, discoveredClues);
    } else if (this.activeTab === 'timeline') {
      return this.renderTimelineTab(state);
    } else if (this.activeTab === 'suspects') {
      return this.renderSuspectsTab(state);
    } else if (this.activeTab === 'connections') {
      return this.renderConnectionsTab(state, discoveredClues);
    }
    return '';
  }

  renderEvidenceTab(state, allEvidence, discoveredClues) {
    // Filter controls
    const rooms = [
      { id: 'ALL', label: 'All Rooms' },
      { id: 'SECURITY_OFFICE', label: 'Security' },
      { id: 'RESEARCH_LAB', label: 'Lab' },
      { id: 'ARCHIVE_ROOM', label: 'Archive' },
      { id: 'OBSERVATION_CORRIDOR', label: 'Corridor' },
      { id: 'CONTROL_ROOM', label: 'Control' }
    ];

    const filtered = this.activeFilter === 'ALL'
      ? discoveredClues
      : discoveredClues.filter(c => c.room === this.activeFilter);

    return `
      <div class="filter-bar flex flex-wrap gap-1 mb-4">
        ${rooms.map(r => `
          <button type="button" class="room-filter-btn text-[11px] px-2.5 py-1 rounded border transition-colors ${this.activeFilter === r.id ? 'bg-teal-950/80 border-teal-500 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}" data-filter="${r.id}">
            ${r.label}
          </button>
        `).join('')}
      </div>

      ${filtered.length === 0 ? `
        <div class="empty-state text-center py-12 border border-dashed border-slate-800 rounded p-6">
          <p class="text-sm text-slate-400 font-medium">No discoveries recorded in this sector yet.</p>
          <p class="text-xs text-slate-500 mt-1">Investigate interactive objects in the facility rooms to collect evidence across loops.</p>
        </div>
      ` : `
        <div class="evidence-grid grid grid-cols-1 md:grid-cols-2 gap-3">
          ${filtered.map(item => `
            <div class="evidence-card p-3 bg-slate-900/90 border border-slate-800 hover:border-slate-600 rounded transition-all cursor-pointer" data-evidence-id="${item.id}">
              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="text-xs font-semibold text-slate-200">${item.title}</span>
                <span class="text-[10px] font-mono text-teal-400 tracking-wider">${item.category}</span>
              </div>
              <p class="text-xs text-slate-400 line-clamp-2 mb-2">${item.description}</p>
              ${item.quote ? `
                <div class="text-[11px] text-slate-300 italic border-l-2 border-teal-600/60 pl-2 py-0.5 bg-slate-950/50">
                  "${item.quote}"
                </div>
              ` : ''}
              <div class="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>Sector: ${item.room.replace('_', ' ')}</span>
                <span class="text-teal-400 hover:underline">Inspect Detail &rarr;</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  }

  renderTimelineTab(state) {
    const events = [
      {
        time: '09:00:00',
        title: 'Chrono-Harmonic Project Setup',
        desc: 'Dr. Evelyn Vane initiates containment test of tachyon isotopes in the Research Laboratory.',
        unlocked: state.discoveredEvidenceIds.includes('EVID_VANE_LAB_NOTE')
      },
      {
        time: '09:35:10',
        title: 'Unscheduled Core Overclock',
        desc: 'Annex Director Dr. Arthur Sterling secretly overrides thermal dampeners, seeking continuous temporal recursion.',
        unlocked: state.discoveredEvidenceIds.includes('EVID_STERLING_CONFESSION')
      },
      {
        time: '09:40:45',
        title: 'Facility Lockdown & Security Memo',
        desc: 'Chief Marcus Reyes notices time tremors and orders security lockbox sealed under code 7490.',
        unlocked: state.discoveredEvidenceIds.includes('EVID_GUARD_LOG')
      },
      {
        time: '09:44:20',
        title: 'Dr. Vane Emergency Abort Attempt',
        desc: 'Dr. Vane attempts manual core SCRAM to prevent the destruction of spacetime, but is locked out by Directive 84.',
        unlocked: state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN')
      },
      {
        time: '09:47:12',
        title: 'The Catastrophic Spacetime Lock',
        desc: 'Resonance coils collapse. Spacetime fractures into a closed 10-minute loop. All moments now loop back to this instant.',
        unlocked: state.discoveredEvidenceIds.includes('EVID_CLOCK_ANOMALY')
      }
    ];

    return `
      <div class="timeline-wrapper space-y-3">
        <p class="text-xs text-slate-400 mb-4">Reconstruction of the events on the morning of October 26 prior to the time loop:</p>
        <div class="timeline-track relative pl-6 border-l border-slate-800 space-y-4">
          ${events.map(e => `
            <div class="timeline-node relative">
              <div class="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 ${e.unlocked ? 'bg-teal-500 border-teal-300' : 'bg-slate-900 border-slate-700'}"></div>
              <div class="p-3 bg-slate-900/80 border ${e.unlocked ? 'border-slate-700' : 'border-slate-800 opacity-50'} rounded">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-mono text-xs text-teal-400">${e.time}</span>
                  <span class="text-xs font-bold text-slate-200">${e.unlocked ? e.title : '[UNKNOWN INCIDENT PHASE]'}</span>
                </div>
                <p class="text-xs text-slate-400">${e.unlocked ? e.desc : 'Discover more clues in the archives and laboratories to reconstruct this timestamp.'}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderSuspectsTab(state) {
    const hasSterlingConfession = state.discoveredEvidenceIds.includes('EVID_STERLING_CONFESSION');
    const hasVaneSecret = state.discoveredEvidenceIds.includes('EVID_SECRET_CONCORDANCE');

    return `
      <div class="suspects-wrapper space-y-4">
        <!-- Dr. Arthur Sterling -->
        <div class="suspect-card p-4 bg-slate-900 border border-slate-800 rounded">
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 class="text-sm font-bold text-slate-100">Dr. Arthur Sterling</h3>
              <div class="text-xs text-amber-400">Annex Director & Project Overseer</div>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded ${hasSterlingConfession ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-400'}">
              ${hasSterlingConfession ? 'PRIMARY SUSPECT: CULPRIT' : 'PERSON OF INTEREST'}
            </span>
          </div>
          <p class="text-xs text-slate-300 mb-2">
            Spearheaded Project CHRONOS. Originally claimed the loop was an unforeseeable quantum malfunction caused by external equipment.
          </p>
          ${hasSterlingConfession ? `
            <div class="p-2.5 bg-rose-950/40 border border-rose-900/60 rounded text-xs text-rose-200">
              <span class="font-semibold text-rose-300">Contradiction Unmasked:</span> Classified Directive #84 proves Sterling intentionally activated the temporal lock to prevent the board from defunding his life's work.
            </div>
          ` : `
            <div class="text-[11px] text-slate-500 italic">Inspect the Archive Room vault to verify his true intentions.</div>
          `}
        </div>

        <!-- Dr. Evelyn Vane -->
        <div class="suspect-card p-4 bg-slate-900 border border-slate-800 rounded">
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 class="text-sm font-bold text-slate-100">Dr. Evelyn Vane</h3>
              <div class="text-xs text-teal-400">Lead Temporal Physicist</div>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded ${hasVaneSecret ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'}">
              ${hasVaneSecret ? 'EXONERATED: WHISTLEBLOWER' : 'ACCUSED IN EARLY LOGS'}
            </span>
          </div>
          <p class="text-xs text-slate-300 mb-2">
            Security terminals initially accused her of cutting cables and attempting to sabotage the mainframe at 09:40.
          </p>
          <div class="p-2.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300">
            <span class="font-semibold text-teal-400">Harmonic Discovery:</span> Her personal notes reveal she was trying to execute an emergency SCRAM because the core's temporal radiation threatened to incinerate everyone inside.
          </div>
        </div>

        <!-- Chief Marcus Reyes -->
        <div class="suspect-card p-4 bg-slate-900 border border-slate-800 rounded">
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 class="text-sm font-bold text-slate-100">Chief Marcus Reyes</h3>
              <div class="text-xs text-slate-400">Head of Facility Security</div>
            </div>
            <span class="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">WITNESS</span>
          </div>
          <p class="text-xs text-slate-300">
            Left meticulous shift logs in the security office. His notes documented that the staff had been experiencing severe déjà vu and temporal slips weeks before the catastrophe.
          </p>
        </div>
      </div>
    `;
  }

  renderConnectionsTab(state, discoveredClues) {
    const connections = [
      {
        id: 'CONN_1',
        title: 'The Shift Combination Connection',
        clues: ['EVID_CLOCK_ANOMALY', 'EVID_GUARD_LOG'],
        deduction: 'The frozen time (09:47) combined with Chief Reyes\' sector 7 shift rule deduces the 4-digit code: 7490.',
        unlocked: state.discoveredEvidenceIds.includes('EVID_CLOCK_ANOMALY') && state.discoveredEvidenceIds.includes('EVID_GUARD_LOG')
      },
      {
        id: 'CONN_2',
        title: 'Chrono-Resonance Half-Life Order',
        clues: ['EVID_VANE_LAB_NOTE', 'EVID_RESONANCE_DATA'],
        deduction: 'Dr. Vane\'s notes dictate stabilizing the specimen array in atomic decay order: Alpha (142h) -> Gamma (48h) -> Beta (0.14h).',
        unlocked: state.discoveredEvidenceIds.includes('EVID_VANE_LAB_NOTE')
      },
      {
        id: 'CONN_3',
        title: 'Directive #84 & Archive Code',
        clues: ['EVID_MISSING_DOSSIER_TAG', 'EVID_UV_MICROFILM', 'EVID_STERLING_CONFESSION'],
        deduction: 'The empty dossier slot 84 cross-referenced with UV markings creates code ASTRA-842, exposing Sterling\'s premeditated loop trigger.',
        unlocked: state.discoveredEvidenceIds.includes('EVID_UV_MICROFILM')
      },
      {
        id: 'CONN_4',
        title: 'Harmonic Escape Frequency (Secret)',
        clues: ['EVID_ECHO_REFLECTION', 'EVID_RESONANCE_DATA', 'EVID_SECRET_CONCORDANCE'],
        deduction: 'The temporal shadow in the corridor combined with Dr. Vane\'s 432.8 Hz harmonic equation enables Ending 3: The Final Echo.',
        unlocked: state.discoveredEvidenceIds.includes('EVID_ECHO_REFLECTION') && state.discoveredEvidenceIds.includes('EVID_RESONANCE_DATA')
      }
    ];

    return `
      <div class="connections-wrapper space-y-3">
        <p class="text-xs text-slate-400 mb-3">Interconnected deductions linking your discovered clues across loops:</p>
        <div class="grid grid-cols-1 gap-3">
          ${connections.map(c => `
            <div class="p-3 bg-slate-900 border ${c.unlocked ? 'border-teal-700/60 bg-teal-950/20' : 'border-slate-800 opacity-60'} rounded">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold ${c.unlocked ? 'text-teal-300' : 'text-slate-400'}">${c.title}</span>
                <span class="text-[10px] font-mono ${c.unlocked ? 'text-teal-400' : 'text-slate-500'}">
                  ${c.unlocked ? 'LINK ESTABLISHED' : 'UNVERIFIED LINK'}
                </span>
              </div>
              <p class="text-xs text-slate-300 mt-1">${c.unlocked ? c.deduction : 'Gather more related clues to form this deduction.'}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  bindEvents(state, allEvidence) {
    const tabButtons = document.querySelectorAll('.notebook-nav-tabs .tab-btn');
    tabButtons.forEach(btn => {
      btn.onclick = () => {
        this.audio.playClick();
        this.activeTab = btn.dataset.tab;
        this.renderNotebook(state, allEvidence);
      };
    });

    const filterButtons = document.querySelectorAll('.room-filter-btn');
    filterButtons.forEach(btn => {
      btn.onclick = () => {
        this.audio.playClick();
        this.activeFilter = btn.dataset.filter;
        this.renderNotebook(state, allEvidence);
      };
    });

    const evidenceCards = document.querySelectorAll('.evidence-card');
    evidenceCards.forEach(card => {
      card.onclick = () => {
        this.audio.playClick();
        const id = card.dataset.evidenceId;
        const item = allEvidence.find(e => e.id === id);
        if (item) {
          this.showEvidenceDetailModal(item);
        }
      };
    });
  }

  showEvidenceDetailModal(item) {
    const modal = document.getElementById('evidence-detail-modal');
    if (!modal) return;

    document.getElementById('evidence-detail-title').textContent = item.title;
    document.getElementById('evidence-detail-category').textContent = item.category;
    document.getElementById('evidence-detail-room').textContent = 'Location: ' + item.room.replace('_', ' ');
    document.getElementById('evidence-detail-desc').textContent = item.description;

    const quoteEl = document.getElementById('evidence-detail-quote');
    if (item.quote) {
      quoteEl.textContent = `"${item.quote}"`;
      quoteEl.classList.remove('hidden');
    } else {
      quoteEl.classList.add('hidden');
    }

    modal.classList.remove('hidden');
  }
}
