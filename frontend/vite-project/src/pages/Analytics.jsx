import React, { useState, useEffect } from 'react';
import { Loader, BarChart3, Car, Tag, Calendar, Fuel, Settings2, TrendingUp, AlertCircle } from 'lucide-react';
import { fetchAnalytics } from '../services/api';

const AnalyticsPage = ({ showToast }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(false);
    fetchAnalytics()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
        showToast('Failed to load analytics', 'error');
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse tracking-widest">ANALYZING MARKET DATA...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <style>{`.glass-card { background: rgba(30,41,59,0.6); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); }`}</style>
        <div className="glass-card border-red-500/20 p-10 rounded-3xl flex flex-col items-center gap-5 text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <p className="font-black text-white text-lg mb-2">Backend Not Connected</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Could not reach the analytics server. The backend might be waking up, please wait a moment and retry.
            </p>
          </div>
          <button
            onClick={loadData}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all text-sm active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20 pt-24">
      <style>{`
        .glass-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .progress-glow {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }
      `}</style>

      <div className="container mx-auto px-6">
        {/* Responsive Header - Fixed Overlapping */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-black text-2xl text-white tracking-tighter">Pak<span className="text-blue-500">ValuAI</span></span>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-blue-500/20">Market Intel</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-tight">
            Market <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Analytics</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            Real-time market intelligence extracted from <span className="text-white font-bold">5,000+</span> active Pakistani vehicle listings.
          </p>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatBox icon={<Car className="text-blue-400" />} label="Total Inventory" value={stats?.dataset?.total_cars?.toLocaleString()} />
          <StatBox icon={<Tag className="text-emerald-400" />} label="Avg. Market Price" value={`${(stats?.price_stats?.mean / 100000).toFixed(1)} Lacs`} />
          <StatBox icon={<TrendingUp className="text-purple-400" />} label="Price Spectrum" value={`${(stats?.price_stats?.min / 100000).toFixed(0)}-${(stats?.price_stats?.max / 100000).toFixed(0)} L`} />
          <StatBox icon={<Calendar className="text-orange-400" />} label="Model Coverage" value={stats?.dataset?.year_range} />
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Top Brands Section */}
          <div className="glass-card p-8 rounded-[2rem] flex flex-col h-full">
            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-400" /> Market Leaders
            </h3>
            <div className="space-y-8 flex-1">
              {stats?.top_brands && Object.entries(stats.top_brands).slice(0, 6).map(([brand, count]) => {
                const maxCount = Math.max(...Object.values(stats.top_brands));
                const percentage = (count / maxCount) * 100;
                return (
                  <div key={brand} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="capitalize font-bold text-slate-300 group-hover:text-blue-400 transition-colors tracking-wide">{brand}</span>
                      <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest">{count} Units</span>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-3 overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out progress-glow"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Segment Distribution Section */}
          <div className="glass-card p-8 rounded-[2rem] flex flex-col h-full">
            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
              <Settings2 className="w-6 h-6 text-purple-400" /> Body Segment Ratio
            </h3>
            <div className="space-y-8 flex-1">
              {stats?.segment_distribution?.map(seg => (
                <div key={seg.segment}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-slate-300 tracking-wide">{seg.segment}</span>
                    <span className="text-sm font-black text-purple-400 tracking-tighter">{seg.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-900/50 rounded-full h-4 overflow-hidden border border-white/5 p-0.5">
                    <div 
                      className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${seg.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Distribution Box */}
        <div className="mt-10 grid md:grid-cols-2 gap-10">
           <DistributionList title="Fuel Source Analysis" data={stats?.fuel_type_distribution} icon={<Fuel className="text-orange-400" />} />
           <DistributionList title="Drivetrain Statistics" data={stats?.transmission_distribution} icon={<Settings2 className="text-cyan-400" />} />
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value }) => (
  <div className="glass-card p-8 rounded-3xl hover:border-white/20 transition-all group hover:-translate-y-1">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-slate-900/50 rounded-xl group-hover:scale-110 transition-transform border border-white/5 shadow-inner">{icon}</div>
      <span className="text-[10px] font-black uppercase text-slate-500 tracking-[3px] leading-none">{label}</span>
    </div>
    <div className="text-3xl font-black text-white tracking-tighter">{value || '0'}</div>
  </div>
);

const DistributionList = ({ title, data, icon }) => (
  <div className="glass-card p-8 rounded-[2rem]">
    <div className="flex items-center gap-4 mb-8 font-black text-white text-xl tracking-tight uppercase">
      <div className="p-2 bg-slate-900/50 rounded-lg border border-white/5">{icon}</div> {title}
    </div>
    <div className="grid grid-cols-2 gap-6">
      {data && Object.entries(data).map(([key, val]) => (
        <div key={key} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl flex flex-col group hover:bg-slate-900/60 transition-colors">
          <span className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-[2px]">{key}</span>
          <span className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{val}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AnalyticsPage;