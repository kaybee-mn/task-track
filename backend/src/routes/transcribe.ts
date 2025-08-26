import { AssemblyAI } from "assemblyai";
import { Readable } from "stream";
import WebSocket, { WebSocketServer, type RawData } from "ws";
// import recorder from "node-record-lpcm16";

// helper functions
const clearLine = () => {
  process.stdout.write("" + " ".repeat(80) + "");
};

function formatTimestamp(timestamp: any) {
  return new Date(timestamp * 1000).toISOString();
}

let ws: WebSocket | null;
let stopRequested: boolean = false;

const ASSEMBLYAI_ENDPOINT =
  "wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000";
async function run() {
  console.log("Starting AssemblyAI real-time transcription...");

  // Initialize WebSocket connection

  ws = new WebSocket(ASSEMBLYAI_ENDPOINT, {
    headers: {
      Authorization: process.env.ASSEMBLYAI_KEY,
    },
  });

  // Setup WebSocket event handlers

  ws.on("open", () => {
    console.log("WebSocket connection opened.");
  });

  ws.on("message", (message: WebSocket.RawData) => {
    try {
      const str = message.toString("utf8"); // convert Buffer → string
      const data = JSON.parse(str);

      if (data.type === "session_begins") {
        console.log("Session started:", data.id);
      } else if (data.type === "partial_transcript") {
        process.stdout.write(`\r${data.text}`); // overwrite line with live text
      } else if (data.type === "final_transcript") {
        console.log("\nFinal:", data.text);
      } else {
        console.log("Other event:", data);
      }
    } catch (error) {
      console.error(`\nError handling message: ${error}`);

      console.error(`Message data: ${message}`);
    }
  });

  ws.on("error", (error) => {
    console.error(`\nWebSocket Error: ${error}`);

    cleanup();
  });

  ws.on("close", (code, reason) => {
    console.log(`\nWebSocket Disconnected: Status=${code}, Msg=${reason}`);

    cleanup();
  });

  // Handle process termination

  setupTerminationHandlers();
}

//when post recieved
try {
  const wss = new WebSocketServer({ port: 8080 });

  wss.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", (data) => {
      let chunk: ArrayBuffer;

      if (typeof data === "string") {
        // Convert base64 string to ArrayBuffer
        const binary = Buffer.from(data, "base64");
        chunk = binary.buffer.slice(
          binary.byteOffset,
          binary.byteOffset + binary.byteLength
        );
      } else if (data instanceof Float32Array) {
        chunk = data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength
        ) as ArrayBuffer;
      } else if (Buffer.isBuffer(data)) {
        chunk = data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength
        ) as ArrayBuffer;
      } else {
        console.warn("Unsupported data type", data);
        return;
      }

      console.log("Chunk length (bytes):", chunk.byteLength);

      if (ws && ws.readyState === WebSocket.OPEN && !stopRequested) {
        const int16Chunk = data;
        ws.send(int16Chunk);
      }
      // forward to AssemblyAI, save to file, etc.
    });

    socket.on("close", () => {
      console.log("Client disconnected");
      cleanup();
    });
    socket.on("error", (e) => {
      console.log("Error message: ", e);
      cleanup();
    });
  });
} catch (error) {
  console.error(`Error opening microphone stream: ${error}`);

  cleanup();
}
function cleanup() {
  stopRequested = true;
  // Close WebSocket connection if it's open

  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    try {
      // Send termination message if possible

      if (ws.readyState === WebSocket.OPEN) {
        const terminateMessage = { type: "Terminate" };

        console.log(
          `Sending termination message: ${JSON.stringify(terminateMessage)}`
        );

        ws.send(JSON.stringify(terminateMessage));
      }

      ws.close();
    } catch (error) {
      console.error(`Error closing WebSocket: ${error}`);
    }

    ws = null;
  }

  console.log("Cleanup complete.");
}

function setupTerminationHandlers() {
  // Handle Ctrl+C and other termination signals

  process.on("SIGINT", () => {
    console.log("\nCtrl+C received. Stopping...");

    cleanup();

    // Give time for cleanup before exiting

    setTimeout(() => process.exit(0), 1000);
  });

  process.on("SIGTERM", () => {
    console.log("\nTermination signal received. Stopping...");

    cleanup();

    // Give time for cleanup before exiting

    setTimeout(() => process.exit(0), 1000);
  });

  // Handle uncaught exceptions

  process.on("uncaughtException", (error) => {
    console.error(`\nUncaught exception: ${error}`);

    cleanup();

    // Give time for cleanup before exiting

    setTimeout(() => process.exit(1), 1000);
  });
}
run();
