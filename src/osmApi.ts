import type { GolfCourse, GolfHole } from './types'
import { calculateBearing } from './utils'

// 複数のOverpassインスタンスを順番に試す（冗長化）
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
]

const HOLE_ENDPOINT = 'https://overpass-api.de/api/interpreter'

async function fetchOverpass(queryBody: string): Promise<unknown> {
  let lastError: unknown
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(`${endpoint}?data=${encodeURIComponent(queryBody)}`, {
        signal: AbortSignal.timeout(20000),
      })
      if (!res.ok) continue
      const text = await res.text()
      if (!text.startsWith('{')) continue // HTMLエラーページを除外
      return JSON.parse(text)
    } catch (e) {
      lastError = e
    }
  }
  throw lastError ?? new Error('Overpass APIに接続できません')
}

// ゴルフ場名で検索（leisure=golf_course タグのみ返す）
export async function searchGolfCourses(name: string): Promise<GolfCourse[]> {
  if (!name.trim()) return []

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const query = `
[out:json][timeout:20];
(
  way["leisure"="golf_course"]["name"~"${escaped}",i];
  relation["leisure"="golf_course"]["name"~"${escaped}",i];
);
out center tags;`

  const data = await fetchOverpass(query) as { elements: OverpassSearchElement[] }

  return data.elements
    .filter((el) => el.tags?.name)
    .map((el) => {
      const lat = el.center?.lat ?? el.lat ?? 0
      const lon = el.center?.lon ?? el.lon ?? 0
      const bounds = el.bounds ?? {
        minlat: lat - 0.02, minlon: lon - 0.02,
        maxlat: lat + 0.02, maxlon: lon + 0.02,
      }
      return {
        id: el.id,
        type: el.type as 'way' | 'relation',
        name: el.tags!.name,
        lat, lon, bounds,
        address: [el.tags?.["addr:prefecture"], el.tags?.["addr:city"]]
          .filter(Boolean).join(' '),
      }
    })
    .slice(0, 8)
}

interface OverpassSearchElement {
  id: number
  type: string
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  bounds?: { minlat: number; minlon: number; maxlat: number; maxlon: number }
  tags?: Record<string, string>
}

export async function fetchGolfHoles(course: GolfCourse): Promise<GolfHole[]> {
  const { minlat, minlon, maxlat, maxlon } = course.bounds
  const buf = 0.005
  const bbox = `${minlat - buf},${minlon - buf},${maxlat + buf},${maxlon + buf}`

  const query = `
[out:json][timeout:20];
(
  node["golf"="tee"](${bbox});
  node["golf"="green"](${bbox});
);
out body;`

  const res = await fetch(`${HOLE_ENDPOINT}?data=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('ホールデータの取得に失敗しました')
  const data = await res.json()

  const tees = new Map<number, { lat: number; lon: number }>()
  const greens = new Map<number, { lat: number; lon: number }>()

  for (const el of data.elements as OverpassNode[]) {
    const ref = parseInt(el.tags?.ref ?? el.tags?.hole ?? '')
    if (!ref || isNaN(ref) || ref < 1 || ref > 18) continue
    const pos = { lat: el.lat, lon: el.lon }
    if (el.tags?.golf === 'tee') tees.set(ref, pos)
    else if (el.tags?.golf === 'green') greens.set(ref, pos)
  }

  const holes: GolfHole[] = []
  const holeNumbers = new Set([...tees.keys(), ...greens.keys()])

  for (const num of Array.from(holeNumbers).sort((a, b) => a - b)) {
    const tee = tees.get(num)
    const green = greens.get(num)
    const direction =
      tee && green ? calculateBearing(tee.lat, tee.lon, green.lat, green.lon) : undefined
    holes.push({ number: num, tee, green, direction })
  }

  return holes
}

interface OverpassElement {
  id: number
  type: string
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  bounds?: { minlat: number; minlon: number; maxlat: number; maxlon: number }
  tags?: Record<string, string>
}

interface OverpassNode extends OverpassElement {
  lat: number
  lon: number
}
