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
  throw lastError ?? new Error('接続失敗')
}

async function searchByOSM(name: string): Promise<GolfCourse[]> {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const query = `
[out:json][timeout:20];
(
  way["leisure"="golf_course"]["name"~"${esc}",i];
  relation["leisure"="golf_course"]["name"~"${esc}",i];
  way["leisure"="golf_course"]["name:ja"~"${esc}",i];
  relation["leisure"="golf_course"]["name:ja"~"${esc}",i];
  way["leisure"="golf_course"]["operator"~"${esc}",i];
  relation["leisure"="golf_course"]["operator"~"${esc}",i];
);
out center tags;`

  const data = await fetchOverpass(query) as { elements: OverpassSearchElement[] }
  const seen = new Set<number>()
  return data.elements
    .filter((el) => el.tags?.name && !seen.has(el.id) && seen.add(el.id))
    .map((el) => {
      const lat = el.center?.lat ?? el.lat ?? 0
      const lon = el.center?.lon ?? el.lon ?? 0
      return {
        id: el.id,
        type: el.type as 'way' | 'relation',
        name: el.tags!.name,
        lat, lon,
        bounds: el.bounds ?? {
          minlat: lat - 0.02, minlon: lon - 0.02,
          maxlat: lat + 0.02, maxlon: lon + 0.02,
        },
        address: [el.tags?.["addr:prefecture"], el.tags?.["addr:city"]]
          .filter(Boolean).join(' '),
      }
    })
    .slice(0, 8)
}

async function searchByGeocode(name: string): Promise<GolfCourse[]> {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(name)}&count=5&language=ja&format=json&countryCode=JP`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  if (!data.results?.length) return []

  return (data.results as GeoResult[]).map((r, i) => ({
    id: -(i + 1),
    type: 'way' as const,
    name: r.name,
    lat: r.latitude,
    lon: r.longitude,
    bounds: {
      minlat: r.latitude - 0.05, minlon: r.longitude - 0.05,
      maxlat: r.latitude + 0.05, maxlon: r.longitude + 0.05,
    },
    address: [r.admin1, r.admin2].filter(Boolean).join(' '),
  }))
}

interface GeoResult {
  name: string
  latitude: number
  longitude: number
  admin1?: string
  admin2?: string
}

export async function searchGolfCourses(name: string): Promise<GolfCourse[]> {
  if (!name.trim()) return []

  const [osmResult, geoResult] = await Promise.allSettled([
    searchByOSM(name),
    searchByGeocode(name),
  ])

  const osmCourses = osmResult.status === 'fulfilled' ? osmResult.value : []
  const geoCourses = geoResult.status === 'fulfilled' ? geoResult.value : []

  if (osmCourses.length > 0) return osmCourses
  return geoCourses
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
  if (course.id < 0) return []

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
      direction: tee && green
        ? calculateBearing(tee.lat, tee.lon, green.lat, green.lon)
        : undefined,
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
