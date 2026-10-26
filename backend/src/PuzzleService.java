package echoes;

import java.util.*;

/**
 * Service for evaluating and validating puzzle submissions with progressive hint logic.
 */
public class PuzzleService {

    public static class PuzzleDefinition {
        public final String id;
        public final String name;
        public final String room;
        public final String expectedSolution;
        public final String[] hints;
        public final String rewardEvidenceId;
        public final String rewardMessage;

        public PuzzleDefinition(String id, String name, String room, String expectedSolution, String[] hints, String rewardEvidenceId, String rewardMessage) {
            this.id = id;
            this.name = name;
            this.room = room;
            this.expectedSolution = expectedSolution;
            this.hints = hints;
            this.rewardEvidenceId = rewardEvidenceId;
            this.rewardMessage = rewardMessage;
        }
    }

    public static class PuzzleResult {
        public final boolean success;
        public final String message;
        public final String hint;
        public final int hintTier;
        public final String unlockedEvidenceId;

        public PuzzleResult(boolean success, String message, String hint, int hintTier, String unlockedEvidenceId) {
            this.success = success;
            this.message = message;
            this.hint = hint;
            this.hintTier = hintTier;
            this.unlockedEvidenceId = unlockedEvidenceId;
        }

        public String toJson() {
            return String.format(
                "{\"success\":%b,\"message\":\"%s\",\"hint\":%s,\"hintTier\":%d,\"unlockedEvidenceId\":%s}",
                success,
                escape(message),
                hint == null ? "null" : "\"" + escape(hint) + "\"",
                hintTier,
                unlockedEvidenceId == null ? "null" : "\"" + escape(unlockedEvidenceId) + "\""
            );
        }

        private static String escape(String s) {
            if (s == null) return "";
            return s.replace("\\", "\\\\").replace("\"", "\\\"");
        }
    }

    private final Map<String, PuzzleDefinition> puzzleMap = new HashMap<>();

    public PuzzleService() {
        puzzleMap.put("PUZZLE_A_DRAWER", new PuzzleDefinition(
            "PUZZLE_A_DRAWER",
            "Security Desk Combination Drawer",
            "SECURITY_OFFICE",
            "7490",
            new String[]{
                "Inspect the Security Log on the desk and note the time on the frozen wall clock.",
                "The log mentions: 'Shift code is sector prefix 7 followed by mirror of incident minute'.",
                "The clock froze at 09:47. Sector prefix is 7, minute 47 mirrored is 490. Try: 7490."
            },
            "EVID_KEYCARD_ALPHA",
            "Lock released! You retrieved Keycard Alpha and Dr. Sterling's audio log."
        ));

        puzzleMap.put("PUZZLE_B_SPECIMEN", new PuzzleDefinition(
            "PUZZLE_B_SPECIMEN",
            "Chrono-Resonance Specimen Array",
            "RESEARCH_LAB",
            "ALPHA,GAMMA,BETA",
            new String[]{
                "Review Dr. Evelyn Vane's handwritten lab notes on the corkboard.",
                "Order isotopes by atomic stability: highest half-life first, dampener second, volatile particle last.",
                "Sequence: Chronite (Alpha) -> Flux-Core (Gamma) -> Tachyon (Beta)."
            },
            "EVID_RESONANCE_DATA",
            "Harmonic alignment achieved! The Observation Corridor bulkhead lock unlocks with a resonant hiss."
        ));

        puzzleMap.put("PUZZLE_C_ARCHIVE", new PuzzleDefinition(
            "PUZZLE_C_ARCHIVE",
            "Project Chronos Classified Vault",
            "ARCHIVE_ROOM",
            "ASTRA-842",
            new String[]{
                "Examine the empty dossier slot and the reading desk ultraviolet markings.",
                "Cross-reference the research department prefix [ASTRA] with Incident Index 84, sub-clause 2.",
                "Combine them as formatted: ASTRA-842."
            },
            "EVID_STERLING_CONFESSION",
            "Vault access granted! Classified Directive #84 recovered, detailing Dr. Sterling's recursion plan."
        ));

        puzzleMap.put("PUZZLE_D_TIMELINE", new PuzzleDefinition(
            "PUZZLE_D_TIMELINE",
            "Temporal Alignment Sequencer",
            "CONTROL_ROOM",
            "EVENT_1_EXPERIMENT,EVENT_2_POWER_SPIKE,EVENT_3_STERLING_OVERRIDE,EVENT_4_VANE_SABOTAGE,EVENT_5_FIELD_COLLAPSE",
            new String[]{
                "Review the transcripts and documents in your notebook chronologically.",
                "What came first? Experiment -> Power Spike -> Sterling's manual lock -> Vane's shutdown attempt -> Spacetime Collapse.",
                "Order: 1. Experiment -> 2. Power Spike -> 3. Sterling Override -> 4. Vane Scram -> 5. Field Collapse."
            },
            "EVID_CHRONOS_KEY",
            "Timeline chronology verified! Master Override Terminal unlocked. Final resolution options are ready."
        ));
    }

    public PuzzleResult evaluateSubmission(String puzzleId, String rawInput, GameState state) {
        PuzzleDefinition def = puzzleMap.get(puzzleId);
        if (def == null) {
            return new PuzzleResult(false, "Unknown puzzle identifier: " + puzzleId, null, 0, null);
        }

        if (state.isPuzzleSolved(puzzleId)) {
            return new PuzzleResult(true, "This puzzle was already solved.", null, 0, def.rewardEvidenceId);
        }

        String normalizedInput = normalize(rawInput);
        String normalizedExpected = normalize(def.expectedSolution);

        boolean isCorrect = normalizedInput.equals(normalizedExpected);

        // Also accept variants (e.g. without hyphens or spaces)
        if (!isCorrect && puzzleId.equals("PUZZLE_C_ARCHIVE")) {
            isCorrect = normalizedInput.replace("-", "").equals("ASTRA842");
        }

        if (isCorrect) {
            state.markPuzzleSolved(puzzleId);
            if (def.rewardEvidenceId != null) {
                state.addEvidence(def.rewardEvidenceId);
            }
            return new PuzzleResult(true, def.rewardMessage, null, 0, def.rewardEvidenceId);
        } else {
            state.incrementAttempt(puzzleId);
            int attempts = state.getAttemptCount(puzzleId);
            int hintTier = Math.min(attempts, def.hints.length);
            String hint = def.hints[hintTier - 1];
            return new PuzzleResult(false, "Incorrect sequence or code. Verification failed.", hint, hintTier, null);
        }
    }

    private String normalize(String s) {
        if (s == null) return "";
        return s.trim().toUpperCase().replaceAll("\\s+", "");
    }

    public PuzzleDefinition getDefinition(String id) {
        return puzzleMap.get(id);
    }
}
