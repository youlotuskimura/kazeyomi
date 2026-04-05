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

    // 天気とホールデータを並行取得
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
      .catch(() => {/* ホールなしは許容 */})
      .finally(() => setLoadingHoles(false))
  }

  const loading = loadingWeather || loadingHoles

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-3xl">⛳</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-tight">ゴルフ天気比較</h1>
            <p className="text-xs text-gray-500">複数の予報モデル × ホール別風向き</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* 検索 */}
        <div className="flex justify-center">
          <SearchBar onSelect={handleCourseSelect} />
        </div>

        {/* 初期状態 */}
        {!course && (
          <div className="text-center py-16 text-gray-400 space-y-3">
            <div className="text-5xl">🏌️</div>
            <p className="text-base">ゴルフ場名を入力して天気を確認しよう</p>
            <p className="text-xs">4つの予報モデルを比較 + ホール別風向き分析</p>
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="text-center py-10 text-gray-400">
            <div className="text-3xl mb-3 animate-bounce">⛳</div>
            <p className="text-sm">データ取得中...</p>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* メインコンテンツ */}
        {course && !loadingWeather && forecasts.length > 0 && (
          <div className="space-y-4">
            {/* コース情報 */}
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
              <span className="text-2xl">📍</span>
              <div>
                <div className="font-bold text-gray-800">{course.name}</div>
                <div className="text-xs text-gray-500">
                  {course.address && <span>{course.address}　</span>}
                  <span>北緯 {course.lat.toFixed(3)}° 東経 {course.lon.toFixed(3)}°</span>
                  {!loadingHoles && (
                    <span className="ml-2">
                      {holes.filter(h => h.direction !== undefined).length > 0
                        ? `　🏌️ ${holes.filter(h => h.direction !== undefined).length}ホール分析可能`
                        : '　ホールデータなし'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 日付セレクター */}
            <DateSelector dates={dates} selected={selectedDate} onSelect={setSelectedDate} />

            {/* タブ */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setTab('weather')}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'weather'
                    ? 'border-green-500 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ☁️ 天気比較
              </button>
              <button
                onClick={() => setTab('wind')}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'wind'
                    ? 'border-green-500 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                💨 ホール別風向き
                {holes.filter(h => h.direction !== undefined).length > 0 && (
                  <span className="ml-1 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">
                    {holes.filter(h => h.direction !== undefined).length}H
                  </span>
                )}
              </button>
            </div>

            {/* タブコンテンツ */}
            {tab === 'weather' && (
              <WeatherPanel forecasts={forecasts} date={selectedDate} />
            )}
            {tab === 'wind' && (
              <HoleWindTable
                holes={holes}
                forecasts={forecasts}
                date={selectedDate}
              />
            )}
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-8 border-t border-gray-100 mt-8">
        <p>天気データ: <a href="https://open-meteo.com/" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">Open-Meteo</a> (CC BY 4.0)　　地図データ: <a href="https://www.openstreetmap.org/" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors (ODbL)</p>
      </footer>
    </div>
  )
}
