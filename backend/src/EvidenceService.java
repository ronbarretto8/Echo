package echoes;

import java.util.*;

/**
 * Registry and discovery service for all evidence and clues in Project ECHOES.
 */
public class EvidenceService {

    public static class EvidenceItem {
        public final String id;
        public final String title;
        public final String category;
        public final String room;
        public final String description;
        public final String quote;
        public final boolean isSecret;

        public EvidenceItem(String id, String title, String category, String room, String description, String quote, boolean isSecret) {
            this.id = id;
            this.title = title;
            this.category = category;
            this.room = room;
            this.description = description;
            this.quote = quote;
            this.isSecret = isSecret;
        }

        public String toJson() {
            return String.format(
                "{\"id\":\"%s\",\"title\":\"%s\",\"category\":\"%s\",\"room\":\"%s\",\"description\":\"%s\",\"quote\":\"%s\",\"isSecret\":%b}",
                escape(id), escape(title), escape(category), escape(room), escape(description), escape(quote), isSecret
            );
        }

        private String escape(String s) {
            if (s == null) return "";
            return s.replace("\\", "\\\\").replace("\"", "\\\"");
        }
    }

    private final Map<String, EvidenceItem> evidenceRegistry = new LinkedHashMap<>();

    public EvidenceService() {
        registerEvidence(new EvidenceItem(
            "EVID_CLOCK_ANOMALY",
            "Frozen Dial Mechanism",
            "OBSERVATION",
            "SECURITY_OFFICE",
            "The wall clock is locked at 09:47:12. The second hand twitches backward by one tick every second.",
            "Time didn't stop. It's vibrating in place like a plucked wire.",
            false
        ));
        registerEvidence(new EvidenceItem(
            "EVID_GUARD_LOG",
            "Guard Shift Log (Oct 26)",
            "DOCUMENT",
            "SECURITY_OFFICE",
            "Duty register noted by Chief Reyes. Highlights strange temporal shifts and contains shift locker memo.",
            "09:40 - Dr. Vane rushed past holding magnetic drives. Dr. Sterling ordered lockdown at 09:45. Shift locker code mirrored from incident minute + sector 7.",
            false
        ));
        registerEvidence(new EvidenceItem(
            "EVID_KEYCARD_ALPHA",
            "Keycard Alpha & Tape 01",
            "OBJECT",
            "SECURITY_OFFICE",
            "Magnetic security pass retrieved from the locked drawer, alongside Dr. Sterling's audio log.",
            "Sterling Audio: 'If the loop holds, we have achieved immortality. Ten minutes of perfection, repeated forever.'",
            false
        ));
        registerEvidence(new EvidenceItem(
            "EVID_VANE_LAB_NOTE",
            "Dr. Vane's Lab Notes",
            "RESEARCH_NOTE",
            "RESEARCH_LAB",
            "Handwritten scrawl pinned to the resonance console with chemical formulas and safety warnings.",
            "Calibrate containment in atomic half-life order: Chronite-Alpha -> Flux-Gamma -> Tachyon-Beta. Sterling wants to overclock it. He is out of his mind.",
            false
        ));
        registerEvidence(new EvidenceItem(
            "EVID_RESONANCE_DATA",
            "Resonance Stabilization Telemetry",
            "RESEARCH_NOTE",
            "RESEARCH_LAB",
            "Calibrated data logs confirming the corridor blast door interlock frequency has unlocked.",
            "Field harmonic stable at 432.8 Hz. Blast bulkhead magnetic clamp disengaged.",
            false
        ));
        registerEvidence(new EvidenceItem(
            "EVID_MISSING_DOSSIER_TAG",
            "Empty Dossier Slot #84",
            "DOCUMENT",
            "ARCHIVE_ROOM",
            "A dust-free gap in the archive shelves labeled 'ASTRA Incident 84-2: Recursive Trajectory Modeling'.",
            "The folder was recently moved to the heavy security safe on the north wall.",
            false
        ));
        registerEvidence(new EvidenceItem(
            "EVID_UV_MICROFILM",
            "UV-Revealed Terminal Coordinates",
            "CODE",
            "ARCHIVE_ROOM",
            "Invisible ink markings illuminated under the archival desk's ultraviolet inspection bulb.",
            "Safe authorization sequence: Combine research branch prefix [ASTRA] with file index [842] -> ASTRA-842.",
            false
        ));
        registerEvidence(new EvidenceItem(
            "EVID_STERLING_CONFESSION",
            "Classified Project Directive #84",
            "DOCUMENT",
            "ARCHIVE_ROOM",
            "Classified report showing Dr. Sterling intentionally disabled the safety dampener before 09:47.",
            "'In the event of funding termination, Directive 84 dictates temporal recursion initiation. We will never be shut down.'",
            false
        ));
        registerEvidence(new EvidenceItem(
            "EVID_ECHO_REFLECTION",
            "Corridor Temporal Shadow",
            "OBSERVATION",
            "OBSERVATION_CORRIDOR",
            "Looking into the reinforced glass window, you see your own reflection lagging by several seconds, pointing toward the ceiling conduit.",
            "The reflection mouths words: 'Loop 14 was not the first. Look deeper into the core console.'",
            true
        ));
        registerEvidence(new EvidenceItem(
            "EVID_CORRIDOR_KEYPAD_CODE",
            "Observation Bulkhead Keycode",
            "CODE",
            "OBSERVATION_CORRIDOR",
            "Electronic biometric door separating the corridor from the inner Control Room.",
            "Keypad interlock responds to Keycard Alpha or manual bypass.",
            false
        ));
        registerEvidence(new EvidenceItem(
            "EVID_CHRONOS_KEY",
            "Reconstructed Incident Timeline",
            "DOCUMENT",
            "CONTROL_ROOM",
            "The verified chronological order of the 5 events that fractured the facility's spacetime continuum.",
            "Sequence locked: Initiation -> Power Surge -> Sterling Override -> Vane Scram -> Field Collapse.",
            false
        ));
        registerEvidence(new EvidenceItem(
            "EVID_SECRET_CONCORDANCE",
            "Dr. Vane's Final Unsent Transmission",
            "TRANSCRIPT",
            "CONTROL_ROOM",
            "An encrypted audio reel recovered from the emergency sub-channel. Requires temporal resonance synchronization.",
            "'If anyone out there remembers this loop, you don't have to destroy the facility or sacrifice yourself. Synchronize the harmonic phase at 09:47:12. We can all wake up.'",
            true
        ));
    }

    private void registerEvidence(EvidenceItem item) {
        evidenceRegistry.put(item.id, item);
    }

    public EvidenceItem getEvidence(String id) {
        return evidenceRegistry.get(id);
    }

    public Collection<EvidenceItem> getAllEvidence() {
        return evidenceRegistry.values();
    }

    public List<EvidenceItem> getDiscoveredEvidence(GameState state) {
        List<EvidenceItem> list = new ArrayList<>();
        for (String id : state.getDiscoveredEvidenceIds()) {
            EvidenceItem item = evidenceRegistry.get(id);
            if (item != null) {
                list.add(item);
            }
        }
        return list;
    }

    public String getAllEvidenceJson() {
        StringBuilder sb = new StringBuilder("[");
        int i = 0;
        for (EvidenceItem item : evidenceRegistry.values()) {
            if (i++ > 0) sb.append(",");
            sb.append(item.toJson());
        }
        sb.append("]");
        return sb.toString();
    }
}
