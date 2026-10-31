import React from 'react';
import { Sparkles, Calculator, Bot, TrendingUp, BarChart3, Zap, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

const HomePage = ({ modelInfo, setCurrentPage, openChat }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .glass-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase">V2.0 Next-Gen AI Model</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
          Pakistan's Most Accurate<br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            AI Car Valuator
          </span>
        </h1>

        {/* Brand pill */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">by</span>
          <span className="font-black text-white tracking-tighter text-lg">
            Pak<span className="text-blue-500">ValuAI</span>
          </span>
        </div>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Stop guessing. Get instant market prices based on <span className="text-white font-bold italic">real-time</span> data from 5,000+ local vehicle listings.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-24">
          <button
            onClick={() => setCurrentPage('predict')}
            className="group flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all hover:scale-[1.02] shadow-xl shadow-blue-600/20"
          >
            <Calculator className="w-6 h-6" />
            Start Prediction
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={openChat}
            className="flex items-center justify-center gap-3 px-10 py-5 glass-card text-white rounded-2xl font-bold hover:bg-white/5 transition-all"
          >
            <Bot className="w-6 h-6 text-purple-400" />
            Talk to AI Expert
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <QuickStat label="Model Accuracy" val={modelInfo?.accuracy_r2 ? `${(modelInfo.accuracy_r2 * 100).toFixed(1)}%` : '94.2%'} color="text-blue-400" />
          <QuickStat label="Active Dataset"  val="5,497+"    color="text-purple-400" />
          <QuickStat label="Processing Time" val="< 1.5s"    color="text-emerald-400" />
        </div>
      </div>

      {/* ── BRAND MARQUEE ── */}
      <div className="py-10 border-y border-white/5 bg-white/[0.01] overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee gap-12 items-center">
          {['Suzuki','Honda','Toyota','Kia','Changan','Hyundai','Daihatsu','Nissan','MG','Proton'].map(b => (
            <span key={b}    className="text-3xl font-black text-white/10 uppercase tracking-tighter">{b}</span>
          ))}
          {['Suzuki','Honda','Toyota','Kia','Changan','Hyundai','Daihatsu','Nissan','MG','Proton'].map(b => (
            <span key={b+'2'} className="text-3xl font-black text-white/10 uppercase tracking-tighter">{b}</span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            How <span className="text-blue-500">PakValuAI</span> Works
          </h2>
          <p className="text-slate-400">Three simple steps to find your car's true market value.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <StepCard num="01" title="Enter Details"     desc="Provide your car's brand, model, year, and mileage in our smart form." />
          <StepCard num="02" title="AI Analysis"       desc="Our Random Forest algorithm compares your data against 5k+ current listings." />
          <StepCard num="03" title="Instant Valuation" desc="Get a precise market range and confidence score in less than 2 seconds." />
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="container mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<TrendingUp className="text-blue-400" />}   title="Regional Insights" desc="Prices optimized for Karachi, Lahore, Islamabad and other major cities." />
          <FeatureCard icon={<Shield    className="text-purple-400" />}  title="Verified Data"     desc="Dataset cleaned from anomalies to ensure outliers don't affect your price." />
          <FeatureCard icon={<Zap       className="text-emerald-400" />} title="Live Updates"      desc="Market trends updated weekly to reflect current inflation and policy changes." />
        </div>
      </div>

      {/* ── TRUST BANNER ── */}
      <div className="container mx-auto px-6 mb-32">
        <div className="glass-card p-12 rounded-[2rem] text-center border-blue-500/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="font-black text-white tracking-tighter text-lg">Pak<span className="text-blue-500">ValuAI</span></span>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-blue-500/30">Trusted</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-6">Ready to check your car's value?</h3>
          <button
            onClick={() => setCurrentPage('predict')}
            className="inline-flex items-center gap-3 px-12 py-5 bg-white text-slate-900 rounded-2xl font-black hover:bg-blue-50 transition-all hover:scale-105"
          >
            Go to Predictor
          </button>
        </div>
      </div>
    </div>
  );
};

const QuickStat = ({ label, val, color }) => (
  <div className="glass-card p-6 rounded-2xl border-white/5 transition-transform hover:-translate-y-1">
    <div className={`text-3xl font-black ${color} mb-1 tracking-tight`} dangerouslySetInnerHTML={{ __html: val }} />
    <div className="text-xs uppercase tracking-widest font-bold text-slate-500">{label}</div>
  </div>
);

const StepCard = ({ num, title, desc }) => (
  <div className="relative group">
    <div className="text-6xl font-black text-white/5 absolute -top-10 -left-4 group-hover:text-blue-500/10 transition-colors">{num}</div>
    <div className="relative z-10">
      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-blue-500" /> {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="glass-card p-8 rounded-3xl hover:border-white/20 transition-all">
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default HomePage;
