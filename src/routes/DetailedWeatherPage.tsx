import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  ArrowLeft,
  MapPin,
  Clock3,
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  CloudRain,
  Cloud,
  Umbrella,
  Waves,
  Activity,
  ShieldAlert,
  Navigation,
  Snowflake,
  CloudSun,
  Loader2,
  AlertCircle,
} from 'lucide-react';

/* =========================================================
   ROUTE
========================================================= */

export const Route = createFileRoute('/DetailedWeatherPage')({
  validateSearch: (search: Record<string, unknown>) => ({
    location:
      typeof search.location === 'string'
        ? search.location
        : '',
  }),
  component: DetailedWeatherPage,
});

/* =========================================================
   HELPERS
========================================================= */

const API_KEY =
  import.meta.env.VITE_WEATHER_API_KEY ||
  'a55c41c630554c03a44122859261905';

const mapConditionIcon = (
  condition = '',
  isDay = 1,
  size = 'w-7 h-7'
) => {
  const text = condition.toLowerCase();

  if (
    text.includes('thunder') ||
    text.includes('lightning')
  ) {
    return (
      <CloudRain
        className={`${size} text-purple-300`}
      />
    );
  }

  if (
    text.includes('rain') ||
    text.includes('drizzle') ||
    text.includes('shower')
  ) {
    return (
      <CloudRain
        className={`${size} text-cyan-300`}
      />
    );
  }

  if (
    text.includes('cloud') ||
    text.includes('overcast')
  ) {
    return isDay ? (
      <CloudSun
        className={`${size} text-amber-200`}
      />
    ) : (
      <Cloud
        className={`${size} text-indigo-200`}
      />
    );
  }

  if (
    text.includes('mist') ||
    text.includes('fog')
  ) {
    return (
      <Cloud
        className={`${size} text-slate-300`}
      />
    );
  }

  return (
    <Sun
      className={`${size} text-amber-300`}
    />
  );
};

const formatHour = (time: string) => {
  if (!time) return '--';

  return new Date(time).toLocaleTimeString([], {
    hour: 'numeric',
    hour12: true,
  });
};

const formatDate = (date: string) => {
  if (!date) return '--';

  return new Date(date).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }
  );
};

const getAqiLabel = (index: number) => {
  switch (index) {
    case 1:
      return 'Good';
    case 2:
      return 'Moderate';
    case 3:
      return 'Unhealthy for sensitive groups';
    case 4:
      return 'Unhealthy';
    case 5:
      return 'Very Unhealthy';
    case 6:
      return 'Hazardous';
    default:
      return 'Unknown';
  }
};

const getUvLabel = (uv: number) => {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';

  return 'Extreme';
};

/* =========================================================
   METRIC CARD
========================================================= */

