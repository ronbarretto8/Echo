# ECHOES — The Time-Loop Mystery

**A story-driven mystery game built with Java, Vanilla JavaScript, HTML5, and CSS3.**

Trapped inside the *Astraea Chrono-Dynamics Annex 4*, the player is caught in a 10-minute temporal recursion ending at 09:47:12 AM. Every loop reveals new clues, environmental anomalies, encrypted records, and pieces of the story. Collect evidence, maintain a persistent investigation notebook, solve 4 interconnected physical and computational puzzles, unmask the truth about Dr. Arthur Sterling and Dr. Evelyn Vane, and choose the facility's fate across three distinct endings.

---

## 1. How the Four Technologies Work Together

The project adheres strictly to the four requested technologies without third-party frameworks or libraries:

1. **Java (Standard Edition SE 11/17/21+) — Backend Logic & Validation Authority**:
   - `GameServer.java`: Lightweight, zero-dependency multi-threaded HTTP server listening on port `8080` using standard `com.sun.net.httpserver.HttpServer`.
   - `GameController.java`: Routes REST requests (`/api/state`, `/api/inspect`, `/api/puzzle/solve`, `/api/loop/reset`, `/api/ending/evaluate`, `/api/save`, `/api/load`).
   - `GameState.java`: Manages loop counters, countdown times, persistent evidence IDs, solved puzzle IDs, and room states.
   - `PuzzleService.java`: Validates puzzle answers, records failed attempts, and serves progressive hints (Tier 1: Subtle clue, Tier 2: Specific link, Tier 3: Direct deduction).
   - `EvidenceService.java`: Registry of 12 classified clues, transcripts, and secret items.
   - `LoopService.java`: Manages timeline collapse, state transitions, and environmental evolution (e.g. Loop 2 temporal shadows, Loop 3 core harmonics).
   - `EndingService.java`: Evaluates ending eligibility (Ending 1: Break The Loop, Ending 2: Preserve The Memory, Ending 3: The Final Echo).
   - `SaveService.java`: Local JSON persistence in `backend/data/saved_game.json`.

2. **JavaScript (Vanilla ECMAScript 2022) — Frontend Interaction & Audio**:
   - `app.js`: Main state machine (`TITLE_MENU`, `PLAYING`, `PAUSED`, `ENDING`) and DOM event binding.
   - `api.js`: Dual-mode client that speaks to the Java server at `http://localhost:8080`, with a seamless client-side local engine fallback (`engine.js`) when evaluated in browser sandboxes.
   - `timer.js`: Accurate real-time 10-minute countdown (with 2-minute fast test loop toggle), pause feature, and warning threshold states.
   - `rooms.js`: Vector scene generators with original SVG graphics, environmental lighting, and interactive hotspot coordinators.
   - `puzzles.js`: Interactive UI for the 4-digit mechanical tumbler, isotope specimen rack, archive vault keypad, and timeline event sequencer.
   - `notebook.js`: Persistent investigation dossier with room filters, suspect cards, chronology tracker, and deduction web.
   - `audio.js`: Pure Web Audio API sound synthesizer producing procedural ambient humming, discovery chimes, mechanical clicks, warning beeps, and loop collapse sweeps.

3. **HTML5 — Semantic Website Structure**:
   - Clean landmarks (`<main>`, `<header>`, `<aside>`, `<section>`), custom accessible modal dialogs, and SVG scene containers.

4. **CSS3 — Atmospheric Visual Identity**:
   - Dark charcoal and near-black theme (`#07090d`, `#0e131b`, `#141b26`), muted blue and desaturated teal accents, amber warning lights, CRT scanline grain, ticking clock animations, and responsive layout for mobile and desktop screens.

---

## 2. Project File Structure

```
echoes/
├── backend/
│   ├── src/
│   │   ├── GameServer.java         # Built-in Java HTTP Server on port 8080
│   │   ├── GameController.java     # Request router and JSON serialization
│   │   ├── GameState.java          # Authoritative game model
│   │   ├── PuzzleService.java      # Validation logic and progressive hints
│   │   ├── EvidenceService.java    # Evidence catalog and access rules
│   │   ├── LoopService.java        # State reset and environmental shifts
│   │   ├── EndingService.java      # 3 endings criteria calculator
│   │   └── SaveService.java        # Safe local JSON file persistence
│   ├── data/
│   │   ├── puzzles.json            # Editable puzzle definitions & solutions
│   │   ├── story.json              # Narrative lore, transcripts, and epilogues
│   │   └── saved_game.json         # Local save file
│   └── README.md                   # Backend documentation
├── frontend/ (and root index.html)
│   ├── index.html                  # Main game UI and modal panels
│   ├── css/
│   │   └── style.css               # Atmospheric styling and animations
│   └── js/
│       ├── app.js                  # Main coordinator and state machine
│       ├── api.js                  # Dual-mode API client (Java + Preview)
│       ├── engine.js               # In-browser local game engine
│       ├── timer.js                # 10m/2m countdown timer & pause
│       ├── rooms.js                # 5 facility rooms and SVG scenes
│       ├── puzzles.js              # Interactive puzzle interfaces
│       ├── notebook.js             # Investigation notebook & deduction web
│       └── audio.js                # Web Audio API synthesizer
└── README.md                       # Complete project guide
```

