import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Car } from 'lucide-react';
import { sendChatMessage } from '../services/api';

const Chatbot = ({ isOpen, onClose, showToast }) => {
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const messagesEndRef           = useRef(null);
  const sessionId                = useRef(`session_${Date.now()}`);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "👋 Assalam-o-Alaikum! Main aapki car price prediction mein madad karunga. Shuru karne ke liye 'predict' likhein!"
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const data = await sendChatMessage(sessionId.current, userMsg);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        prediction: data.prediction,
      }]);
    } catch {
      showToast('Error sending message', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes pv-slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes pv-dot {
          0%, 60%, 100% { transform: translateY(0);   }
          30%           { transform: translateY(-5px); }
        }

        /* ── OVERLAY ── */
        .pv-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          /* stack children bottom-right */
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
        }

        /* ── PANEL — mobile: full screen ── */
        .pv-panel {
          width: 100%;
          height: 100%;
          background: #0d1525;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: pv-slideUp 0.28s ease-out both;
        }

        /* ── PANEL — desktop: fixed size, anchored bottom-right ── */
        @media (min-width: 640px) {
          .pv-panel {
            width: 420px;
            height: auto;
            /* key: fixed pixel height so it never overflows */
            max-height: calc(100vh - 96px);
            min-height: 500px;
            margin: 24px;          /* gap from viewport edges */
            border-radius: 20px;
            border: 1px solid rgba(59, 130, 246, 0.18);
            box-shadow:
              0 0 0 1px rgba(255,255,255,0.03) inset,
              0 24px 60px rgba(0,0,0,0.7),
              0 0 40px rgba(37,99,235,0.08);
          }
        }

        /* ── HEADER ── */
        .pv-header {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #0c1e3d 0%, #130e30 100%);
          border-bottom: 1px solid rgba(59, 130, 246, 0.15);
        }
        .pv-avatar {
          width: 40px; height: 40px; flex-shrink: 0;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 10px rgba(37,99,235,0.5);
        }
        .pv-close-btn {
          width: 32px; height: 32px; flex-shrink: 0;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
          outline: none;
        }
        .pv-close-btn:hover { background: rgba(255,255,255,0.14); }

        /* ── MESSAGES ── */
        .pv-messages {
          flex: 1;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #0d1525;
          /* ensure this shrinks, not the header/input */
          min-height: 0;
        }
        .pv-messages::-webkit-scrollbar { width: 3px; }
        .pv-messages::-webkit-scrollbar-thumb {
          background: rgba(59,130,246,0.2); border-radius: 10px;
        }

        /* ── MESSAGE ROWS ── */
        .pv-row {
          display: flex; align-items: flex-end; gap: 8px;
        }
        .pv-row.user { justify-content: flex-end; }
        .pv-row.bot  { justify-content: flex-start; }

        .pv-bot-icon {
          width: 26px; height: 26px; flex-shrink: 0;
          background: linear-gradient(135deg, #1e3a8a, #312e81);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }

        .pv-bubble-user {
          max-width: 78%;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: #fff;
          padding: 10px 14px;
          border-radius: 16px 16px 4px 16px;
          font-size: 13px; line-height: 1.55;
          box-shadow: 0 3px 10px rgba(37,99,235,0.3);
        }
        .pv-bubble-bot {
          max-width: 78%;
          background: rgba(26, 38, 58, 0.95);
          border: 1px solid rgba(255,255,255,0.06);
          color: #cbd5e1;
          padding: 10px 14px;
          border-radius: 16px 16px 16px 4px;
          font-size: 13px; line-height: 1.55;
        }

        .pv-typing {
          display: flex; gap: 5px; align-items: center;
          padding: 12px 14px;
        }
        .pv-typing span {
          width: 6px; height: 6px;
          background: #3b82f6; border-radius: 50%;
          animation: pv-dot 1.1s ease-in-out infinite;
        }

        .pv-pred-card {
          margin-top: 9px;
          background: linear-gradient(135deg, rgba(16,185,129,0.13), rgba(16,185,129,0.03));
          border: 1px solid rgba(16,185,129,0.22);
          border-radius: 10px;
          padding: 10px 12px;
        }

        /* ── INPUT BAR ── */
        .pv-input-area {
          flex-shrink: 0;
          padding: 12px 14px 11px;
          background: rgba(9, 14, 26, 0.98);
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .pv-input-row { display: flex; gap: 8px; align-items: center; }
        .pv-input {
          flex: 1;
          background: rgba(22, 32, 52, 0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #f1f5f9;
          padding: 11px 15px;
          font-size: 13px;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          font-family: inherit;
        }
        .pv-input:focus {
          border-color: rgba(59,130,246,0.5);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.09);
        }
        .pv-input::placeholder { color: #2d3f5a; }
        .pv-send {
          width: 42px; height: 42px; flex-shrink: 0;
          background: linear-gradient(135deg, #2563eb, #4338ca);
          border: none; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 3px 10px rgba(37,99,235,0.4);
        }
        .pv-send:hover   { transform: scale(1.07); box-shadow: 0 5px 16px rgba(37,99,235,0.5); }
        .pv-send:active  { transform: scale(0.92); }
        .pv-send:disabled{ opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }
        .pv-footer-txt {
          text-align: center; margin-top: 7px;
          font-size: 8px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #162035;
        }
      `}</style>

      {/* ── OVERLAY — click backdrop to close ── */}
      <div
        className="pv-overlay"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="pv-panel">

          {/* ── HEADER ── */}
          <div className="pv-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="pv-avatar">
                <Car size={19} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontWeight: 900, color: '#fff', fontSize: 14.5, letterSpacing: '-0.02em' }}>
                    Pak<span style={{ color: '#60a5fa' }}>ValuAI</span>
                  </span>
                  <span style={{
                    background: 'rgba(59,130,246,0.16)',
                    border: '1px solid rgba(59,130,246,0.28)',
                    color: '#60a5fa',
                    fontSize: 8.5, fontWeight: 900,
                    padding: '1px 6px', borderRadius: 20,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>AI</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{
                    width: 6, height: 6,
                    background: '#10b981', borderRadius: '50%',
                    display: 'inline-block',
                    boxShadow: '0 0 6px rgba(16,185,129,0.8)',
                  }} />
                  <span style={{
                    fontSize: 9.5, color: '#475569', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    Online · Car Expert
                  </span>
                </div>
              </div>
            </div>

            <button className="pv-close-btn" onClick={onClose} aria-label="Close">
              <X size={14} color="#64748b" />
            </button>
          </div>

          {/* ── MESSAGES ── */}
          <div className="pv-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`pv-row ${msg.role === 'user' ? 'user' : 'bot'}`}>
                {msg.role === 'assistant' && (
                  <div className="pv-bot-icon">
                    <Sparkles size={12} color="#60a5fa" />
                  </div>
                )}
                <div className={msg.role === 'user' ? 'pv-bubble-user' : 'pv-bubble-bot'}>
                  {msg.content}
                  {msg.prediction?.success && (
                    <div className="pv-pred-card">
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#34d399', letterSpacing: '-0.02em' }}>
                        {msg.prediction.price_display.formatted}
                      </div>
                      <div style={{ fontSize: 9.5, color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3 }}>
                        AI Estimated · {msg.prediction.price_display.lacs} Lacs PKR
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="pv-row bot">
                <div className="pv-bot-icon">
                  <Sparkles size={12} color="#60a5fa" />
                </div>
                <div className="pv-bubble-bot pv-typing">
                  <span style={{ animationDelay: '0s'   }} />
                  <span style={{ animationDelay: '0.18s' }} />
                  <span style={{ animationDelay: '0.36s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── INPUT ── */}
          <div className="pv-input-area">
            <div className="pv-input-row">
              <input
                className="pv-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about car prices..."
                disabled={loading}
              />
              <button
                className="pv-send"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <Send size={16} color="#fff" />
              </button>
            </div>
            <p className="pv-footer-txt">Powered by PakValuAI · Pakistan Car Intelligence</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Chatbot;
