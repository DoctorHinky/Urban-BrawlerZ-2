import React, { useRef, useEffect, useState } from "react";
import Player from "../Game/Player ";
import Input from "../Game/Input";
import startGameLoop from "../Game/GameLoop";  // Import the extracted game loop
import "./Canvas.scss";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [player] = useState(new Player());
  const frameIndexRef = useRef(0);
  const frameSpeed = 1000 / 10; // 30 FPS

  const canvasSize = {
    width: 1500,
    height: 800,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (canvas && ctx) {
      // Start the game loop
      startGameLoop(ctx, canvas, player, frameIndexRef, frameSpeed);
    }
  }, [player]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="canvas"
        width={canvasSize.width}
        height={canvasSize.height}
      />
      <Input player={player} />
    </div>
  );
};

export default GameCanvas;












