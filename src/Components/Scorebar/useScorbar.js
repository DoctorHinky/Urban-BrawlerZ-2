import { useState, useEffect, useCallback } from "react";

const MAX_HEALTH = 300;

export default function useScorebar() {
  const [playerOneHealth, setPlayerOneHealth] = useState(300);
  const [playerTwoHealth, setPlayerTwoHealth] = useState(300);
  const [prevHealth, setPrevHealth] = useState({
    p1: playerOneHealth,
    p2: playerTwoHealth,
  });
  const [time, setTime] = useState(120);
  const [playerOneWins, setPlayerOneWins] = useState(2);
  const [playerTwoWins, setPlayerTwoWins] = useState(1);

  useEffect(() => {
    const updateHealth = (player, health) => {
      if (health < prevHealth[player]) {
        setTimeout(
          () => setPrevHealth((h) => ({ ...h, [player]: health })),
          500
        );
      }
    };

    updateHealth("p1", playerOneHealth);
    updateHealth("p2", playerTwoHealth);
  }, [playerOneHealth, playerTwoHealth, prevHealth]);

  const gameOver = () => {};

  const startNextRound = useCallback(() => {
    if (playerOneHealth > playerTwoHealth && playerOneWins < 2) {
      setPlayerOneWins((p) => p + 1);
      setTime(120);
      setPlayerOneHealth(MAX_HEALTH);
      setPlayerTwoHealth(MAX_HEALTH);
    } else if (playerTwoWins < 2 && playerTwoHealth > playerOneHealth) {
      setPlayerTwoWins((p) => p + 1);
      setTime(120);
      setPlayerOneHealth(MAX_HEALTH);
      setPlayerTwoHealth(MAX_HEALTH);
    } else {
      gameOver();
    }
  }, [playerOneHealth, playerTwoHealth, playerOneWins, playerTwoWins]);

  useEffect(() => {
    if (time > 0) {
      const timerId = setTimeout(() => {
        setTime(time - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    } else {
      startNextRound();
    }
  }, [time, startNextRound]);

  const calcWidth = (health) => (health / MAX_HEALTH) * 100;
  const getHealthColor = (health) => {
    if (health > MAX_HEALTH * 0.75) return "health-100";
    if (health > MAX_HEALTH * 0.5) return "health-75";
    if (health > MAX_HEALTH * 0.25) return "health-50";
    return "health-25";
  };

  return {
    playerOneHealth,
    playerTwoHealth,
    time,
    playerOneWins,
    playerTwoWins,
    prevHealth,
    calcWidth,
    getHealthColor,
  };
}
