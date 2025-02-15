import { useEffect } from "react";

const Input = ({ player }) => {
  useEffect(() => {
    // Track key states
    const keyStates = {
      ArrowRight: false,
      ArrowLeft: false,
    };

    // Handle keydown (pressing keys)
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        player.changeState("run");
        player.position.x += 5; // Move right (adjust speed)
        keyStates.ArrowRight = true;
      }
      if (event.key === "ArrowLeft") {
        player.changeState("run");
        player.position.x -= 5; // Move left (adjust speed)
        keyStates.ArrowLeft = true;
      }
      if (event.key === "Space") {
        player.changeState("attack"); // Switch to attack state when spacebar is pressed
      }
    };

    // Handle keyup (releasing keys)
    const handleKeyUp = (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        keyStates[event.key] = false;
      }

      // Check if no keys are being pressed (both left and right keys released)
      if (!keyStates.ArrowLeft && !keyStates.ArrowRight) {
        player.changeState("idle"); // Switch back to idle if no movement keys are pressed
      }
    };

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup the event listeners when the component is unmounted
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [player]);

  return null;  // This component doesn't render anything itself
};

export default Input;





  