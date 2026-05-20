import React, { useState } from 'react';
import { MapPin, Plus, List, Sun, CloudRain, CloudLightning, CloudMoon, Wind, Droplets, Eye, Blocks } from 'lucide-react';
import { WeatherSidebar } from './RightSidebar';
import { MetricsSidebar } from './LeftSidebar';

export interface WeatherDashboardProps {
    data: any; // API data structure object passed from route level
    isLeftSidebarOpen: boolean;
    setIsLeftSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isRightSidebarOpen: boolean;
    setIsRightSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface HourlyForecast {
    time: string;
    temp: number;
    condition: 'clear' | 'rain' | 'cloudy' | 'storm';
    pop?: number;
    isCurrent?: boolean;
}

interface DailyForecast {
    day: string;
    tempMax: number;
    tempMin: number;
    condition: 'clear' | 'rain' | 'cloudy' | 'storm';
}

// Internal helper to map dynamic structural strings onto UI condition states
const mapConditionText = (text: string): 'clear' | 'rain' | 'cloudy' | 'storm' => {
    const condition = text.toLowerCase();
    if (condition.includes('thunder') || condition.includes('lightning')) return 'storm';
    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) return 'rain';
    if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('mist') || condition.includes('fog')) return 'cloudy';
    return 'clear';
};

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
    data,
    isLeftSidebarOpen,
    setIsLeftSidebarOpen,
    isRightSidebarOpen,
    setIsRightSidebarOpen
}) => {
    const [activeTab, setActiveTab] = useState<'hourly' | 'weekly'>('hourly');

    // Extract properties safely from the response structure
    const location = data?.location;
    const current = data?.current;
    const forecastDays = data?.forecast?.forecastday || [];

    // Parse out dynamic Timeline intervals (taking 8 sequential slices starting relative to hour index chunks)
    const rawHours = forecastDays[0]?.hour || [];
    const currentHourIndex = new Date(location?.localtime || Date.now()).getHours();

    const hourlyData: HourlyForecast[] = rawHours.slice(currentHourIndex, currentHourIndex + 7).map((h: any, idx: number) => ({
        time: idx === 0 ? 'Now' : new Date(h.time).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        temp: Math.round(h.temp_c),
        condition: mapConditionText(h.condition?.text || ''),
        pop: h.chance_of_rain > 0 ? h.chance_of_rain : undefined,
        isCurrent: idx === 0
    }));

    // Parse out structural Forecast elements for upcoming dates
    const weeklyData: DailyForecast[] = forecastDays.map((d: any) => ({
        day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        tempMax: Math.round(d.day.maxtemp_c),
        tempMin: Math.round(d.day.mintemp_c),
        condition: mapConditionText(d.day.condition?.text || '')
    }));

    const renderWeatherIcon = (condition: string, sizeClass = "w-6 h-6") => {
        switch (condition) {
            case 'clear':
                return <Sun className={`${sizeClass} text-amber-300 animate-[spin_20s_linear_infinite] drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]`} />;
            case 'rain':
                return <CloudRain className={`${sizeClass} text-cyan-300 animate-[bounce_3s_ease-in-out_infinite] drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]`} />;
            case 'storm':
                return <CloudLightning className={`${sizeClass} text-purple-300 animate-pulse drop-shadow-[0_0_12px_rgba(192,132,252,0.6)]`} />;
            default:
                return <CloudMoon className={`${sizeClass} text-indigo-200 animate-[pulse_4s_ease-in-out_infinite]`} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-[#0b0813] text-slate-100 font-sans antialiased relative overflow-hidden flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8">
            {/* Premium Cinematic Atmospheric Background Blooms */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* --- MASTER CONTAINER --- */}
            <div className="relative z-10 w-full h-full max-w-6xl max-h-[850px] bg-white/[0.02] backdrop-blur-2xl border border-white/10 sm:rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] p-5 md:p-7 flex flex-col justify-between gap-5 overflow-hidden">

                {/* HEADER AREA */}
                <div className="flex justify-between items-center flex-initial">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                            <MapPin className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-white leading-tight">{location?.name || 'Kashipur'}</h1>
                            <p className="text-xs text-slate-400 font-medium">{location?.country || 'India'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-3 py-1.5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold tracking-wide text-slate-300">
                            {location?.localtime ? new Date(location.localtime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '1:41 PM'}
                        </span>
                    </div>
                </div>

                {/* MAIN BODY GRID */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden items-stretch">

                    {/* HERO CARD */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-white/[0.06] to-white/[0.02] rounded-[28px] border border-white/10 p-6 flex flex-col justify-between items-start relative overflow-hidden group min-h-[340px] sm:min-h-full">
                        <div className="absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br from-purple-500/30 to-indigo-500/0 rounded-full blur-3xl pointer-events-none group-hover:from-purple-500/40 transition-all duration-500" />

                        {/* Top Section: Labels & Condition */}
                        <div className="w-full flex justify-between items-start z-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold tracking-widest text-purple-400 uppercase">Current Weather</span>
                                <h2 className="text-2xl font-normal text-white mt-0.5 tracking-tight">{current?.condition?.text || 'Mostly Clear'}</h2>
                            </div>

                            <div className="flex gap-1.5 text-[11px] font-bold text-slate-300 bg-white/5 border border-white/5 p-1 rounded-xl backdrop-blur-md">
                                <span className="px-2 py-0.5 bg-white/5 rounded-lg text-white">H: {Math.round(forecastDays[0]?.day?.maxtemp_c || 24)}°</span>
                                <span className="px-2 py-0.5 text-slate-400">L: {Math.round(forecastDays[0]?.day?.mintemp_c || 18)}°</span>
                            </div>
                        </div>

                        {/* Middle Section: Temperature & Icon */}
                        <div className="w-full flex items-baseline justify-between my-auto py-4 z-10">
                            <div className="relative">
                                <p className="text-8xl sm:text-[100px] lg:text-[115px] font-extralight tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">
                                    {Math.round(current?.temp_c || 20)}
                                    <span className="absolute text-4xl sm:text-5xl font-light top-2 -right-5 sm:-right-7 text-white/90">°</span>
                                </p>
                            </div>

                            <div className="animate-[bounce_4s_ease-in-out_infinite] transition-all duration-500 transform group-hover:scale-110 group-hover:brightness-110 pr-2">
                                {renderWeatherIcon(mapConditionText(current?.condition?.text || ''), "w-20 h-20 sm:w-24 sm:h-24")}
                            </div>
                        </div>

                        {/* Bottom Section: Metric Panel */}
                        <div className="w-full flex justify-between items-center gap-2 bg-white/[0.03] backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-xs z-10 shadow-lg">
                            <div className="flex flex-col gap-0.5 items-start pl-1">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                                    <Wind className="w-3 h-3 text-slate-400" /> Wind
                                </span>
                                <span className="text-slate-200 font-semibold mt-0.5">{current?.wind_kph || 12} km/h</span>
                            </div>

                            <div className="w-px h-6 bg-white/10" />

                            <div className="flex flex-col gap-0.5 items-start">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                                    <Droplets className="w-3 h-3 text-cyan-400" /> Humidity
                                </span>
                                <span className="text-slate-200 font-semibold mt-0.5">{current?.humidity || 64}%</span>
                            </div>

                            <div className="w-px h-6 bg-white/10" />

                            <div className="flex flex-col gap-0.5 items-end pr-1">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                                    <Eye className="w-3 h-3 text-amber-400" /> Visibility
                                </span>
                                <span className="text-slate-200 font-semibold mt-0.5">{current?.vis_km || 10} km</span>
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC TIMELINES GRID */}
                    <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden">

                        {/* Adaptive Navigation Tabs */}
                        <div className="flex lg:hidden bg-white/5 p-1 rounded-xl border border-white/5 flex-initial">
                            <button
                                onClick={() => setActiveTab('hourly')}
                                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === 'hourly' ? 'bg-white/10 text-white shadow-sm font-semibold' : 'text-slate-400'}`}
                            >
                                Hourly Forecast
                            </button>
                            <button
                                onClick={() => setActiveTab('weekly')}
                                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === 'weekly' ? 'bg-white/10 text-white shadow-sm font-semibold' : 'text-slate-400'}`}
                            >
                                Weekly Forecast
                            </button>
                        </div>

                        {/* Hourly Row Card Container */}
                        <div className={`${activeTab === 'weekly' ? 'hidden lg:flex' : 'flex'} flex-1 bg-white/[0.03] rounded-2xl border border-white/5 p-4 flex-col justify-between overflow-hidden`}>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">24-Hour Timeline</h3>
                            <div className="flex flex-row gap-2 overflow-x-auto pb-1 flex-1 items-stretch scrollbar-none snap-x mandatory">
                                {hourlyData.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col items-center justify-between py-3 px-3 rounded-xl border transition-all w-[76px] sm:w-[84px] flex-shrink-0 snap-chip ${item.isCurrent
                                            ? 'bg-gradient-to-b from-indigo-600/40 to-purple-600/30 border-purple-500/40 shadow-lg shadow-purple-500/10'
                                            : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'
                                            }`}
                                    >
                                        <span className="text-[11px] font-medium text-slate-400">{item.time}</span>
                                        <div className="my-1.5">{renderWeatherIcon(item.condition, "w-6 h-6")}</div>
                                        <span className="text-sm font-semibold text-white">{item.temp}°</span>
                                        {item.pop ? (
                                            <span className="text-[9px] font-bold text-cyan-400">{item.pop}%</span>
                                        ) : (
                                            <span className="text-[9px] font-medium text-slate-500">-</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Row Card Container */}
                        <div className={`${activeTab === 'hourly' ? 'hidden lg:flex' : 'flex'} flex-1 bg-white/[0.03] rounded-2xl border border-white/5 p-4 flex-col justify-between overflow-hidden`}>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">7-Day Forecast</h3>
                            <div className="flex flex-col justify-between flex-1 gap-1 overflow-y-auto pr-1 scrollbar-none">
                                {weeklyData.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl transition-colors text-xs">
                                        <span className="font-semibold text-slate-300 w-12">{item.day}</span>
                                        <div className="flex items-center gap-2 min-w-[50px]">
                                            {renderWeatherIcon(item.condition, "w-4 h-4")}
                                            <span className="text-[11px] capitalize text-slate-400 font-medium hidden sm:inline">{item.condition}</span>
                                        </div>
                                        <div className="flex gap-3 font-semibold tracking-tight">
                                            <span className="text-white">{item.tempMax}°</span>
                                            <span className="text-slate-500">{item.tempMin}°</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* BOTTOM CONTROL BAR */}
                <div className="flex justify-between items-center bg-black/30 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/5 flex-initial shadow-inner">
                    <button onClick={() => setIsLeftSidebarOpen(true)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Blocks className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 bg-gradient-to-tr from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all border border-white/20">
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button onClick={() => setIsRightSidebarOpen(true)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Sidebar Overlays */}
            <WeatherSidebar data={data} isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} />
            <MetricsSidebar data={data} isOpen={isLeftSidebarOpen} onClose={() => setIsLeftSidebarOpen(false)} />
        </div>
    );
};

export default WeatherDashboard;