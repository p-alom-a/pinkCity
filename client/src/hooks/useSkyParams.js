import { useWeather } from './useWeather'

const defaultParams = {
  distance: 1000,
  sunPosition: [0, 0.6, 0],
  inclination: 0.1,
  azimuth: 0.25,
  turbidity: 12,
  rayleigh: 2.5,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  exposure: 0.9
}

// Fonction pour calculer la position du soleil en fonction de l'heure
const getSunPosition = (hour) => {
  // À midi (12h), angle = 0 (zénith) ; à minuit (0h/24h), angle = π (nadir)
  const angle = ((hour - 6) / 12) * Math.PI // 6h = lever, 18h = coucher

  const x = Math.cos(angle)
  const y = Math.sin(angle)
  const adjustedY = Math.max(0, y) // Ne jamais passer sous l'horizon

  return [x, adjustedY, 0]
}

// Fonction pour calculer l'intensité de la lumière en fonction de l'heure
const getLightIntensity = (hour) => {
  // Heures de lever et coucher du soleil (approximatives)
  const sunrise = 6
  const sunset = 18
  
  // Calculer l'intensité en fonction de l'heure
  if (hour >= sunrise && hour <= sunset) {
    // Journée
    const noon = (sunrise + sunset) / 2
    const distanceFromNoon = Math.abs(hour - noon)
    const maxIntensity = 1
    const minIntensity = 0.3
    
    // Intensité maximale à midi, diminue vers le lever/coucher
    return maxIntensity - (distanceFromNoon / (sunset - sunrise)) * (maxIntensity - minIntensity)
  } else {
    // Nuit
    return 0.1
  }
}

const skyConfigs = {
  thunderstorm: {
    distance: 1000,
    sunPosition: [0, 0.1, 0],
    inclination: 0.6,
    azimuth: 0.25,
    turbidity: 50,
    rayleigh: 6,
    mieCoefficient: 0.01,
    mieDirectionalG: 0.9,
    exposure: 0.3
  },
  drizzle: {
    distance: 1000,
    sunPosition: [0, 0.3, 0],
    inclination: 0.4,
    azimuth: 0.25,
    turbidity: 35,
    rayleigh: 4.5,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.85,
    exposure: 0.5
  },
  rain: {
    distance: 1000,
    sunPosition: [0, 0.2, 0],
    inclination: 0.5,
    azimuth: 0.25,
    turbidity: 40,
    rayleigh: 5,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.85,
    exposure: 0.4
  },
  snow: {
    distance: 1000,
    sunPosition: [0, 0.4, 0],
    inclination: 0.3,
    azimuth: 0.25,
    turbidity: 20,
    rayleigh: 3,
    mieCoefficient: 0.004,
    mieDirectionalG: 0.75,
    exposure: 0.8
  },
  atmosphere: {
    distance: 1000,
    sunPosition: [0, 0.2, 0],
    inclination: 0.5,
    azimuth: 0.25,
    turbidity: 60,
    rayleigh: 7,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.9,
    exposure: 0.2
  },
  clear: {
    distance: 1000,
    sunPosition: [0, 0.7, 0],
    inclination: 0.15,
    azimuth: 0.25,
    turbidity: 3, // Réduire la turbidité pour un ciel plus clair
    rayleigh: 0.1, // Réduire le coefficient de Rayleigh pour un bleu plus intense
    mieCoefficient: 0.00, // Réduire le coefficient de Mie pour moins de particules
    mieDirectionalG: 0.3,
    exposure: 1.1 // Ajuster l'exposition pour équilibrer la luminosité
  },
  
  clouds: {
    distance: 1000,
    sunPosition: [0, 0.5, 0],
    inclination: 0.2,
    azimuth: 0.25,
    turbidity: 25,
    rayleigh: 3.5,
    mieCoefficient: 0.006,
    mieDirectionalG: 0.8,
    exposure: 0.7
  }
}

const getWeatherType = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm'
  if (weatherId >= 300 && weatherId < 400) return 'drizzle'
  if (weatherId >= 500 && weatherId < 600) return 'rain'
  if (weatherId >= 600 && weatherId < 700) return 'snow'
  if (weatherId >= 700 && weatherId < 800) return 'atmosphere'
  if (weatherId === 800) return 'clear'
  if (weatherId > 800) return 'clouds'
  return 'default'
}

export const useSkyParams = () => {
  const { weather } = useWeather()
  
  const getSkyParams = () => {
    if (!weather?.weather?.[0]) {
      // console.log('Pas de données météo disponibles')
      return defaultParams
    }
    
    const weatherId = weather.weather[0].id
    const weatherType = getWeatherType(weatherId)
    
    // Obtenir l'heure actuelle
    const now = new Date()
    const hour = now.getHours() + now.getMinutes() / 60
    
    // Calculer la position et l'intensité du soleil
    const sunPosition = getSunPosition(hour)
    const sunY = sunPosition[1] // hauteur du soleil (0 = horizon, 1 = zénith)
    const lightIntensity = getLightIntensity(hour)
    
    // console.log(`Configuration du ciel: ${weatherType} (ID: ${weatherId})`)
    // console.log(`Heure: ${hour.toFixed(2)}h, Intensité lumière: ${lightIntensity.toFixed(2)}`)
    
    // Obtenir la configuration de base
    const baseConfig = skyConfigs[weatherType] || defaultParams
    
    // Paramètres dynamiques selon la hauteur du soleil
    let exposure = baseConfig.exposure * (0.7 + sunY * 0.5)
    let turbidity = baseConfig.turbidity + (1 - sunY) * 10 // plus de turbidité quand le soleil est bas
    let rayleigh = baseConfig.rayleigh + (1 - sunY) * 2 // plus de diffusion Rayleigh à l'aube/crépuscule

    // Clamp pour éviter les valeurs extrêmes
    exposure = Math.max(0.1, Math.min(2, exposure))
    turbidity = Math.max(1, Math.min(60, turbidity))
    rayleigh = Math.max(0, Math.min(10, rayleigh))

    // Ajuster la configuration avec la position du soleil et l'intensité
    return {
      ...baseConfig,
      sunPosition,
      exposure,
      turbidity,
      rayleigh
    }
  }
  
  return getSkyParams()
}