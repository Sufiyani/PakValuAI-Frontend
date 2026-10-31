import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How accurate are the price predictions?",
      answer: "Our AI model operates with a 94.2% R² accuracy rate. It is trained on over 5,000 verified listings from the Pakistani market. However, prices may vary based on the specific condition of the car and urgent sale factors.",
      icon: <Zap className="text-yellow-400" />
    },
    {
      question: "Is this tool specifically for Pakistani cars?",
      answer: "Yes, the entire neural network is trained on local data points from cities like Karachi, Lahore, and Islamabad, ensuring the prices reflect the unique economic and market trends of Pakistan.",
      icon: <ShieldCheck className="text-blue-400" />
    },
    {
      question: "What algorithm is used for calculation?",
      answer: "We use a Random Forest Regressor combined with Polynomial Feature Engineering. This allows the AI to understand complex relationships between a car's age, mileage, and brand value.",
      icon: <Sparkles className="text-purple-400" />
    },
    {
      question: "How often is the data updated?",
      answer: "Our dataset is synchronized periodically to account for inflation, currency fluctuations, and new vehicle launches in the Pakistani automotive sector.",
      icon: <HelpCircle className="text-emerald-400" />
    },
    {
      question: "What does the 'Confidence Score' mean?",
      answer: "The Confidence Score indicates how certain the AI is about a specific valuation. High confidence usually applies to popular models with plenty of market data, while rarer cars might show a lower score.",
      icon: <MessageSquare className="text-pink-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pt-32 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
            <HelpCircle className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Support Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h1>
          <p className="text-slate-400 text-lg">Everything you need to know about <span className="text-white font-bold">PakValuAI</span>'s engine.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'border-blue-500/30 shadow-lg shadow-blue-500/5' : 'hover:border-white/10'}`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-800 rounded-lg">{faq.icon}</div>
                  <span className="font-bold text-white md:text-lg">{faq.question}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-48' : 'max-h-0'}`}
              >
                <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5 bg-white/[0.01]">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Support Card */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-slate-400 mb-6 text-sm">Ask our <span className="text-white font-bold">PakValuAI</span> Assistant for real-time help with your specific car model.</p>
          <button 
             onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}
             className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
          >
            Chat with AI Now
          </button>
        </div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default FAQPage;