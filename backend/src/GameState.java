package echoes;

import java.io.Serializable;
import java.util.*;

/**
 * Authoritative GameState model representing the player's progress across loops.
 */
public class GameState implements Serializable {
    private static final long serialVersionUID = 1L;

    private int loopNumber;
    private int timeRemainingSeconds;
    private String currentRoom;
    private boolean isPaused;
    private boolean isCompleted;
    private String selectedEnding;
    private int totalLoopsCompleted;
    private int totalTimeElapsedSeconds;

    // Permanent across loops
    private Set<String> discoveredEvidenceIds;
    private Set<String> solvedPuzzleIds;
    private Set<String> connectedCluePairs;
    private Map<String, Integer> failedPuzzleAttempts;

    // Transient (resets each loop)
    private Set<String> temporaryInteractions;
    private Set<String> unlockedDoors;

    public GameState() {
        this.loopNumber = 1;
        this.timeRemainingSeconds = 600; // 10 minutes default
        this.currentRoom = "SECURITY_OFFICE";
        this.isPaused = false;
        this.isCompleted = false;
        this.selectedEnding = null;
        this.totalLoopsCompleted = 0;
        this.totalTimeElapsedSeconds = 0;

        this.discoveredEvidenceIds = new LinkedHashSet<>();
        this.solvedPuzzleIds = new LinkedHashSet<>();
        this.connectedCluePairs = new LinkedHashSet<>();
        this.failedPuzzleAttempts = new HashMap<>();

        this.temporaryInteractions = new HashSet<>();
        this.unlockedDoors = new HashSet<>();

        // Add starting discovery: the anomaly itself
        this.discoveredEvidenceIds.add("EVID_CLOCK_ANOMALY");
    }

    // Getters and Setters
    public int getLoopNumber() { return loopNumber; }
    public void setLoopNumber(int loopNumber) { this.loopNumber = loopNumber; }

    public int getTimeRemainingSeconds() { return timeRemainingSeconds; }
    public void setTimeRemainingSeconds(int timeRemainingSeconds) { this.timeRemainingSeconds = timeRemainingSeconds; }

    public String getCurrentRoom() { return currentRoom; }
    public void setCurrentRoom(String currentRoom) { this.currentRoom = currentRoom; }

    public boolean isPaused() { return isPaused; }
    public void setPaused(boolean paused) { isPaused = paused; }

    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }

    public String getSelectedEnding() { return selectedEnding; }
    public void setSelectedEnding(String selectedEnding) { this.selectedEnding = selectedEnding; }

    public int getTotalLoopsCompleted() { return totalLoopsCompleted; }
    public void setTotalLoopsCompleted(int count) { this.totalLoopsCompleted = count; }

    public int getTotalTimeElapsedSeconds() { return totalTimeElapsedSeconds; }
    public void setTotalTimeElapsedSeconds(int seconds) { this.totalTimeElapsedSeconds = seconds; }

    public Set<String> getDiscoveredEvidenceIds() { return discoveredEvidenceIds; }
    public void setDiscoveredEvidenceIds(Set<String> ids) { this.discoveredEvidenceIds = ids; }

    public Set<String> getSolvedPuzzleIds() { return solvedPuzzleIds; }
    public void setSolvedPuzzleIds(Set<String> ids) { this.solvedPuzzleIds = ids; }

    public Set<String> getConnectedCluePairs() { return connectedCluePairs; }
    public void setConnectedCluePairs(Set<String> pairs) { this.connectedCluePairs = pairs; }

    public Map<String, Integer> getFailedPuzzleAttempts() { return failedPuzzleAttempts; }
    public void setFailedPuzzleAttempts(Map<String, Integer> attempts) { this.failedPuzzleAttempts = attempts; }

    public Set<String> getTemporaryInteractions() { return temporaryInteractions; }
    public void setTemporaryInteractions(Set<String> interactions) { this.temporaryInteractions = interactions; }

    public Set<String> getUnlockedDoors() { return unlockedDoors; }
    public void setUnlockedDoors(Set<String> doors) { this.unlockedDoors = doors; }

    public void incrementAttempt(String puzzleId) {
        int current = failedPuzzleAttempts.getOrDefault(puzzleId, 0);
        failedPuzzleAttempts.put(puzzleId, current + 1);
    }

    public int getAttemptCount(String puzzleId) {
        return failedPuzzleAttempts.getOrDefault(puzzleId, 0);
    }

    public void addEvidence(String evidenceId) {
        discoveredEvidenceIds.add(evidenceId);
    }

    public boolean hasEvidence(String evidenceId) {
        return discoveredEvidenceIds.contains(evidenceId);
    }

    public void markPuzzleSolved(String puzzleId) {
        solvedPuzzleIds.add(puzzleId);
    }

    public boolean isPuzzleSolved(String puzzleId) {
        return solvedPuzzleIds.contains(puzzleId);
    }

    /**
     * Converts GameState to a clean JSON string representation without external dependencies.
     */
    public String toJson() {
        StringBuilder sb = new StringBuilder("{");
        sb.append("\"loopNumber\":").append(loopNumber).append(",");
        sb.append("\"timeRemainingSeconds\":").append(timeRemainingSeconds).append(",");
        sb.append("\"currentRoom\":\"").append(escape(currentRoom)).append("\",");
        sb.append("\"isPaused\":").append(isPaused).append(",");
        sb.append("\"isCompleted\":").append(isCompleted).append(",");
        sb.append("\"selectedEnding\":").append(selectedEnding == null ? "null" : "\"" + escape(selectedEnding) + "\"").append(",");
        sb.append("\"totalLoopsCompleted\":").append(totalLoopsCompleted).append(",");
        sb.append("\"totalTimeElapsedSeconds\":").append(totalTimeElapsedSeconds).append(",");

        // discoveredEvidenceIds
        sb.append("\"discoveredEvidenceIds\":[");
        int i = 0;
        for (String id : discoveredEvidenceIds) {
            if (i++ > 0) sb.append(",");
            sb.append("\"").append(escape(id)).append("\"");
        }
        sb.append("],");

        // solvedPuzzleIds
        sb.append("\"solvedPuzzleIds\":[");
        i = 0;
        for (String id : solvedPuzzleIds) {
            if (i++ > 0) sb.append(",");
            sb.append("\"").append(escape(id)).append("\"");
        }
        sb.append("],");

        // unlockedDoors
        sb.append("\"unlockedDoors\":[");
        i = 0;
        for (String id : unlockedDoors) {
            if (i++ > 0) sb.append(",");
            sb.append("\"").append(escape(id)).append("\"");
        }
        sb.append("],");

        // temporaryInteractions
        sb.append("\"temporaryInteractions\":[");
        i = 0;
        for (String id : temporaryInteractions) {
            if (i++ > 0) sb.append(",");
            sb.append("\"").append(escape(id)).append("\"");
        }
        sb.append("],");

        // failedPuzzleAttempts
        sb.append("\"failedPuzzleAttempts\":{");
        i = 0;
        for (Map.Entry<String, Integer> entry : failedPuzzleAttempts.entrySet()) {
            if (i++ > 0) sb.append(",");
            sb.append("\"").append(escape(entry.getKey())).append("\":").append(entry.getValue());
        }
        sb.append("}");

        sb.append("}");
        return sb.toString();
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