---

## 3. How to Run the Java Server Locally

### Prerequisites
- JDK 11 or higher installed on your computer.
- Verify with `javac -version` and `java -version`.

### Windows Laptop
1. Open Command Prompt (`cmd.exe`) or PowerShell.
2. Navigate to the project root:
   ```cmd
   cd echoes
   ```
3. Compile all backend classes:
   ```cmd
   mkdir bin
   javac -encoding UTF-8 -d bin backend\src\*.java
   ```
4. Run the server on port 8080:
   ```cmd
   java -cp bin echoes.GameServer 8080
   ```
5. You will see:
   ```
   ==================================================
     ECHOES — THE TIME-LOOP MYSTERY GAME SERVER     
     Running on port: 8080
     API Health: http://localhost:8080/api/health
     Facility: Astraea Chrono-Dynamics Annex 4       
   ==================================================
   ```

### macOS / Linux
```bash
cd echoes
mkdir -p bin
javac -encoding UTF-8 -d bin backend/src/*.java
java -cp bin echoes.GameServer 8080
```

---

## 4. How to Open the Game in a Browser

1. In Google AI Studio preview:
   - The game is immediately live and interactive!
   - In preview mode without Java running in the container, it uses the built-in **Local Web Preview Engine** with 100% identical gameplay, evidence persistence, puzzles, and multiple endings.
2. On your local machine with the Java backend running:
   - Open `index.html` (or `frontend/index.html`) using any web browser or local server (`npx serve`, `python -m http.server 3000`, etc.).
   - The status pill will display **"● Java Server (port 8080)"** indicating live communication with your running Java backend!

---

## 5. Walkthrough & Puzzle Solutions

- **Puzzle A — The Security Drawer (Security Office)**:
  - Clue: Guard shift log refers to sector prefix 7 and mirror of incident minute 47 (490).
  - Code: **`7490`**
  - Unlocks: Keycard Alpha & Sterling Audio Tape.
- **Puzzle B — Chrono-Resonance Specimen Array (Research Lab)**:
  - Clue: Dr. Vane's note requires ordering by atomic half-life: longest to shortest.
  - Sequence: **`Chronite-Alpha (142h) -> Flux-Gamma (48h) -> Tachyon-Beta (0.14h)`**
  - Unlocks: Observation Corridor bulkhead blast door to Control Room.
- **Puzzle C — Project Chronos Vault (Archive Room)**:
  - Clue: Missing dossier slot 84 cross-referenced with UV desk markings.
  - Code: **`ASTRA-842`**
  - Unlocks: Classified Directive #84 (proves Sterling triggered the loop intentionally).
- **Puzzle D — Temporal Alignment Sequencer (Control Room)**:
  - Chronological Order:
    1. Dr. Vane begins Chrono-Harmonic Resonance Test
    2. Unscheduled Power Spike in Tachyon Core (+240%)
    3. Dr. Sterling executes Directive 84 Lockdown
    4. Dr. Vane attempts Manual SCRAM to protect crew
    5. Spacetime Containment Collapse at 09:47:12
  - Unlocks: Master Terminal & Central Timeline Resolution Interface.

### Three Endings:
1. **Ending 1 (Break The Loop)**: Pull manual SCRAM lever. Spacetime fractures, you escape, research lost.
2. **Ending 2 (Preserve The Memory)**: Broadcast archive to orbital satellite. Humanity learns the truth, your consciousness stays anchored.
3. **Ending 3 (The Final Echo — Secret Ending)**:
   - Prerequisites: Inspect corridor reflection in Loop 2+ (`EVID_ECHO_REFLECTION`), Dr. Vane's secret transmission (`EVID_SECRET_CONCORDANCE`), and Directive 84 (`EVID_STERLING_CONFESSION`).
   - Execute Harmonic Synchronization at 432.8 Hz. The paradox heals, loop dissolves gently, and Dr. Evelyn Vane is saved!

---

## 6. Testing Checklist

- [x] Title menu: "Some moments refuse to end.", clock frozen at 09:47:12.
- [x] New Investigation / Continue Investigation buttons with confirmation.
- [x] How to Play modal and Credits modal.
- [x] 10-minute real-time countdown timer with 2-minute dev testing toggle.
- [x] Pause button (Space bar) with accessibility explanation.
- [x] Room navigation across all 5 sectors with dynamic SVG scenes.
- [x] Clue collection and persistent investigation notebook.
- [x] Validation and progressive hint tiers for Puzzles A, B, C, D.
- [x] Time-loop collapse reset at 00:00 with screen aberration and environmental shifts in Loop 2+.
- [x] Web Audio API procedural sound synthesizer (ambient drone, discovery chimes, loop reset sweep).
- [x] All 3 endings with dedicated narrative conclusions and replay option.
