import PropTypes from "prop-types";
import SternSVG from "../../assets/styles/Images/sternSVG";
import "./scorebar.scss";
import useScorebar from "./useScorbar";

/* temporäre Variablen, diese werden später übergeben */
/* der Rahmen, wird später hinzugefügt */
const MAX_COMBO = 5;
const playerOneName = "Norman";
const playerTwoName = "Mark";
const playerOneComboCount = 3;
const playerTwoComboCount = 2;
export default function ScoreBar() {
  const {
    playerOneHealth,
    playerTwoHealth,
    prevHealth,
    time,
    playerOneWins,
    playerTwoWins,
    calcWidth,
    getHealthColor,
  } = useScorebar();

  /* Dynamische Klassen noch mit fixer Gesundheit wird später vom Character übergeben */

  const renderComboBlocks = (comboCount, side) => {
    const rotate = side === "left" ? { transform: "rotateY(180deg)" } : {};

    return (
      <div className={`combo-blocks borderradius-${side}`} style={rotate}>
        {[...Array(MAX_COMBO)].map((_, index) => (
          <div
            key={index}
            className={`combo-block ${index < comboCount ? "active" : ""}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="scorebar-Container">
      <div className="Playernames">
        <span>{playerOneName}</span>
        <span>{playerTwoName}</span>
      </div>
      <div className="score-bar">
        {/* Spieler 1 Gesundheitsbalken*/}
        <div className="playerHealthSection">
          <div className="health-bar borderradius-left">
            <div
              className={`damage-fill borderradius-left ${getHealthColor(
                prevHealth.p1
              )}`}
              style={{ width: `${calcWidth(prevHealth.p1)}%`, right: 0 }}
            />
            <div
              className="health-fill borderradius-left"
              style={{ width: `${calcWidth(playerOneHealth)}%`, right: 0 }}
            />
          </div>
        </div>

        {/* Zeitanzeige */}
        <div className="timeContainer">
          <span>{time}</span>
        </div>

        {/* Spieler 2 Gesundheitsbalken*/}
        <div className="playerHealthSection">
          <div className="health-bar borderradius-right">
            <div
              className={`damage-fill borderradius-right ${getHealthColor(
                prevHealth.p2
              )}`}
              style={{ width: `${calcWidth(prevHealth.p2)}%`, left: 0 }}
            />
            <div
              className="health-fill borderradius-right"
              style={{ width: `${calcWidth(playerTwoHealth)}%`, left: 0 }}
            />
          </div>
        </div>
      </div>
      {/* Namen und match count */}
      <div className="namesContainer">
        <div className="playerNames">
          {renderComboBlocks(playerOneComboCount, "right")}
          <div className="sternContainer">
            <SternSVG active={playerOneWins >= 2} />
            <SternSVG active={playerOneWins >= 1} />
          </div>
        </div>
        <div className="playerNames">
          <div className="sternContainer">
            <SternSVG active={playerTwoWins >= 1} />
            <SternSVG active={playerTwoWins >= 2} />
          </div>
          {renderComboBlocks(playerTwoComboCount, "left")}
        </div>
      </div>
    </div>
  );
}

ScoreBar.propTypes = {
  playerOneHealth: PropTypes.number,
  playerTwoHealth: PropTypes.number,
  time: PropTypes.number,
};
