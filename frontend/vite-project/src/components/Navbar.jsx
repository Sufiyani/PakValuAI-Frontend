import React, { useState, useEffect } from 'react';
import { Menu, Home, Calculator, BarChart3, Info, MessageCircle, X, Sparkles, HelpCircle } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage, openChat }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home',      label: 'Home',          icon: Home },
    { id: 'predict',   label: 'Predict Price', icon: Calculator },
    { id: 'analytics', label: 'Analytics',     icon: BarChart3 },
    { id: 'faq',       label: 'FAQ',           icon: HelpCircle },
    { id: 'about',     label: 'About',         icon: Info },
  ];

  return (
    <>
      <style>{`
        @keyframes logoGlow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(59,130,246,0.5)); }
          50%       { filter: drop-shadow(0 0 15px rgba(139,92,246,0.8)); }
        }
        .nav-item-active::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 10%; right: 10%;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 20px;
        }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-xl'
          : 'bg-transparent py-2'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">

            {/* ── LOGO ── */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setCurrentPage('home')}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl group-hover:bg-purple-500/40 transition-all"></div>
                <svg width="44" height="44" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 animate-[logoGlow_3s_infinite]">
                  <path d="M10 32C10 28.134 13.134 25 17 25H33C36.866 25 40 28.134 40 32V35H10V32Z" fill="url(#logo-grad)" />
                  <path d="M15 25L20 12H30L35 25H15Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="18" cy="35" r="4" fill="#3b82f6" />
                  <circle cx="32" cy="35" r="4" fill="#3b82f6" />
                  <defs>
                    <linearGradient id="logo-grad" x1="10" y1="25" x2="40" y2="35" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white leading-none">
                  Pak<span className="text-blue-500">ValuAI</span>
                </span>
                <span className="text-[10px] uppercase tracking-[3px] text-slate-400 font-bold">Car Valuator</span>
              </div>
            </div>

            {/* ── DESKTOP NAV ── */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    currentPage === item.id
                      ? 'text-white nav-item-active'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={openChat}
                className="ml-4 flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Chat AI</span>
              </button>
            </div>

            {/* ── MOBILE BUTTON ── */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* ── MOBILE MENU ── */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 right-0 bg-slate-900/95 backdrop-blur-2xl border-b border-white/10 p-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                    currentPage === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { openChat(); setMobileMenuOpen(false); }}
                className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                CHAT WITH AI
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
