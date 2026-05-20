import React from 'react';
import { X, ShieldAlert, Sun, Sunrise, Sunset, Wind, Droplets, Compass } from 'lucide-react';

interface MetricsSidebarProps {
  data: any; // Dynamic response object passed down from root shell
  isOpen: boolean;
  onClose: () => void;
}

export const MetricsSidebar: React.FC<MetricsSidebarProps> = ({ data, isOpen, onClose }) => {
  const current = data?.current;
  const forecastDayZero = data?.forecast?.forecastday?.[0] || {};
  const aqi = current?.air_quality;

  // Extract or evaluate standard US-EPA indices
  const epaIndex = aqi?.['us-epa-index'] || 1;
  const getAqiDescription = (index: number) => {
    switch (index) {
      case 1: return '1-Good (Minimal Risk)';
      case 2: return '2-Moderate';
      case 3: return '3-Unhealthy for Vulnerable Groups';
      default: return '4-High Health Risk';
    }
  };

  // Map progress marker positions based on index (1 to 4+)
  const aqiPercentage = Math.min((epaIndex / 4) * 100, 100);

  // Safely grab structural UV thresholds
  const uvValue = current?.uv || 0;
  const getUvDescription = (uv: number) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    return 'Very High';
  };

  return (
    <>
      {/* Backdrop Blur Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* --- LEFT METRICS SIDEBAR DRAWER --- */}
      <div 
        className={`fixed z-50 bg-[#0b0813]/90 backdrop-blur-2xl border-white/10 text-white transition-transform duration-300 ease-out flex flex-col
          bottom-0 top-0 left-0 w-full sm:w-[400px] h-full rounded-r-[32px] border-r
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Ambient Glow Backdrops */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

        {/* HEADER AREA */}
        <div className="p-6 pb-3 flex justify-between items-center flex-initial z-10">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">Weather Condition Details</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time parameters</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* METRICS SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 scrollbar-none z-10">
          
          {/* AIR QUALITY CARD */}
          <div className="bg-[#231b4d]/60 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <ShieldAlert className="w-3.5 h-3.5" /> Air Quality
            </div>
            <div>
              <p className="text-xl font-semibold text-white">{getAqiDescription(epaIndex)}</p>
            </div>
            {/* Dynamic UI Slider */}
            <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-visible mt-1">
              <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
              <div 
                style={{ left: `${aqiPercentage}%` }}
                className="absolute top-1/2 w-2.5 h-2.5 bg-white border border-slate-900 rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-md transition-all duration-500" 
              />
            </div>
            <div className="text-[10px] text-slate-400 grid grid-cols-3 mt-1 font-mono">
              <span>PM2.5: {aqi?.pm2_5?.toFixed(1) || 0}</span>
              <span>PM10: {aqi?.pm10?.toFixed(1) || 0}</span>
              <span>O3: {aqi?.o3?.toFixed(1) || 0}</span>
            </div>
          </div>

          {/* TWO COLUMN METRIC SPLIT MAP */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* UV INDEX CARD */}
            <div className="bg-[#231b4d]/60 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[145px]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> UV Index
              </div>
              <div className="my-2">
                <p className="text-3xl font-light text-white leading-tight">{uvValue}</p>
                <p className="text-sm font-medium text-slate-200">{getUvDescription(uvValue)}</p>
              </div>
              <div className="relative w-full h-1 bg-gradient-to-r from-blue-400 to-pink-500 rounded-full">
                <div 
                  style={{ left: `${Math.min((uvValue / 11) * 100, 100)}%` }}
                  className="absolute top-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-all duration-500" 
                />
              </div>
            </div>

            {/* SUNRISE / SUNSET CARD */}
            <div className="bg-[#231b4d]/60 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[145px] overflow-hidden relative">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                <Sunrise className="w-3.5 h-3.5 text-indigo-300" /> Sunrise
              </div>
              <div className="my-1 z-10">
                <p className="text-2xl font-light text-white tracking-tight">{forecastDayZero?.astro?.sunrise || '5:28 AM'}</p>
              </div>
              
              {/* Sine-Wave Graphic Simulation */}
              <div className="relative h-8 w-full border-b border-white/20 mt-1">
                <div className="absolute bottom-0 left-0 right-0 h-10 border-t-2 border-dashed border-indigo-400/40 rounded-[100%] transform translate-y-3">
                  <div className="absolute top-0 left-[45%] w-2 h-2 bg-indigo-300 rounded-full shadow-[0_0_8px_#818cf8]" />
                </div>
              </div>
              <div className="text-[9px] text-slate-400 flex justify-between items-center mt-1 z-10">
                <span>Sunset: {forecastDayZero?.astro?.sunset || '7:25 PM'}</span>
              </div>
            </div>

          </div>

          {/* SECOND CONTAINER SPAN GRID */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* WIND DIAGRAM BOX */}
            <div className="bg-[#231b4d]/60 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[145px]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                <Wind className="w-3.5 h-3.5 text-slate-300" /> Wind Direction
              </div>
              <div className="flex flex-col items-center justify-center my-1 relative py-2">
                <div className="w-14 h-14 rounded-full border border-dashed border-white/20 flex items-center justify-center text-[8px] text-slate-500 relative">
                  <span className="absolute top-0.5 font-bold text-slate-400">N</span>
                  <Compass 
                    style={{ transform: `rotate(${current?.wind_degree || 0}deg)` }}
                    className="w-5 h-5 text-indigo-400 transition-transform duration-500" 
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-md font-semibold text-white leading-none">{current?.wind_kph || 0} km/h</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Vector: {current?.wind_dir || 'N'}</p>
              </div>
            </div>

            {/* RAINFALL CARD */}
            <div className="bg-[#231b4d]/60 border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[145px]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Precip
              </div>
              <div className="my-2">
                <p className="text-2xl font-light text-white leading-tight">{current?.precip_mm || 0} mm</p>
                <p className="text-[11px] text-slate-400 font-medium">Humidity: {current?.humidity || 0}%</p>
              </div>
              <div className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 w-max">
                Feels: {Math.round(current?.feelslike_c || 0)}°C
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};