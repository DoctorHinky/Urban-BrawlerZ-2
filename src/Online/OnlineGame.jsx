import { useEffect } from "react";
import { socket } from "./WebsocketClient";
import { activateOnline } from "./WebsocketClient";
import Lobby from "./Lobby";

let isSocketActive = false;
function OnlineGame() {
  useEffect(() => {
    // Nur aktivieren, wenn der WebSocket noch nicht aktiv ist
    if (!isSocketActive) {
      activateOnline();
      isSocketActive = true;
    }

    // Cleanup Funktion: Schließe den WebSocket, wenn die Komponente entfernt wird
    return () => {
      if (socket) {
        socket.close(); // Schließt die WebSocket-Verbindung
        console.log("WebSocket Verbindung geschlossen");
      }
    };
  }, []); // Der Effekt wird nur einmal beim ersten Rendern aufgerufen

  return (
    <main className="home">
      <Lobby />
    </main>
  );
}

export default OnlineGame;
