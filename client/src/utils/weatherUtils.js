// Mapping des conditions météo
export const getWeatherCondition = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
  if (weatherId >= 300 && weatherId < 400) return 'drizzle';
  if (weatherId >= 500 && weatherId < 600) return 'rain';
  if (weatherId >= 600 && weatherId < 700) return 'snow';
  if (weatherId >= 700 && weatherId < 800) return 'atmosphere';
  if (weatherId === 800) return 'clear';
  if (weatherId > 800) return 'clouds';
  return 'unknown';
};

// Formatage des données météo
export const formatWeatherData = (data) => {
  if (!data || !data.weather || !data.weather[0]) {
    throw new Error('Données météo invalides');
  }

  return {
    ...data,
    condition: getWeatherCondition(data.weather[0].id),
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed
  };
}; 