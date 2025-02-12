import { log } from "console";

const SERVER_URL = "wss://urban-brawlerz-2-server.onrender.com";
let socket = new WebSocket(SERVER_URL);

let playerLatency = 0;
let players = {};

let playerId = null; // spieler id wird vom server vergeben und ist für die spätere Logik wichtig

socket.addEventListener("open", () => {
  log("Verbindung erfolgreich hergestellt");
});

socket.addEventListener("message", (e) => {
  let data;
  try {
    data = JSON.parse(e.data);
  } catch (err) {
    log("Fehler beim Parsen der Servernachricht: ", e.data);
    log("Fehlermeldung: ", err);
    return;
  }
  log(`Servernachricht: ${data.type}`, data);

  switch (data.type) {
    case "WELCOME":
      if (!data.playerId) {
        log("Fehlende Spieler-ID in WELCOME-Msg: ", data);
      }
      // hier wird die spieler id vom Server empfangen
      playerId = data.playerId;
      log("Deine Spieler ID: ", playerId);
      break;

    case "PONG":
      playerLatency = data.latency;
      break;

    case "START_SELECTION":
      log("Charakterauswahl startet");
      startCharacterSelection(); // Placeholer später wird hier die Logik angeknüpft
      break;

    case "CHARACTER_UPDATE":
      log("Gegnerischer Spieler hat einen Champion gewählt: ", data.playerData);
      updateCharacterSelection(data.playerData);
      break;

    case "GAME_START":
      log("Spiel startet");
      startGame(data.playerData);
      break;

    case "UPDATE_ACTION":
      if (data.action.x !== undefined && data.action.y !== undefined) {
        updatePlayerPosition(data.playerId, data.action.x, data.action.y);
      } else {
        log("Gegner hat eine Aktion ausgeführt: ", data.action);
      }

      break;

    case "PLAYER_DISCONNECTED":
      log("Gegner hat das Spiel verlassen");
      returnToLobby();
      break;

    case "ERROR":
      log("Keine Verbindung möglich versuche es später erneut: ", data.message);
      break;
    default:
      log("Unbekannter Nachrichtentyp: ", data.type);
      break;
  }
});

socket.addEventListener("close", (e) => {
  log(
    `verbindung zum Server wurde getrennt (Code: ${e.code}), Grund: ${e.reason}`
  );
  setTimeout(() => {
    log("Versuche erneut zu verbinden");
    socket = new WebSocket(SERVER_URL);
  }, 3000);
});

// Brokeup Case:

function selectedCharacter(character) {
  if (!playerId) return;

  socket.send(
    JSON.stringify({
      type: "CHARACTER_SELECTED",
      playerId,
      character,
    })
  );

  log("Character gesendet: ", character);
}

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
      x: players[playerId].x,
      y: players[playerId].y,
    })
  );
}, 33); // 33ms ~ 30fps

// Latneztest
setInterval(() => {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "PING", timeStamp: Date.now() }));
}, 1000);

// sanfte bewegungen des spielers

function updatePlayerPosition(playerId, newX, newY) {
  if (!players[playerId]) {
    players[playerId] = { x: newX, y: newY, targetX: newX, targetY: newY };
  } else {
    players[playerId].targetX = newX;
    players[playerId].targetY = newY;
  }
}

function smoothUpdate() {
  for (let id in players) {
    let p = players[id];
    if (!p) continue; // sicherheitscheck

    if (Math.abs(p.targetX - p.x) > 0.5) p.x = p.target; // Mindestbewegung
    else p.x += (p.targetX - p.x) * 0.1; // Sanfte Bewegung (10% Schritt)

    if (Math.abs(p.targetY - p.y) > 0.5) p.y = p.target;
    else p.y += (p.targetY - p.y) * 0.1;
  }
}
setInterval(smoothUpdate, 16); // Alle 16ms aufrufen (~60 FPS)

// prediction kommt später

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
