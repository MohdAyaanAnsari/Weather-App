import React, { useState, useEffect } from 'react';
import { X, Search, Sun, CloudRain, Wind, CloudSun, CloudLightning, MapPin } from 'lucide-react';
import axios from 'axios';

interface WeatherSidebarProps {
  data: any; 
  isOpen: boolean;
  onClose: () => void;
}

interface SavedCity {
  city: string;
  country: string;
  temp: number;
  high: number;
  low: number;
  condition: string;
  type: 'clear' | 'rain' | 'wind' | 'cloudy' | 'storm';
}

export const WeatherSidebar: React.FC<WeatherSidebarProps> = ({ data, isOpen, onClose }) => {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SavedCity | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Directly utilizing your active API Key string
  const API_KEY = "a55c41c630554c03a44122859261905";

  // Hydrate the favorite default city list when the sidebar opens
  useEffect(() => {
    async function loadPinnedMetrics() {
      if (!API_KEY) {
        console.warn("Weather API Key is empty.");
        return;
      }
      const defaults = ['Bengaluru', 'Chennai', 'Delhi'];
      try {
        const requests = defaults.map(city => 
          axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1`)
        );
        const responses = await Promise.all(requests);
        
        const mapped: SavedCity[] = responses.map(res => parseWeatherData(res.data));
        setSavedCities(mapped);
      } catch (err) {
        console.error("Error hydrating saved cities list:", err);
      }
    }

    if (isOpen) {
      loadPinnedMetrics();
    }
  }, [isOpen, API_KEY]);

  // Shared parsing engine matching your backend data layers
  const parseWeatherData = (apiData: any): SavedCity => {
    const conditionText = apiData.current?.condition?.text?.toLowerCase() || '';
    let type: SavedCity['type'] = 'clear';
    
    if (conditionText.includes('thunder')) type = 'storm';
    else if (conditionText.includes('rain') || conditionText.includes('drizzle')) type = 'rain';
    else if (conditionText.includes('wind') || apiData.current?.wind_kph > 20) type = 'wind';
    else if (conditionText.includes('cloud') || conditionText.includes('overcast')) type = 'cloudy';

    return {
      city: apiData.location?.name,
      country: apiData.location?.country,
      temp: Math.round(apiData.current?.temp_c),
      high: Math.round(apiData.forecast?.forecastday?.[0]?.day?.maxtemp_c || 0),
      low: Math.round(apiData.forecast?.forecastday?.[0]?.day?.mintemp_c || 0),
      condition: apiData.current?.condition?.text || 'Clear',
      type
    };
  };

  // Execution engine for search requests
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevents page refresh on Enter key press
    
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      setSearchError(null);
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}&days=1`
      );
      const parsedCity = parseWeatherData(response.data);
      setSearchResult(parsedCity);
    } catch (err) {
      setSearchError('City not found. Please try another query.');
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const renderCityIcon = (type: string) => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-12 h-12 text-cyan-300 drop-shadow-[0_4px_12px_rgba(34,211,238,0.4)]" />;
      case 'wind':
        return <Wind className="w-12 h-12 text-slate-300 drop-shadow-[0_4px_12px_rgba(255,255,255,0.2)]" />;
      case 'storm':
        return <CloudLightning className="w-12 h-12 text-purple-400 drop-shadow-[0_4px_12px_rgba(168,85,247,0.4)]" />;
      case 'cloudy':
        return <CloudSun className="w-12 h-12 text-amber-200 drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]" />;
      default:
        return <Sun className="w-12 h-12 text-amber-300 drop-shadow-[0_4px_12px_rgba(251,191,36,0.5)]" />;
    }
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

      {/* --- RESPONSIVE SIDEBAR DRAWER --- */}
      <div 
        className={`fixed z-50 bg-[#0b0813]/90 backdrop-blur-2xl border-white/10 text-white transition-transform duration-300 ease-out flex flex-col justify-between
          bottom-0 left-0 right-0 h-[85vh] rounded-t-[32px] border-t
          lg:top-0 lg:bottom-0 lg:right-0 lg:left-auto lg:w-[420px] lg:h-full lg:rounded-t-none lg:rounded-l-[32px] lg:border-l lg:border-t-0
          ${isOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-full'}`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1 lg:hidden flex-initial z-10" />

        {/* HEADER AREA */}
        <div className="p-6 pb-3 flex flex-col gap-4 flex-initial z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold tracking-tight text-white">Weather Locations</h2>
            <button 
              onClick={onClose} 
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Form container captures explicit action triggers */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <button 
              type="submit" 
              className="absolute left-3.5 p-0 bg-transparent border-none text-slate-400 hover:text-purple-400 transition-colors z-20"
            >
              <Search className="w-4 h-4" />
            </button>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city... (Press Enter)" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/30 transition-colors shadow-inner"
            />
            {searchLoading && (
              <span className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin absolute right-3.5" />
            )}
          </form>

          {/* Error Message Render block */}
          {searchError && (
            <p className="text-[11px] font-medium text-red-400 px-1 animate-pulse">
              {searchError}
            </p>
          )}
        </div>

        {/* CITY CARDS LIST AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-3 scrollbar-none z-10">
          
          {/* SEARCH RESULT DISPATCH BLOCK */}
          {searchResult && (
            <div className="flex flex-col gap-1.5 mb-2">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1 pl-1">
                <MapPin className="w-3 h-3" /> Search Result
              </span>
              <div 
                className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-500/20 via-purple-500/5 to-transparent border border-purple-500/30 p-5 flex justify-between items-end min-h-[120px] shadow-lg group hover:border-purple-400/40 transition-all duration-300"
              >
                <div className="flex flex-col justify-between h-full z-10">
                  <div>
                    <p className="text-4xl font-extralight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 leading-none">{searchResult.temp}°</p>
                    <div className="flex gap-2 text-[10px] font-semibold text-slate-400 mt-2">
                      <span className="bg-white/5 px-1.5 py-0.5 rounded">H: {searchResult.high}°</span>
                      <span className="bg-white/5 px-1.5 py-0.5 rounded">L: {searchResult.low}°</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 tracking-tight mt-4">
                    {searchResult.city} <span className="text-slate-400 text-xs font-medium ml-1">{searchResult.country}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between h-full z-10 text-right">
                  <div className="mb-1 transform group-hover:scale-105 transition-transform duration-300">
                    {renderCityIcon(searchResult.type)}
                  </div>
                  <p className="text-[11px] font-medium text-purple-300 tracking-wide bg-purple-950/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-purple-500/20">
                    {searchResult.condition}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DEFAULT PINNED LOCATIONS BLOCK */}
          {savedCities.length > 0 ? (
            savedCities.map((city, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 p-5 flex justify-between items-end min-h-[120px] shadow-lg group hover:border-white/20 transition-all duration-300"
              >
                <div className="flex flex-col justify-between h-full z-10">
                  <div>
                    <p className="text-4xl font-extralight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 leading-none">{city.temp}°</p>
                    <div className="flex gap-2 text-[10px] font-semibold text-slate-400 mt-2">
                      <span className="bg-white/5 px-1.5 py-0.5 rounded">H: {city.high}°</span>
                      <span className="bg-white/5 px-1.5 py-0.5 rounded">L: {city.low}°</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 tracking-tight mt-4">
                    {city.city} <span className="text-slate-400 text-xs font-medium ml-1">{city.country}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between h-full z-10 text-right">
                  <div className="mb-1 transform group-hover:scale-105 transition-transform duration-300">
                    {renderCityIcon(city.type)}
                  </div>
                  <p className="text-[11px] font-medium text-slate-300 tracking-wide bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/5">
                    {city.condition}
                  </p>
                </div>
              </div>
            ))
          ) : (
            !searchLoading && (
              <p className="text-center text-xs text-slate-500 mt-8 font-medium">
                Loading tracked favorite locations...
              </p>
            )
          )}
        </div>

      </div>
    </>
  );
};