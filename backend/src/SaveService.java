package echoes;

import java.io.*;
import java.nio.charset.StandardCharsets;

/**
 * Service for local JSON file-based persistence of game progress.
 */
public class SaveService {

    private final File saveFile;

    public SaveService() {
        File dataDir = new File("backend/data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
        this.saveFile = new File(dataDir, "saved_game.json");
    }

    public synchronized boolean saveGame(GameState state) {
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(saveFile), StandardCharsets.UTF_8))) {
            writer.write(state.toJson());
            return true;
        } catch (IOException e) {
            System.err.println("Error saving game state: " + e.getMessage());
            return false;
        }
    }

    public synchronized String loadGameJson() {
        if (!saveFile.exists()) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(saveFile), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
        } catch (IOException e) {
            System.err.println("Error loading saved game: " + e.getMessage());
            return null;
        }
    }

    public boolean hasSaveFile() {
        return saveFile.exists() && saveFile.length() > 0;
    }

    public boolean deleteSave() {
        if (saveFile.exists()) {
            return saveFile.delete();
        }
        return true;
    }
}
