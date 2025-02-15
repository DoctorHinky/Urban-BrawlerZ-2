const startGameLoop = (ctx, canvas, player, frameIndexRef, frameSpeed) => {
  let previousTimestamp = 0;

  const gameLoop = (timestamp) => {
    const timeDiff = timestamp - previousTimestamp;

    if (timeDiff >= frameSpeed) {
      previousTimestamp = timestamp;

      // Update the frame index
      const { frameCount } = player.character.getCurrentFrameData();
      frameIndexRef.current = (frameIndexRef.current + 1) % frameCount;
    }

    draw(ctx, canvas, player, frameIndexRef); // Pass frameIndexRef
    requestAnimationFrame(gameLoop);
  };

  requestAnimationFrame(gameLoop);
};

// Draw function
const draw = (ctx, canvas, player, frameIndexRef) => {
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  drawCharacter(ctx, player, frameIndexRef); // Pass frameIndexRef
};

// Draw the character
const drawCharacter = (ctx, player, frameIndexRef) => {
  const { preloadedSprite, frameWidth, frameHeight, frameCount } =
    player.character.getCurrentFrameData();

  const scale = player.character.scale; // Dynamically get scale from player character

  if (preloadedSprite && preloadedSprite.complete) {
    ctx.drawImage(
      preloadedSprite,
      frameIndexRef.current * frameWidth,
      0,
      frameWidth,
      frameHeight,
      player.position.x,
      player.position.y,
      frameWidth * scale,
      frameHeight * scale
    );
  }
};

export default startGameLoop;



  
  