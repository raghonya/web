// terminal.js

// ───────────────────────────────────────────────────────────────────────────
// 1) BASIC CONFIGURATION
// ───────────────────────────────────────────────────────────────────────────

// WebSocket endpoint (update if needed)
const WS_URL = "ws://10.0.100.50:8765";

// Core C keywords (C89/C99) only
const C_KEYWORDS = [
  "auto", "break", "case", "char", "const", "continue",
  "default", "do", "double", "else", "enum", "extern",
  "float", "for", "goto", "if", "inline", "int",
  "long", "register", "restrict", "return", "short",
  "signed", "sizeof", "static", "struct", "switch",
  "typedef", "union", "unsigned", "void", "volatile", "while"
];

// ───────────────────────────────────────────────────────────────────────────
// 2) STATE VARIABLES
// ───────────────────────────────────────────────────────────────────────────
let socket = null;
let reconnectTimeout = null;

// DOM references (initialized on DOMContentLoaded)
let statusDot, statusText, sendButton, terminalContainer, cmEditor;

// ───────────────────────────────────────────────────────────────────────────
// 3) CODEMIRROR SETUP (C MODE + AUTOCOMPLETE FOR BASIC KEYWORDS)
// ───────────────────────────────────────────────────────────────────────────
function initCodeMirror() {
  cmEditor = CodeMirror.fromTextArea(document.getElementById("c-editor"), {
    mode: "text/x-csrc",
    theme: "monokai",
    lineNumbers: true,
    indentUnit: 4,
    // Bind Ctrl-Space to call showHint() (will insert a single match automatically)
    extraKeys: {
      "Ctrl-Space": function(cm) {
        cm.showHint({ completeSingle: true });
      }
    },
    hintOptions: {
      // Only suggest from the C_KEYWORDS array above
      hint: function(cm) {
        const cur = cm.getCursor();
        const token = cm.getTokenAt(cur);
        const start = token.start;
        const end = cur.ch;
        const word = token.string.slice(0, end - start);
        // Filter only the basic C keywords that start with 'word'
        const list = C_KEYWORDS
          .filter(k => k.startsWith(word))
          .sort();
        return {
          list: list,
          from: CodeMirror.Pos(cur.line, start),
          to: CodeMirror.Pos(cur.line, end)
        };
      }
    }
  });

  // (Optional) Starter template
  const initialTemplate = `#include <stdio.h>

int main(void) {
    printf("Hello from C code!\\n");
    return 0;
}
`;
  cmEditor.setValue(initialTemplate);

  // ─────────────────────────────────────────────────────────────────────────
  //  → AUTO-POPUP AS YOU TYPE
  //    (type any letter/digit/underscore to pop up the hint box)
  // ─────────────────────────────────────────────────────────────────────────
  cmEditor.on("inputRead", (cm, change) => {
    const charTyped = change.text[0];
    if (!charTyped) return;
    // Only trigger on letter/digit/underscore
    if (/[\w]/.test(charTyped)) {
      cm.showHint({ completeSingle: true });
    }
  });
}

// ───────────────────────────────────────────────────────────────────────────
// 4) TERMINAL OUTPUT (APPEND / CLEAR)
// ───────────────────────────────────────────────────────────────────────────
function appendTerminalLine(text, isError = false) {
  const lineEl = document.createElement("div");
  lineEl.className = "terminal-line";
  lineEl.style.color = isError ? "#ff6666" : "#cccccc";
  lineEl.textContent = text;
  terminalContainer.appendChild(lineEl);
  terminalContainer.scrollTop = terminalContainer.scrollHeight;
}

function clearTerminal() {
  terminalContainer.innerHTML = "";
}

// ───────────────────────────────────────────────────────────────────────────
// 5) STATUS INDICATOR
// ───────────────────────────────────────────────────────────────────────────
function setStatus(status) {
  switch (status) {
    case "connecting":
      statusDot.style.background = "gray";
      statusText.textContent = "Connecting…";
      sendButton.disabled = true;
      break;
    case "connected":
      statusDot.style.background = "#4caf50"; // green
      statusText.textContent = "Connected";
      sendButton.disabled = false;
      break;
    case "disconnected":
      statusDot.style.background = "red";
      statusText.textContent = "Disconnected";
      sendButton.disabled = true;
      break;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 6) WEBSOCKET LOGIC (CONNECT / RECONNECT ON ERROR)
// ───────────────────────────────────────────────────────────────────────────
function connectWebSocket() {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  setStatus("connecting");
  socket = new WebSocket(WS_URL);

  socket.addEventListener("open", () => {
    setStatus("connected");
    appendTerminalLine("→ WebSocket connected.");
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  });

  socket.addEventListener("message", (event) => {
    let msg = event.data;
    try {
      const obj = JSON.parse(msg);
      appendTerminalLine("← JSON Response:");
      appendTerminalLine(JSON.stringify(obj, null, 2));
    } catch {
      appendTerminalLine(`← ${msg}`);
    }
  });

  socket.addEventListener("close", () => {
    setStatus("disconnected");
    appendTerminalLine("→ WebSocket disconnected. Reconnecting in 2s…", true);
    if (!reconnectTimeout) {
      reconnectTimeout = setTimeout(connectWebSocket, 2000);
    }
  });

  socket.addEventListener("error", (err) => {
    console.error("WebSocket error:", err);
    appendTerminalLine("→ WebSocket error occurred.", true);
    socket.close();
  });
}

// ───────────────────────────────────────────────────────────────────────────
// 7) SEND C CODE OVER WEBSOCKET
// ───────────────────────────────────────────────────────────────────────────
function sendCCode() {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    appendTerminalLine("← Cannot send: WebSocket is not open.", true);
    return;
  }
  const rawCode = cmEditor.getValue();
  const payload = { code: rawCode };

  try {
    socket.send(JSON.stringify(payload));
    appendTerminalLine("→ Sent C code to server.");
  } catch (e) {
    appendTerminalLine("← Send failed: " + e.message, true);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 8) DOM CONTENT LOADED INITIALIZATION
// ───────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Grab DOM references
  statusDot = document.getElementById("status-dot");
  statusText = document.getElementById("status-text");
  sendButton = document.getElementById("send-button");
  terminalContainer = document.getElementById("terminal-container");

  // Initialize CodeMirror and open WebSocket
  initCodeMirror();
  connectWebSocket();

  // Hook up “Send C Code” button
  sendButton.addEventListener("click", sendCCode);
});
