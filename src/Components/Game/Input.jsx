import { useEffect } from "react";

const Input = ({ player }) => {
  useEffect(() => {
    const keyStates = {
      ArrowRight: false,
      ArrowLeft: false,
    };

    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowRight":
          if (!keyStates.ArrowRight) {
            player.changeState("run");
            player.position.x += 30;
            keyStates.ArrowRight = true;
            console.log("Player moving right");
          }
          break;
        case "ArrowLeft":
          if (!keyStates.ArrowLeft) {
            player.changeState("run");
            player.position.x -= 30;
            keyStates.ArrowLeft = true;
            console.log("Player moving left");
          }
          break;
        case "Space":
          player.changeState("attack");
          console.log("Player attacking");
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        keyStates[event.key] = false;
        if (!keyStates.ArrowRight && !keyStates.ArrowLeft) {
          player.changeState("idle");
          console.log("Player idle");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [player]);

  return null;
};

export default Input;






  