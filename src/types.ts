export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  country_code: string
  admin1?: string
  admin2?: string
}

export interface HourlyData {
  time: string
  temperature_2m: number
  precipitation_probability: number
  precipitation: number
  wind_speed_10m: number
  wind_direction_10m: number
  uv_index: number
  weather_code: number
}

export interface ModelForecast {
  model: string
  modelName: string
  color: string
  textColor: string
  hourly: HourlyData[]
}

export interface WeatherModel {
  model: string
  name: string
  color: string
  textColor: string
  description: string
}
