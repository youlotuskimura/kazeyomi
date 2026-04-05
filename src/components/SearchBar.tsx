import { useState, useEffect, useRef } from 'react'
import type { GolfCourse } from '../types'
import { searchGolfCourses } from '../osmApi'

interface Props {
  onSelect: (course: GolfCourse) => void
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GolfCourse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // デバウンス検索
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await searchGolfCourses(query)
        setResults(res)
        setOpen(true)
        if (res.length === 0) setError('見つかりませんでした。別のキーワードで試してください。')
      } catch {
        setError('検索中にエラーが発生しました。')
      } finally {
        setLoading(false)
      }
    }, 600)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  // 外側クリックで閉じる
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(course: GolfCourse) {
    setQuery(course.name)
    setOpen(false)
    setResults([])
    onSelect(course)
  }

  return (
    <div ref={wrapRef} className="relative w-full max-w-xl">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">⛳</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ゴルフ場名を入力（例：軽井沢、太平洋クラブ）"
          className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none text-gray-800 text-base shadow-sm"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin">⟳</span>
        )}
      </div>

      {open && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {results.length > 0 ? (
            results.map((c) => (
              <li key={`${c.type}-${c.id}`}>
                <button
                  onClick={() => handleSelect(c)}
                  className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-gray-800">{c.name}</div>
                  {c.address && (
                    <div className="text-xs text-gray-500 mt-0.5">{c.address}</div>
                  )}
                </button>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-gray-500">{error}</li>
          )}
        </ul>
      )}
    </div>
  )
}
