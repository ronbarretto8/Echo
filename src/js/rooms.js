/**
 * Facility Room Definitions & Interactive SVG Scenes for Project ECHOES.
 * Features 5 interconnected locations with original CSS/SVG illustrations and dynamic loop shifts.
 */

export const ROOMS = {
  SECURITY_OFFICE: {
    id: 'SECURITY_OFFICE',
    name: 'Security Office',
    sector: 'Sector 7 — Ground Annex',
    description: 'A dim watch station smelling of stale coffee and hot vacuum tubes. Emergency amber monitors cast long shadows across the metal desk.',
    adjacentRoomIds: ['OBSERVATION_CORRIDOR'],
    renderScene: (state) => `
      <svg class="room-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Security Office Scene">
        <defs>
          <linearGradient id="sec-wall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0f141c" />
            <stop offset="100%" stop-color="#070a0e" />
          </linearGradient>
          <linearGradient id="sec-desk" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1e2631" />
            <stop offset="100%" stop-color="#141a22" />
          </linearGradient>
          <radialGradient id="lamp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(245, 158, 11, 0.25)" />
            <stop offset="100%" stop-color="rgba(245, 158, 11, 0)" />
          </radialGradient>
          <filter id="crt-glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Room Walls & Floor -->
        <rect x="0" y="0" width="800" height="450" fill="url(#sec-wall)" />
        <polygon points="0,450 800,450 720,320 80,320" fill="#090d12" stroke="#1b2533" stroke-width="1.5" />
        
        <!-- Wall Conduits & Beams -->
        <line x1="80" y1="0" x2="80" y2="320" stroke="#161f2c" stroke-width="4" />
        <line x1="720" y1="0" x2="720" y2="320" stroke="#161f2c" stroke-width="4" />
        <line x1="0" y1="120" x2="800" y2="120" stroke="#131b26" stroke-width="2" />

        <!-- Wall Clock (Frozen at 09:47:12) -->
        <g class="interactive-hotspot" data-action="inspect" data-object="wall_clock" tabindex="0" role="button" aria-label="Wall Clock">
          <circle cx="400" cy="90" r="38" fill="#111720" stroke="#f59e0b" stroke-width="2.5" />
          <circle cx="400" cy="90" r="35" fill="#0b0f15" />
          <!-- Hour tick marks -->
          <circle cx="400" cy="62" r="1.5" fill="#94a3b8" />
          <circle cx="428" cy="90" r="1.5" fill="#94a3b8" />
          <circle cx="400" cy="118" r="1.5" fill="#94a3b8" />
          <circle cx="372" cy="90" r="1.5" fill="#94a3b8" />
          <!-- Clock Hands pointing to 09:47:12 with twitch animation -->
          <line x1="400" y1="90" x2="380" y2="76" stroke="#e2e8f0" stroke-width="2.5" stroke-linecap="round" />
          <line x1="400" y1="90" x2="386" y2="114" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round" />
          <line x1="400" y1="90" x2="408" y2="70" stroke="#f59e0b" stroke-width="1" class="clock-twitch" />
          <circle cx="400" cy="90" r="3" fill="#f59e0b" />
          <text x="400" y="140" text-anchor="middle" fill="#f59e0b" font-family="monospace" font-size="11" letter-spacing="1">09:47:12</text>
        </g>

        <!-- Security CCTV Terminal Screen -->
        <g class="interactive-hotspot" data-action="inspect" data-object="computer_terminal" tabindex="0" role="button" aria-label="Security Terminal">
          <rect x="160" y="150" width="130" height="90" rx="4" fill="#141b24" stroke="#334155" stroke-width="2" />
          <rect x="168" y="158" width="114" height="74" fill="#041214" stroke="#0e7490" stroke-width="1" />
          <!-- CRT Terminal text lines -->
          <text x="174" y="174" fill="#22d3ee" font-family="monospace" font-size="9" filter="url(#crt-glow)">SYS // RECURSION</text>
          <text x="174" y="190" fill="#0891b2" font-family="monospace" font-size="8">CAMERA FEED: FROZEN</text>
          <text x="174" y="204" fill="#0891b2" font-family="monospace" font-size="8">SECTOR 07 LOCKDOWN</text>
          <rect x="174" y="214" width="28" height="4" fill="#22d3ee" class="terminal-blink" />
          <polygon points="215,240 235,240 240,265 210,265" fill="#1e293b" />
        </g>

        <!-- Security Desk -->
        <polygon points="120,260 680,260 740,410 60,410" fill="url(#sec-desk)" stroke="#334155" stroke-width="1.5" />

        <!-- Security Desk Log Binder -->
        <g class="interactive-hotspot" data-action="inspect" data-object="security_log" tabindex="0" role="button" aria-label="Security Log Binder">
          <polygon points="330,285 430,285 445,340 315,340" fill="#1e293b" stroke="#64748b" stroke-width="1.5" />
          <polygon points="336,290 424,290 438,335 322,335" fill="#0f172a" />
          <line x1="345" y1="300" x2="415" y2="300" stroke="#94a3b8" stroke-width="1.5" />
          <line x1="343" y1="310" x2="420" y2="310" stroke="#64748b" stroke-width="1" />
          <line x1="340" y1="320" x2="400" y2="320" stroke="#64748b" stroke-width="1" />
          <text x="380" y="360" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="10">DUTY LOG</text>
        </g>

        <!-- Locked Metal Drawer (Puzzle A) -->
        <g class="interactive-hotspot" data-action="puzzle" data-puzzle="PUZZLE_A_DRAWER" tabindex="0" role="button" aria-label="Locked Desk Drawer">
          <rect x="520" y="280" width="130" height="85" rx="3" fill="#0f172a" stroke="${state.solvedPuzzleIds.includes('PUZZLE_A_DRAWER') ? '#10b981' : '#f59e0b'}" stroke-width="1.8" />
          <rect x="535" y="295" width="100" height="18" fill="#1e293b" stroke="#475569" stroke-width="1" />
          <circle cx="585" cy="304" r="3" fill="${state.solvedPuzzleIds.includes('PUZZLE_A_DRAWER') ? '#10b981' : '#ef4444'}" />
          <line x1="560" y1="330" x2="610" y2="330" stroke="#475569" stroke-width="3" stroke-linecap="round" />
          <text x="585" y="352" text-anchor="middle" fill="${state.solvedPuzzleIds.includes('PUZZLE_A_DRAWER') ? '#10b981' : '#cbd5e1'}" font-family="monospace" font-size="10">
            ${state.solvedPuzzleIds.includes('PUZZLE_A_DRAWER') ? '[UNLOCKED]' : '[LOCKED KEYPAD]'}
          </text>
        </g>

        <!-- Exit Door to Corridor -->
        <g class="interactive-hotspot" data-action="navigate" data-target="OBSERVATION_CORRIDOR" tabindex="0" role="button" aria-label="Door to Observation Corridor">
          <polygon points="690,140 760,165 760,335 690,335" fill="#0b0f17" stroke="#38bdf8" stroke-width="1.5" />
          <text x="725" y="240" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="9" transform="rotate(-90 725 240)">CORRIDOR ></text>
        </g>
      </svg>
    `
  },

  RESEARCH_LAB: {
    id: 'RESEARCH_LAB',
    name: 'Research Laboratory',
    sector: 'Sector 4 — Temporal Resonance Suite',
    description: 'A pressurized laboratory dominated by three humming containment cylinders and Dr. Vane’s temporal resonance machine.',
    adjacentRoomIds: ['OBSERVATION_CORRIDOR', 'ARCHIVE_ROOM'],
    renderScene: (state) => `
      <svg class="room-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Research Laboratory Scene">
        <defs>
          <linearGradient id="lab-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0a1219" />
            <stop offset="100%" stop-color="#05080c" />
          </linearGradient>
          <linearGradient id="tube-alpha" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(56, 189, 248, 0.7)" />
            <stop offset="100%" stop-color="rgba(14, 116, 144, 0.2)" />
          </linearGradient>
          <linearGradient id="tube-gamma" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(245, 158, 11, 0.7)" />
            <stop offset="100%" stop-color="rgba(180, 83, 9, 0.2)" />
          </linearGradient>
          <linearGradient id="tube-beta" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(45, 212, 191, 0.7)" />
            <stop offset="100%" stop-color="rgba(13, 148, 136, 0.2)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="800" height="450" fill="url(#lab-bg)" />
        <polygon points="0,450 800,450 710,300 90,300" fill="#090e15" stroke="#162231" stroke-width="1.5" />

        <!-- Resonance Machine & Power Conduits -->
        <g class="interactive-hotspot" data-action="inspect" data-object="resonance_machine" tabindex="0" role="button" aria-label="Resonance Machine">
          <rect x="100" y="110" width="140" height="180" rx="4" fill="#0f172a" stroke="#334155" stroke-width="2" />
          <!-- Oscilloscope Screen -->
          <rect x="115" y="125" width="110" height="70" fill="#021814" stroke="#0d9488" stroke-width="1.2" />
          <path d="M 120 160 Q 140 135 155 160 T 190 160 T 220 160" fill="none" stroke="#2dd4bf" stroke-width="2" class="wave-oscillate" />
          <circle cx="130" cy="225" r="8" fill="#1e293b" stroke="#0ea5e9" stroke-width="2" />
          <circle cx="160" cy="225" r="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
          <circle cx="190" cy="225" r="8" fill="#1e293b" stroke="#10b981" stroke-width="2" />
          <text x="170" y="270" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="10">RESONANCE COIL</text>
        </g>

        <!-- Specimen Array (Puzzle B) -->
        <g class="interactive-hotspot" data-action="puzzle" data-puzzle="PUZZLE_B_SPECIMEN" tabindex="0" role="button" aria-label="Specimen Array">
          <rect x="290" y="90" width="280" height="200" rx="6" fill="#090f17" stroke="${state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN') ? '#10b981' : '#38bdf8'}" stroke-width="2" />
          <text x="430" y="115" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="11" letter-spacing="1">CHRONO-SPECIMEN ARRAY</text>

          <!-- Tube 1: Chronite-Alpha -->
          <g transform="translate(320, 130)">
            <rect x="0" y="0" width="40" height="100" rx="10" fill="url(#tube-alpha)" stroke="#38bdf8" stroke-width="1.5" />
            <circle cx="20" cy="50" r="12" fill="#38bdf8" opacity="0.6" class="specimen-float" />
            <text x="20" y="120" text-anchor="middle" fill="#bae6fd" font-family="monospace" font-size="10">ALPHA</text>
          </g>

          <!-- Tube 2: Flux-Gamma -->
          <g transform="translate(410, 130)">
            <rect x="0" y="0" width="40" height="100" rx="10" fill="url(#tube-gamma)" stroke="#f59e0b" stroke-width="1.5" />
            <polygon points="20,40 28,60 12,60" fill="#f59e0b" opacity="0.7" class="specimen-float" />
            <text x="20" y="120" text-anchor="middle" fill="#fde68a" font-family="monospace" font-size="10">GAMMA</text>
          </g>

          <!-- Tube 3: Tachyon-Beta -->
          <g transform="translate(500, 130)">
            <rect x="0" y="0" width="40" height="100" rx="10" fill="url(#tube-beta)" stroke="#2dd4bf" stroke-width="1.5" />
            <rect x="12" y="42" width="16" height="16" transform="rotate(45 20 50)" fill="#2dd4bf" opacity="0.7" class="specimen-float" />
            <text x="20" y="120" text-anchor="middle" fill="#a7f3d0" font-family="monospace" font-size="10">BETA</text>
          </g>

          <text x="430" y="275" text-anchor="middle" fill="${state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN') ? '#10b981' : '#38bdf8'}" font-family="monospace" font-size="10">
            ${state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN') ? '[CONTAINMENT HARMONIZED]' : '[CALIBRATION SEQUENCE REQUIRED]'}
          </text>
        </g>

        <!-- Dr. Vane's Handwritten Lab Notes on Corkboard -->
        <g class="interactive-hotspot" data-action="inspect" data-object="vane_notes" tabindex="0" role="button" aria-label="Dr. Vane's Lab Notes">
          <rect x="610" y="120" width="110" height="130" fill="#1c1917" stroke="#78716c" stroke-width="1.5" />
          <rect x="620" y="130" width="90" height="105" fill="#fef3c7" opacity="0.9" />
          <text x="630" y="150" fill="#451a03" font-family="sans-serif" font-weight="bold" font-size="9">DR. VANE NOTE:</text>
          <line x1="630" y1="165" x2="695" y2="165" stroke="#78350f" stroke-width="1" />
          <line x1="630" y1="175" x2="700" y2="175" stroke="#78350f" stroke-width="1" />
          <line x1="630" y1="185" x2="685" y2="185" stroke="#78350f" stroke-width="1" />
          <line x1="630" y1="195" x2="695" y2="195" stroke="#78350f" stroke-width="1" />
          <text x="665" y="270" text-anchor="middle" fill="#fde68a" font-family="monospace" font-size="10">LAB MEMO</text>
        </g>

        <!-- Exit doors -->
        <g class="interactive-hotspot" data-action="navigate" data-target="OBSERVATION_CORRIDOR" tabindex="0" role="button" aria-label="Back to Corridor">
          <polygon points="50,140 10,165 10,335 50,335" fill="#0b0f17" stroke="#38bdf8" stroke-width="1.5" />
          <text x="30" y="240" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="9" transform="rotate(90 30 240)">< CORRIDOR</text>
        </g>
        <g class="interactive-hotspot" data-action="navigate" data-target="ARCHIVE_ROOM" tabindex="0" role="button" aria-label="Door to Archive Room">
          <polygon points="750,140 790,165 790,335 750,335" fill="#0b0f17" stroke="#38bdf8" stroke-width="1.5" />
          <text x="770" y="240" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="9" transform="rotate(-90 770 240)">ARCHIVE ></text>
        </g>
      </svg>
    `
  },

  ARCHIVE_ROOM: {
    id: 'ARCHIVE_ROOM',
    name: 'Archive Room',
    sector: 'Sector 3 — Records & Classified Storage',
    description: 'Floor-to-ceiling rows of microfiche cabinets, classified binders, and an ultraviolet inspection station.',
    adjacentRoomIds: ['RESEARCH_LAB', 'CONTROL_ROOM'],
    renderScene: (state) => `
      <svg class="room-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Archive Room Scene">
        <defs>
          <linearGradient id="arch-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0c0e14" />
            <stop offset="100%" stop-color="#050609" />
          </linearGradient>
          <radialGradient id="uv-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(147, 51, 234, 0.4)" />
            <stop offset="100%" stop-color="rgba(147, 51, 234, 0)" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="800" height="450" fill="url(#arch-bg)" />
        <polygon points="0,450 800,450 710,310 90,310" fill="#090b10" stroke="#1a202c" stroke-width="1.5" />

        <!-- High Archive Shelves -->
        <g class="interactive-hotspot" data-action="inspect" data-object="missing_dossier" tabindex="0" role="button" aria-label="Archive Shelves & Dossier #84">
          <rect x="100" y="80" width="220" height="220" fill="#111827" stroke="#374151" stroke-width="1.5" />
          <!-- Shelf dividers -->
          <line x1="100" y1="130" x2="320" y2="130" stroke="#4b5563" stroke-width="2" />
          <line x1="100" y1="180" x2="320" y2="180" stroke="#4b5563" stroke-width="2" />
          <line x1="100" y1="230" x2="320" y2="230" stroke="#4b5563" stroke-width="2" />
          
          <!-- Binders -->
          <rect x="110" y="88" width="12" height="38" fill="#334155" />
          <rect x="125" y="88" width="14" height="38" fill="#475569" />
          <rect x="142" y="88" width="16" height="38" fill="#1e293b" />
          <rect x="175" y="138" width="24" height="38" fill="#0f172a" stroke="#e2e8f0" stroke-dasharray="2,2" />
          <text x="187" y="162" text-anchor="middle" fill="#ef4444" font-family="monospace" font-size="10">#84</text>
          <text x="210" y="320" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="10">PROJECT DOSSIERS</text>
        </g>

        <!-- Classified Safe (Puzzle C) -->
        <g class="interactive-hotspot" data-action="puzzle" data-puzzle="PUZZLE_C_ARCHIVE" tabindex="0" role="button" aria-label="Classified Vault Safe">
          <rect x="360" y="90" width="170" height="200" rx="4" fill="#0f172a" stroke="${state.solvedPuzzleIds.includes('PUZZLE_C_ARCHIVE') ? '#10b981' : '#f59e0b'}" stroke-width="2" />
          <!-- Heavy Vault Wheel -->
          <circle cx="445" cy="170" r="40" fill="#1e293b" stroke="#64748b" stroke-width="4" />
          <circle cx="445" cy="170" r="16" fill="#0f172a" stroke="#f59e0b" stroke-width="2" />
          <line x1="445" y1="130" x2="445" y2="210" stroke="#94a3b8" stroke-width="4" />
          <line x1="405" y1="170" x2="485" y2="170" stroke="#94a3b8" stroke-width="4" />
          <!-- Keypad display -->
          <rect x="405" y="105" width="80" height="20" fill="#020617" stroke="#334155" stroke-width="1" />
          <text x="445" y="119" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="9">AUTH CODE</text>
          <text x="445" y="275" text-anchor="middle" fill="${state.solvedPuzzleIds.includes('PUZZLE_C_ARCHIVE') ? '#10b981' : '#f59e0b'}" font-family="monospace" font-size="10">
            ${state.solvedPuzzleIds.includes('PUZZLE_C_ARCHIVE') ? '[VAULT OPEN]' : '[SECURITY VAULT]'}
          </text>
        </g>

        <!-- Reading Table & Ultraviolet Lamp -->
        <g class="interactive-hotspot" data-action="inspect" data-object="uv_lamp" tabindex="0" role="button" aria-label="UV Inspection Desk">
          <polygon points="560,240 730,240 760,380 530,380" fill="#141a24" stroke="#334155" stroke-width="1.5" />
          <!-- UV Lamp housing -->
          <path d="M 680 240 L 680 180 L 640 180" fill="none" stroke="#64748b" stroke-width="3" />
          <rect x="620" y="175" width="30" height="12" rx="3" fill="#312e81" stroke="#818cf8" stroke-width="1.5" />
          <!-- UV Cone of light -->
          <polygon points="620,187 650,187 690,290 580,290" fill="url(#uv-glow)" />
          <!-- Fluorescent document -->
          <rect x="600" y="260" width="70" height="45" fill="#1e1b4b" stroke="#c084fc" stroke-width="1" />
          <text x="635" y="285" text-anchor="middle" fill="#e879f9" font-family="monospace" font-size="8" letter-spacing="1">ASTRA-842</text>
          <text x="645" y="360" text-anchor="middle" fill="#c084fc" font-family="monospace" font-size="10">UV DESK</text>
        </g>

        <!-- Exit Doors -->
        <g class="interactive-hotspot" data-action="navigate" data-target="RESEARCH_LAB" tabindex="0" role="button" aria-label="Back to Laboratory">
          <polygon points="50,140 10,165 10,335 50,335" fill="#0b0f17" stroke="#38bdf8" stroke-width="1.5" />
          <text x="30" y="240" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="9" transform="rotate(90 30 240)">< LAB</text>
        </g>
        <g class="interactive-hotspot" data-action="navigate" data-target="CONTROL_ROOM" tabindex="0" role="button" aria-label="Door to Control Room">
          <polygon points="750,140 790,165 790,335 750,335" fill="#0b0f17" stroke="#38bdf8" stroke-width="1.5" />
          <text x="770" y="240" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="9" transform="rotate(-90 770 240)">CONTROL ></text>
        </g>
      </svg>
    `
  },

  OBSERVATION_CORRIDOR: {
    id: 'OBSERVATION_CORRIDOR',
    name: 'Observation Corridor',
    sector: 'Central Transit Spine',
    description: 'A reinforced glass observation walkway overlooking the facility’s external containment perimeter. The storm outside is frozen in mid-swirl.',
    adjacentRoomIds: ['SECURITY_OFFICE', 'RESEARCH_LAB', 'CONTROL_ROOM'],
    renderScene: (state) => `
      <svg class="room-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Observation Corridor Scene">
        <defs>
          <linearGradient id="corr-storm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0e1726" />
            <stop offset="50%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#090d16" />
          </linearGradient>
          <linearGradient id="neon-flicker" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(56, 189, 248, 0.9)" />
            <stop offset="100%" stop-color="rgba(14, 116, 144, 0.4)" />
          </linearGradient>
        </defs>

        <!-- Corridor Perspective -->
        <rect x="0" y="0" width="800" height="450" fill="#05070a" />
        
        <!-- Floor grid with perspective -->
        <polygon points="0,450 800,450 560,220 240,220" fill="#080c12" stroke="#1e293b" stroke-width="1.5" />
        <line x1="320" y1="220" x2="140" y2="450" stroke="#16202c" stroke-width="1" />
        <line x1="400" y1="220" x2="400" y2="450" stroke="#16202c" stroke-width="1" />
        <line x1="480" y1="220" x2="660" y2="450" stroke="#16202c" stroke-width="1" />

        <!-- Ceiling & Flickering Fluorescent Strip -->
        <polygon points="0,0 800,0 560,90 240,90" fill="#070a0e" stroke="#16202c" stroke-width="1" />
        <rect x="290" y="85" width="220" height="6" rx="2" fill="url(#neon-flicker)" class="corridor-flicker" />

        <!-- Blast Window with Temporal Storm -->
        <g class="interactive-hotspot" data-action="inspect" data-object="window_reflection" tabindex="0" role="button" aria-label="Blast Window & Reflection">
          <polygon points="20,110 210,130 210,360 20,400" fill="url(#corr-storm)" stroke="#38bdf8" stroke-width="2" />
          <!-- Swirling frozen vortex -->
          <circle cx="110" cy="240" r="50" fill="none" stroke="#334155" stroke-dasharray="8,6" opacity="0.6" />
          <circle cx="110" cy="240" r="28" fill="none" stroke="#0ea5e9" stroke-dasharray="4,4" opacity="0.8" />
          
          <!-- Loop 2+ Temporal Shadow / Reflection -->
          ${state.loopNumber >= 2 ? `
            <g class="echo-silhouette">
              <circle cx="130" cy="220" r="16" fill="none" stroke="#38bdf8" stroke-width="1.8" />
              <path d="M 130 238 L 130 280 M 130 255 L 105 270 M 130 255 L 155 240" stroke="#38bdf8" stroke-width="1.8" />
              <text x="110" y="310" fill="#38bdf8" font-family="monospace" font-size="9">[ECHO DETECTED]</text>
            </g>
          ` : `
            <text x="115" y="250" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="9">BLAST WINDOW</text>
          `}
        </g>

        <!-- Bulkhead Door to Control Room (Puzzle/Locked Door) -->
        <g class="interactive-hotspot" data-action="inspect" data-object="corridor_keypad" tabindex="0" role="button" aria-label="Control Room Bulkhead">
          <polygon points="590,130 780,110 780,400 590,360" fill="#0f172a" stroke="${state.unlockedDoors.includes('CORRIDOR_BULKHEAD') || state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN') ? '#10b981' : '#f59e0b'}" stroke-width="2" />
          
          <!-- Heavy Interlock Bars -->
          <line x1="610" y1="200" x2="760" y2="185" stroke="#475569" stroke-width="4" />
          <line x1="610" y1="270" x2="760" y2="255" stroke="#475569" stroke-width="4" />
          
          <!-- Biometric Keypad Scanner -->
          <rect x="625" y="215" width="25" height="35" rx="3" fill="#1e293b" stroke="${state.unlockedDoors.includes('CORRIDOR_BULKHEAD') || state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN') ? '#10b981' : '#ef4444'}" stroke-width="1.5" />
          <circle cx="637" cy="227" r="4" fill="${state.unlockedDoors.includes('CORRIDOR_BULKHEAD') || state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN') ? '#10b981' : '#ef4444'}" />
          
          <text x="685" y="325" text-anchor="middle" fill="${state.unlockedDoors.includes('CORRIDOR_BULKHEAD') || state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN') ? '#10b981' : '#f59e0b'}" font-family="monospace" font-size="9">
            ${state.unlockedDoors.includes('CORRIDOR_BULKHEAD') || state.solvedPuzzleIds.includes('PUZZLE_B_SPECIMEN') ? '[BULKHEAD UNLOCKED]' : '[SECURED BULKHEAD]'}
          </text>
        </g>

        <!-- Center door into Control Room (if unlocked) -->
        <g class="interactive-hotspot" data-action="navigate" data-target="CONTROL_ROOM" tabindex="0" role="button" aria-label="Enter Control Room">
          <polygon points="340,110 460,110 460,220 340,220" fill="#0b1118" stroke="#38bdf8" stroke-width="1.5" />
          <text x="400" y="170" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">CONTROL ROOM</text>
        </g>

        <!-- Navigation Buttons -->
        <g class="interactive-hotspot" data-action="navigate" data-target="SECURITY_OFFICE" tabindex="0" role="button" aria-label="To Security Office">
          <rect x="30" y="405" width="160" height="30" rx="3" fill="#111827" stroke="#475569" stroke-width="1" />
          <text x="110" y="424" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="10">< SECURITY OFFICE</text>
        </g>
        <g class="interactive-hotspot" data-action="navigate" data-target="RESEARCH_LAB" tabindex="0" role="button" aria-label="To Research Lab">
          <rect x="610" y="405" width="160" height="30" rx="3" fill="#111827" stroke="#475569" stroke-width="1" />
          <text x="690" y="424" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="10">RESEARCH LAB ></text>
        </g>
      </svg>
    `
  },

  CONTROL_ROOM: {
    id: 'CONTROL_ROOM',
    name: 'Control Room',
    sector: 'Sector 1 — Chrono-Mainframe Core',
    description: 'The core nerve center of Project CHRONOS. A spherical reactor containment field pulses at the center with eerie silence.',
    adjacentRoomIds: ['OBSERVATION_CORRIDOR', 'ARCHIVE_ROOM'],
    renderScene: (state) => `
      <svg class="room-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Control Room Scene">
        <defs>
          <linearGradient id="ctrl-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#070a10" />
            <stop offset="100%" stop-color="#030407" />
          </linearGradient>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
            <stop offset="40%" stop-color="#0284c7" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#0369a1" stop-opacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="800" height="450" fill="url(#ctrl-bg)" />
        <polygon points="0,450 800,450 690,300 110,300" fill="#080b12" stroke="#1e293b" stroke-width="1.5" />

        <!-- The Central Timeline Core Sphere -->
        <g class="interactive-hotspot" data-action="inspect" data-object="timeline_core" tabindex="0" role="button" aria-label="Central Timeline Core">
          <circle cx="400" cy="150" r="90" fill="url(#core-glow)" />
          <circle cx="400" cy="150" r="50" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2.5" class="core-pulse" />
          <!-- Rotating magnetic field rings -->
          <ellipse cx="400" cy="150" rx="75" ry="24" fill="none" stroke="#22d3ee" stroke-width="1.8" transform="rotate(-25 400 150)" />
          <ellipse cx="400" cy="150" rx="75" ry="24" fill="none" stroke="#38bdf8" stroke-width="1.8" transform="rotate(25 400 150)" />
          <text x="400" y="270" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11" letter-spacing="1">CHRONO-CORE // 09:47:12</text>
        </g>

        <!-- Master Timeline Sequencer Console (Puzzle D) -->
        <g class="interactive-hotspot" data-action="puzzle" data-puzzle="PUZZLE_D_TIMELINE" tabindex="0" role="button" aria-label="Master Terminal & Timeline Sequencer">
          <polygon points="260,290 540,290 580,410 220,410" fill="#0f172a" stroke="${state.solvedPuzzleIds.includes('PUZZLE_D_TIMELINE') ? '#10b981' : '#f59e0b'}" stroke-width="2" />
          <!-- Terminal screens -->
          <rect x="290" y="305" width="220" height="50" rx="3" fill="#020617" stroke="#334155" stroke-width="1.5" />
          <text x="400" y="325" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="10">TIMELINE RECONSTRUCTION</text>
          <text x="400" y="342" text-anchor="middle" fill="${state.solvedPuzzleIds.includes('PUZZLE_D_TIMELINE') ? '#10b981' : '#f59e0b'}" font-family="monospace" font-size="9">
            ${state.solvedPuzzleIds.includes('PUZZLE_D_TIMELINE') ? '[CHRONOLOGY VERIFIED — OVERRIDE READY]' : '[ENTER INCIDENT CHRONOLOGY]'}
          </text>
        </g>

        <!-- System Shutdown / Final Choices Mechanism -->
        <g class="interactive-hotspot" data-action="ending_choice" tabindex="0" role="button" aria-label="System Resolution Interface">
          <rect x="620" y="160" width="130" height="150" rx="5" fill="#18181b" stroke="${state.solvedPuzzleIds.includes('PUZZLE_D_TIMELINE') ? '#38bdf8' : '#52525b'}" stroke-width="2" />
          <!-- Big Emergency SCRAM Lever -->
          <rect x="645" y="190" width="80" height="60" fill="#27272a" stroke="#71717a" stroke-width="1.5" />
          <line x1="685" y1="200" x2="685" y2="240" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />
          <circle cx="685" cy="200" r="8" fill="#dc2626" />
          <text x="685" y="280" text-anchor="middle" fill="${state.solvedPuzzleIds.includes('PUZZLE_D_TIMELINE') ? '#f59e0b' : '#71717a'}" font-family="monospace" font-size="10">
            ${state.solvedPuzzleIds.includes('PUZZLE_D_TIMELINE') ? '[RESOLVE LOOP]' : '[LOCKED]'}
          </text>
        </g>

        <!-- Exit doors -->
        <g class="interactive-hotspot" data-action="navigate" data-target="OBSERVATION_CORRIDOR" tabindex="0" role="button" aria-label="Back to Corridor">
          <polygon points="50,140 10,165 10,335 50,335" fill="#0b0f17" stroke="#38bdf8" stroke-width="1.5" />
          <text x="30" y="240" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="9" transform="rotate(90 30 240)">< CORRIDOR</text>
        </g>
        <g class="interactive-hotspot" data-action="navigate" data-target="ARCHIVE_ROOM" tabindex="0" role="button" aria-label="To Archive Room">
          <polygon points="120,405 20,405 20,375 120,375" fill="#111827" stroke="#475569" stroke-width="1" />
          <text x="70" y="394" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="10">< ARCHIVE</text>
        </g>
      </svg>
    `
  }
};
