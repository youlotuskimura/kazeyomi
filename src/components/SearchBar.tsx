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
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      setMessage('')
      try {
        const res = await searchGolfCourses(query)
        setResults(res)
        setOpen(true)
        if (res.length === 0)
          setMessage('見つかりませんでした。コース名の一部（例：「太平洋」「川奈」）で試してください。')
      } catch {
        setOpen(true)
        setMessage('接続できませんでした。しばらくしてから再試行してください。')
      } finally {
        setLoading(false)
      }
    }, 700)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">⛳</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ゴルフ場名を入力（例：太平洋クラブ、川奈）"
          className="w-full pl-10 pr-16 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none text-gray-800 text-base shadow-sm bg-white"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">
            検索中…
          </span>
        )}
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {results.length > 0 ? (
            <ul>
              {results.map((c) => (
                <li key={`${c.type}-${c.id}`}>
                  <button
                    onClick={() => handleSelect(c)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 active:bg-green-100 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="font-medium text-gray-800">{c.name}</div>
                    {c.address && <div className="text-xs text-gray-400 mt-0.5">{c.address}</div>}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">{message}</div>
          )}
        </div>
      )}
    </div>
  )
}
