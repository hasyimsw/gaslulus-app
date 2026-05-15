import { HiOutlineXCircle } from 'react-icons/hi';

export default function ExamSidebar({ 
  questions, 
  currentQ, 
  setCurrentQ, 
  answers, 
  bookmarks, 
  onSubmit 
}) {
  return (
    <aside className="w-full lg:w-[380px] shrink-0">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-50 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Navigasi Soal</h3>
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Terjawab: {Object.keys(answers).length}/{questions.length}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-between gap-2 mb-8">
          <div className="flex-1 bg-[#011F7B]/5 p-4 rounded-xl flex flex-col items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500" />
            <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest">Terjawab</span>
          </div>
          <div className="flex-1 bg-[#011F7B]/5 p-4 rounded-xl flex flex-col items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest">Bookmark</span>
          </div>
          <div className="flex-1 bg-[#011F7B]/5 p-4 rounded-xl flex flex-col items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-300" />
            <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest">Kosong</span>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-3">
            {questions.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setCurrentQ(i)}
                className={`
                  w-full aspect-square rounded-xl font-semibold text-xs transition-all border-2
                  ${i === currentQ
                    ? 'border-[#011F7B] text-[#011F7B] ring-4 ring-[#011F7B]/5'
                    : bookmarks.has(item.id)
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : answers[item.id]
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-slate-100 border-transparent text-slate-400 hover:border-slate-200'
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          className="mt-12 w-full bg-red-50 text-red-500 py-4 rounded-xl font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-100 hover:text-red-600 transition-all border border-red-100 cursor-pointer"
        >
          <HiOutlineXCircle size={20} />
          Akhiri Ujian
        </button>
      </div>
    </aside>
  );
}
