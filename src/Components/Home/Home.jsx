import { useState, useEffect } from "react";
import { useMode } from "../../Context/GameMode";
import OnlineGame from "../../Online/OnlineGame";
import OfflineGame from "../../Offline/OfflineGame";
import OnlineLogo from "../../assets/styles/Images/OnlineLogo";
import OfflineLogo from "../../assets/styles/Images/OfflineLogo";

import "./Home.scss";

const Home = () => {
  const { mode, toggleMode } = useMode(); // Hole Mode und toggleMode
  const [isModeSelected, setIsModeSelected] = useState(false); // Um zu überprüfen, ob der Modus gewählt wurde

  useEffect(() => {
    if (mode) {
      console.log("Mode selected: ", mode);
      setIsModeSelected(true);
    }
  }, [mode]);

  const startGame = (selectedMode) => {
    toggleMode(selectedMode);
  };

  return (
    <main className="home">
      {!isModeSelected ? (
        <>
          <h1>Urban BrawlerZ 2</h1>
          <section>
            <h2>Wähle deinen Spielmodus</h2>
            <div className="modes-container">
              <div className="modes" onClick={() => startGame("online")}>
                <OnlineLogo />
                <p>Online</p>
              </div>
              <div className="modes" onClick={() => startGame("offline")}>
                <OfflineLogo />
                <p>Offline</p>
              </div>
            </div>
          </section>
        </>
      ) : // Wenn ein Modus gewählt wurde, zeige das Spiel an
      mode === "online" ? (
        <OnlineGame />
      ) : (
        <OfflineGame />
      )}
    </main>
  );
};

export default Home;
