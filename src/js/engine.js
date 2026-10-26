/**
 * Local Game Engine for Project ECHOES.
 * Mirror implementation of the Java Backend services (GameState, PuzzleService, EvidenceService, LoopService, EndingService, SaveService).
 * Provides 100% full gameplay execution directly in browser sandboxes.
 */

export class LocalGameEngine {
  constructor() {
    this.storageKey = 'echoes_saved_game_v1';
    this.allEvidence = [
      {
        id: 'EVID_CLOCK_ANOMALY',
        title: 'Frozen Dial Mechanism',
        category: 'OBSERVATION',
        room: 'SECURITY_OFFICE',
        description: 'The wall clock is locked at 09:47:12. The second hand twitches backward by one tick every second.',
        quote: 'Time didn\'t stop. It\'s vibrating in place like a plucked wire.',
        isSecret: false
      },
      {
        id: 'EVID_GUARD_LOG',
        title: 'Guard Shift Log (Oct 26)',
        category: 'DOCUMENT',
        room: 'SECURITY_OFFICE',
        description: 'Duty register noted by Chief Marcus Reyes. Highlights strange temporal shifts and contains shift locker memo.',
        quote: '09:40 - Dr. Vane rushed past holding magnetic drives. Dr. Sterling ordered lockdown at 09:45. Shift locker code mirrored from incident minute + sector 7.',
        isSecret: false
      },
      {
        id: 'EVID_KEYCARD_ALPHA',
        title: 'Keycard Alpha & Tape 01',
        category: 'OBJECT',
        room: 'SECURITY_OFFICE',
        description: 'Magnetic security pass retrieved from the locked drawer, alongside Dr. Sterling\'s audio log.',
        quote: 'Sterling Audio: "If the loop holds, we have achieved immortality. Ten minutes of perfection, repeated forever."',
        isSecret: false
      },
      {
        id: 'EVID_VANE_LAB_NOTE',
        title: 'Dr. Vane\'s Lab Notes',
        category: 'RESEARCH_NOTE',
        room: 'RESEARCH_LAB',
        description: 'Handwritten scrawl pinned to the resonance console with chemical formulas and safety warnings.',
        quote: 'Calibrate containment in atomic half-life order: Chronite-Alpha -> Flux-Gamma -> Tachyon-Beta. Sterling wants to overclock it. He is out of his mind.',
        isSecret: false
      },
      {
        id: 'EVID_RESONANCE_DATA',
        title: 'Resonance Stabilization Telemetry',
        category: 'RESEARCH_NOTE',
        room: 'RESEARCH_LAB',
        description: 'Calibrated data logs confirming the corridor blast door interlock frequency has unlocked.',
        quote: 'Field harmonic stable at 432.8 Hz. Blast bulkhead magnetic clamp disengaged.',
        isSecret: false
      },
      {
        id: 'EVID_MISSING_DOSSIER_TAG',
        title: 'Empty Dossier Slot #84',
        category: 'DOCUMENT',
        room: 'ARCHIVE_ROOM',
        description: 'A dust-free gap in the archive shelves labeled "ASTRA Incident 84-2: Recursive Trajectory Modeling".',
        quote: 'The folder was recently moved to the heavy security safe on the north wall.',
        isSecret: false
      },
      {
        id: 'EVID_UV_MICROFILM',
        title: 'UV-Revealed Terminal Coordinates',
        category: 'CODE',
        room: 'ARCHIVE_ROOM',
        description: 'Invisible ink markings illuminated under the archival desk\'s ultraviolet inspection bulb.',
        quote: 'Safe authorization sequence: Combine research branch prefix [ASTRA] with file index [842] -> ASTRA-842.',
        isSecret: false
      },
      {
        id: 'EVID_STERLING_CONFESSION',
        title: 'Classified Project Directive #84',
        category: 'DOCUMENT',
        room: 'ARCHIVE_ROOM',
        description: 'Classified report showing Dr. Sterling intentionally disabled the safety dampener before 09:47.',
        quote: '"In the event of funding termination, Directive 84 dictates temporal recursion initiation. We will never be shut down."',
        isSecret: false
      },
      {
        id: 'EVID_ECHO_REFLECTION',
        title: 'Corridor Temporal Shadow',
        category: 'OBSERVATION',
        room: 'OBSERVATION_CORRIDOR',
        description: 'Looking into the reinforced glass window, you see your own reflection lagging by several seconds, pointing toward the ceiling conduit.',
        quote: 'The reflection mouths words: "Loop 14 was not the first. Look deeper into the core console."',
        isSecret: true
      },
      {
        id: 'EVID_CORRIDOR_KEYPAD_CODE',
        title: 'Observation Bulkhead Keycode',
        category: 'CODE',
        room: 'OBSERVATION_CORRIDOR',
        description: 'Electronic biometric door separating the corridor from the inner Control Room.',
        quote: 'Keypad interlock responds to Keycard Alpha or manual bypass.',
        isSecret: false
      },
      {
        id: 'EVID_CHRONOS_KEY',
        title: 'Reconstructed Incident Timeline',
        category: 'DOCUMENT',
        room: 'CONTROL_ROOM',
        description: 'The verified chronological order of the 5 events that fractured the facility\'s spacetime continuum.',
        quote: 'Sequence locked: Initiation -> Power Surge -> Sterling Override -> Vane Scram -> Field Collapse.',
        isSecret: false
      },
      {
        id: 'EVID_SECRET_CONCORDANCE',
        title: 'Dr. Vane\'s Final Unsent Transmission',
        category: 'TRANSCRIPT',
        room: 'CONTROL_ROOM',
        description: 'An encrypted audio reel recovered from the emergency sub-channel. Requires temporal resonance synchronization.',
        quote: '"If anyone out there remembers this loop, you don\'t have to destroy the facility or sacrifice yourself. Synchronize the harmonic phase at 09:47:12. We can all wake up."',
        isSecret: true
      }
    ];

    this.puzzleDefs = {
      PUZZLE_A_DRAWER: {
        id: 'PUZZLE_A_DRAWER',
        solution: '7490',
        hints: [
          'Inspect the Security Log on the desk and look at the frozen clock on the wall.',
          'The log states: "Shift code is sector prefix 7 followed by mirror of incident minute".',
          'The clock stopped at 09:47. Sector prefix is 7, minute 47 mirrored is 490. Try: 7490.'
        ],
        rewardEvidenceId: 'EVID_KEYCARD_ALPHA',
        rewardMessage: 'Mechanical tumbler clicks! Drawer unlocked. You retrieved Keycard Alpha and Dr. Sterling\'s audio tape.'
      },
      PUZZLE_B_SPECIMEN: {
        id: 'PUZZLE_B_SPECIMEN',
        solution: 'ALPHA,GAMMA,BETA',
        hints: [
          'Review Dr. Evelyn Vane\'s handwritten lab notes on the corkboard.',
          'Order isotopes by atomic stability: highest half-life first, dampener second, volatile particle last.',
          'Sequence: Chronite (Alpha) -> Flux-Core (Gamma) -> Tachyon (Beta).'
        ],
        rewardEvidenceId: 'EVID_RESONANCE_DATA',
        rewardMessage: 'Harmonic alignment achieved! The Observation Corridor bulkhead lock releases with a resonant chime.'
      },
      PUZZLE_C_ARCHIVE: {
        id: 'PUZZLE_C_ARCHIVE',
        solution: 'ASTRA-842',
        hints: [
          'Examine the empty dossier slot and the reading desk ultraviolet markings.',
          'Cross-reference research prefix [ASTRA] with file index 84, sub-clause 2.',
          'Combine them: ASTRA-842.'
        ],
        rewardEvidenceId: 'EVID_STERLING_CONFESSION',
        rewardMessage: 'Vault door swings open! Classified Directive #84 recovered, detailing Dr. Sterling\'s loop trigger.'
      },
      PUZZLE_D_TIMELINE: {
        id: 'PUZZLE_D_TIMELINE',
        solution: 'EVENT_1_EXPERIMENT,EVENT_2_POWER_SPIKE,EVENT_3_STERLING_OVERRIDE,EVENT_4_VANE_SABOTAGE,EVENT_5_FIELD_COLLAPSE',
        hints: [
          'Review the transcripts and documents in your notebook chronologically.',
          'What came first? Experiment -> Power Spike -> Sterling\'s manual lock -> Vane\'s shutdown attempt -> Spacetime Collapse.',
          'Correct order: 1. Experiment -> 2. Power Spike -> 3. Sterling Override -> 4. Vane Scram -> 5. Field Collapse.'
        ],
        rewardEvidenceId: 'EVID_CHRONOS_KEY',
        rewardMessage: 'Chronology verified! Master Override Terminal unlocked. Final resolution options are ready.'
      }
    };

    this.state = this.createInitialState();
  }

