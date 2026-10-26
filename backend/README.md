# ECHOES — The Time-Loop Mystery
**Student Project: Computer Engineering / Interactive Systems**

ECHOES is a story-driven mystery game where the player is trapped inside an old temporal research facility (*Astraea Chrono-Dynamics Annex 4*) where the same 10 minutes (ending at 09:47:12 AM) repeat endlessly. Discover clues, solve interconnected physical and computational puzzles, record evidence in a persistent investigation notebook, unravel the truth about Dr. Arthur Sterling and Dr. Evelyn Vane, and choose the facility's final fate across three unique endings.

---

## 1. System Architecture & Technology Stack

The project strictly utilizes four foundational web and system technologies:

1. **Java (Standard JDK 17+ or 11+)**:
   - Multi-threaded backend HTTP Server (`com.sun.net.httpserver.HttpServer`) on port 8080.
   - Authoritative game state machine (`GameState.java`), puzzle validation (`PuzzleService.java`), progressive hint engine, loop resets (`LoopService.java`), ending calculator (`EndingService.java`), and atomic file persistence (`SaveService.java`).
   - Requires zero third-party dependencies or external JARs.
2. **JavaScript (Vanilla ECMAScript 2022)**:
   - Client-side room transitions, interactive SVG/canvas scenes, 10-minute real-time countdown timer, Web Audio API procedural sound synthesizer, evidence notebook, and modal overlays.
   - Dual-mode API client (`api.js`): Communicates with the live Java server when running, with automatic local engine fallback for browser preview sandboxes.
3. **HTML5**:
   - Clean semantic document structure, accessibility landmarks, interactive puzzle modals, inspection viewports.
4. **CSS3**:
   - Custom atmospheric styling: dark charcoal palette (`#0c0f12`), CRT scanlines, flicker animations, responsive flex/grid layouts, SVG illustrations, and high-contrast typography.

---

## 2. File Organization

```
echoes/
├── backend/
│   ├── src/
│   │   ├── GameServer.java       # HTTP Server listening on port 8080
│   │   ├── GameController.java   # API request routing and JSON responses
│   │   ├── GameState.java        # Authoritative loop and evidence model
│   │   ├── PuzzleService.java    # Puzzles A, B, C, D validation & hints
│   │   ├── EvidenceService.java  # 12 evidence records & catalog
│   │   ├── LoopService.java      # Reset handling & environmental shifts
│   │   ├── EndingService.java    # 3 endings calculation & secret checks
│   │   └── SaveService.java      # Local JSON file persistence
│   ├── data/
│   │   ├── puzzles.json          # Puzzle definitions & hints
│   │   ├── story.json            # Lore, dialogue, and ending text
│   │   └── saved_game.json       # Generated upon saving game
│   └── README.md                 # This documentation
└── frontend / web /
    ├── index.html                # Main game interface & modals
    ├── src/css/style.css         # Complete styling, animations & theme
    └── src/js/
        ├── app.js                # State machine & UI coordinator
        ├── api.js                # Dual-mode backend / preview bridge
        ├── engine.js             # Client state & authoritative logic
        ├── timer.js              # Real-time countdown & pause controller
        ├── rooms.js              # 5 facility rooms & interactive SVG scenes
        ├── inventory.js          # Clue inspector & evidence manager
        ├── notebook.js           # Investigation notebook & suspects tab
        ├── puzzles.js            # Keypad, sequence & timeline UI handlers
        └── audio.js              # Web Audio API ambient hum & SFX
```

---

## 3. How to Compile and Run the Java Server Locally

### Prerequisites
- Java Development Kit (JDK 11, 17, 21 or later).
- Check your installation by opening a terminal / command prompt and running:
  ```bash
  java -version
  javac -version
  ```

### Windows Laptop Instructions

1. Open **Command Prompt** (`cmd.exe`) or **PowerShell**.
2. Navigate to the project root directory:
   ```cmd
   cd path\to\echoes
   ```
3. Compile all Java source files into a `bin` directory:
   ```cmd
   mkdir bin
   javac -encoding UTF-8 -d bin backend\src\*.java
   ```
4. Start the Java GameServer on port 8080:
   ```cmd
   java -cp bin echoes.GameServer 8080
   ```
5. You should see the startup banner:
   ```
   ==================================================
     ECHOES — THE TIME-LOOP MYSTERY GAME SERVER
     Running on port: 8080
     API Health: http://localhost:8080/api/health
     Facility: Astraea Chrono-Dynamics Annex 4
   ==================================================
   ```

### macOS / Linux Instructions

1. Open Terminal and navigate to the project directory:
   ```bash
   cd path/to/echoes
   mkdir -p bin
   javac -encoding UTF-8 -d bin backend/src/*.java
   java -cp bin echoes.GameServer 8080
   ```

