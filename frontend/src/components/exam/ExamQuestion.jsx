import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBookmark } from 'react-icons/hi';
import { FaBookmark } from 'react-icons/fa';

export default function ExamQuestion({ 
  question, 
  index, 
  selectedOption, 
  onSelect, 
  isBookmarked, 
  onToggleBookmark 
}) {
  if (!question) return null;

  return (
    <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-50 relative">
      <div className="flex justify-between items-center mb-8">
        <div className="bg-[#011F7B]/5 text-[#011F7B] px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
          SOAL NO. {index + 1}
        </div>
        <button
          onClick={() => onToggleBookmark(question.id)}
          className={`flex items-center gap-2 transition-colors text-xs font-bold cursor-pointer ${isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-[#011F7B]'}`}
        >
          {isBookmarked ? <FaBookmark size={18} /> : <HiOutlineBookmark size={18} />}
          {isBookmarked ? 'Tersimpan' : 'Bookmark'}
        </button>
      </div>

      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-lg font-semibold text-slate-700 leading-relaxed whitespace-pre-wrap">
              {question.question}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        {question.options.map((opt, i) => (
          <button
            key={opt.id}
            onClick={() => onSelect(question.id, opt.id)}
            className={`
              w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-6
              ${selectedOption === opt.id
                ? 'bg-[#011F7B]/5/50 border-2 border-[#011F7B]/40'
                : 'bg-white border-slate-200 hover:border-[#011F7B]/40'
              }
            `}
          >
            <div className={`
              w-8 h-8 rounded-xl flex items-center justify-center font-semibold text-xs shrink-0 transition-all
              ${selectedOption === opt.id ? 'bg-[#011F7B] text-white shadow-sm shadow-[#011F7B]/20' : 'bg-white border-2 border-slate-200 text-slate-400'}
            `}>
              {String.fromCharCode(65 + i)}
            </div>
            <span className={`text-sm font-semibold leading-relaxed ${selectedOption === opt.id ? 'text-slate-900' : 'text-slate-500'}`}>
              {opt.optionText}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
