import React, { useRef, useEffect, useState } from "react";
import Player from "../Game/Player ";
import Input from "../Game/Input";  // Import Input component for handling movement
import "./Canvas.scss";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [player] = useState(new Player()); // Create player instance
  const frameIndexRef = useRef(0); // Track frame index without causing re-renders
  const frameSpeed = 1000 / 30; // Frame speed in milliseconds (30 FPS -> ~33ms)
  const [lastFrameTime, setLastFrameTime] = useState(0);

  // Fixed canvas size
  const canvasSize = {
    width: 340,  // Fixed width of the canvas
    height: 150, // Fixed height of the canvas
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (canvas && ctx) {
      // Get sprite for the current state
      const spriteSheet = player.character.getCurrentSpriteSheet();
      const sprite = new Image();
      sprite.src = spriteSheet.src;

      // Once the sprite is loaded, start the game loop
      sprite.onload = () => {
        startGameLoop(ctx, canvas, sprite);
      };

      // Set initial position for debugging
      player.position = { x: 10, y: 50 }; // Set initial position (adjust if necessary)
    }
  }, [player]);

  const startGameLoop = (ctx, canvas, sprite) => {
    let previousTimestamp = 0;

    const gameLoop = (timestamp) => {
      // Calculate time difference from the last frame
      const timeDiff = timestamp - previousTimestamp;

      // If the time difference is greater than or equal to frame speed (for 30 FPS)
      if (timeDiff >= frameSpeed) {
        previousTimestamp = timestamp;

        // Increment frame index and wrap around when reaching the frame count
        const { frameCount } = player.character.getCurrentFrameData();
        frameIndexRef.current = (frameIndexRef.current + 1) % frameCount; // Wrap to 0 when reaching the end
      }

      draw(ctx, canvas, sprite);
      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  };

  const draw = (ctx, canvas, sprite) => {
    // Clear background
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw boundaries (optional)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    drawCharacter(ctx, sprite, canvas);
  };

  const drawCharacter = (ctx, sprite, canvas) => {
    const { preloadedSprite, frameWidth, frameHeight, frameCount } =
      player.character.getCurrentFrameData();

    // Check if the sprite is loaded
    if (preloadedSprite && preloadedSprite.complete) {
      // Draw the sprite at the current frame with player’s updated position
      const fixedWidth = player.character.fixedWidth;
      const fixedHeight = player.character.fixedHeight;

      // Draw the sprite at the current frame
      ctx.drawImage(
        preloadedSprite,
        frameIndexRef.current * frameWidth, // Crop x position (frame index)
        0, // Crop y position (assumes all frames are in one row)
        frameWidth,
        frameHeight,
        player.position.x, // Draw at player's current position
        player.position.y, // Draw at player's current position
        fixedWidth,        // Use the fixed size width for the character
        fixedHeight       // Use the fixed size height for the character
      );

      // Optional: Draw a red border around the character for debugging
      ctx.strokeStyle = "red"; // Set border color to red
      ctx.lineWidth = 2; // Set border width
      ctx.strokeRect(
        player.position.x, // X position of the character
        player.position.y, // Y position of the character
        fixedWidth, // Width of the character
        fixedHeight // Height of the character
      );
    } else {
      console.log("Sprite is not loaded yet.");
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="canvas"
        width={canvasSize.width}
        height={canvasSize.height}
      />
      <Input player={player} /> {/* Adding the Input component */}
    </div>
  );
};

export default GameCanvas;








