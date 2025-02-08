import PropTypes from "prop-types";
import "./svg.scss";
export default function SternSVG({ active = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={active ? "starOn" : "starOff"}
    >
      <polygon
        strokeWidth="2"
        stroke="black"
        points="50,10 61,35 88,38 66,58 72,85 50,70 28,85 34,58 12,38 39,35"
      />
    </svg>
  );
}

SternSVG.propTypes = {
  active: PropTypes.bool,
};
