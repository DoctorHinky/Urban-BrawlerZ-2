// Exportierte Variable, die nach Aktivierung des WebSockets aktualisiert wird
export let socket = null;

// WebSocket-Server URL
const SERVER_URL = "ws://localhost:3001";

// Versuche, die sessionId aus dem Cookie zu lesen
let sessionId = document.cookie
  .split("; ")
  .find((row) => row.startsWith("sessionId="))
  ?.split("=")[1];

let playerLatency = 0;
let players = {};
let playerId = null; // Spieler-ID wird vom Server vergeben

export function activateOnline() {
  const socketUrl = sessionId
    ? `${SERVER_URL}?sessionId=${sessionId}`
    : SERVER_URL;

  socket = new WebSocket(socketUrl);

  // Listener für erfolgreiche Verbindung
  socket.addEventListener("open", () => {
    console.log("Verbindung erfolgreich hergestellt");
  });

  socket.addEventListener("message", handleMessage);

  socket.addEventListener("close", (e) => {
    console.log(`Verbindung zum Server wurde getrennt (Code: ${e.code})`);
    setTimeout(() => {
      reconnectWebsocket();
    }, 3000);
  });

  // Intervall zum Senden von Spieleraktionen (ca. 30fps)
  setInterval(() => {
    if (!playerId || !players[playerId]) return;
    // Initialisiere Spielerposition falls noch nicht vorhanden
    players[playerId] = players[playerId] || { x: 0, y: 0 };
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "PLAYER_ACTION",
          playerId,
          action: { x: players[playerId].x, y: players[playerId].y },
        })
      );
    }
  }, 33);

  setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "PING", timeStamp: Date.now() }));
    }
  }, 5000);

  // Intervall für sanfte Spielerbewegungen (~60 FPS)
  setInterval(smoothUpdate, 16);
}

/**
 * Verarbeitet Nachrichten, die vom Server empfangen werden.
 * @param {MessageEvent} e - Das empfangene Nachrichten-Event
 */
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
      // Spieler-ID wird vom Server empfangen
      playerId = data.playerId;
      console.log("Deine Spieler ID: ", playerId);
      setSessionId(data.playerId);

      sessionId = getCookie("sessionId");
      console.log("sessionId: ", sessionId);
      break;

    case "START_SELECTION":
      console.log("Charakterauswahl startet");
      startCharacterSelection(); // Placeholder für zukünftige Logik
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
        "Keine Verbindung möglich, versuche es später erneut: ",
        data.message
      );
      break;

    default:
      break;
  }
}

/**
 * Aktualisiert die Position eines Spielers mit sanften Übergängen.
 * @param {string} playerId - Die ID des Spielers
 * @param {number} newX - Neue X-Koordinate
 * @param {number} newY - Neue Y-Koordinate
 */
function updatePlayerPosition(playerId, newX, newY) {
  if (!players[playerId]) {
    players[playerId] = { x: newX, y: newY, targetX: newX, targetY: newY };
  } else {
    players[playerId].targetX = newX;
    players[playerId].targetY = newY;
  }
}

/**
 * Lineare Interpolation zwischen zwei Werten.
 * @param {number} start - Startwert
 * @param {number} end - Endwert
 * @param {number} alpha - Interpolationsfaktor
 * @returns {number} Der interpolierte Wert
 */
function lerp(start, end, alpha) {
  return start + (end - start) * alpha;
}

/**
 * Führt sanfte Bewegungsupdates für alle Spieler aus.
 */
function smoothUpdate() {
  for (let id in players) {
    let p = players[id];
    if (!p) continue; // Sicherheitscheck
    p.x = lerp(p.x, p.targetX, 0.1);
    p.y = lerp(p.y, p.targetY, 0.1);
  }
}

/* Cookie-Funktionen */

/**
 * Liest den Wert eines Cookies aus.
 * @param {string} name - Der Name des Cookies
 * @returns {string|null} Der Wert des Cookies oder null, wenn nicht gefunden
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

/**
 * Setzt ein Cookie mit einer bestimmten Ablaufzeit.
 * @param {string} name - Der Name des Cookies
 * @param {string} value - Der Wert des Cookies
 * @param {number} hours - Die Gültigkeitsdauer in Stunden
 */
function setCookie(name, value, hours) {
  if (!value) {
    console.error(`Error: Wert für Cookie ${name} ist undefined oder null`);
    return;
  }
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  console.log(`Cookie gesetzt: ${name}=${value}; expires=${expires}; path=/`);
}

/**
 * Setzt die Session-ID im Cookie.
 * @param {string} sessionId - Die Session-ID vom Server
 */
function setSessionId(sessionId) {
  document.cookie = `sessionId=${sessionId}; path=/; max-age=300`; // 5 Minuten
  console.log("Session ID gesetzt: ", sessionId);
}

/**
@param {string} name - Der Name des Cookies
 */
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

function reconnectWebsocket() {
  console.log("Versuche erneut zu verbinden...");

  // Falls der Socket noch verbunden oder dabei ist, sich zu verbinden, schließen wir ihn
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    console.warn("Socket ist bereits verbunden oder verbindet sich bereits");
    socket.close();
  }

  // Lese die sessionId neu aus dem Cookie
  sessionId = getCookie("sessionId");
  const newSocket = new WebSocket(
    sessionId ? `${SERVER_URL}?sessionId=${sessionId}` : SERVER_URL
  );

  // Füge die Event Listener zum neuen Socket hinzu
  newSocket.addEventListener("open", () => console.log("Wieder verbunden"));
  newSocket.addEventListener("message", handleMessage);
  newSocket.addEventListener("close", () =>
    setTimeout(reconnectWebsocket, 3000)
  );

  // Aktualisiere die exportierte Variable
  socket = newSocket;
}
