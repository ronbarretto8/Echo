package echoes;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Executors;

/**
 * Lightweight, zero-dependency Java HTTP Server for ECHOES Game Backend.
 * Uses standard Java SE com.sun.net.httpserver.HttpServer.
 */
public class GameServer {

    private static final int DEFAULT_PORT = 8080;
    private final GameController controller;
    private HttpServer server;

    public GameServer() {
        this.controller = new GameController();
    }

    public void start(int port) throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);
        server.setExecutor(Executors.newFixedThreadPool(4));

        // Register API endpoints
        server.createContext("/api/health", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                sendJsonResponse(exchange, 200, "{\"status\":\"ONLINE\",\"server\":\"ECHOES-Java-GameServer\",\"version\":\"1.0.0\"}");
            }
        });

        server.createContext("/api/state", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                sendJsonResponse(exchange, 200, controller.getCurrentState());
            }
        });

        server.createContext("/api/evidence", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                sendJsonResponse(exchange, 200, controller.getAllEvidence());
            }
        });

        server.createContext("/api/new-game", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                sendJsonResponse(exchange, 200, controller.startNewGame());
            }
        });

        server.createContext("/api/inspect", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                String body = readBody(exchange);
                String roomId = extractJsonValue(body, "roomId");
                String objectId = extractJsonValue(body, "objectId");
                sendJsonResponse(exchange, 200, controller.inspectObject(roomId, objectId));
            }
        });

        server.createContext("/api/puzzle/solve", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                String body = readBody(exchange);
                String puzzleId = extractJsonValue(body, "puzzleId");
                String solution = extractJsonValue(body, "solution");
                sendJsonResponse(exchange, 200, controller.submitPuzzle(puzzleId, solution));
            }
        });

        server.createContext("/api/loop/reset", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                sendJsonResponse(exchange, 200, controller.resetLoop());
            }
        });

        server.createContext("/api/ending/evaluate", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                String body = readBody(exchange);
                String endingChoice = extractJsonValue(body, "endingChoice");
                sendJsonResponse(exchange, 200, controller.evaluateEnding(endingChoice));
            }
        });

        server.createContext("/api/save", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                sendJsonResponse(exchange, 200, controller.saveGame());
            }
        });

        server.createContext("/api/load", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                sendJsonResponse(exchange, 200, controller.loadGame());
            }
        });

        server.createContext("/api/time/tick", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                String body = readBody(exchange);
                String deltaStr = extractJsonValue(body, "deltaSeconds");
                int delta = 1;
                try {
                    if (deltaStr != null && !deltaStr.isEmpty()) delta = Integer.parseInt(deltaStr);
                } catch (NumberFormatException ignored) {}
                sendJsonResponse(exchange, 200, controller.updateTime(delta));
            }
        });

        server.createContext("/api/pause", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if (handleCors(exchange)) return;
                String body = readBody(exchange);
                String pausedStr = extractJsonValue(body, "paused");
                boolean paused = Boolean.parseBoolean(pausedStr);
                sendJsonResponse(exchange, 200, controller.setPaused(paused));
            }
        });

        server.start();

        System.out.println("==================================================");
        System.out.println("  ECHOES — THE TIME-LOOP MYSTERY GAME SERVER     ");
        System.out.println("  Running on port: " + port);
        System.out.println("  API Health: http://localhost:" + port + "/api/health");
        System.out.println("  Facility: Astraea Chrono-Dynamics Annex 4       ");
        System.out.println("==================================================");
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
        }
    }

    private static boolean handleCors(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return true;
        }
        return false;
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String responseJson) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        byte[] bytes = responseJson.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[1024];
        while ((nRead = is.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        buffer.flush();
        return new String(buffer.toByteArray(), StandardCharsets.UTF_8);
    }

    private static String extractJsonValue(String json, String key) {
        if (json == null) return null;
        String pattern = "\"" + key + "\":";
        int idx = json.indexOf(pattern);
        if (idx == -1) return null;
        int start = idx + pattern.length();
        while (start < json.length() && (json.charAt(start) == ' ' || json.charAt(start) == '\t')) {
            start++;
        }
        if (start >= json.length()) return null;

        if (json.charAt(start) == '\"') {
            start++;
            int end = json.indexOf('\"', start);
            if (end == -1) return "";
            return json.substring(start, end);
        } else {
            int end = start;
            while (end < json.length() && json.charAt(end) != ',' && json.charAt(end) != '}' && json.charAt(end) != ']') {
                end++;
            }
            return json.substring(start, end).trim();
        }
    }

    public static void main(String[] args) {
        int port = DEFAULT_PORT;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.err.println("Invalid port specified, defaulting to " + DEFAULT_PORT);
            }
        }
        try {
            GameServer server = new GameServer();
            server.start(port);
        } catch (IOException e) {
            System.err.println("Failed to start ECHOES GameServer: " + e.getMessage());
        }
    }
}
