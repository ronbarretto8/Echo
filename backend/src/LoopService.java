package echoes;

import java.util.*;

/**
 * Service managing time-loop transitions, state resetting, and environmental evolution.
 */
public class LoopService {

    public static class LoopResetResult {
        public final int newLoopNumber;
        public final String narrativeMessage;
        public final List<String> environmentalChanges;

        public LoopResetResult(int newLoopNumber, String narrativeMessage, List<String> environmentalChanges) {
            this.newLoopNumber = newLoopNumber;
            this.narrativeMessage = narrativeMessage;
            this.environmentalChanges = environmentalChanges;
        }

        public String toJson() {
            StringBuilder sb = new StringBuilder("{");
            sb.append("\"newLoopNumber\":").append(newLoopNumber).append(",");
            sb.append("\"narrativeMessage\":\"").append(escape(narrativeMessage)).append("\",");
            sb.append("\"environmentalChanges\":[");
            int i = 0;
            for (String change : environmentalChanges) {
                if (i++ > 0) sb.append(",");
                sb.append("\"").append(escape(change)).append("\"");
            }
            sb.append("]}");
            return sb.toString();
        }

        private String escape(String s) {
            if (s == null) return "";
            return s.replace("\\", "\\\\").replace("\"", "\\\"");
        }
    }

    public LoopResetResult executeLoopReset(GameState state) {
        int nextLoop = state.getLoopNumber() + 1;
        state.setLoopNumber(nextLoop);
        state.setTotalLoopsCompleted(state.getTotalLoopsCompleted() + 1);

        // Reset countdown to default 10 minutes (600s)
        state.setTimeRemainingSeconds(600);
        state.setCurrentRoom("SECURITY_OFFICE");
        state.setPaused(false);

        // Clear transient interactions but keep permanent evidence and solved puzzles
        state.getTemporaryInteractions().clear();

        // Environmental notes
        List<String> changes = new ArrayList<>();
        String narrative;

        if (nextLoop == 2) {
            narrative = "The world implodes into a flash of monochrome light. A suffocating ringing fills your ears—and then, sudden silence. You open your eyes. The wall clock ticks backwards once at 09:47:12. You are back at the security desk. Your notebook remains in your hands, every clue you jotted down intact. But on the observation corridor glass, an eerie silhouette has formed...";
            changes.add("A persistent temporal reflection now hovers in the Observation Corridor window.");
            changes.add("Dr. Evelyn Vane's laboratory terminal has rebooted into safe mode.");
        } else if (nextLoop == 3) {
            narrative = "Another cycle collapses. Spacetime snaps like cold iron. You wake up with your head on the wooden console, the metallic taste of ozone on your tongue. The loop is decaying—microscopic fissures of light are visible in the ceiling conduits.";
            changes.add("The central timeline core hums at a higher harmonic frequency.");
            changes.add("Archive room ultraviolet lamp reveals deeper fluorescent handwriting.");
        } else {
            narrative = String.format("Loop %d begins. 09:47:12 AM. The facility resets its physical arrangement, but your memory and evidence remain unbroken. The truth is within your grasp.", nextLoop);
            changes.add("Facility timeline stability index: " + Math.max(12, 100 - (nextLoop * 14)) + "%");
        }

        return new LoopResetResult(nextLoop, narrative, changes);
    }
}
