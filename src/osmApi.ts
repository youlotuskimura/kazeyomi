import type { GolfCourse, GolfHole } from './types'
import { calculateBearing } from './utils'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org'

function overpassQuery(query: string): string {
  return `${OVERPASS_URL}?data=${encodeURIComponent(query)}`
}

// ゴルフ場名で検索（Nominatim使用：日本語テキスト検索に強い）
export async function searchGolfCourses(name: string): Promise<GolfCourse[]> {
  if (!name.trim()) return []

  const url =
    `${NOMINATIM_URL}/search` +
    `?format=json` +
    `&q=${encodeURIComponent(name)}` +
    `&limit=10` +
    `&countrycodes=jp` +
    `&addressdetails=1` +
    `&extratags=1`

  const res = await fetch(url, {
    headers: { 'Accept-Language': 'ja', 'User-Agent': 'kazeyomi-golf-weather/1.0' },
  })
  if (!res.ok) throw new Error('ゴルフ場の検索に失敗しました')
  const data: NominatimResult[] = await res.json()

  const golf = data.filter(
    (r) =>
      r.type === 'golf_course' ||
      r.class === 'leisure' ||
      r.display_name.includes('ゴルフ') ||
      r.display_name.toLowerCase().includes('golf') ||
      r.display_name.includes('カントリー'),
  )

  const results = golf.length > 0 ? golf : data.slice(0, 5)

  return results.map((r) => {
    const lat = parseFloat(r.lat)
    const lon = parseFloat(r.lon)
    const bb = r.boundingbox
    return {
      id: r.osm_id,
      type: (r.osm_type === 'way' ? 'way' : 'relation') as 'way' | 'relation',
      name: r.name || r.display_name.split(',')[0],
      lat,
      lon,
      bounds: {
        minlat: parseFloat(bb[0]),
        maxlat: parseFloat(bb[1]),
        minlon: parseFloat(bb[2]),
        maxlon: parseFloat(bb[3]),
      },
      address: r.address
        ? [r.address.state, r.address.city ?? r.address.town ?? r.address.village]
            .filter(Boolean)
            .join(' ')
        : '',
    }
  })
}

interface NominatimResult {
  osm_id: number
  osm_type: string
  lat: string
  lon: string
  display_name: string
  name: string
  type: string
  class: string
  boundingbox: [string, string, string, string]
  address?: {
    state?: string
    city?: string
    town?: string
    village?: string
  }
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
