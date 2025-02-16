import { useState, useEffect } from "react";

function Lobby({ socket }) {
  const [players, setPlayers] = useState([]);

  const handlePlayerData = (e) => {
    let data;
    try {
      data = JSON.parse(e.data);
    } catch (err) {
      console.log("Fehler beim Parsen der Servernachricht: ", e.data);
      console.log("Fehlermeldung: ", err);
      return;
    }

    if (data.type === "LOBBY_DATA") {
      console.log(
        "In der Lobby sind folgende Spieler (lobby.jsx): ",
        data.players
      );

      setPlayers(data.players);
    }

    return (
      <main className="home">
        <h1>Lobby</h1>
        {players.length === 0 ? (
          <p>Keine Spieler verbunden</p>
        ) : (
          players.map(({ player }) => {
            return (
              <p key={player.sessionId} className="listedPlayer">
                Name: {player.sessionId} latenz: {player.latenz}
              </p>
            );
          })
        )}
      </main>
    );
  };
}
export default Lobby;
