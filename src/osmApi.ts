import type { GolfCourse, GolfHole } from './types'
import { calculateBearing } from './utils'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

function overpassQuery(query: string): string {
  return `${OVERPASS_URL}?data=${encodeURIComponent(query)}`
}

// ゴルフ場名で検索
export async function searchGolfCourses(name: string): Promise<GolfCourse[]> {
  if (!name.trim()) return []

  const query = `
[out:json][timeout:20];
(
  way["leisure"="golf_course"]["name"~"${name}",i];
  relation["leisure"="golf_course"]["name"~"${name}",i];
);
out center tags;`

  const res = await fetch(overpassQuery(query))
  if (!res.ok) throw new Error('ゴルフ場の検索に失敗しました')
  const data = await res.json()

  return (data.elements as OverpassElement[])
    .filter((el) => el.tags?.name)
    .map((el) => {
      const lat = el.center?.lat ?? el.lat ?? 0
      const lon = el.center?.lon ?? el.lon ?? 0
      const bounds = el.bounds ?? {
        minlat: lat - 0.02,
        minlon: lon - 0.02,
        maxlat: lat + 0.02,
        maxlon: lon + 0.02,
      }
      return {
        id: el.id,
        type: el.type as 'way' | 'relation',
        name: el.tags?.name ?? '',
        lat,
        lon,
        bounds,
        address: [el.tags?.['addr:prefecture'], el.tags?.['addr:city']]
          .filter(Boolean)
          .join(' '),
      }
    })
    .slice(0, 8)
}

// コースのホール情報を取得（ティー・グリーンのノード）
export async function fetchGolfHoles(course: GolfCourse): Promise<GolfHole[]> {
  const { minlat, minlon, maxlat, maxlon } = course.bounds
  // バッファを少し広げる
  const buf = 0.005
  const bbox = `${minlat - buf},${minlon - buf},${maxlat + buf},${maxlon + buf}`

  const query = `
[out:json][timeout:20];
(
  node["golf"="tee"](${bbox});
  node["golf"="green"](${bbox});
);
out body;`

  const res = await fetch(overpassQuery(query))
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

// Overpass レスポンス型
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
