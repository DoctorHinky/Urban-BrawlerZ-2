import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const ModeContext = createContext();

export const useMode = () => useContext(ModeContext);

export const ModeProvider = ({ children }) => {
  const [gameMode, setGameMode] = useState(null);
  useEffect(() => {
    if (gameMode !== "offline" && gameMode !== "online") {
      setGameMode(null);
    }
  }, [gameMode]);
  const toggleMode = (newMode) => setGameMode(newMode);

  return (
    <ModeContext.Provider value={{ mode: gameMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

ModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
