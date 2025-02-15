const SERVER_URL = "wss://urban-brawlerz-2-server.onrender.com";
export let socket = new WebSocket(SERVER_URL);

let playerLatency = 0;
let players = {};

let playerId = null; // spieler id wird vom server vergeben und ist für die spätere console.Logik wichtig

socket.addEventListener("open", () => {
  console.log("Verbindung erfolgreich hergestellt");
});

socket.addEventListener("message", (e) => {
  let data;
  try {
    data = JSON.parse(e.data);
  } catch (err) {
    console.log("Fehler beim Parsen der Servernachricht: ", e.data);
    console.log("Fehlermeldung: ", err);
    return;
  }
  console.log(`Servernachricht: ${data.type}`, data);

  switch (data.type) {
    case "WELCOME":
      if (!data.playerId) {
        console.log("Fehlende Spieler-ID in WELCOME-Msg: ", data);
      }
      // hier wird die spieler id vom Server empfangen
      playerId = data.playerId;
      console.log("Deine Spieler ID: ", playerId);
      break;

    case "PONG":
      playerLatency = data.latency;
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
      if (data.action.x !== undefined && data.action.y !== undefined) {
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
      console.log("Unbekannter Nachrichtentyp: ", data.type);
      break;
  }
});

socket.addEventListener("close", (e) => {
  console.log(
    `verbindung zum Server wurde getrennt (Code: ${e.code}), Grund: ${e.reason}`
  );
  setTimeout(() => {
    console.log("Versuche erneut zu verbinden");
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

  console.log("Character gesendet: ", character);
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

function smoothUpdate() {
  for (let id in players) {
    let p = players[id];
    if (!p) continue; // sicherheitscheck

    if (Math.abs(p.targetX - p.x) > 0.5) p.x = p.targetX; // Mindestbewegung
    else p.x += (p.targetX - p.x) * 0.1; // Sanfte Bewegung (10% Schritt)

    if (Math.abs(p.targetY - p.y) > 0.5) p.y = p.targetY;
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
