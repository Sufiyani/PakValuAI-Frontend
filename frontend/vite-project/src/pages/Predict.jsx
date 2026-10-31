import React, { useState, useEffect, useRef } from 'react';
import { Loader, Calculator, Car, MapPin, Fuel, Gauge, Settings, Calendar, TrendingUp, AlertCircle, Download, Activity, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const PredictPage = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [trendStats, setTrendStats] = useState(null);
  const [trendMeta, setTrendMeta] = useState(null);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [featureOptions, setFeatureOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const reportRef = useRef(null);

  const [formData, setFormData] = useState({
    car_brand: '', car_model: '', city: '', fuel_type: '',
    engine: '', transmission: '', registered_in: '', mileage: ''
  });

  const calculateProgress = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(f => f !== '').length;
    return (filledFields / fields.length) * 100;
  };

  // ✅ PDF GENERATION — PakValuAI branded certificate
  const generatePDF = async () => {
    if (!result) return;

    showToast('Generating certificate...', 'info');
    setLoading(true);

    try {
      const { jsPDF } = await import('jspdf');

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth  = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const centerX    = pageWidth / 2;
      let y = 0;

      // ── PAGE BACKGROUND ───────────────────────────────────────────
      pdf.setFillColor(11, 18, 33);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // ── TOP ACCENT STRIP (blue → indigo) ──────────────────────────
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, pageWidth, 2.5, 'F');
      pdf.setFillColor(79, 70, 229);
      pdf.rect(pageWidth * 0.5, 0, pageWidth * 0.5, 2.5, 'F');

      // ── HEADER BAND ───────────────────────────────────────────────
      pdf.setFillColor(15, 22, 40);
      pdf.rect(0, 2.5, pageWidth, 38, 'F');

      // Brand: "Pak" white, "ValuAI" blue
      y = 17;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      const pakW = pdf.getTextWidth('Pak');
      const brandW = pakW + pdf.getTextWidth('ValuAI');
      const bx = centerX - brandW / 2;
      pdf.text('Pak', bx, y);
      pdf.setTextColor(59, 130, 246);
      pdf.text('ValuAI', bx + pakW, y);

      y += 7;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(71, 85, 105);
      pdf.text('OFFICIAL AI VALUATION CERTIFICATE  ·  V2.0', centerX, y, { align: 'center' });

      y += 5;
      pdf.setFontSize(7);
      pdf.setTextColor(45, 55, 72);
      pdf.text(
        new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }),
        centerX, y, { align: 'center' }
      );

      // ── WATERMARK ────────────────────────────────────────────────
      pdf.saveGraphicsState();
      pdf.setGState(new pdf.GState({ opacity: 0.022 }));
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(68);
      pdf.setTextColor(255, 255, 255);
      pdf.text('PAKVALUAI', centerX, pageHeight / 2 + 10, { align: 'center', angle: -30 });
      pdf.restoreGraphicsState();

      // ── PRICE HERO BOX ────────────────────────────────────────────
      y = 54;
      pdf.setFillColor(17, 25, 44);
      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(14, y - 4, pageWidth - 28, 42, 4, 4, 'FD');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(38);
      pdf.text(result.price_display.formatted, centerX, y + 15, { align: 'center' });

      pdf.setTextColor(16, 185, 129);
      pdf.setFontSize(15);
      pdf.text(`${result.price_display.lacs} Lacs PKR`, centerX, y + 25, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(71, 85, 105);
      pdf.text('ESTIMATED MARKET VALUE', centerX, y + 32, { align: 'center' });

      // ── SECTION HEADER HELPER ────────────────────────────────────
      const sectionTitle = (title, yPos) => {
        pdf.setFillColor(20, 28, 46);
        pdf.rect(14, yPos, pageWidth - 28, 7, 'F');
        pdf.setDrawColor(37, 99, 235);
        pdf.setLineWidth(0.25);
        pdf.line(14, yPos + 7, pageWidth - 14, yPos + 7);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(59, 130, 246);
        pdf.text(title, 19, yPos + 4.8);
      };

      // ── INFO CARD HELPER ──────────────────────────────────────────
      const gap = 3;
      const drawInfoCard = (cx, cy, cw, ch, lbl, val) => {
        pdf.setFillColor(19, 27, 45);
        pdf.setDrawColor(28, 38, 58);
        pdf.setLineWidth(0.18);
        pdf.roundedRect(cx, cy, cw, ch, 2.5, 2.5, 'FD');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6);
        pdf.setTextColor(71, 85, 105);
        pdf.text(lbl.toUpperCase(), cx + cw / 2, cy + 4.5, { align: 'center' });
        pdf.setFontSize(10.5);
        pdf.setTextColor(220, 230, 245);
        const dv = val.toString().length > 14 ? val.toString().substring(0, 14) + '…' : val.toString();
        pdf.text(dv.toUpperCase(), cx + cw / 2, cy + 11.2, { align: 'center' });
      };

      // ── VEHICLE IDENTIFICATION ────────────────────────────────────
      y += 45;
      sectionTitle('VEHICLE IDENTIFICATION', y);
      y += 9;

      const cw = (pageWidth - 31) / 2;
      const ch = 15.5;
      drawInfoCard(14,          y, cw, ch, 'Brand',     formData.car_brand);
      drawInfoCard(14 + cw + gap, y, cw, ch, 'Model',   formData.car_model);
      y += ch + gap;
      drawInfoCard(14,          y, cw, ch, 'Reg. Year', formData.registered_in);
      drawInfoCard(14 + cw + gap, y, cw, ch, 'Mileage', `${Number(formData.mileage).toLocaleString()} KM`);

      // ── TECHNICAL SPECS ───────────────────────────────────────────
      y += ch + 8;
      sectionTitle('TECHNICAL SPECIFICATIONS', y);
      y += 9;

      const specItems = [
        ['Engine Capacity', `${formData.engine} CC`],
        ['Transmission',    formData.transmission],
        ['Fuel Type',       formData.fuel_type],
        ['Registered City', formData.city],
      ];
      const scw = (pageWidth - 31) / 2;
      const sch = 13;
      specItems.forEach((spec, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const sx = 14 + col * (scw + gap);
        const sy = y + row * (sch + gap);
        pdf.setFillColor(19, 27, 45);
        pdf.setDrawColor(28, 38, 58);
        pdf.setLineWidth(0.18);
        pdf.roundedRect(sx, sy, scw, sch, 2, 2, 'FD');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(5.8);
        pdf.setTextColor(71, 85, 105);
        pdf.text(spec[0].toUpperCase(), sx + 4, sy + 4.2);
        pdf.setFontSize(9);
        pdf.setTextColor(200, 212, 228);
        pdf.text(spec[1].toString().toUpperCase(), sx + 4, sy + 10);
      });

      // ── MARKET ANALYSIS (conditional) ────────────────────────────
      if (trendStats) {
        y += (sch + gap) * 2 + 8;
        sectionTitle('MARKET ANALYSIS', y);
        y += 9;

        const mw = (pageWidth - 34) / 3;
        const mh = 19;
        const analyses = [
          { lbl: 'Purchase Price',
            val: `${(trendStats.price_at_purchase / 100000).toFixed(2)}L`,
            col: [200, 212, 228] },
          { lbl: trendStats.is_appreciating ? 'Value Gain' : 'Value Loss',
            val: `${trendStats.is_appreciating ? '+' : ''}${(trendStats.total_value_change / 100000).toFixed(2)}L`,
            col: trendStats.is_appreciating ? [16, 185, 129] : [239, 68, 68] },
          { lbl: 'Change Rate',
            val: `${trendStats.is_appreciating ? '+' : ''}${Math.abs(trendStats.value_change_percentage).toFixed(1)}%`,
            col: trendStats.is_appreciating ? [16, 185, 129] : [251, 191, 36] },
        ];
        analyses.forEach((a, i) => {
          const ax = 14 + i * (mw + gap);
          pdf.setFillColor(19, 27, 45);
          pdf.setDrawColor(28, 38, 58);
          pdf.setLineWidth(0.18);
          pdf.roundedRect(ax, y, mw, mh, 2.5, 2.5, 'FD');
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(6);
          pdf.setTextColor(71, 85, 105);
          pdf.text(a.lbl.toUpperCase(), ax + mw / 2, y + 5.2, { align: 'center' });
          pdf.setFontSize(13);
          pdf.setTextColor(...a.col);
          pdf.text(a.val, ax + mw / 2, y + 14, { align: 'center' });
        });
        y += mh + 5;
      } else {
        y += (sch + gap) * 2 + 5;
      }

      // ── AI PERFORMANCE STRIP ──────────────────────────────────────
      y += 7;
      sectionTitle('AI MODEL PERFORMANCE', y);
      y += 9;

      const perfItems = [
        ['Model Type',  result.model_performance?.model_name || 'Random Forest'],
        ['R² Score',    `${((result.model_performance?.accuracy_r2 || 0.942) * 100).toFixed(1)}%`],
        ['Dataset',     '5,497 Records'],
        ['Confidence',  trendMeta?.reliability || 'High'],
      ];
      const pcw = (pageWidth - 32) / 4;
      const pch = 15;
      perfItems.forEach((p, i) => {
        const px = 14 + i * (pcw + gap * 0.5);
        pdf.setFillColor(15, 22, 40);
        pdf.setDrawColor(37, 99, 235);
        pdf.setLineWidth(0.2);
        pdf.roundedRect(px, y, pcw, pch, 2, 2, 'FD');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(5.5);
        pdf.setTextColor(59, 130, 246);
        pdf.text(p[0].toUpperCase(), px + pcw / 2, y + 4.5, { align: 'center' });
        pdf.setFontSize(9);
        pdf.setTextColor(255, 255, 255);
        pdf.text(p[1].toString(), px + pcw / 2, y + 11, { align: 'center' });
      });

      // ── VERIFICATION BADGE ────────────────────────────────────────
      y += pch + 9;
      pdf.setFillColor(24, 60, 168);
      pdf.roundedRect(14, y, pageWidth - 28, 15, 3, 3, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(255, 255, 255);
      pdf.text('✓  AI-POWERED VALUATION  ·  PAKVALUAI CERTIFIED', centerX, y + 6.5, { align: 'center' });
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.5);
      pdf.setTextColor(147, 197, 253);
      pdf.text(
        `Random Forest ML  ·  R² ${((result.model_performance?.accuracy_r2 || 0.942) * 100).toFixed(1)}%  ·  Pakistan Automotive Market`,
        centerX, y + 11.5, { align: 'center' }
      );

      // ── FOOTER ────────────────────────────────────────────────────
      const footerY = pageHeight - 13;
      pdf.setFillColor(13, 20, 35);
      pdf.rect(0, footerY - 3, pageWidth, 16, 'F');
      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(0.25);
      pdf.line(14, footerY - 2, pageWidth - 14, footerY - 2);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(59, 130, 246);
      pdf.text('PakValuAI', 16, footerY + 3);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(45, 55, 72);
      pdf.text('  ·  Pakistan Car Intelligence Engine', 16 + pdf.getTextWidth('PakValuAI'), footerY + 3);

      const certId = `PKV-${Date.now().toString(36).toUpperCase()}`;
      pdf.setTextColor(45, 55, 72);
      pdf.text(`Cert: ${certId}`, pageWidth - 16, footerY + 3, { align: 'right' });

      // ── BOTTOM ACCENT STRIP ───────────────────────────────────────
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, pageHeight - 2.5, pageWidth, 2.5, 'F');
      pdf.setFillColor(79, 70, 229);
      pdf.rect(pageWidth * 0.5, pageHeight - 2.5, pageWidth * 0.5, 2.5, 'F');

      // ── SAVE ─────────────────────────────────────────────────────
      const filename = `PakValuAI_${formData.car_brand}_${formData.car_model}_${formData.registered_in}.pdf`;
      pdf.save(filename);

      showToast('Certificate downloaded! 🎉', 'success');
    } catch (error) {
      console.error('PDF Error:', error);
      showToast(`Generation failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feature-options');
        const data = await response.json();
        if (mounted) {
          setFeatureOptions(data.options);
          setLoadingOptions(false);
        }
      } catch (err) {
        if (mounted) {
          setLoadingOptions(false);
          showToast('Failed to sync options', 'error');
        }
      }
    };
    fetchOptions();
    return () => { mounted = false; };
  }, []);

  const fetchTrendData = async (predictedPrice) => {
    setLoadingTrend(true);
    try {
      const response = await fetch('http://localhost:5000/api/price-trend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_brand: formData.car_brand,
          car_model: formData.car_model,
          fuel_type: formData.fuel_type,
          transmission: formData.transmission,
          engine: parseInt(formData.engine),
          mileage: parseInt(formData.mileage),
          registered_in: parseInt(formData.registered_in),
          predicted_price: predictedPrice
        })
      });
      const data = await response.json();
      
      if (data.success) {
        const chartData = data.trend_data.years.map((year, idx) => ({
          year: year.toString(),
          price: data.trend_data.prices[idx],
          isCurrentYear: year === data.trend_data.current_year
        }));
        setTrendData(chartData);
        setTrendStats(data.statistics);
        setTrendMeta(data.metadata);
        
        showToast(`Trend loaded (${data.metadata.reliability} confidence)`, 'success');
      } else {
        showToast('Could not load price trend', 'error');
      }
    } catch (error) {
      console.error('Trend fetch error:', error);
      showToast('Trend data unavailable', 'error');
    } finally {
      setLoadingTrend(false);
    }
  };

  const handleSubmit = async () => {
    if (Object.values(formData).some(val => val === '')) {
      showToast('All parameters required for analysis', 'error');
      return;
    }
    setLoading(true);
    setResult(null);
    setTrendData(null);
    setTrendStats(null);
    setTrendMeta(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          engine: parseInt(formData.engine),
          registered_in: parseInt(formData.registered_in),
          mileage: parseInt(formData.mileage)
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data);
        showToast('AI valuation generated!', 'success');
        await fetchTrendData(data.predicted_price);
      }
    } catch (error) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/20 rounded-xl p-4 shadow-2xl">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
            Year {payload[0].payload.year}
          </p>
          <p className="text-lg font-black text-white">
            PKR {(payload[0].value / 100000).toFixed(2)} Lacs
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {payload[0].value.toLocaleString()} PKR
          </p>
          {payload[0].payload.isCurrentYear && (
            <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Current Value
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const TrendIcon = () => {
    if (!trendStats) return <Minus className="w-4 h-4" />;
    if (trendStats.trend_direction === 'increasing') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trendStats.trend_direction === 'decreasing') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-500" />;
  };

  if (loadingOptions) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-500 text-xs font-black tracking-[0.3em]">SYNCHRONIZING MODELS</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pt-28 pb-20 selection:bg-blue-500/30">
      <style>{`
        .glass-input { background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); }
        .glass-input:focus { border-color: #3b82f6; background: rgba(30, 41, 59, 0.6); outline: none; }
        .prediction-card { background: linear-gradient(160deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95)); border: 1px solid rgba(255, 255, 255, 0.05); }
        .watermark-text { 
           position: absolute; top: 50%; left: 50%; 
           transform: translate(-50%, -50%) rotate(-25deg);
           font-size: 8rem; font-weight: 900; color: white; opacity: 0.02;
           pointer-events: none; white-space: nowrap; z-index: 0;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .reliability-badge {
          font-size: 9px;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .reliability-high { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; }
        .reliability-medium { background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid #fbbf24; }
        .reliability-low { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; }
      `}</style>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
           <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">
            <span className="text-white">Pak</span><span className="text-blue-500">ValuAI</span> <span className="text-slate-400 text-3xl md:text-4xl font-bold">Predictor</span>
           </h1>
           <p className="text-slate-500 font-medium">Neural valuation engine for the Pakistani automotive market.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 shadow-inner">
               <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Analysis Readiness</span>
                  <span className="text-blue-500 font-bold text-sm">{Math.round(calculateProgress())}%</span>
               </div>
               <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700 shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                    style={{ width: `${calculateProgress()}%` }}
                  />
               </div>
            </div>

            <div className="prediction-card p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <FormSelect icon={<Car/>} label="Brand" value={formData.car_brand} onChange={(e) => setFormData({...formData, car_brand: e.target.value, car_model: ''})} options={featureOptions.car_brand} />
                <FormSelect icon={<Settings/>} label="Model" value={formData.car_model} onChange={(e) => setFormData({...formData, car_model: e.target.value})} options={featureOptions.car_model} disabled={!formData.car_brand} />
                <FormInput icon={<MapPin/>} label="City" value={formData.city} placeholder="City Name" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <FormSelect icon={<Fuel/>} label="Fuel" value={formData.fuel_type} onChange={(e) => setFormData({...formData, fuel_type: e.target.value})} options={featureOptions.fuel_type} />
                <FormInput icon={<Gauge/>} label="Engine" type="number" value={formData.engine} placeholder="CC e.g. 1300" onChange={(e) => setFormData({...formData, engine: e.target.value})} />
                <FormSelect icon={<TrendingUp/>} label="Gear" value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})} options={featureOptions.transmission} />
                <FormInput icon={<Calendar/>} label="Year" type="number" value={formData.registered_in} placeholder="Registration Year" onChange={(e) => setFormData({...formData, registered_in: e.target.value})} />
                <FormInput icon={<TrendingUp/>} label="ODO" type="number" value={formData.mileage} placeholder="Total KM" onChange={(e) => setFormData({...formData, mileage: e.target.value})} />
              </div>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader className="animate-spin"/> : "Generate AI Valuation"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            {result ? (
              <div className="sticky top-28 space-y-6">
                <div ref={reportRef} className="space-y-6">
                  <div className="prediction-card p-10 rounded-[2.5rem] relative overflow-hidden bg-[#0f172a] animate-fade-in-up">
                    <div className="watermark-text tracking-widest">CERTIFIED</div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10 border-b border-white/10 pb-6">
                          <div>
                              <div className="text-blue-500 font-black text-xl italic tracking-tighter">PAK<span className="text-white not-italic">VALUAI</span></div>
                              <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Official Valuation Certificate v2.0</div>
                          </div>
                          <div className="text-right text-[10px] font-bold text-slate-400">
                             {new Date().toLocaleDateString()}
                          </div>
                      </div>

                      <div className="mb-10">
                        <div className="text-6xl font-black text-white tracking-tighter mb-1">{result.price_display.formatted}</div>
                        <div className="text-xl font-bold text-emerald-500 tracking-tight">{result.price_display.lacs} Lacs PKR</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-8">
                        <ReportDetail label="Brand" value={formData.car_brand}/>
                        <ReportDetail label="Variant" value={formData.car_model}/>
                        <ReportDetail label="Mileage" value={`${Number(formData.mileage).toLocaleString()} KM`}/>
                        <ReportDetail label="Year" value={formData.registered_in}/>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
                         <span>Market Accuracy</span>
                         <span className="text-emerald-500">Verified by PakValuAI</span>
                      </div>
                    </div>
                  </div>

                  <div className="prediction-card p-8 rounded-[2.5rem] relative overflow-hidden animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <div>
                          <h3 className="text-lg font-black text-white">Market History</h3>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            {formData.car_brand} {formData.car_model} • Yearly Analysis
                          </p>
                        </div>
                      </div>
                      {trendMeta && (
                        <div className={`reliability-badge reliability-${trendMeta.reliability}`}>
                          {trendMeta.reliability}
                        </div>
                      )}
                    </div>

                    {loadingTrend ? (
                      <div className="h-64 flex flex-col items-center justify-center gap-3">
                        <Loader className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-xs text-slate-500 font-bold">Analyzing market data...</p>
                      </div>
                    ) : trendData ? (
                      <>
                        <div className="h-64 mb-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis 
                                dataKey="year" 
                                stroke="#64748b"
                                style={{ fontSize: '11px', fontWeight: 'bold' }}
                                tick={{ fill: '#64748b' }}
                              />
                              <YAxis 
                                stroke="#64748b"
                                style={{ fontSize: '11px', fontWeight: 'bold' }}
                                tick={{ fill: '#64748b' }}
                                tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Area 
                                type="monotone" 
                                dataKey="price" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                fill="url(#priceGradient)"
                                dot={(props) => {
                                  const { cx, cy, payload } = props;
                                  return payload.isCurrentYear ? (
                                    <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="#fff" strokeWidth={2} />
                                  ) : (
                                    <circle cx={cx} cy={cy} r={4} fill="#3b82f6" />
                                  );
                                }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {trendStats && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Purchase Price</span>
                                  <TrendIcon />
                                </div>
                                <div className="text-lg font-black text-white">
                                  {(trendStats.price_at_purchase / 100000).toFixed(2)}L
                                </div>
                              </div>
                              
                              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-2">
                                  {trendStats.is_appreciating ? "Value Gain" : "Value Loss"}
                                </div>
                                <div className={`text-lg font-black ${trendStats.is_appreciating ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {trendStats.is_appreciating ? '+' : ''}{(trendStats.total_value_change / 100000).toFixed(2)}L
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                              <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-2">
                                {trendStats.trend_label === 'appreciation' ? 'Appreciation Rate' : trendStats.trend_label === 'depreciation' ? 'Depreciation Rate' : 'Market Status'}
                              </div>
                              <div className="flex items-baseline gap-2">
                                <div className={`text-2xl font-black ${trendStats.is_appreciating ? 'text-emerald-400' : 'text-orange-400'}`}>
                                  {trendStats.is_appreciating ? '+' : ''}{Math.abs(trendStats.value_change_percentage).toFixed(1)}%
                                </div>
                                <div className="text-xs text-slate-500 font-bold">
                                  ({trendStats.is_appreciating ? '+' : ''}{Math.abs(trendStats.avg_change_per_year / 100000).toFixed(2)}L/year)
                                </div>
                              </div>
                            </div>

                            {trendStats.is_appreciating && (
                              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-2">
                                  <TrendingUp className="w-3 h-3" />
                                  Pakistani market inflation effect: Car value increased!
                                </p>
                              </div>
                            )}

                            {trendMeta && trendMeta.data_source === 'real_market_data' && (
                              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-2">
                                  <Activity className="w-3 h-3" />
                                  Based on {trendMeta.matching_cars_found} similar cars in market
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-slate-600">
                        <p className="text-sm">Trend data unavailable</p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={generatePDF}
                  disabled={loading}
                  className="w-full py-5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white rounded-3xl font-black transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-5 h-5 text-blue-500" />
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'DOWNLOAD FULL CERTIFICATE'}
                </button>
              </div>
            ) : (
              <div className="sticky top-28 h-[550px] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center">
                 <Calculator className="w-12 h-12 text-slate-800 mb-4" />
                 <h3 className="text-slate-400 font-bold">Waiting for Specs</h3>
                 <p className="text-slate-600 text-xs mt-2">Fill the form to unlock AI valuation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportDetail = ({ label, value }) => (
  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-center">
    <div className="text-[8px] uppercase text-slate-500 font-black mb-1 tracking-widest">{label}</div>
    <div className="text-[11px] font-black text-white uppercase truncate">{value}</div>
  </div>
);

const FormInput = ({ icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.15em]">{icon} {label}</label>
    <input className="w-full px-6 py-4 glass-input rounded-2xl text-white placeholder:text-slate-700 font-bold text-sm transition-all" {...props} />
  </div>
);

const FormSelect = ({ icon, label, options, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.15em]">{icon} {label}</label>
    <select className="w-full px-6 py-4 glass-input rounded-2xl text-white appearance-none cursor-pointer font-bold text-sm transition-all" {...props}>
      <option value="">Choose {label}</option>
      {options?.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
    </select>
  </div>
);

export default PredictPage;