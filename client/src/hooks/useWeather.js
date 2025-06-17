import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/api';
import { formatWeatherData } from '../utils/weatherUtils';

export const useWeather = (city = 'Toulouse') => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchWeather(city);
        const formattedData = formatWeatherData(data);
        setWeather(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, [city]);

  return { weather, loading, error };
}; 