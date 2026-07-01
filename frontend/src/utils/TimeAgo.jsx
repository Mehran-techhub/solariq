import { useState, useEffect, useRef } from 'react';
import { timeAgo } from './time';

export default function TimeAgo({ date, className, style }) {
  const [label, setLabel] = useState(() => timeAgo(date));
  const timerRef = useRef(null);

  useEffect(() => {
    const update = () => setLabel(timeAgo(date));
    update();
    const diff = date ? (Date.now() - new Date(date)) / 1000 : Infinity;
    let delay = 30000;
    if (diff < 60) delay = 1000;
    else if (diff < 3600) delay = 10000;
    timerRef.current = setInterval(update, delay);
    return () => clearInterval(timerRef.current);
  }, [date]);

  return <span className={className} style={style}>{label}</span>;
}
