import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * CountUpNumber
 * Animates a number from 0 to the `end` value using requestAnimationFrame.
 * - Smooth ease-out animation
 * - Re-runs when `end` changes
 * - Cancels animation on unmount
 */
const easeOutQuad = (t) => t * (2 - t);

const CountUpNumber = ({ end = 0, duration = 500, prefix = "", suffix = "" }) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const target = Number(end) || 0;
    cancelAnimationFrame(rafRef.current);

    let startTs = null;
    const startVal = 0;

    const step = (ts) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = easeOutQuad(progress);
      const val = Math.round(startVal + (target - startVal) * eased);
      setDisplay(val);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

CountUpNumber.propTypes = {
  end: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  duration: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
};

export default CountUpNumber;