---

## 4. Opening the Website in a Browser

1. In any modern browser (Chrome, Edge, Firefox, Safari), open the web app.
2. The game automatically checks `http://localhost:8080/api/health`.
   - If the Java server is running: the top status pill displays **"● Java Server Connected"** in teal.
   - If running in a web sandbox or without Java installed: it runs seamlessly via the built-in **"● Local Engine (Preview Mode)"**, providing the exact same rules, evidence persistence, timer, and multiple endings.

---

## 5. API Endpoints Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and server identity |
| `GET` | `/api/state` | Returns the current full GameState JSON |
| `GET` | `/api/evidence` | Returns the complete evidence registry |
| `POST` | `/api/new-game` | Resets progress and starts Loop 01 |
| `POST` | `/api/inspect` | Inspects an object in a room (advances time 10s) |
| `POST` | `/api/puzzle/solve` | Validates puzzle answer; returns feedback & hints |
| `POST` | `/api/loop/reset` | Resets countdown, increments loop, preserves evidence |
| `POST` | `/api/ending/evaluate` | Evaluates chosen ending against discovered clues |
| `POST` | `/api/save` | Writes state to `backend/data/saved_game.json` |
| `POST` | `/api/load` | Reads state from `backend/data/saved_game.json` |
| `POST` | `/api/pause` | Sets or unsets pause flag |

---

## 6. Comprehensive Testing Checklist

- [ ] **1. Title Menu & Initiation**:
  - Click "How to Play" — verifies rule explanation modal.
  - Click "Credits" — verifies student project accreditation.
  - Click "New Investigation" — starts Loop 01 at 09:47:12.
- [ ] **2. 10-Minute Countdown & Controls**:
  - Watch timer tick downwards from 10:00.
  - Click **Pause** — timer freezes, screen indicates paused state, audio mutes.
  - Switch to **2-Minute Fast Loop** in settings/header for testing rapid loop reset.
- [ ] **3. Room Navigation**:
  - Visit all 5 locations: Security Office, Research Laboratory, Archive Room, Observation Corridor, Control Room.
  - Click facility map or adjacent room doorways.
- [ ] **4. Object Inspection & Evidence Persistence**:
  - Inspect Security Log -> Unlocks `EVID_GUARD_LOG`.
  - Open Notebook -> Verify clue is filed under Security Office with quote.
  - Inspect Frozen Wall Clock -> Unlocks `EVID_CLOCK_ANOMALY`.
- [ ] **5. Puzzle Validation & Progressive Hints**:
  - **Puzzle A (Security Drawer)**:
    - Attempt incorrect code `1234` -> Error feedback, hint 1 appears.
    - Submit correct code `7490` -> Drawer unlocks, reveals Keycard Alpha & Audio Tape.
  - **Puzzle B (Specimen Array)**:
    - Reorder isotopes: Select Alpha (Chronite), Gamma (Flux-Core), Beta (Tachyon).
    - Submit -> Harmonic chime, Corridor Bulkhead door unlocked.
  - **Puzzle C (Archive Vault)**:
    - Inspect ultraviolet lamp -> reveals `ASTRA-842`.
    - Submit `ASTRA-842` -> Unlocks Sterling's secret Directive 84.
  - **Puzzle D (Timeline Sequencer)**:
    - Arrange the 5 historical events chronologically:
      1. Initiation -> 2. Power Spike -> 3. Sterling Override -> 4. Vane Scram -> 5. Field Collapse.
    - Submit -> Master Terminal unlocked!
- [ ] **6. Time-Loop Reset**:
  - Allow timer to reach 00:00 or click **Force Loop Reset**.
  - Witness temporal collapse transition.
  - Verify loop counter increments (`Loop 02`).
  - Open Notebook: All previously discovered clues, solved puzzles, and notes remain intact!
  - Visit Observation Corridor: Environmental shift! Temporal shadow reflection appears on the glass.
- [ ] **7. Sound Synthesis**:
  - Click sound toggle (`SFX`). Ambient lowpass humming starts. Inspecting clues triggers harmonic discovery chimes.
- [ ] **8. Multiple Endings**:
  - **Ending 1 (Break the Loop)**: Select Manual SCRAM -> Facility core collapses, escape to outside world.
  - **Ending 2 (Preserve the Memory)**: Select Satellite Uplink -> Archive transmitted to world, consciousness anchored.
  - **Ending 3 (The Final Echo - Secret)**: Collect Echo Reflection + Evelyn's Confession + Sterling's Directive 84 -> Select Harmonic Phase Synchronization -> Paradox resolved, loop heals, Evelyn Vane saved!
