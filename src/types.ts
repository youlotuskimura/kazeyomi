// ゴルフ場
export interface GolfCourse {
  id: number
  type: 'way' | 'relation'
  name: string
  lat: number
  lon: number
  bounds: { minlat: number; minlon: number; maxlat: number; maxlon: number }
  address?: string
}

// ホール情報
export interface GolfHole {
  number: number
  tee?: { lat: number; lon: number }
  green?: { lat: number; lon: number }
  direction?: number // ティー→グリーンの方位角 (0-360°)
}

// 風の影響
export type WindEffectType = 'follow' | 'against' | 'cross-left' | 'cross-right'

export interface WindEffect {
  type: WindEffectType
  label: string      // フォロー / アゲインスト / 左横風 / 右横風
  emoji: string
  angle: number      // 0=追い風, 180=向かい風
}

// 気象データ（1時間毎）
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

// 予報モデル別データ
export interface ModelForecast {
  model: string
  modelName: string
  color: string       // tailwind bg class
  textColor: string   // tailwind text class
  borderColor: string // tailwind border class
  hourly: HourlyData[]
}

export interface WeatherModel {
  model: string
  name: string
  color: string
  textColor: string
  borderColor: string
  description: string
}

// ゴルフ適性スコア
export interface GolfScore {
  score: number    // 0-100
  label: string    // 絶好/良好/普通/注意/不良
  bg: string
  text: string
}
