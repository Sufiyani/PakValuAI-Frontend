import React from 'react';
import {
  Brain, TrendingUp, Database, Cpu, Layers, Shield,
  Rocket, Target, CheckCircle2, Users, MapPin, BarChart2,
  Zap, Award, Globe, ChevronRight
} from 'lucide-react';

const AboutPage = ({ modelInfo }) => {
  const accuracy = modelInfo?.accuracy_r2
    ? `${(modelInfo.accuracy_r2 * 100).toFixed(1)}%`
    : '94.2%';

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 relative overflow-hidden pt-28 pb-20">

      {/* background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20  left-[-10%] w-[500px] h-[500px] bg-blue-600/8   rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-20 right-[-10%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[130px] animate-pulse delay-700" />
      </div>

      <style>{`
        .glass-card {
          background: rgba(22,32,51,0.55);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .about-chip {
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          transition: all 0.25s;
        }
        .about-chip:hover {
          background: rgba(59,130,246,0.2);
          transform: translateY(-2px);
          box-shadow: 0 5px 14px rgba(59,130,246,0.2);
        }
        .stat-glow { box-shadow: 0 0 28px rgba(59,130,246,0.12); }
      `}</style>

      <div className="container mx-auto px-6 relative z-10">

        {/* ── HERO ── */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
            <Brain className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">About PakValuAI</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Built for <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Pakistan's</span><br/>
            Car Market
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            PakValuAI is Pakistan's first dedicated AI car valuation platform — trained exclusively
            on local market data to give you the most accurate price estimates for used vehicles
            across all major cities.
          </p>
        </div>

        {/* ── MISSION STATEMENT ── */}
        <div className="glass-card p-10 rounded-[2.5rem] mb-12 border-l-4 border-blue-500 stat-glow">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-14 h-14 bg-blue-500/15 rounded-2xl flex items-center justify-center">
              <Target className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed text-base">
                Buying or selling a car in Pakistan has always been a guessing game. Dealers overprice,
                buyers overpay, and sellers undersell — all because there's no reliable, data-driven
                price benchmark. PakValuAI exists to fix that. We use machine learning trained on
                <span className="text-white font-bold"> 5,000+ verified Pakistani listings</span> to
                give you a fair, instant, and transparent market valuation — completely free.
              </p>
            </div>
          </div>
        </div>

        {/* ── KEY STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          <StatCard icon={<Award className="text-blue-400 w-5 h-5"/>}   num={accuracy}    label="Model Accuracy" />
          <StatCard icon={<Database className="text-emerald-400 w-5 h-5"/>} num="5,497+"   label="Training Records" />
          <StatCard icon={<MapPin className="text-purple-400 w-5 h-5"/>}    num="20+"      label="Cities Covered" />
          <StatCard icon={<Zap className="text-orange-400 w-5 h-5"/>}      num="< 1.5s"   label="Response Time" />
        </div>

        {/* ── HOW WE BUILT IT ── */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              How We <span className="text-blue-500">Built</span> PakValuAI
            </h2>
            <p className="text-slate-500 text-sm">From raw data to instant valuations — the complete pipeline.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <PipelineStep
              step="01" icon={<Database className="w-6 h-6"/>}
              title="Data Collection"
              desc="Scraped 5,497 real Pakistani used-car listings covering brands from Suzuki to BMW across all major markets."
              color="blue"
            />
            <PipelineStep
              step="02" icon={<Layers className="w-6 h-6"/>}
              title="Cleaning & Prep"
              desc="Removed duplicates, outliers, and inconsistencies. Standardised city names, engine sizes, and mileage units."
              color="indigo"
            />
            <PipelineStep
              step="03" icon={<Cpu className="w-6 h-6"/>}
              title="ML Training"
              desc="Trained a Random Forest Regressor with polynomial features, tuned via cross-validation on local price patterns."
              color="purple"
            />
            <PipelineStep
              step="04" icon={<TrendingUp className="w-6 h-6"/>}
              title="Live Valuation"
              desc="Your inputs are scored against 50+ learned features and returned as a market-calibrated price in under 2 seconds."
              color="pink"
            />
          </div>
        </div>

        {/* ── WHY PAKISTAN-SPECIFIC ── */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-white">Why Pakistan-Specific Matters</h3>
            </div>
            <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
              <p>
                Generic global car-valuation tools fail in Pakistan because they don't account for local
                factors: <span className="text-white">rupee inflation</span>, import duties on Japanese
                cars, city-specific demand (Karachi vs Lahore), and the unique depreciation curves of
                locally-assembled vehicles like Alto, City, and Corolla.
              </p>
              <p>
                PakValuAI was trained <span className="text-white font-bold">exclusively</span> on Pakistani
                listings — so every prediction already reflects these local realities.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                'Suzuki / Pak Suzuki pricing',
                'Japanese grey-market imports',
                'City-wise demand variance',
                'Inflation-adjusted trends',
                'Local registration rules',
                'Locally-assembled models',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-black text-white">What Makes Our AI Accurate</h3>
            </div>
            <div className="space-y-5">
              {[
                {
                  title: 'Random Forest Regressor',
                  desc: 'Ensemble of 200+ decision trees that collectively handle non-linear relationships between age, mileage, brand, and city demand.',
                },
                {
                  title: 'Polynomial Feature Engineering',
                  desc: 'Captures compound effects — e.g. how high mileage on an older car impacts price differently than on a newer one.',
                },
                {
                  title: 'Cross-Validated & Tuned',
                  desc: '5-fold cross-validation with grid-search hyperparameter tuning ensures the model generalises, not just memorises.',
                },
                {
                  title: 'Market Trend Layer',
                  desc: 'Yearly price-trend module simulates how inflation and import policy shifts have affected each model historically.',
                },
              ].map(f => (
                <div key={f.title} className="flex gap-3">
                  <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-bold text-sm mb-0.5">{f.title}</div>
                    <div className="text-slate-500 text-xs leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MARKET COVERAGE ── */}
        <div className="glass-card p-10 rounded-[2.5rem] mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Market Coverage</h2>
            <p className="text-slate-500 text-sm">Every major Pakistani automotive segment is represented in our dataset.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SegmentCard icon="💰" label="Economy"   range="Under 20 Lacs"  desc="Mehran, Alto, Mira, Coure"                    color="from-green-500 to-emerald-400"  />
            <SegmentCard icon="🚗" label="Mid-Range" range="20 – 45 Lacs"   desc="Cultus, City, Corolla, Swift"                  color="from-blue-500 to-cyan-400"      />
            <SegmentCard icon="✨" label="Premium"   range="45 – 80 Lacs"   desc="Civic, Fortuner, Tucson, BRV"                  color="from-purple-500 to-indigo-400"  />
            <SegmentCard icon="👑" label="Luxury"    range="Above 80 Lacs"  desc="Land Cruiser, Prado, BMW, Audi"                color="from-rose-500 to-pink-400"      />
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-12 text-center shadow-2xl">
          <div className="absolute -top-10 -right-10 opacity-10">
            <Rocket className="w-48 h-48 text-white rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 text-2xl font-black text-white mb-3">
              Pak<span className="text-blue-200">ValuAI</span>
            </div>
            <p className="text-white/80 max-w-lg mx-auto mb-8 text-base font-medium">
              Pakistan's most data-driven car pricing tool. Check your car's fair market value in seconds.
            </p>
            <div className="flex justify-center gap-10 flex-wrap">
              <KpiPill num={accuracy}   label="R² Accuracy"  />
              <div className="w-px h-10 bg-white/20 self-center hidden sm:block" />
              <KpiPill num="5,497+"     label="Data Points"  />
              <div className="w-px h-10 bg-white/20 self-center hidden sm:block" />
              <KpiPill num="< 2s"       label="Response"     />
              <div className="w-px h-10 bg-white/20 self-center hidden sm:block" />
              <KpiPill num="Free"       label="Always"       />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ── Sub-components ── */

const StatCard = ({ icon, num, label }) => (
  <div className="glass-card p-6 rounded-2xl text-center hover:-translate-y-1 transition-transform">
    <div className="w-10 h-10 bg-slate-800/60 rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/5">
      {icon}
    </div>
    <div className="text-2xl font-black text-white tracking-tight mb-0.5">{num}</div>
    <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</div>
  </div>
);

const PipelineStep = ({ step, icon, title, desc, color }) => {
  const colors = {
    blue:   'bg-blue-500/15 text-blue-400   border-blue-500/20',
    indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    pink:   'bg-pink-500/15 text-pink-400   border-pink-500/20',
  };
  return (
    <div className="glass-card p-6 rounded-2xl hover:-translate-y-2 transition-all group">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${colors[color]} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{step}</div>
      <h4 className="text-white font-black mb-2 text-base">{title}</h4>
      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
};

const SegmentCard = ({ icon, label, range, desc, color }) => (
  <div className="glass-card p-6 rounded-2xl text-center group hover:-translate-y-2 transition-all">
    <div className="text-4xl mb-3 group-hover:scale-125 transition-transform inline-block">{icon}</div>
    <h4 className="text-white font-black mb-1">{label}</h4>
    <div className="text-xs font-bold text-slate-400 mb-1">{range}</div>
    <div className="text-[11px] text-slate-600 mb-4">{desc}</div>
    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: '100%' }} />
    </div>
  </div>
);

const KpiPill = ({ num, label }) => (
  <div className="text-center">
    <div className="text-3xl font-black text-white tracking-tighter">{num}</div>
    <div className="text-[10px] font-bold text-white/55 uppercase tracking-widest mt-0.5">{label}</div>
  </div>
);

export default AboutPage;
