import type { ModelForecast } from '../types'
import { groupByDay, calculateGolfScore, weatherEmoji, getHourlyAt } from '../utils'
import { WEATHER_MODELS } from '../weatherApi'

interface Props {
  forecasts: ModelForecast[]
  date: string
}

const PLAY_HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

export default function WeatherPanel({ forecasts, date }: Props) {
  if (forecasts.length === 0) return null

  // 日別データ抽出
  const byModel = forecasts.map((f) => ({
    ...f,
    dayHourly: groupByDay(f.hourly)[date] ?? [],
  }))

  return (
    <div className="space-y-3">
      {/* モデル別スコアサマリー */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {byModel.map((m) => {
          const score = calculateGolfScore(m.dayHourly)
          return (
            <div key={m.model} className={`rounded-xl p-3 border-2 ${m.borderColor} bg-white`}>
              <div className={`text-xs font-bold mb-1 ${m.textColor}`}>{m.modelName}</div>
              <div className={`inline-block px-2 py-0.5 rounded-full text-sm font-bold ${score.bg} ${score.text}`}>
                {score.label} {score.score}
              </div>
              <div className="text-xs text-gray-500 mt-1">{WEATHER_MODELS.find(w => w.model === m.model)?.description}</div>
            </div>
          )
        })}
      </div>

      {/* 時間別比較テーブル */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 py-2 text-gray-500 font-medium w-14">時刻</th>
              {byModel.map((m) => (
                <th key={m.model} className={`px-2 py-2 text-center font-bold ${m.textColor}`}>
                  {m.modelName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLAY_HOURS.map((hour, idx) => {
              const cells = byModel.map((m) => getHourlyAt(m.dayHourly, date, hour))
              return (
                <tr key={hour} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-3 py-2 font-mono text-gray-600 text-xs">{hour}:00</td>
                  {cells.map((h, i) =>
                    h ? (
                      <td key={i} className="px-2 py-2 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span>{weatherEmoji(h.weather_code)}</span>
                          <span className="font-bold text-gray-800">{h.temperature_2m.toFixed(0)}°</span>
                          <span className="text-blue-600">💧{h.precipitation_probability}%</span>
                          <span className="text-gray-500">💨{h.wind_speed_10m.toFixed(1)}</span>
                        </div>
                      </td>
                    ) : (
                      <td key={i} className="px-2 py-2 text-center text-gray-300">−</td>
                    )
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 text-right">💨 風速: m/s　　データ: Open-Meteo (CC BY 4.0)</p>
    </div>
  )
}
