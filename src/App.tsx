import { useState } from 'react'
import type { GolfCourse, GolfHole, ModelForecast } from './types'
import { fetchAllForecasts } from './weatherApi'
import { fetchGolfHoles } from './osmApi'
import { groupByDay } from './utils'
import SearchBar from './components/SearchBar'
import DateSelector from './components/DateSelector'
import WeatherPanel from './components/WeatherPanel'
import HoleWindTable from './components/HoleWindTable'

type Tab = 'weather' | 'wind'

export default function App() {
  const [course, setCourse] = useState<GolfCourse | null>(null)
  const [holes, setHoles] = useState<GolfHole[]>([])
  const [forecasts, setForecasts] = useState<ModelForecast[]>([])
  const [dates, setDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [tab, setTab] = useState<Tab>('weather')
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [loadingHoles, setLoadingHoles] = useState(false)
  const [error, setError] = useState('')

  async function handleCourseSelect(c: GolfCourse) {
    setCourse(c)
    setForecasts([])
    setHoles([])
    setError('')
    setTab('weather')
    setLoadingWeather(true)
    setLoadingHoles(true)

    fetchAllForecasts(c.lat, c.lon)
      .then((data) => {
        setForecasts(data)
        const allDays = Object.keys(groupByDay(data[0].hourly)).sort()
        setDates(allDays)
        setSelectedDate(allDays[0] ?? '')
      })
      .catch(() => setError('天気データの取得に失敗しました。'))
      .finally(() => setLoadingWeather(false))

    fetchGolfHoles(c)
      .then(setHoles)
      .catch(() => {})
      .finally(() => setLoadingHoles(false))
  }

  const holeCount = holes.filter((h) => h.direction !== undefined).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="text-2xl">⛳</div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight tracking-tight">風読み</h1>
            <p className="text-xs text-gray-400">4モデル天気比較 × ホール別風向き</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        <SearchBar onSelect={handleCourseSelect} />

        {!course && !loadingWeather && (
          <div className="text-center py-16 text-gray-400 space-y-2">
            <div className="text-5xl">🏌️</div>
            <p className="font-medium">ゴルフ場を検索して<br />プレー日の天気を分析</p>
            <p className="text-xs mt-3 text-gray-300">
              気象庁 · ECMWF · GFS · ICONの4モデルを同時比較
            </p>
          </div>
        )}

        {loadingWeather && (
          <div className="text-center py-12">
            <div className="text-3xl mb-2 animate-bounce">⛳</div>
            <p className="text-sm text-gray-500">天気データ取得中…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        {course && !loadingWeather && forecasts.length > 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-start gap-3 shadow-sm">
              <span className="text-xl mt-0.5">📍</span>
              <div className="min-w-0">
                <div className="font-bold text-gray-900 truncate">{course.name}</div>
                <div className="text-xs text-gray-400 mt-0.5 flex flex-wrap gap-x-3">
                  {course.address && <span>{course.address}</span>}
                  <span>{course.lat.toFixed(3)}°N {course.lon.toFixed(3)}°E</span>
                  {!loadingHoles && (
                    <span className={holeCount > 0 ? 'text-green-600 font-medium' : ''}>
                      {holeCount > 0 ? `🏌️ ${holeCount}H分析可` : 'ホールデータなし'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <DateSelector dates={dates} selected={selectedDate} onSelect={setSelectedDate} />

            <div className="flex border-b border-gray-200 gap-1">
              {([['weather', '☁️ 天気比較'], ['wind', '💨 ホール風向き']] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    tab === key
                      ? 'border-green-500 text-green-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                  {key === 'wind' && holeCount > 0 && (
                    <span className="ml-1 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">
                      {holeCount}H
                    </span>
                  )}
                </button>
              ))}
            </div>

            {tab === 'weather' && <WeatherPanel forecasts={forecasts} date={selectedDate} />}
            {tab === 'wind' && <HoleWindTable holes={holes} forecasts={forecasts} date={selectedDate} />}
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-300 py-8 border-t border-gray-100 mt-8 px-4">
        天気:{' '}
        <a href="https://open-meteo.com/" className="underline" target="_blank" rel="noopener noreferrer">Open-Meteo</a>{' '}
        (CC BY 4.0)　地図:{' '}
        <a href="https://www.openstreetmap.org/" className="underline" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>{' '}
        contributors (ODbL)
      </footer>
    </div>
  )
}
