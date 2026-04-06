import type { GolfCourse, GolfHole } from './types'
import { calculateBearing } from './utils'

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
]

async function fetchOverpass(queryBody: string): Promise<unknown> {
  let lastError: unknown
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(`${endpoint}?data=${encodeURIComponent(queryBody)}`)
      if (!res.ok) continue
      const text = await res.text()
      if (!text.startsWith('{')) continue
      return JSON.parse(text)
    } catch (e) {
      lastError = e
    }
  }
  throw lastError ?? new Error('サーバーに接続できません')
}

// ゴルフ場名で検索（name / operator / name:ja 複数タグ対応）
export async function searchGolfCourses(name: string): Promise<GolfCourse[]> {
  if (!name.trim()) return []

  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const query = `
[out:json][timeout:25];
(
  way["leisure"="golf_course"]["name"~"${esc}",i];
  relation["leisure"="golf_course"]["name"~"${esc}",i];
  way["leisure"="golf_course"]["name:ja"~"${esc}",i];
  relation["leisure"="golf_course"]["name:ja"~"${esc}",i];
  way["leisure"="golf_course"]["operator"~"${esc}",i];
  relation["leisure"="golf_course"]["operator"~"${esc}",i];
  way["leisure"="golf_course"]["official_name"~"${esc}",i];
  relation["leisure"="golf_course"]["official_name"~"${esc}",i];
);
out center tags;`

  const data = await fetchOverpass(query) as { elements: OverpassSearchElement[] }

  const seen = new Set<number>()
  return data.elements
    .filter((el) => el.tags?.name && !seen.has(el.id) && seen.add(el.id))
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
        address: [el.tags?.['addr:prefecture'], el.tags?.['addr:city']]
          .filter(Boolean).join(' '),
      }
    })
    .slice(0, 10)
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

  const data = await fetchOverpass(query) as { elements: OverpassNode[] }

  const tees = new Map<number, { lat: number; lon: number }>()
  const greens = new Map<number, { lat: number; lon: number }>()

  for (const el of data.elements) {
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
    holes.push({
      number: num, tee, green,
      direction: tee && green ? calculateBearing(tee.lat, tee.lon, green.lat, green.lon) : undefined,
    })
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