const MetricCard = ({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition-all hover:bg-white/[0.055]">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {icon}
        {label}
      </div>

      <div className="mt-3">
        <p className="text-2xl font-light text-white">
          {value}
        </p>

        {description && (
          <p className="mt-1 text-[11px] text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

function DetailedWeatherPage() {
  const navigate = useNavigate();

  const { location: searchedLocation } =
    Route.useSearch();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  /* =====================================================
     FETCH WEATHER
  ===================================================== */

  useEffect(() => {
    if (!searchedLocation) {
      setError('No location was provided.');
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json`,
          {
            params: {
              key: API_KEY,
              q: searchedLocation,
              days: 7,
              aqi: 'yes',
              alerts: 'yes',
            },
          }
        );

        setData(response.data);
      } catch (err) {
        console.error(
          'Failed to fetch detailed weather:',
          err
        );

        setError(
          'Unable to load weather data for this location.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [searchedLocation]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0813] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-white">
              Loading weather
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Fetching weather data for{' '}
              {searchedLocation || 'location'}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0813] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            Weather unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error ||
              'Something went wrong while loading the weather.'}
          </p>

          <button
            onClick={() => navigate({ to: '/' })}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Weather
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     WEATHER DATA
  ===================================================== */

  const location = data?.location;
  const current = data?.current;
  const forecastDays =
    data?.forecast?.forecastday || [];

  const today = forecastDays[0];
  const astro = today?.astro;

  const airQuality = current?.air_quality;

  const hourlyForecast = forecastDays.flatMap(
    (day: any) => day?.hour || []
  );

  const currentTemp = Math.round(
    current?.temp_c ?? 0
  );

  const currentCondition =
    current?.condition?.text || 'Unknown';

  const aqiIndex =
    airQuality?.['us-epa-index'] ?? 0;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#0b0813] font-sans antialiased text-slate-100">

      {/* =================================================
          ATMOSPHERIC BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[150px]" />

        <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]" />

        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[130px]" />

        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-[0.015] [background-size:20px_20px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-6 flex items-center justify-between">

          <button
            onClick={() => navigate({ to: '/' })}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 transition-all hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-4 w-4 text-slate-400 transition-colors group-hover:text-white" />

            <span className="text-xs font-medium text-slate-300">
              Back
            </span>
          </button>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Weather Report
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Updated{' '}
              {current?.last_updated || '--'}
            </p>
          </div>

        </header>

        {/* =================================================
            LOCATION HEADER
        ================================================= */}

        <section className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2 text-purple-400">
              <MapPin className="h-4 w-4" />

              <span className="text-xs font-semibold">
                {location?.region ||
                  location?.country ||
                  '--'}
              </span>
            </div>

            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
              {location?.name ||
                'Unknown Location'}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {location?.region}

              {location?.region &&
                location?.country
                ? ', '
                : ''}

              {location?.country}
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <Clock3 className="h-3.5 w-3.5 text-slate-500" />

              <span className="text-xs text-slate-300">
                {location?.localtime || '--'}
              </span>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Live
              </span>
            </div>

          </div>
        </section>

        {/* =================================================
            HERO WEATHER
        ================================================= */}

        <section className="relative mb-5 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent p-6 sm:p-8">

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-purple-500/15 blur-[90px]" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">

            <div>

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
                Current Conditions
              </p>

              <div className="mt-5 flex items-center gap-4">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05]">
                  {mapConditionIcon(
                    currentCondition,
                    current?.is_day,
                    'h-12 w-12'
                  )}
                </div>

                <div>

                  <p className="text-5xl font-extralight tracking-tighter text-white sm:text-7xl">
                    {currentTemp}

                    <span className="ml-1 align-top text-3xl text-slate-400 sm:text-4xl">
                      °C
                    </span>
                  </p>

                  <p className="mt-1 text-base text-slate-300 sm:text-lg">
                    {currentCondition}
                  </p>

                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">

                <span className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
                  Feels like{' '}
                  {Math.round(
                    current?.feelslike_c ?? 0
                  )}
                  °C
                </span>

                <span className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
                  High{' '}
                  {Math.round(
                    today?.day?.maxtemp_c ?? 0
                  )}
                  °
                </span>

                <span className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
                  Low{' '}
                  {Math.round(
                    today?.day?.mintemp_c ?? 0
                  )}
                  °
                </span>

              </div>
            </div>

            {/* MAIN WEATHER STATS */}

            <div className="grid min-w-[280px] grid-cols-2 gap-3">

              <MetricCard
                icon={
                  <Wind className="h-3.5 w-3.5" />
                }
                label="Wind"
                value={`${current?.wind_kph ?? 0} km/h`}
                description={`${current?.wind_dir ?? '--'} · ${current?.wind_degree ?? 0}°`}
              />

              <MetricCard
                icon={
                  <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                }
                label="Humidity"
                value={`${current?.humidity ?? 0}%`}
                description={`Cloud cover ${current?.cloud ?? 0}%`}
              />

              <MetricCard
                icon={
                  <Eye className="h-3.5 w-3.5 text-amber-400" />
                }
                label="Visibility"
                value={`${current?.vis_km ?? 0} km`}
                description={`${current?.vis_miles ?? 0} miles`}
              />

              <MetricCard
                icon={
                  <Gauge className="h-3.5 w-3.5 text-purple-400" />
                }
                label="Pressure"
                value={`${current?.pressure_mb ?? 0} mb`}
                description={`${current?.pressure_in ?? 0} inHg`}
              />

            </div>
          </div>
        </section>

        {/* =================================================
            DETAILED CONDITIONS
        ================================================= */}

        <section className="mb-5">

          <div className="mb-3">
            <h2 className="text-lg font-semibold text-white">
              Detailed Conditions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Everything currently measured at this location
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            <MetricCard
              icon={
                <Thermometer className="h-3.5 w-3.5 text-orange-300" />
              }
              label="Feels Like"
              value={`${current?.feelslike_c ?? 0}°C`}
            />

            <MetricCard
              icon={
                <Activity className="h-3.5 w-3.5 text-rose-300" />
              }
              label="Heat Index"
              value={`${current?.heatindex_c ?? 0}°C`}
            />

            <MetricCard
              icon={
                <Snowflake className="h-3.5 w-3.5 text-cyan-300" />
              }
              label="Wind Chill"
              value={`${current?.windchill_c ?? 0}°C`}
            />

            <MetricCard
              icon={
                <Waves className="h-3.5 w-3.5 text-blue-300" />
              }
              label="Dew Point"
              value={`${current?.dewpoint_c ?? 0}°C`}
            />

            <MetricCard
              icon={
                <Droplets className="h-3.5 w-3.5 text-cyan-300" />
              }
              label="Precipitation"
              value={`${current?.precip_mm ?? 0} mm`}
            />

            <MetricCard
              icon={
                <Wind className="h-3.5 w-3.5 text-slate-300" />
              }
              label="Wind Gust"
              value={`${current?.gust_kph ?? 0} km/h`}
            />

          </div>
        </section>

        {/* =================================================
            RAIN + UV
        ================================================= */}

        <section className="mb-5 grid gap-5 lg:grid-cols-2">

          {/* RAIN */}

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">

            <div className="mb-5 flex items-center gap-2">

              <Umbrella className="h-4 w-4 text-cyan-400" />

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Rain & Precipitation
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Current precipitation probability
                </p>
              </div>

            </div>

            <div className="flex items-end justify-between">

              <div>
                <p className="text-4xl font-light text-white">
                  {today?.day
                    ?.daily_chance_of_rain ?? 0}
                  %
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Chance of rain
                </p>
              </div>

              <div className="text-right">

                <p className="text-xl text-slate-200">
                  {current?.precip_mm ?? 0} mm
                </p>

                <p className="text-xs text-slate-500">
                  Current precipitation
                </p>

              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{
                  width: `${Math.min(
                    today?.day
                      ?.daily_chance_of_rain ?? 0,
                    100
                  )}%`,
                }}
              />

            </div>

            <div className="mt-3 flex justify-between text-[10px] text-slate-500">

              <span>
                Rain:{' '}
                {today?.day?.daily_will_it_rain
                  ? 'Expected'
                  : 'Not expected'}
              </span>

              <span>
                Snow:{' '}
                {today?.day?.daily_will_it_snow
                  ? 'Expected'
                  : 'Not expected'}
              </span>

            </div>
          </div>

          {/* UV */}

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">

            <div className="mb-5 flex items-center gap-2">

              <Sun className="h-4 w-4 text-amber-400" />

              <div>
                <h3 className="text-sm font-semibold text-white">
                  UV Exposure
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Current ultraviolet index
                </p>
              </div>

            </div>

            <div className="flex items-end justify-between">

              <div>

                <p className="text-4xl font-light text-white">
                  {current?.uv ?? 0}
                </p>

                <p className="mt-1 text-xs text-amber-300">
                  {getUvLabel(current?.uv ?? 0)}
                </p>

              </div>

              <div className="text-right">

                <p className="text-xl text-slate-200">
                  {current?.cloud ?? 0}%
                </p>

                <p className="text-xs text-slate-500">
                  Cloud cover
                </p>

              </div>

            </div>

            <div className="relative mt-5 h-2 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500">

              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-lg"
                style={{
                  left: `${Math.min(
                    ((current?.uv ?? 0) / 11) *
                      100,
                    100
                  )}%`,
                }}
              />

            </div>
          </div>
        </section>

        {/* =================================================
            AIR QUALITY
        ================================================= */}

        <section className="mb-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">

          <div className="mb-6 flex items-start justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <ShieldAlert className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-white">
                  Air Quality
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Atmospheric pollution measurements
                </p>
              </div>

            </div>

            <div className="text-right">

              <p className="text-2xl font-light text-white">
                {getAqiLabel(aqiIndex)}
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                US EPA Index: {aqiIndex || '--'}
              </p>

            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {[
              [
                'PM2.5',
                airQuality?.pm2_5,
                'µg/m³',
              ],
              [
                'PM10',
                airQuality?.pm10,
                'µg/m³',
              ],
              [
                'O₃',
                airQuality?.o3,
                'µg/m³',
              ],
              [
                'NO₂',
                airQuality?.no2,
                'µg/m³',
              ],
              [
                'SO₂',
                airQuality?.so2,
                'µg/m³',
              ],
              [
                'CO',
                airQuality?.co,
                'µg/m³',
              ],
            ].map(([label, value, unit]) => (
              <div
                key={String(label)}
                className="rounded-xl border border-white/5 bg-black/10 p-3"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {label}
                </p>

                <p className="mt-2 text-lg text-white">
                  {typeof value === 'number'
                    ? value.toFixed(1)
                    : '--'}
                </p>

                <p className="mt-0.5 text-[9px] text-slate-600">
                  {unit}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* =================================================
            HOURLY FORECAST
        ================================================= */}

        <section className="mb-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-base font-semibold text-white">
                Hourly Forecast
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Temperature, rain probability and conditions
              </p>
            </div>

            <span className="text-[10px] uppercase tracking-widest text-slate-500">
              7 Days
            </span>

          </div>

          <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">

            {hourlyForecast.map(
              (hour: any, index: number) => (
                <div
                  key={`${hour.time}-${index}`}
                  className="min-w-[100px] rounded-2xl border border-white/5 bg-white/[0.025] p-3.5 text-center transition-all hover:bg-white/[0.05]"
                >
                  <p className="text-[10px] font-medium text-slate-500">
                    {formatHour(hour.time)}
                  </p>

                  <div className="my-3 flex justify-center">
                    {mapConditionIcon(
                      hour?.condition?.text,
                      hour?.is_day,
                      'h-7 w-7'
                    )}
                  </div>

                  <p className="text-lg font-semibold text-white">
                    {Math.round(
                      hour?.temp_c ?? 0
                    )}
                    °
                  </p>

                  <p className="mt-1 text-[10px] text-cyan-400">
                    {hour?.chance_of_rain ?? 0}%
                    rain
                  </p>

                  <div className="mt-3 border-t border-white/5 pt-2">

                    <p className="text-[9px] text-slate-500">
                      Feels{' '}
                      {Math.round(
                        hour?.feelslike_c ?? 0
                      )}
                      °
                    </p>

                    <p className="mt-1 text-[9px] text-slate-500">
                      {hour?.wind_kph ?? 0} km/h
                    </p>

                  </div>
                </div>
              )
            )}

          </div>
        </section>

        {/* =================================================
            DAILY FORECAST
        ================================================= */}

        <section className="mb-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">

          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">
              Extended Forecast
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Daily weather outlook
            </p>
          </div>

          <div className="space-y-2">

            {forecastDays.map(
              (day: any, index: number) => (
                <div
                  key={day.date}
                  className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 rounded-xl border p-4 transition-all sm:grid-cols-[1.3fr_1fr_1fr_1fr] ${
                    index === 0
                      ? 'border-purple-500/20 bg-purple-500/10'
                      : 'border-white/5 bg-white/[0.015] hover:bg-white/[0.035]'
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div>
                      {mapConditionIcon(
                        day?.day?.condition?.text,
                        1,
                        'h-6 w-6'
                      )}
                    </div>

                    <div>

                      <p className="text-xs font-semibold text-white">
                        {index === 0
                          ? 'Today'
                          : new Date(
                              day.date
                            ).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'short',
                              }
                            )}
                      </p>

                      <p className="mt-0.5 hidden text-[10px] text-slate-500 sm:block">
                        {formatDate(day.date)}
                      </p>

                    </div>
                  </div>

                  <div className="hidden sm:block">

                    <p className="text-xs text-slate-400">
                      {day?.day?.condition?.text}
                    </p>

                    <p className="mt-1 text-[10px] text-cyan-400">
                      {day?.day
                        ?.daily_chance_of_rain ??
                        0}
                      % rain
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm font-semibold text-white">
                      {Math.round(
                        day?.day?.maxtemp_c ?? 0
                      )}
                      °
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                      High
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm font-semibold text-slate-400">
                      {Math.round(
                        day?.day?.mintemp_c ?? 0
                      )}
                      °
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-600">
                      Low
                    </p>

                  </div>

                </div>
              )
            )}

          </div>
        </section>

        {/* =================================================
            SUN + MOON
        ================================================= */}

        <section className="mb-5 grid gap-5 md:grid-cols-2">

          {/* SUN */}

          <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-amber-500/10 to-transparent p-5 sm:p-6">

            <div className="mb-6 flex items-center gap-2">

              <Sun className="h-4 w-4 text-amber-400" />

              <h2 className="text-base font-semibold text-white">
                Sun
              </h2>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                <Sunrise className="mb-3 h-4 w-4 text-orange-300" />

                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                  Sunrise
                </p>

                <p className="mt-1 text-xl text-white">
                  {astro?.sunrise || '--'}
                </p>

              </div>

              <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                <Sunset className="mb-3 h-4 w-4 text-purple-300" />

                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                  Sunset
                </p>

                <p className="mt-1 text-xl text-white">
                  {astro?.sunset || '--'}
                </p>

              </div>

            </div>
          </div>

          {/* MOON */}

          <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent p-5 sm:p-6">

            <div className="mb-6 flex items-center gap-2">

              <Moon className="h-4 w-4 text-indigo-300" />

              <h2 className="text-base font-semibold text-white">
                Moon
              </h2>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                <Moon className="mb-3 h-4 w-4 text-indigo-300" />

                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                  Phase
                </p>

                <p className="mt-1 text-base text-white">
                  {astro?.moon_phase || '--'}
                </p>

              </div>

              <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                <Activity className="mb-3 h-4 w-4 text-purple-300" />

                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                  Illumination
                </p>

                <p className="mt-1 text-xl text-white">
                  {astro?.moon_illumination ??
                    0}
                  %
                </p>

              </div>

              <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                <Clock3 className="mb-3 h-4 w-4 text-slate-400" />

                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                  Moonrise
                </p>

                <p className="mt-1 text-base text-white">
                  {astro?.moonrise || '--'}
                </p>

              </div>

              <div className="rounded-xl border border-white/5 bg-black/10 p-4">

                <Clock3 className="mb-3 h-4 w-4 text-slate-400" />

                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                  Moonset
                </p>

                <p className="mt-1 text-base text-white">
                  {astro?.moonset || '--'}
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            TODAY SUMMARY
        ================================================= */}

        {today?.day && (
          <section className="mb-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">

            <div className="mb-5 flex items-center gap-2">

              <Activity className="h-4 w-4 text-purple-400" />

              <div>
                <h2 className="text-base font-semibold text-white">
                  Today's Weather Summary
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Aggregated forecast information
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

              <MetricCard
                icon={
                  <Thermometer className="h-3.5 w-3.5" />
                }
                label="Average"
                value={`${today.day.avgtemp_c}°C`}
              />

              <MetricCard
                icon={
                  <Wind className="h-3.5 w-3.5" />
                }
                label="Max Wind"
                value={`${today.day.maxwind_kph} km/h`}
              />

              <MetricCard
                icon={
                  <CloudRain className="h-3.5 w-3.5" />
                }
                label="Rain"
                value={`${today.day.totalprecip_mm} mm`}
              />

              <MetricCard
                icon={
                  <Droplets className="h-3.5 w-3.5" />
                }
                label="Humidity"
                value={`${today.day.avghumidity}%`}
              />

              <MetricCard
                icon={
                  <Eye className="h-3.5 w-3.5" />
                }
                label="Visibility"
                value={`${today.day.avgvis_km} km`}
              />

              <MetricCard
                icon={
                  <Sun className="h-3.5 w-3.5" />
                }
                label="UV"
                value={`${today.day.uv}`}
              />

            </div>
          </section>
        )}

        {/* =================================================
            LOCATION DATA
        ================================================= */}

        <footer className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <Navigation className="h-3.5 w-3.5 text-purple-400" />

            <span className="text-xs text-slate-400">
              {location?.lat}° N,{' '}
              {location?.lon}° E
            </span>

          </div>

          <div className="text-[10px] text-slate-600">
            Timezone: {location?.tz_id || '--'}
          </div>

        </footer>

      </main>
    </div>
  );
}