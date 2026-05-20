// api/weather.ts
import axios from 'axios';

const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';
const API_KEY = "a55c41c630554c03a44122859261905" // Or replace safely with your string key

/**
 * Fetches current weather, air quality, astronomy, and 7-day forecast data
 * @param query City name, postal code, or lat/long coordinates (e.g., "Kashipur")
 */
export const fetchWeatherData = async (query: string) => {
    try {
        if (!API_KEY) {
            throw new Error("WeatherAPI Key is missing. Check your environment variables.");
        }

        const response = await axios.get(`${WEATHER_API_BASE}/forecast.json`, {
            params: {
                key: API_KEY,
                q: query,
                days: 7,
                aqi: 'yes', // Enables the air_quality data blocks
                alerts: 'no'
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching data from WeatherAPI:", error);
        throw error;
    }
};