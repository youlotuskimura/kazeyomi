// HILLS ONE モックアップ用のダミーデータ
// すべて架空のサンプルです（森ビルの実データではありません）。

export type Role = 'worker' | 'admin'

export const properties = [
  {
    name: '虎ノ門ヒルズ ステーションタワー',
    area: '120 - 4,800 坪',
    feature: 'TOKYO NODE併設。国際新都心のフラッグシップ。',
    vacancy: '一部区画 空室あり',
    tag: 'NEW',
  },
  {
    name: '麻布台ヒルズ 森JPタワー',
    area: '300 - 6,200 坪',
    feature: '日本一の高さ。Green & Wellnessの最先端。',
    vacancy: 'お問い合わせ',
    tag: 'PREMIUM',
  },
  {
    name: '六本木ヒルズ 森タワー',
    area: '150 - 3,500 坪',
    feature: '文化都心の象徴。美術館・展望台を内包。',
    vacancy: '少数区画',
    tag: '',
  },
]

export const cases = [
  { company: 'A社（IT・SaaS）', metric: '従業員エンゲージメント', value: '+18%', note: 'コミュニティ／イベント活用' },
  { company: 'B社（コンサル）', metric: '中途採用 応募数', value: '+32%', note: 'ヒルズ立地を採用広報に活用' },
  { company: 'C社（製造）', metric: '健康診断 有所見率', value: '−11%', note: '健康経営ダッシュボードで改善' },
]

export const stats = [
  { label: '入居企業数', value: '1,200+' },
  { label: '登録ワーカー数', value: '85,000+' },
  { label: '年間イベント数', value: '480+' },
  { label: 'ワーカー満足度', value: '92%' },
]

export const archives = [
  { title: '虎ノ門サミット 2026 — 都市とスタートアップの共創', speaker: '登壇企業 12社', len: '94分', tag: 'SUMMIT', progress: 40 },
  { title: 'AI時代の総務DX — 入居企業の実践', speaker: '森ビル × 入居3社', len: '58分', tag: 'SEMINAR', progress: 0 },
  { title: 'ウェルビーイング経営の最前線', speaker: '産業医 田中氏', len: '47分', tag: 'WELLNESS', progress: 100 },
  { title: '麻布台ヒルズ アートとビジネス', speaker: 'キュレーター対談', len: '36分', tag: 'CULTURE', progress: 0 },
]

export const matches = [
  { company: 'D社', want: '共同実証パートナー募集（スマートビル）', tags: ['IoT', '実証実験'], status: '新着' },
  { company: 'E社', want: '法務SaaSの発注先を探しています', tags: ['発注', 'リーガル'], status: '商談中' },
  { company: 'F社', want: 'デザイン人材の採用・業務委託', tags: ['採用', 'デザイン'], status: '新着' },
]

export const feedItems = [
  { user: '中野 さん', group: '#朝活ランニング部', text: '明日6:30、麻布台ヒルズ集合で5km走ります！初心者歓迎🏃', time: '12分前' },
  { user: '李 さん', group: '#プロダクト勉強会', text: 'LT登壇者あと1名募集中。テーマ自由です。', time: '1時間前' },
  { user: '事務局', group: '#お知らせ', text: '展望台の社員特典チケットが今月分追加されました。', time: '3時間前' },
]

export const lunchMatches = [
  { name: 'S.K さん', dept: '別テナント・マーケ', common: '共通の興味：生成AI / 登山' },
  { name: 'M.T さん', dept: '別テナント・人事', common: '共通の興味：採用広報 / コーヒー' },
]

export const workerQuickActions = [
  { icon: '🗓️', label: '会議室を予約' },
  { icon: '🍱', label: 'モバイルオーダー' },
  { icon: '🎟️', label: '展望台チケット' },
  { icon: '🎨', label: '美術館 優待' },
]

export const adminQuickActions = [
  { icon: '📊', label: '健康経営レポート' },
  { icon: '👥', label: '従業員管理' },
  { icon: '🏢', label: 'ファシリティ申請' },
  { icon: '🧾', label: '請求・契約' },
]

export const healthScores = [
  { dept: '営業部', score: 78, trend: '+4' },
  { dept: '開発部', score: 71, trend: '+2' },
  { dept: '管理部', score: 84, trend: '+1' },
  { dept: 'CS部', score: 69, trend: '−3' },
]

export const recommendations = [
  { icon: '☀️', title: '今日は晴れ。ルーフトップでランチ優待20%', cat: '回遊' },
  { icon: '🎤', title: '本日17:00 ネットワーキング（残り8席）', cat: 'イベント' },
  { icon: '🪑', title: '3F ラウンジに空席あり（集中エリア）', cat: 'ファシリティ' },
]
