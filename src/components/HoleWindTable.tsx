import type { GolfHole, ModelForecast } from '../types'
import { getWindEffect, windStrengthLabel, windDirectionLabel, groupByDay, getHourlyAt } from '../utils'

interface Props {
  holes: GolfHole[]
  forecasts: ModelForecast[]
  date: string
}

// プレー時間帯の代表時刻
const TIME_SLOTS = [
  { label: '早朝 6時', hour: 6 },
  { label: '午前 9時', hour: 9 },
  { label: '昼　12時', hour: 12 },
  { label: '午後 15時', hour: 15 },
]

const EFFECT_STYLE: Record<string, string> = {
  follow: 'bg-green-100 text-green-800',
  against: 'bg-red-100 text-red-800',
  'cross-left': 'bg-yellow-100 text-yellow-800',
  'cross-right': 'bg-blue-100 text-blue-800',
}

export default function HoleWindTable({ holes, forecasts, date }: Props) {
  if (holes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-400">
        <div className="text-2xl mb-2">🗺️</div>
        <div className="text-sm">このコースのホールデータはOpenStreetMapに未登録です。</div>
        <div className="text-xs mt-1">OSMへの登録にご協力いただけると表示されます。</div>
      </div>
    )
  }

  // 最初のモデル（JMA）を代表として使う
  const primary = forecasts.find((f) => f.model === 'jma_seamless') ?? forecasts[0]
  const dayHourly = groupByDay(primary.hourly)[date] ?? []

  const holesWithDir = holes.filter((h) => h.direction !== undefined)
  if (holesWithDir.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-400">
        <div className="text-sm">ティーまたはグリーンの座標が不足しているため方向が計算できません。</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        ↓フォロー（追い風）　↑アゲインスト（向かい風）　←→横風　　風向きは気象庁モデル(JMA)使用
      </p>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 py-2 text-gray-500 font-medium w-16">ホール</th>
              <th className="text-left px-3 py-2 text-gray-500 font-medium w-20">方向</th>
              {TIME_SLOTS.map((ts) => (
                <th key={ts.hour} className="px-2 py-2 text-center text-gray-500 font-medium">
                  {ts.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holesWithDir.map((hole, idx) => (
              <tr key={hole.number} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="px-3 py-2.5">
                  <span className="font-bold text-gray-800">{hole.number}番</span>
                </td>
                <td className="px-3 py-2.5 text-xs text-gray-500">
                  {directionLabel(hole.direction!)}
                </td>
                {TIME_SLOTS.map((ts) => {
                  const h = getHourlyAt(dayHourly, date, ts.hour)
                  if (!h) return <td key={ts.hour} className="px-2 py-2.5 text-center text-gray-300">−</td>
                  const effect = getWindEffect(h.wind_direction_10m, hole.direction!)
                  const strength = windStrengthLabel(h.wind_speed_10m)
                  return (
                    <td key={ts.hour} className="px-2 py-2.5 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${EFFECT_STYLE[effect.type]}`}
                        >
                          {effect.emoji} {effect.label}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {windDirectionLabel(h.wind_direction_10m)} {h.wind_speed_10m.toFixed(1)}m/s
                        </span>
                        <span className="text-gray-400 text-xs">{strength}</span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-right">
        ホールデータ: OpenStreetMap contributors (ODbL)
      </p>
    </div>
  )
}

/** 方位角を矢印＋方角で表示 */
function directionLabel(deg: number): string {
  const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖']
  const dirs = ['北', '北東', '東', '南東', '南', '南西', '西', '北西']
  const idx = Math.round(deg / 45) % 8
  return `${arrows[idx]} ${dirs[idx]}`
}
