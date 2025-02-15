// const SERVER_URL = "wss://urban-brawlerz-2-server.onrender.com";
const SERVER_URL = "ws://localhost:3001";

let sessionId = document.cookie
  .split("; ")
  .find((row) => row.startsWith("sessionId="))
  ?.split("=")[1];

const socketUrl = sessionId
  ? `${SERVER_URL}?sessionId=${sessionId}`
  : SERVER_URL;

export let socket = new WebSocket(socketUrl);
console.log("Websocket verbindung vor Verbindung: ", socketUrl);

let playerLatency = 0;
let players = {};

let playerId = null; // spieler id wird vom server vergeben und ist für die spätere console.Logik wichtig

socket.addEventListener("open", () => {
  console.log("Verbindung erfolgreich hergestellt");
});
socket.removeEventListener("message", handleMessage);
socket.addEventListener("message", handleMessage);

function handleMessage(e) {
  let data;
  try {
    data = JSON.parse(e.data);
  } catch (err) {
    console.log("Fehler beim Parsen der Servernachricht: ", e.data);
    console.log("Fehlermeldung: ", err);
    return;
  }
  if (data.type === "PONG") {
    console.log("Pong erhalten: ", Date.now() - data.timeStamp);
  }

  switch (data.type.trim()) {
    case "WELCOME":
      if (!data.playerId) {
        console.log("Fehlende Spieler-ID in WELCOME-Msg: ", data);
      }
      // hier wird die spieler id vom Server empfangen
      playerId = data.playerId;
      console.log("Deine Spieler ID: ", playerId);
      setSessionId(data.playerId);

      sessionId = getCookie("sessionId");
      console.log("sessionId: ", sessionId);

      break;

    case "START_SELECTION":
      console.log("Charakterauswahl startet");
      startCharacterSelection(); // Placeholer später wird hier die console.Logik angeknüpft
      break;

    case "CHARACTER_UPDATE":
      console.log(
        "Gegnerischer Spieler hat einen Champion gewählt: ",
        data.playerData
      );
      updateCharacterSelection(data.playerData);
      break;

    case "CHARACTER_SELECTION":
      console.log("Time to select your Champion");
      break;

    case "GAME_START":
      console.log("Spiel startet");
      startGame(data.playerData);
      break;

    case "UPDATE_ACTION":
      if (
        data.action.x !== undefined &&
        data.action.y !== undefined &&
        typeof data.action.x === "number" &&
        typeof data.action.y === "number"
      ) {
        updatePlayerPosition(data.playerId, data.action.x, data.action.y);
      } else {
        console.log("Gegner hat eine Aktion ausgeführt: ", data.action);
      }
      break;
    case "PLAYER_DISCONNECTED":
      console.log("Gegner hat das Spiel verlassen");
      returnToLobby();
      break;

    case "ERROR":
      console.log(
        "Keine Verbindung möglich versuche es später erneut: ",
        data.message
      );
      break;
    default:
      break;
  }
}

socket.addEventListener("close", (e) => {
  console.log(`verbindung zum Server wurde getrennt (Code: ${e.code})`);
  setTimeout(() => {
    reconnectWebsocket();
  }, 3000);
});

function sendPlayerAction(action) {
  if (!playerId) return;
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "PLAYER_ACTION", playerId, action }));
}
setInterval(() => {
  if (!playerId || !players[playerId]) return;
  players[playerId] = players[playerId] || { x: 0, y: 0 };
  socket.send(
    JSON.stringify({
      type: "PLAYER_ACTION",
      playerId,
      action: { x: players[playerId].x, y: players[playerId].y },
    })
  );
}, 33); // 33ms ~ 30fps

// Latneztest
setInterval(() => {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "PING", timeStamp: Date.now() }));
}, 5000);

// sanfte bewegungen des spielers

function updatePlayerPosition(playerId, newX, newY) {
  if (!players[playerId]) {
    players[playerId] = { x: newX, y: newY, targetX: newX, targetY: newY };
  } else {
    players[playerId].targetX = newX;
    players[playerId].targetY = newY;
  }
}

// sanfte Bewegungsfunktion

function lerp(start, end, alpha) {
  return start + (end - start) * alpha;
}

function smoothUpdate() {
  for (let id in players) {
    let p = players[id];
    if (!p) continue; // sicherheitscheck

    p.x = lerp(p.x, p.targetX, 0.1);
    p.y = lerp(p.y, p.targetY, 0.1);
  }
}
setInterval(smoothUpdate, 16); // Alle 16ms aufrufen (~60 FPS)

// prediction kommt später

// cookie Funktionen

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function setCookie(name, value, hours) {
  if (!value) {
    console.error(`Error: Wert für Cookie ${name} ist undefined oder null`);
    return;
  }

  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;

  console.log(`Cookie gesetzt: ${name}=${value}; expires=${expires}; path=/`);
}

function setSessionId(sessionId) {
  document.cookie = `sessionId=${sessionId}; path=/; max-age=300`; // 5 Minuten
  console.log("Session ID gesetzt: ", sessionId);
}

// delete cookie

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/* PLACEHOLDER FUNKTIONEN */

function startCharacterSelection() {
  return;
}
function updateCharacterSelection(playerData) {
  return;
}
function startGame() {
  return;
}
function returnToLobby() {
  return;
}

// Reconnect Funktion

function reconnectWebsocket() {
  console.log("Versuche erneut zu verbinden...");

  if (
    socket.readyState === WebSocket.OPEN ||
    socket.readyState === WebSocket.CONNECTING
  ) {
    console.warn("Socket ist bereits verbunden oder verbindet sich bereits");
    socket.close();
  }

  socket.close(); // alten Socket schließen
  sessionId = getCookie("sessionId");
  const NewSocket = new WebSocket(
    sessionId ? `${SERVER_URL}?sessionId=${sessionId}` : SERVER_URL
  );

  socket.addEventListener("open", () => console.log("Wieder verbunden"));
  socket.addEventListener("message", handleMessage);
  socket.addEventListener("close", () => setTimeout(reconnectWebsocket, 3000));

  socket = NewSocket;
}
