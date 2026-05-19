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

  const isWarning = timeLeft <= 300 && timeLeft > 0; // 5 Menit

  return (
    <div className={`px-6 py-2.5 rounded-xl flex items-center gap-3 border transition-all duration-300 ${
      isWarning 
        ? 'bg-red-50 text-red-600 border-red-200 shadow-md shadow-red-500/20 animate-pulse'
        : 'bg-[#011F7B]/5 text-[#011F7B] border-[#011F7B]/10'
    }`}>
      <HiOutlineClock size={20} className={isWarning ? 'animate-bounce' : ''} />
      <span className="font-extrabold text-sm tracking-widest tabular-nums">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
