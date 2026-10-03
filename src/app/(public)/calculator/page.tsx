"use client";

import { useState, useEffect } from "react";
import { HardDrive, Camera, Calendar, Activity, Info, Video, Film, Volume2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function CalculatorPage() {
  const [channels, setChannels] = useState<number>(4);
  const [days, setDays] = useState<number>(30);
  const [camType, setCamType] = useState<string>("IP");
  const [encode, setEncode] = useState<number>(1.0); // Multiplier
  const [quality, setQuality] = useState<number>(1.0); // Multiplier
  const [resolution, setResolution] = useState<number>(2048); // Base Bitrate in kbps
  const [fps, setFps] = useState<number>(25);
  const [audio, setAudio] = useState<boolean>(false);
  const [motion, setMotion] = useState<number>(100); // Percentage

  const [calcBitrate, setCalcBitrate] = useState<number>(0);

  // Constants
  const resolutions = [
    { label: "1MP (720p)", base: 1024 },
    { label: "2MP (1080p)", base: 2048 },
    { label: "3MP", base: 3072 },
    { label: "4MP (1440p)", base: 4096 },
    { label: "5MP", base: 5120 },
    { label: "8MP (4K)", base: 8192 },
  ];

  const encodes = [
    { label: "H.264", value: 1.0 },
    { label: "H.264+", value: 0.75 },
    { label: "H.265", value: 0.5 },
    { label: "H.265+", value: 0.35 },
  ];

  const qualities = [
    { label: "Low", value: 0.6 },
    { label: "Medium", value: 1.0 },
    { label: "High", value: 1.3 },
    { label: "Best", value: 1.5 },
  ];

  const motionOptions = [
    { label: "Continuous (100%)", value: 100 },
    { label: "High Motion / Street (80%)", value: 80 },
    { label: "Medium / Retail (50%)", value: 50 },
    { label: "Low Motion / Office (30%)", value: 30 },
  ];

  // Update calculated bitrate whenever factors change
  useEffect(() => {
    let br = resolution * encode * quality * (fps / 25.0);
    if (audio) {
      br += 64; // Add 64 kbps for audio channel
    }
    setCalcBitrate(Math.round(br));
  }, [resolution, encode, quality, fps, audio]);

  const calculateStorage = () => {
    // bytes per second for ONE camera
    const bytesPerSecond = (calcBitrate * 1000) / 8; 
    
    // Total bytes for all cameras for 1 day
    const bytesPerDay = bytesPerSecond * 86400 * channels;
    
    // Apply motion percentage (if it's not recording 100% of the time)
    const activeBytesPerDay = bytesPerDay * (motion / 100.0);
    
    // Total for given days
    const totalBytes = activeBytesPerDay * days;
    
    const totalGB = totalBytes / (1024 * 1024 * 1024);
    const totalTB = totalGB / 1024;
    
    return {
      gb: totalGB.toFixed(2),
      tb: totalTB.toFixed(2)
    };
  };

  const result = calculateStorage();

  return (
    <div className="min-h-screen bg-slate-50 pt-6 sm:pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Advanced HDD Calculator</h1>
          <p className="text-slate-500 text-xs md:text-sm max-w-2xl mx-auto">
            Calculate precise storage requirements using professional parameters including Encode, FPS, Bitrate, and Motion complexity.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Inputs Grid (Left Side) */}
          <div className="lg:col-span-6 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Camera Stream Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
              
              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</label>
                <select 
                  value={camType}
                  onChange={(e) => setCamType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="IP">IP Camera</option>
                  <option value="HDCVI">Analog / HDCVI</option>
                </select>
              </div>

              {/* Channels */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Channels</label>
                <input 
                  type="number" min="1" max="256"
                  value={channels}
                  onChange={(e) => setChannels(Number(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Resolution */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resolution</label>
                <select 
                  value={resolution}
                  onChange={(e) => setResolution(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  {resolutions.map((res) => (
                    <option key={res.base} value={res.base}>{res.label}</option>
                  ))}
                </select>
              </div>

              {/* Encode */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Encode</label>
                <select 
                  value={encode}
                  onChange={(e) => setEncode(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  {encodes.map((e) => (
                    <option key={e.label} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>

              {/* Quality */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quality</label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  {qualities.map((q) => (
                    <option key={q.label} value={q.value}>{q.label}</option>
                  ))}
                </select>
              </div>

              {/* FPS */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">FPS (1-30)</label>
                <input 
                  type="number" min="1" max="60"
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value) || 25)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Audio */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Audio</label>
                <select 
                  value={audio ? "yes" : "no"}
                  onChange={(e) => setAudio(e.target.value === "yes")}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes (+64 kbps)</option>
                </select>
              </div>

              {/* Motion */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Motion</label>
                <select 
                  value={motion}
                  onChange={(e) => setMotion(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  {motionOptions.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Days */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Days</label>
                <input 
                  type="number" min="1" max="365"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-blue-500"/> {calcBitrate} Kbps per cam</p>
              <Link href="/services" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-sm shadow-md shadow-blue-600/20">
                Book Install
              </Link>
            </div>

          </div>

          
          {/* Results Sidebar (Right Side - UNIQUE UI) */}
          <div className="lg:col-span-6 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Soft background glows */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-50/50 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-8 z-10 flex items-center gap-2">
              <HardDrive className="w-4 h-4" /> Estimated Storage
            </h3>

            {/* Custom SVG Radial Gauge */}
            <div className="relative w-64 h-64 flex items-center justify-center z-10 mb-6 group">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 transition-transform duration-700 group-hover:scale-105" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="46" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                
                {/* Dynamic Progress Ring (Visually set to ~75% for aesthetics, or could be dynamic) */}
                <circle cx="50" cy="50" r="46" stroke="url(#storageGradient)" strokeWidth="8" fill="none" 
                  strokeDasharray="289" strokeDashoffset="60" strokeLinecap="round" 
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.3))' }} 
                />
                
                <defs>
                  <linearGradient id="storageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
                    <stop offset="100%" stopColor="#6366f1" /> {/* indigo-500 */}
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Content */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-6xl font-black text-slate-800 tracking-tighter drop-shadow-sm">{result.tb}</span>
                <span className="text-xl font-extrabold text-blue-600 tracking-widest mt-1">TB</span>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500 z-10 bg-slate-100/80 backdrop-blur-md px-5 py-2 rounded-full border border-slate-200/50">
               Equivalent to <span className="text-slate-700">{result.gb} GB</span>
            </div>

            {/* Floating Bottom Stats */}
            <div className="w-full mt-auto pt-10 grid grid-cols-2 gap-5 z-10">
               <div className="bg-white/60 backdrop-blur-lg border border-slate-100 rounded-3xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mb-3">
                     <Camera className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-black text-slate-800">{channels}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cameras</p>
               </div>
               
               <div className="bg-white/60 backdrop-blur-lg border border-slate-100 rounded-3xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
                     <Activity className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-black text-slate-800">{(calcBitrate * channels / 1024).toFixed(1)} <span className="text-sm text-slate-500">Mbps</span></p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bandwidth</p>
               </div>
            </div>
          </div>
{/* Pro Tips Section */}
          <div className="lg:col-span-12 mt-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Expert Guidelines for Storage &amp; Bandwidth
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <ShieldAlert className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-slate-800">Smart Motion Recording</h4>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Activating "Motion-Based Recording" significantly cuts down storage costs. By only recording active movements (like in offices or homes), you avoid saving hours of empty footage, preserving both HDD capacity and network bandwidth.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Video className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-slate-800">H.265+ Compression</h4>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Always prefer cameras supporting H.265 or H.265+ encode. It reduces the bitrate by up to 60-70% compared to legacy H.264, allowing you to store double the footage on the same hard drive.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
