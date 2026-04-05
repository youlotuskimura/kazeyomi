import type { HourlyData, WindEffect, GolfScore } from './types'

// ========================
// 方位・風向き計算
// ========================

/** 2点間の方位角を返す（0-360°、北=0、時計回り） */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const lat1Rad = (lat1 * Math.PI) / 180
  const lat2Rad = (lat2 * Math.PI) / 180
  const y = Math.sin(dLon) * Math.cos(lat2Rad)
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

/**
 * ホールに対する風の影響を判定
 * @param windFromDeg 風向き（気象：どこから吹いてくるか）
 * @param holeDirDeg  ホール方向（ティー→グリーン）
 */
export function getWindEffect(windFromDeg: number, holeDirDeg: number): WindEffect {
  // 風が吹いていく方向（「から」→「へ」に変換）
  const windToDeg = (windFromDeg + 180) % 360
  // ホール方向との差（-180〜+180）
  const diff = ((windToDeg - holeDirDeg + 540) % 360) - 180

  const angle = Math.abs(diff)

  if (angle <= 45) return { type: 'follow', label: 'フォロー', emoji: '↓', angle }
  if (angle >= 135) return { type: 'against', label: 'アゲインスト', emoji: '↑', angle }
  if (diff > 0) return { type: 'cross-right', label: '右横風', emoji: '→', angle }
  return { type: 'cross-left', label: '左横風', emoji: '←', angle }
}

/** 風速を強さラベルに変換 */
export function windStrengthLabel(speed: number): string {
  if (speed < 3) return '微風'
  if (speed < 6) return '軽風'
  if (speed < 9) return '並風'
  if (speed < 12) return '強風'
  return '暴風'
}

/** 風向きを16方位で表示 */
export function windDirectionLabel(deg: number): string {
  const dirs = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東',
                '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西']
  return dirs[Math.round(deg / 22.5) % 16]
}

// ========================
// ゴルフ適性スコア
// ========================

/** 7:00〜17:00 の時間帯のゴルフ適性スコアを計算（0-100） */
export function calculateGolfScore(hourly: HourlyData[]): GolfScore {
  const playing = hourly.filter((h) => {
    const hour = parseInt(h.time.split('T')[1])
    return hour >= 7 && hour <= 17
  })
  if (playing.length === 0) return { score: 0, label: '−', bg: 'bg-gray-100', text: 'text-gray-500' }

  const scores = playing.map((h) => {
    let s = 100
    // 降水確率
    if (h.precipitation_probability >= 70) s -= 45
    else if (h.precipitation_probability >= 40) s -= 25
    else if (h.precipitation_probability >= 20) s -= 10
    // 風速 (m/s)
    if (h.wind_speed_10m >= 15) s -= 35
    else if (h.wind_speed_10m >= 10) s -= 20
    else if (h.wind_speed_10m >= 7) s -= 8
    // 気温
    if (h.temperature_2m < 5 || h.temperature_2m > 36) s -= 25
    else if (h.temperature_2m < 10 || h.temperature_2m > 32) s -= 10
    return Math.max(0, s)
  })

  const score = Math.round(scores.reduce((a, b) => a + b) / scores.length)
  return scoreToLabel(score)
}

function scoreToLabel(score: number): GolfScore {
  if (score >= 80) return { score, label: '絶好', bg: 'bg-green-100', text: 'text-green-800' }
  if (score >= 60) return { score, label: '良好', bg: 'bg-blue-100', text: 'text-blue-800' }
  if (score >= 40) return { score, label: '普通', bg: 'bg-yellow-100', text: 'text-yellow-800' }
  if (score >= 20) return { score, label: '注意', bg: 'bg-orange-100', text: 'text-orange-800' }
  return { score, label: '不良', bg: 'bg-red-100', text: 'text-red-800' }
}

// ========================
// 天気コード
// ========================

export function weatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 49) return '🌫️'
  if (code <= 59) return '🌦️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '❄️'
  if (code <= 82) return '🌧️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

// ========================
// 日付フォーマット
// ========================

const DAYS_JA = ['日', '月', '火', '水', '木', '金', '土']

export function formatDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`)
  return {
    short: `${d.getMonth() + 1}/${d.getDate()}`,
    long: `${d.getMonth() + 1}月${d.getDate()}日`,
    dow: DAYS_JA[d.getDay()],
    isWeekend: d.getDay() === 0 || d.getDay() === 6,
  }
}

export function isToday(dateStr: string): boolean {
  return new Date().toLocaleDateString('sv') === dateStr
}

/** HourlyData[] を日付ごとにグループ化 */
export function groupByDay(hourly: HourlyData[]): Record<string, HourlyData[]> {
  return hourly.reduce(
    (acc, h) => {
      const day = h.time.split('T')[0]
      ;(acc[day] ??= []).push(h)
      return acc
    },
    {} as Record<string, HourlyData[]>,
  )
}

/** 特定の日・時刻に最も近い HourlyData を返す */
export function getHourlyAt(hourly: HourlyData[], date: string, hour: number): HourlyData | undefined {
  const target = `${date}T${String(hour).padStart(2, '0')}:00`
  return hourly.find((h) => h.time === target)
}
