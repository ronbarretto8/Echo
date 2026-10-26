package echoes;

import java.util.*;

/**
 * Service for calculating ending outcomes based on player actions and secret evidence.
 */
public class EndingService {

    public static class EndingOutcome {
        public final String endingId;
        public final String title;
        public final String subtitle;
        public final String narrative;
        public final int loopsUsed;
        public final int evidenceDiscovered;
        public final int totalPuzzlesSolved;
        public final boolean isSecretEnding;

        public EndingOutcome(String endingId, String title, String subtitle, String narrative, int loopsUsed, int evidenceDiscovered, int totalPuzzlesSolved, boolean isSecretEnding) {
            this.endingId = endingId;
            this.title = title;
            this.subtitle = subtitle;
            this.narrative = narrative;
            this.loopsUsed = loopsUsed;
            this.evidenceDiscovered = evidenceDiscovered;
            this.totalPuzzlesSolved = totalPuzzlesSolved;
            this.isSecretEnding = isSecretEnding;
        }

        public String toJson() {
            return String.format(
                "{\"endingId\":\"%s\",\"title\":\"%s\",\"subtitle\":\"%s\",\"narrative\":\"%s\",\"loopsUsed\":%d,\"evidenceDiscovered\":%d,\"totalPuzzlesSolved\":%d,\"isSecretEnding\":%b}",
                escape(endingId), escape(title), escape(subtitle), escape(narrative),
                loopsUsed, evidenceDiscovered, totalPuzzlesSolved, isSecretEnding
            );
        }

        private static String escape(String s) {
            if (s == null) return "";
            return s.replace("\\", "\\\\").replace("\"", "\\\"");
        }
    }

    public EndingOutcome evaluateEnding(String requestedEndingId, GameState state) {
        int loops = state.getLoopNumber();
        int evidenceCount = state.getDiscoveredEvidenceIds().size();
        int puzzlesCount = state.getSolvedPuzzleIds().size();

        // Check prerequisites for Secret Ending: THE_FINAL_ECHO
        boolean hasEcho = state.hasEvidence("EVID_ECHO_REFLECTION");
        boolean hasVaneSecret = state.hasEvidence("EVID_SECRET_CONCORDANCE") || state.hasEvidence("EVID_RESONANCE_DATA");
        boolean hasDirective84 = state.hasEvidence("EVID_STERLING_CONFESSION");
        boolean timelineSolved = state.isPuzzleSolved("PUZZLE_D_TIMELINE");

        boolean secretEligible = hasEcho && hasVaneSecret && hasDirective84 && timelineSolved;

        if ("THE_FINAL_ECHO".equalsIgnoreCase(requestedEndingId) || "ENDING_3".equalsIgnoreCase(requestedEndingId)) {
            if (secretEligible) {
                state.setCompleted(true);
                state.setSelectedEnding("THE_FINAL_ECHO");
                return new EndingOutcome(
                    "THE_FINAL_ECHO",
                    "Ending 3 — The Final Echo",
                    "Harmonic Spacetime Synchronization",
                    "Armed with the memory of past loops and Dr. Vane's secret harmonic equations, you do not pull the emergency SCRAM. Instead, you synchronize the chrono-resonance coils to 432.8 Hz at the precise microsecond of 09:47:12. The blinding flash dissolves into warm amber light. The endless recursion dissolves gently, and the facility clock ticks forward to 09:47:13. Through the open door, Dr. Evelyn Vane looks up with tears in her eyes. 'You remembered,' she says softly. 'Tomorrow has finally arrived.'",
                    loops, evidenceCount, puzzlesCount, true
                );
            } else {
                // Fallback if requested without prerequisite clues
                requestedEndingId = "BREAK_THE_LOOP";
            }
        }

        if ("PRESERVE_THE_MEMORY".equalsIgnoreCase(requestedEndingId) || "ENDING_2".equalsIgnoreCase(requestedEndingId)) {
            state.setCompleted(true);
            state.setSelectedEnding("PRESERVE_THE_MEMORY");
            return new EndingOutcome(
                "PRESERVE_THE_MEMORY",
                "Ending 2 — Preserve The Memory",
                "The Archive in the Stars",
                "You re-route the timeline core's excess energy into the high-gain transmission array. Every byte of Project CHRONOS, every recording of Dr. Sterling's fatal ambition and Dr. Vane's courage, is beamed to an orbital relay beyond the facility. The world will uncover the truth. But the transmission consumes the last dampening field. The loop collapses, preserving the data across humanity, while your own consciousness drifts into the eternal static of the chronometric spectrum.",
                loops, evidenceCount, puzzlesCount, false
            );
        }

        // Default: Ending 1 - BREAK_THE_LOOP
        state.setCompleted(true);
        state.setSelectedEnding("BREAK_THE_LOOP");
        return new EndingOutcome(
            "BREAK_THE_LOOP",
            "Ending 1 — Break The Loop",
            "Severing Spacetime",
            "You grasp the heavy manual SCRAM lever and pull downward with all your weight. Dampener rods plunge into the heart of the core. Alarms wail as sparks cascade from the ceiling conduits. Spacetime screams, then abruptly fractures into stillness. The temporal recursion breaks. You stumble out of the facility entrance into the biting morning air. Time is moving forward once more. Yet behind you, the facility incinerates, burying the secrets of Project CHRONOS in ash.",
            loops, evidenceCount, puzzlesCount, false
        );
    }
}
