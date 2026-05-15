import { HiOutlineStar } from "react-icons/hi";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Andi Pratama",
      role: "Lulus CPNS 2024",
      content: "GasLulus sangat membantu saya dalam memanajemen waktu saat mengerjakan soal. Sistemnya sangat mirip dengan CAT!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi",
    },
    {
      name: "Siti Aminah",
      role: "Mahasiswa UI",
      content: "Soal-soal UTBK di sini sangat akurat. Pembahasannya juga mudah dipahami oleh pemula sekalipun.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    },
    {
      name: "Budi Santoso",
      role: "Lulus PPPK",
      content: "Analisis performanya gila! Saya jadi tahu harus fokus belajar di bab mana saja. Highly recommended!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    },
  ];

  return (
    <section id="testimoni" className="px-6 py-32 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <Badge variant="warning" className="mb-4">Testimoni</Badge>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Apa Kata Mereka?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">Ribuan siswa telah membuktikan efektivitas belajar bersama GasLulus.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="p-8 border-none bg-slate-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 text-[#FFBA09] opacity-20 group-hover:opacity-40 transition-opacity">
                <HiOutlineStar size={80} />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm" />
                <div>
                  <h4 className="font-black text-slate-900">{t.name}</h4>
                  <p className="text-xs font-bold text-[#011F7B] uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed italic">"{t.content}"</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
