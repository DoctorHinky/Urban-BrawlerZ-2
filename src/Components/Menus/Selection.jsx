import { useEffect, useState } from "react";
import { socket } from "../../Online/WebsocketClient";
import "./Selection.scss";
import data from "./data.json";

function Selection() {
  const maps = data.maps;
  const characters = data.characters;

  const middleIndex = (array) => Math.floor(array.length / 2);
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedChar, setSelectedChar] = useState(null);
  const [ready, setReady] = useState(false);

  const [playerId, setPlayerId] = useState(null);

  const [gameSelectedData, setGameSelectedData] = useState({
    player1: {
      name: "Player 1",
      selection: {
        charId: null,
        map1: null,
      },
    },
    player2: {
      name: "Player 2",
      selection: {
        charId: null,
        map2: null,
      },
    },
    maps: {
      map1: null, // player1 selection
      map2: null, // player2 selection
    },
  });

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Server sendet JSON, also parsen
        console.log("Servernachricht erhalten:", data);

        if (data.type === "WELCOME") {
          setPlayerId(data.playerId); // suche hier die Lösung für die achtualisierung der maps
          console.log("Spieler ID gesetzt:", data.playerId);
        }

        /* if (data.type === "PONG") {
          console.log("PONG erhalten:", data.timeStamp);
        } */ // Für später um latency zu messen

        if (data.type === "selectionUpdate") {
          setGameSelectedData((prev) => ({
            ...prev,
            player1: data.playerData?.player1
              ? { ...prev.player1, selection: data.playerData.player1 }
              : prev.player1,
            player2: data.playerData?.player2
              ? { ...prev.player2, selection: data.playerData.player2 }
              : prev.player2,
          }));
          console.log("Aktualisierte Auswahl empfangen:", data);
        }
      } catch (error) {
        console.error("Fehler beim Verarbeiten der Nachricht:", error);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, []);

  const [opponentSelection, setOpponentSelection] = useState(null);

  useEffect(() => {
    const handleSelectionUpdate = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "selectionUpdate") {
          setGameSelectedData((prev) => ({
            ...prev,
            player1: data.player1
              ? { ...prev.player1, selection: data.player1.selection }
              : prev.player1,
            player2: data.player2
              ? { ...prev.player2, selection: data.player2.selection }
              : prev.player2,
          }));
          console.log("Aktualisierte Auswahl empfangen:", data);
        }
      } catch (error) {
        console.error("Fehler beim Verarbeiten der Serverantwort:", error);
      }
    };

    socket.addEventListener("message", handleSelectionUpdate);
    return () => {
      socket.removeEventListener("message", handleSelectionUpdate);
    };
  }, []);

  function sendSelection() {
    if (socket.readyState === WebSocket.OPEN) {
      const selectedData = {
        type: "selection",
        playerId,
        selection: {
          charId: selectedChar?.id,
          map: selectedMap?.name,
        },
      };
      socket.send(JSON.stringify(selectedData));
      console.log("das ist das Objekt gerade:", selectedData);
    } else {
      console.log("WebSocket nicht verbunden!");
    }
  }

  return (
    <main className="home selection">
      <h2>Wählt eure Champions!</h2>
      <section className="showCase">
        {" "}
        <div
          className="charP1 charShow"
          style={{
            background: gameSelectedData.player1.selection.charId
              ? `url(${
                  data.characters.find(
                    (char) =>
                      char.id === gameSelectedData.player1.selection.charId
                  )?.image
                }) center/cover`
              : "none",
          }}
        >
          <p id="player1Name">
            {gameSelectedData.player1.selection.charId
              ? data.characters.find(
                  (char) =>
                    char.id === gameSelectedData.player1.selection.charId
                )?.name
              : ""}
          </p>
        </div>
        <div
          className="showMap"
          style={{
            background: selectedMap
              ? `url(${selectedMap?.image}) center/cover`
              : "none",
          }}
        >
          {selectedMap ? selectedMap?.name : "Wählt eine Map!"}
        </div>
        <div
          className="charP2 charShow"
          style={{
            background: gameSelectedData.player2.selection.charId
              ? `url(${
                  data.characters.find(
                    (char) =>
                      char.id === gameSelectedData.player2.selection.charId
                  )?.image
                }) center/cover`
              : "none",
          }}
        >
          <p id="player2Name">
            {gameSelectedData.player2.selection.charId
              ? data.characters.find(
                  (char) =>
                    char.id === gameSelectedData.player2.selection.charId
                )?.name
              : ""}
          </p>
        </div>
      </section>
      <section className="mapSect">
        {maps.map((map, index) => {
          let shadow = "";

          if (index < middleIndex(maps)) {
            shadow = `-${index}px 0px 10px white`; // Links → Schatten nach rechts
          } else if (index > middleIndex(maps)) {
            shadow = `${index}px 0px 10px white`; // Rechts → Schatten nach links
          } else {
            shadow = "0px 5px 10px white"; // Mitte → Schatten nach unten
          }

          return (
            <div
              key={index}
              className="map"
              style={{
                boxShadow: "none",
                transition: "box-shadow 0.3s",
                background: `url(${map.image}) center/cover`,
              }}
              onClick={() => {
                setSelectedMap(map);
                if (playerId === "player1") {
                  setGameSelectedData((prev) => ({
                    ...prev,
                    player1: {
                      ...prev.player1,
                      selection: {
                        ...prev.player1.selection,
                        map1: map.name,
                      },
                    },
                  }));
                } else if (playerId === "player2") {
                  setGameSelectedData((prev) => ({
                    ...prev,
                    player2: {
                      ...prev.player2,
                      selection: {
                        ...prev.player2.selection,
                        map2: map.name,
                      },
                    },
                  }));
                }
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = shadow)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              {map.name}
            </div>
          );
        })}
      </section>
      <section className="charsSect">
        {characters.map((char, index) => {
          let rotateAngle = 0;
          let shadow = "";
          let relativePosition = index - middleIndex(characters);
          rotateAngle = relativePosition * 8;

          if (index < middleIndex(characters)) {
            shadow = `${relativePosition * 2}px 0px 10px white`; // Links → Schatten nach rechts
          } else if (index > middleIndex(characters)) {
            shadow = `${relativePosition + 3}px 0px 10px white`; // Rechts → Schatten nach links
          } else {
            shadow = "0px 5px 10px white"; // Mitte → Schatten nach unten
          }

          function giveBorder(playerId) {
            if (playerId === "player1" && selectedChar?.id === char.id) {
              rotateAngle = 0;
              shadow = "0px 0px 10px white";
              const player1Name = document.getElementById("player1Name");
              player1Name.classList.contains("glowingText")
                ? player1Name.classList.remove("glowingText")
                : "",
                setTimeout(() => {
                  player1Name.classList.add("glowingText");
                }, 1);
              return "4px solid green";
            } else if (playerId === "player2" && selectedChar?.id === char.id) {
              const player2Name = document.getElementById("player2Name");
              player2Name.classList.contains("glowingText")
                ? player2Name.classList.remove("glowingText")
                : "",
                setTimeout(() => {
                  player2Name.classList.add("glowingText");
                }, 1);
              rotateAngle = 0;
              shadow = "0px 0px 10px white";
              return "4px solid red";
            }
            return "";
          }

          return (
            <div
              key={index}
              className={`charHead`}
              style={{
                background: `url(${char.image}) center/cover`,
                transition: "box-shadow 0.5s, transform 0.5s",
                boxShadow: shadow,
                border: giveBorder(),
                transform: `rotateY(${rotateAngle}deg)`,
              }}
              onClick={() => {
                if (playerId === "player1") {
                  setSelectedChar(char);
                  setGameSelectedData({
                    ...gameSelectedData,
                    player1: {
                      ...gameSelectedData.player1,
                      selection: {
                        charId: char.id,
                      },
                    },
                  });
                } else if (playerId === "player2") {
                  setSelectedChar(char);
                  setGameSelectedData({
                    ...gameSelectedData,
                    player2: {
                      ...gameSelectedData.player2,
                      selection: {
                        charId: char.id,
                      },
                    },
                  });
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0px 0px 10px white";
                e.currentTarget.style.transform = `rotateY(${0}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateY(${rotateAngle}deg)`;
                e.currentTarget.style.boxShadow = shadow;
              }}
            >
              {char.name}
            </div>
          );
        })}
      </section>
      {selectedChar && selectedMap ? (
        <button
          onClick={() => {
            setReady(true);
            sendSelection();
          }}
        >
          Auswahl bestätigen
        </button>
      ) : null}
    </main>
  );
}

export default Selection;
