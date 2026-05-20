import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { WeatherDashboard } from '../components/hero'
import { fetchWeatherData } from '../api/weather'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);
  
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Initializing...');

  useEffect(() => {
  async function loadWeather(query: string) {
    try {
      setLoading(true);

      const data = await fetchWeatherData(query);

      setWeatherData(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch atmospheric tracking data.');
    } finally {
      setLoading(false);
    }
  }

  if (!navigator.geolocation) {
    setStatusMessage('Geolocation is not supported on this device.');
    return;
  }

  setStatusMessage('Waiting for location permission...');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      setStatusMessage('Fetching weather from your location...');

      loadWeather(`${lat},${lon}`);
    },

    (geoError) => {
      console.warn(geoError);

      // KEEP LOADING
      setLoading(true);

      if (geoError.code === geoError.PERMISSION_DENIED) {
        setStatusMessage('Please allow location access to continue...');
      } else {
        setStatusMessage('Unable to get your location...');
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0b0813] flex flex-col items-center justify-center text-slate-400 font-sans gap-3">
        <span className="text-center w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="animate-pulse tracking-widest text-[10px] font-bold uppercase text-purple-400">
          {statusMessage}
        </span>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="h-screen w-screen bg-[#0b0813] flex items-center text-center justify-center text-red-400 font-sans text-xs">
        {error || 'No weather data found.'}
      </div>
    );
  }

  return (
    <WeatherDashboard 
      data={weatherData}
      isLeftSidebarOpen={isLeftSidebarOpen} 
      setIsLeftSidebarOpen={setIsLeftSidebarOpen} 
      isRightSidebarOpen={isRightSidebarOpen} 
      setIsRightSidebarOpen={setIsRightSidebarOpen} 
    />
  )
}