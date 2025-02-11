import "./Canvas.scss";
import { useRef, useEffect } from "react";

const GameCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.classList.add("canvas");
    const ctx = canvas.getContext("2d");

    if (canvas && ctx) {
      canvas.width = window.innerWidth * 0.7; // 70vw
      const aspectRatio = 16 / 9;
      canvas.height = canvas.width / aspectRatio;
      drawCharacter(ctx); // Beispiel-Charakter zeichnen
    }
  }, []);

  /* Charakter malen */
  const drawCharacter = (ctx) => {
    ctx.fillStyle = "red";
    ctx.fillRect(100, 100, 50, 50);
  };

  return <canvas ref={canvasRef} />;
};

export default GameCanvas;
