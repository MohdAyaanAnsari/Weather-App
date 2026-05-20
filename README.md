# 🌤️ Atmosphere — Weather Dashboard

A cinematic, real-time weather dashboard built with **TanStack Start**, **React**, and **Tailwind CSS**. Fetches live weather data via the [WeatherAPI](https://www.weatherapi.com/) and presents it in a premium glassmorphism UI with animated icons, hourly/weekly forecasts, air quality metrics, and multi-city lookup.
---

## 📸 Screenshots

<img width="2560" height="1600" alt="localhost_3000_(Nest Hub Max)" src="https://github.com/user-attachments/assets/837edf5f-aba1-4df3-8e7a-2abf1843407c" />
<img width="2560" height="1600" alt="localhost_3000_(Nest Hub Max)" src="https://github.com/user-attachments/assets/ab565421-f7e8-4feb-8f96-ba95ac2e3140" />
<img width="2560" height="1600" alt="localhost_3000_(Nest Hub Max)" src="https://github.com/user-attachments/assets/dbd73a63-7489-44b1-a15e-7e5347d551aa" />
<table>
  <tr>
    <td width="33.33%"><img width="100%" alt="Mobile View 1" src="https://github.com/user-attachments/assets/586fc4f1-70f8-40d5-a187-1c6278eb4aa7" /></td>
    <td width="33.33%"><img width="100%" alt="Mobile View 2" src="https://github.com/user-attachments/assets/ffb013fa-0d9b-4183-9be9-81e88517c6b0" /></td>
    <td width="33.33%"><img width="100%" alt="Mobile View 3" src="https://github.com/user-attachments/assets/d2e9123b-1d67-4aef-bee7-d92fdf70b771" /></td>
  </tr>
</table>
---

## ✨ Features

- **Auto-location detection** — Uses the browser Geolocation API to load weather for the user's current coordinates on first visit
- **Current conditions** — Temperature, feels-like, wind speed, humidity, visibility, and UV index
- **24-hour timeline** — Scrollable hourly forecast with precipitation chance indicators
- **7-day forecast** — Daily high/low with animated condition icons
- **Left Sidebar — Metrics Drawer**
  - Air Quality Index (US-EPA scale) with PM2.5, PM10, O₃ readings
  - UV Index gauge
  - Sunrise & sunset with arc visualisation
  - Wind compass with live bearing
  - Precipitation and humidity panel
- **Right Sidebar — Locations Drawer**
  - Pinned city cards auto-loaded on open (Bengaluru, Chennai, Delhi by default)
  - Live city search with Enter-key or button submit
- **Glassmorphism design** — Deep-space dark theme with ambient bloom gradients, backdrop blur, and smooth drawer transitions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (file-based SSR routing) |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| Icons | [Lucide React](https://lucide.dev/) |
| HTTP | Axios |
| Weather Data | [WeatherAPI.com](https://www.weatherapi.com/) |

---

## 📁 Project Structure

```
src/
├── api/
│   └── weather.ts          # WeatherAPI fetch helper (forecast + AQI)
├── components/
│   ├── hero.tsx             # Main WeatherDashboard component
│   ├── LeftSidebar.tsx      # Metrics drawer (AQI, UV, wind, etc.)
│   └── RightSidebar.tsx     # Locations drawer (search + pinned cities)
└── routes/
    ├── __root.tsx           # TanStack root shell with theme init script
    ├── index.tsx            # Home route — geolocation + data fetching
    └── about.tsx            # About page
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A free [WeatherAPI](https://www.weatherapi.com/) key

### Installation

```bash
git clone https://github.com/your-username/atmosphere.git
cd atmosphere
npm install
```

### Configuration

Open `src/api/weather.ts` and replace the API key, or set it via an environment variable:

```ts
// src/api/weather.ts
const API_KEY = process.env.WEATHER_API_KEY ?? "your_api_key_here";
```

> ⚠️ **Never commit a real API key to source control.** Move the key to a `.env` file and add `.env` to `.gitignore`.

```env
# .env
WEATHER_API_KEY=your_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Grant location permission when prompted — the dashboard will auto-load weather for your coordinates.

### Production Build

```bash
npm run build
npm run start
```

---

## 🔑 API Reference

All weather data is sourced from the [WeatherAPI Forecast endpoint](https://www.weatherapi.com/docs/):

```
GET https://api.weatherapi.com/v1/forecast.json
  ?key=YOUR_KEY
  &q={city | lat,lon}
  &days=7
  &aqi=yes
```

Response fields used:

- `location` — name, country, localtime
- `current` — temp_c, feelslike_c, humidity, wind_kph, wind_dir, wind_degree, vis_km, uv, precip_mm, condition, air_quality
- `forecast.forecastday[].hour[]` — hourly temp and precipitation chance
- `forecast.forecastday[].day` — daily high/low and condition
- `forecast.forecastday[0].astro` — sunrise and sunset times

---

