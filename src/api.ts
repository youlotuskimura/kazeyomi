import type { GeocodingResult, ModelForecast, HourlyData, WeatherModel } from './types'

export const WEATHER_MODELS: WeatherModel[] = [
  {
    model: 'jma_seamless',
    name: '気象庁 JMA',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    description: '日本気象庁モデル',
  },
  {
    model: 'ecmwf_ifs04',
    name: 'ECMWF',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    description: '欧州中期予報センター',
  },
  {
    model: 'gfs_seamless',
    name: 'GFS (NOAA)',
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
    description: '米国NOAAモデル',
  },
  {
    model: 'icon_seamless',
    name: 'ICON',
    color: 'bg-violet-500',
    textColor: 'text-violet-600',
    description: 'ドイツ気象局モデル',
  },
]

export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) return []
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=ja&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('位置情報の検索に失敗しました')
  const data = await res.json()
  return (data.results as GeocodingResult[]) || []
}

const HOURLY_PARAMS = [
  'temperature_2m',
  'precipitation_probability',
  'precipitation',
  'wind_speed_10m',
  'wind_direction_10m',
  'uv_index',
  'weather_code',
].join(',')

async function fetchModelForecast(
  lat: number,
  lon: number,
  model: WeatherModel,
): Promise<ModelForecast> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&hourly=${HOURLY_PARAMS}` +
    `&models=${model.model}` +
    `&timezone=Asia%2FTokyo` +
    `&forecast_days=7`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`${model.name}のデータ取得に失敗しました`)
  const data = await res.json()

  const times: string[] = data.hourly.time
  const hourly: HourlyData[] = times.map((time, i) => ({
    time,
    temperature_2m: data.hourly.temperature_2m[i] ?? 0,
    precipitation_probability: data.hourly.precipitation_probability?.[i] ?? 0,
    precipitation: data.hourly.precipitation[i] ?? 0,
    wind_speed_10m: data.hourly.wind_speed_10m[i] ?? 0,
    wind_direction_10m: data.hourly.wind_direction_10m[i] ?? 0,
    uv_index: data.hourly.uv_index?.[i] ?? 0,
    weather_code: data.hourly.weather_code[i] ?? 0,
  }))

  return {
    model: model.model,
    modelName: model.name,
    color: model.color,
    textColor: model.textColor,
    hourly,
  }
}

export async function fetchAllForecasts(
  lat: number,
  lon: number,
): Promise<ModelForecast[]> {
  return Promise.all(WEATHER_MODELS.map((m) => fetchModelForecast(lat, lon, m)))
}
