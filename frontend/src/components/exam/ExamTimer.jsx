import { useEffect } from 'react';
import { HiOutlineClock } from 'react-icons/hi';

export default function ExamTimer({ timeLeft, setTimeLeft, onTimeUp }) {
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [setTimeLeft, onTimeUp]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-primary/10 text-primary px-6 py-2.5 rounded-xl flex items-center gap-3 border border-primary/10">
      <HiOutlineClock size={20} />
      <span className="font-bold text-sm tracking-tight tabular-nums">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