  createInitialState() {
    return {
      loopNumber: 1,
      timeRemainingSeconds: 600,
      currentRoom: 'SECURITY_OFFICE',
      isPaused: false,
      isCompleted: false,
      selectedEnding: null,
      totalLoopsCompleted: 0,
      totalTimeElapsedSeconds: 0,
      discoveredEvidenceIds: ['EVID_CLOCK_ANOMALY'],
      solvedPuzzleIds: [],
      unlockedDoors: [],
      temporaryInteractions: [],
      failedPuzzleAttempts: {}
    };
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  startNewGame() {
    this.state = this.createInitialState();
    this.saveGame();
    return this.getState();
  }

  inspectObject(roomId, objectId) {
    this.state.currentRoom = roomId;
    if (!this.state.temporaryInteractions.includes(objectId)) {
      this.state.temporaryInteractions.push(objectId);
    }

    // Inspection advances clock 10 seconds
    this.state.timeRemainingSeconds = Math.max(0, this.state.timeRemainingSeconds - 10);
    this.state.totalTimeElapsedSeconds += 10;

    let discoveredEvidenceId = null;
    let narrative = '';

    switch (objectId) {
      case 'wall_clock':
        discoveredEvidenceId = 'EVID_CLOCK_ANOMALY';
        narrative = 'The second hand twitches backward by one tick every second. The hands are frozen at 09:47:12.';
        break;
      case 'security_log':
        discoveredEvidenceId = 'EVID_GUARD_LOG';
        narrative = 'Chief Marcus Reyes\' handwritten shift log details anomalous time slips and the locker code rule.';
        break;
      case 'vane_notes':
        discoveredEvidenceId = 'EVID_VANE_LAB_NOTE';
        narrative = 'Dr. Evelyn Vane\'s half-life calibration formulas for the specimen containers are pinned to the board.';
        break;
      case 'missing_dossier':
        discoveredEvidenceId = 'EVID_MISSING_DOSSIER_TAG';
        narrative = 'A dust-free gap in shelf 84 points to the classified vault on the north wall.';
        break;
      case 'uv_lamp':
        discoveredEvidenceId = 'EVID_UV_MICROFILM';
        narrative = 'The ultraviolet lamp illuminates glowing invisible ink: [ASTRA-842].';
        break;
      case 'window_reflection':
        if (this.state.loopNumber >= 2) {
          discoveredEvidenceId = 'EVID_ECHO_REFLECTION';
          narrative = 'Your temporal reflection on the glass mouths: "Loop 14 was not the first. Look deeper into the core."';
        } else {
          narrative = 'The observation glass vibrates faintly. Beyond it lies a frozen grey temporal vortex.';
        }
        break;
      case 'corridor_keypad':
        discoveredEvidenceId = 'EVID_CORRIDOR_KEYPAD_CODE';
        narrative = 'Biometric security door to Control Room. Responds to Keycard Alpha or manual bypass.';
        break;
      default:
        narrative = 'You thoroughly examine the area. Nothing additional is found.';
    }

    if (discoveredEvidenceId && !this.state.discoveredEvidenceIds.includes(discoveredEvidenceId)) {
      this.state.discoveredEvidenceIds.push(discoveredEvidenceId);
    }

    this.saveGame();

    return {
      success: true,
      objectId,
      narrative,
      discoveredEvidenceId,
      timeRemainingSeconds: this.state.timeRemainingSeconds,
      state: this.getState()
    };
  }

  submitPuzzle(puzzleId, solution) {
    const def = this.puzzleDefs[puzzleId];
    if (!def) {
      return {
        puzzleResult: { success: false, message: 'Unknown puzzle', hint: null, hintTier: 0 },
        state: this.getState()
      };
    }

    if (this.state.solvedPuzzleIds.includes(puzzleId)) {
      return {
        puzzleResult: { success: true, message: 'Already solved.', hint: null, hintTier: 0, unlockedEvidenceId: def.rewardEvidenceId },
        state: this.getState()
      };
    }

    const normInput = (solution || '').trim().toUpperCase().replace(/\s+/g, '');
    const normExpected = def.solution.trim().toUpperCase().replace(/\s+/g, '');

    let isCorrect = normInput === normExpected;
    if (!isCorrect && puzzleId === 'PUZZLE_C_ARCHIVE') {
      isCorrect = normInput.replace(/-/g, '') === 'ASTRA842';
    }

    if (isCorrect) {
      if (!this.state.solvedPuzzleIds.includes(puzzleId)) {
        this.state.solvedPuzzleIds.push(puzzleId);
      }
      if (def.rewardEvidenceId && !this.state.discoveredEvidenceIds.includes(def.rewardEvidenceId)) {
        this.state.discoveredEvidenceIds.push(def.rewardEvidenceId);
      }
      if (puzzleId === 'PUZZLE_B_SPECIMEN' && !this.state.unlockedDoors.includes('CORRIDOR_BULKHEAD')) {
        this.state.unlockedDoors.push('CORRIDOR_BULKHEAD');
      }
      if (puzzleId === 'PUZZLE_A_DRAWER' && !this.state.unlockedDoors.includes('SECURITY_DRAWER')) {
        this.state.unlockedDoors.push('SECURITY_DRAWER');
      }
      this.saveGame();
      return {
        puzzleResult: {
          success: true,
          message: def.rewardMessage,
          hint: null,
          hintTier: 0,
          unlockedEvidenceId: def.rewardEvidenceId
        },
        state: this.getState()
      };
    } else {
      this.state.failedPuzzleAttempts[puzzleId] = (this.state.failedPuzzleAttempts[puzzleId] || 0) + 1;
      const count = this.state.failedPuzzleAttempts[puzzleId];
      const hintTier = Math.min(count, def.hints.length);
      const hint = def.hints[hintTier - 1];
      return {
        puzzleResult: {
          success: false,
          message: 'Incorrect sequence or code. Verification failed.',
          hint,
          hintTier,
          unlockedEvidenceId: null
        },
        state: this.getState()
      };
    }
  }

  resetLoop() {
    const nextLoop = this.state.loopNumber + 1;
    this.state.loopNumber = nextLoop;
    this.state.totalLoopsCompleted += 1;
    this.state.timeRemainingSeconds = 600;
    this.state.currentRoom = 'SECURITY_OFFICE';
    this.state.isPaused = false;
    this.state.temporaryInteractions = [];

    const changes = [];
    let narrative = '';

    if (nextLoop === 2) {
      narrative = 'The world collapses into a blinding flash of monochrome light. A suffocating ringing fills your ears—and then sudden silence. You open your eyes. The wall clock ticks backward once at 09:47:12. You are back at the security desk. Your notebook remains in your hands, every clue intact. But outside in the corridor, a strange temporal shadow has formed on the glass...';
      changes.push('A persistent temporal reflection now hovers in the Observation Corridor window.');
      changes.push('Dr. Evelyn Vane\'s laboratory terminal has rebooted into safe mode.');
    } else if (nextLoop === 3) {
      narrative = 'Another cycle collapses. Spacetime snaps like cold iron. You wake up with your head on the wooden console, the taste of ozone on your tongue. The loop is decaying—subtle fissures of light are visible in the conduits.';
      changes.push('The central timeline core hums at a higher harmonic frequency.');
      changes.push('Archive room ultraviolet lamp reveals deeper fluorescent handwriting.');
    } else {
      narrative = `Loop ${nextLoop} begins. 09:47:12 AM. The facility resets its physical arrangement, but your memory and evidence remain unbroken. The truth is within your grasp.`;
      changes.push(`Facility timeline stability index: ${Math.max(12, 100 - (nextLoop * 14))}%`);
    }

    this.saveGame();

    return {
      resetResult: {
        newLoopNumber: nextLoop,
        narrativeMessage: narrative,
        environmentalChanges: changes
      },
      state: this.getState()
    };
  }

  evaluateEnding(endingChoice) {
    const loops = this.state.loopNumber;
    const evidenceCount = this.state.discoveredEvidenceIds.length;
    const puzzlesCount = this.state.solvedPuzzleIds.length;

    const hasEcho = this.state.discoveredEvidenceIds.includes('EVID_ECHO_REFLECTION');
    const hasVaneSecret = this.state.discoveredEvidenceIds.includes('EVID_SECRET_CONCORDANCE') || this.state.discoveredEvidenceIds.includes('EVID_RESONANCE_DATA');
    const hasDirective84 = this.state.discoveredEvidenceIds.includes('EVID_STERLING_CONFESSION');
    const timelineSolved = this.state.solvedPuzzleIds.includes('PUZZLE_D_TIMELINE');

    const secretEligible = hasEcho && hasVaneSecret && hasDirective84 && timelineSolved;

    let outcome;

    if ((endingChoice === 'THE_FINAL_ECHO' || endingChoice === 'ENDING_3') && secretEligible) {
      this.state.isCompleted = true;
      this.state.selectedEnding = 'THE_FINAL_ECHO';
      outcome = {
        endingId: 'THE_FINAL_ECHO',
        title: 'Ending 3 — The Final Echo',
        subtitle: 'Harmonic Spacetime Synchronization',
        narrative: 'Armed with the memory of past loops and Dr. Vane\'s secret harmonic equations, you do not pull the emergency SCRAM. Instead, you synchronize the chrono-resonance coils to 432.8 Hz at the precise microsecond of 09:47:12. The blinding flash dissolves into warm amber light. The endless recursion dissolves gently, and the facility clock ticks forward to 09:47:13. Through the open door, Dr. Evelyn Vane looks up with tears in her eyes. "You remembered," she says softly. "Tomorrow has finally arrived."',
        loopsUsed: loops,
        evidenceDiscovered: evidenceCount,
        totalPuzzlesSolved: puzzlesCount,
        isSecretEnding: true
      };
    } else if (endingChoice === 'PRESERVE_THE_MEMORY' || endingChoice === 'ENDING_2') {
      this.state.isCompleted = true;
      this.state.selectedEnding = 'PRESERVE_THE_MEMORY';
      outcome = {
        endingId: 'PRESERVE_THE_MEMORY',
        title: 'Ending 2 — Preserve The Memory',
        subtitle: 'The Archive in the Stars',
        narrative: 'You re-route the timeline core\'s excess energy into the high-gain transmission array. Every byte of Project CHRONOS, every recording of Dr. Sterling\'s fatal ambition and Dr. Vane\'s courage, is beamed to an orbital relay beyond the facility. The world will uncover the truth. But the transmission consumes the last dampening field. The loop collapses, preserving the data across humanity, while your own consciousness drifts into the eternal static of the chronometric spectrum.',
        loopsUsed: loops,
        evidenceDiscovered: evidenceCount,
        totalPuzzlesSolved: puzzlesCount,
        isSecretEnding: false
      };
    } else {
      this.state.isCompleted = true;
      this.state.selectedEnding = 'BREAK_THE_LOOP';
      outcome = {
        endingId: 'BREAK_THE_LOOP',
        title: 'Ending 1 — Break The Loop',
        subtitle: 'Severing Spacetime',
        narrative: 'You grasp the heavy manual SCRAM lever and pull downward with all your weight. Dampener rods plunge into the heart of the core. Alarms wail as sparks cascade from the ceiling conduits. Spacetime screams, then abruptly fractures into stillness. The temporal recursion breaks. You stumble out of the facility entrance into the biting morning air. Time is moving forward once more. Yet behind you, the facility incinerates, burying the secrets of Project CHRONOS in ash.',
        loopsUsed: loops,
        evidenceDiscovered: evidenceCount,
        totalPuzzlesSolved: puzzlesCount,
        isSecretEnding: false
      };
    }

    this.saveGame();

    return {
      ending: outcome,
      state: this.getState()
    };
  }

  saveGame() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }

  loadGame() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.state = JSON.parse(data);
        return { success: true, state: this.getState() };
      }
    } catch (e) {}
    return { success: false, message: 'No saved game found' };
  }

  hasSaveGame() {
    try {
      return !!localStorage.getItem(this.storageKey);
    } catch (e) {
      return false;
    }
  }

  getAllEvidence() {
    return this.allEvidence;
  }
}
