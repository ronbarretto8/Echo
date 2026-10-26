package echoes;

import java.util.*;

/**
 * Controller mediating API requests from the frontend and dispatching to services.
 */
public class GameController {

    private final GameState gameState;
    private final PuzzleService puzzleService;
    private final EvidenceService evidenceService;
    private final LoopService loopService;
    private final EndingService endingService;
    private final SaveService saveService;

    public GameController() {
        this.gameState = new GameState();
        this.puzzleService = new PuzzleService();
        this.evidenceService = new EvidenceService();
        this.loopService = new LoopService();
        this.endingService = new EndingService();
        this.saveService = new SaveService();
    }

    public String getCurrentState() {
        return gameState.toJson();
    }

    public String startNewGame() {
        // Reset state
        gameState.setLoopNumber(1);
        gameState.setTimeRemainingSeconds(600);
        gameState.setCurrentRoom("SECURITY_OFFICE");
        gameState.setPaused(false);
        gameState.setCompleted(false);
        gameState.setSelectedEnding(null);
        gameState.getDiscoveredEvidenceIds().clear();
        gameState.getDiscoveredEvidenceIds().add("EVID_CLOCK_ANOMALY");
        gameState.getSolvedPuzzleIds().clear();
        gameState.getTemporaryInteractions().clear();
        gameState.getFailedPuzzleAttempts().clear();
        gameState.getUnlockedDoors().clear();

        saveService.saveGame(gameState);
        return gameState.toJson();
    }

    public String inspectObject(String roomId, String objectId) {
        gameState.setCurrentRoom(roomId);
        gameState.getTemporaryInteractions().add(objectId);

        // Small in-game time cost (10 seconds for thorough investigation)
        int updatedTime = Math.max(0, gameState.getTimeRemainingSeconds() - 10);
        gameState.setTimeRemainingSeconds(updatedTime);
        gameState.setTotalTimeElapsedSeconds(gameState.getTotalTimeElapsedSeconds() + 10);

        String discoveredEvidenceId = null;
        String narrativeNote = "";

        // Inspection rules
        if ("wall_clock".equalsIgnoreCase(objectId)) {
            discoveredEvidenceId = "EVID_CLOCK_ANOMALY";
            narrativeNote = "The second hand twitches backward. The hands are frozen at 09:47:12.";
        } else if ("security_log".equalsIgnoreCase(objectId)) {
            discoveredEvidenceId = "EVID_GUARD_LOG";
            narrativeNote = "You read Chief Marcus Reyes' handwritten log detailing the anomalous shift memos.";
        } else if ("vane_notes".equalsIgnoreCase(objectId)) {
            discoveredEvidenceId = "EVID_VANE_LAB_NOTE";
            narrativeNote = "Dr. Evelyn Vane's scribbled half-life calibration instructions are pinned to the board.";
        } else if ("missing_dossier".equalsIgnoreCase(objectId)) {
            discoveredEvidenceId = "EVID_MISSING_DOSSIER_TAG";
            narrativeNote = "The gap on shelf 84 points directly to the classified vault on the north wall.";
        } else if ("uv_lamp".equalsIgnoreCase(objectId)) {
            discoveredEvidenceId = "EVID_UV_MICROFILM";
            narrativeNote = "The ultraviolet lamp reveals glowing fluorescent letters: ASTRA-842.";
        } else if ("window_reflection".equalsIgnoreCase(objectId)) {
            if (gameState.getLoopNumber() >= 2) {
                discoveredEvidenceId = "EVID_ECHO_REFLECTION";
                narrativeNote = "Your temporal shadow lingers on the glass, pointing towards the ceiling conduit.";
            } else {
                narrativeNote = "The observation glass vibrates faintly. Beyond it lies a frozen vortex of grey clouds.";
            }
        } else if ("corridor_keypad".equalsIgnoreCase(objectId)) {
            discoveredEvidenceId = "EVID_CORRIDOR_KEYPAD_CODE";
            narrativeNote = "Biometric door lock requires Keycard Alpha from the security office drawer.";
        }

        if (discoveredEvidenceId != null) {
            gameState.addEvidence(discoveredEvidenceId);
        }

        // Auto-save on significant discoveries
        saveService.saveGame(gameState);

        return String.format(
            "{\"success\":true,\"objectId\":\"%s\",\"narrative\":\"%s\",\"discoveredEvidenceId\":%s,\"timeRemainingSeconds\":%d,\"state\":%s}",
            escape(objectId),
            escape(narrativeNote),
            discoveredEvidenceId == null ? "null" : "\"" + escape(discoveredEvidenceId) + "\"",
            gameState.getTimeRemainingSeconds(),
            gameState.toJson()
        );
    }

    public String submitPuzzle(String puzzleId, String solutionInput) {
        PuzzleService.PuzzleResult result = puzzleService.evaluateSubmission(puzzleId, solutionInput, gameState);
        if (result.success) {
            if ("PUZZLE_B_SPECIMEN".equals(puzzleId)) {
                gameState.getUnlockedDoors().add("CORRIDOR_BULKHEAD");
            } else if ("PUZZLE_A_DRAWER".equals(puzzleId)) {
                gameState.getUnlockedDoors().add("SECURITY_DRAWER");
            }
            saveService.saveGame(gameState);
        }
        return String.format(
            "{\"puzzleResult\":%s,\"state\":%s}",
            result.toJson(),
            gameState.toJson()
        );
    }

    public String resetLoop() {
        LoopService.LoopResetResult resetResult = loopService.executeLoopReset(gameState);
        saveService.saveGame(gameState);
        return String.format(
            "{\"resetResult\":%s,\"state\":%s}",
            resetResult.toJson(),
            gameState.toJson()
        );
    }

    public String evaluateEnding(String endingChoice) {
        EndingService.EndingOutcome outcome = endingService.evaluateEnding(endingChoice, gameState);
        saveService.saveGame(gameState);
        return String.format(
            "{\"ending\":%s,\"state\":%s}",
            outcome.toJson(),
            gameState.toJson()
        );
    }

    public String saveGame() {
        boolean ok = saveService.saveGame(gameState);
        return String.format("{\"success\":%b,\"message\":\"Game state saved successfully\"}", ok);
    }

    public String loadGame() {
        String savedJson = saveService.loadGameJson();
        if (savedJson == null) {
            return "{\"success\":false,\"message\":\"No saved game found\"}";
        }
        return String.format("{\"success\":true,\"state\":%s}", savedJson);
    }

    public String updateTime(int deltaSeconds) {
        int current = gameState.getTimeRemainingSeconds();
        int next = Math.max(0, current - deltaSeconds);
        gameState.setTimeRemainingSeconds(next);
        gameState.setTotalTimeElapsedSeconds(gameState.getTotalTimeElapsedSeconds() + deltaSeconds);
        return String.format("{\"timeRemainingSeconds\":%d,\"loopExpired\":%b}", next, next <= 0);
    }

    public String setPaused(boolean paused) {
        gameState.setPaused(paused);
        return String.format("{\"isPaused\":%b}", paused);
    }

    public String getAllEvidence() {
        return evidenceService.getAllEvidenceJson();
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
