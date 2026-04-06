// 主要ゴルフ場の静的データ（座標はコース中心の近似値）
// OSMに登録されていないコースでも確実に検索できるよう内蔵

export interface StaticCourse {
  name: string
  lat: number
  lon: number
  prefecture: string
  city?: string
}

export const STATIC_COURSES: StaticCourse[] = [
  // 関東
  { name: '太平洋クラブ 御殿場コース', lat: 35.308, lon: 138.931, prefecture: '静岡県', city: '御殿場市' },
  { name: '太平洋クラブ 益子コース', lat: 36.474, lon: 140.188, prefecture: '栃木県', city: '益子町' },
  { name: '太平洋クラブ 市原コース', lat: 35.434, lon: 140.171, prefecture: '千葉県', city: '市原市' },
  { name: '川奈ホテルゴルフコース 富士コース', lat: 34.930, lon: 138.930, prefecture: '静岡県', city: '伊東市' },
  { name: '廣野ゴルフ倶樂部', lat: 34.870, lon: 135.022, prefecture: '兵庫県', city: '三木市' },
  { name: '東京ゴルフ倶樂部', lat: 35.851, lon: 139.345, prefecture: '埼玉県', city: '入間郡' },
  { name: '武蔵カントリー倶樂部 豊岡コース', lat: 35.916, lon: 139.334, prefecture: '埼玉県', city: '入間市' },
  { name: '程ケ谷カントリー倶樂部', lat: 35.494, lon: 139.450, prefecture: '神奈川県', city: '横浜市' },
  { name: 'よみうりゴルフ倶樂部', lat: 35.760, lon: 139.493, prefecture: '東京都', city: '稲城市' },
  { name: '宍戸ヒルズカントリークラブ', lat: 36.393, lon: 140.412, prefecture: '茨城県', city: '笠間市' },
  { name: '茨城ゴルフ倶樂部', lat: 36.240, lon: 140.320, prefecture: '茨城県', city: '小美玉市' },
  { name: '烏山城カントリークラブ', lat: 36.656, lon: 140.162, prefecture: '栃木県', city: '那須烏山市' },
  { name: '那須ゴルフクラブ', lat: 36.984, lon: 140.044, prefecture: '栃木県', city: '那須町' },
  { name: '軽井沢72ゴルフ 北コース', lat: 36.381, lon: 138.611, prefecture: '長野県', city: '軽井沢町' },
  { name: '軽井沢カントリークラブ', lat: 36.353, lon: 138.568, prefecture: '長野県', city: '軽井沢町' },
  { name: 'ゴルフ倶樂部成田ハイツリー', lat: 35.787, lon: 140.366, prefecture: '千葉県', city: '成田市' },
  { name: '千葉カントリー倶樂部 野田コース', lat: 35.958, lon: 139.864, prefecture: '千葉県', city: '野田市' },
  { name: '我孫子ゴルフ倶樂部', lat: 35.866, lon: 140.066, prefecture: '千葉県', city: '我孫子市' },
  // 関西
  { name: '大阪ゴルフクラブ', lat: 34.649, lon: 135.526, prefecture: '大阪府', city: '羽曳野市' },
  { name: 'クラシックゴルフ倶樂部', lat: 34.948, lon: 135.716, prefecture: '滋賀県', city: '甲賀市' },
  { name: '有馬カンツリー倶樂部', lat: 34.840, lon: 135.209, prefecture: '兵庫県', city: '三田市' },
  { name: '六甲国際ゴルフ倶樂部', lat: 34.793, lon: 135.244, prefecture: '兵庫県', city: '神戸市' },
  { name: 'JGMゴルフクラブ笠間', lat: 36.370, lon: 140.284, prefecture: '茨城県', city: '笠間市' },
  // 中部
  { name: '名古屋ゴルフ倶樂部 和合コース', lat: 35.239, lon: 137.079, prefecture: '愛知県', city: '日進市' },
  { name: '三好カントリー倶樂部', lat: 35.091, lon: 137.071, prefecture: '愛知県', city: 'みよし市' },
  // 九州
  { name: 'ザ・クイーンズヒルゴルフクラブ', lat: 33.617, lon: 130.418, prefecture: '福岡県', city: '飯塚市' },
  { name: '古賀ゴルフ・クラブ', lat: 33.722, lon: 130.551, prefecture: '福岡県', city: '古賀市' },
  // 北海道
  { name: '札幌ゴルフ倶樂部 輪厚コース', lat: 43.086, lon: 141.619, prefecture: '北海道', city: '北広島市' },
  { name: '小樽カントリー倶樂部', lat: 43.232, lon: 141.019, prefecture: '北海道', city: '小樽市' },
  // 東北
  { name: '仙台カントリー倶樂部', lat: 38.242, lon: 140.839, prefecture: '宮城県', city: '仙台市' },
]

export function searchStatic(query: string): StaticCourse[] {
  const q = query.toLowerCase()
  return STATIC_COURSES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.prefecture.includes(query) ||
      (c.city ?? '').includes(query),
  )
}
