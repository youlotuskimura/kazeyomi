import { workerQuickActions, recommendations, archives, feedItems, lunchMatches } from './data'
import { Badge, Button, Card, Section, ProgressBar } from './ui'

// ログイン時トップ（ワーカー個人＝リテンション最優先）
export default function WorkerHome({ onNav }: { onNav: (key: string) => void }) {
  return (
    <div className="bg-slate-50">
      {/* 1-2. パーソナルヘッダー + クイックアクション */}
      <div className="bg-ink-900 text-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <p className="text-sm text-slate-300">麻布台ヒルズ 森JPタワー 32F</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            こんにちは、森 太郎さん <span className="text-base font-normal text-slate-400">/ 株式会社サンプル</span>
          </h1>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {workerQuickActions.map((a) => (
              <button
                key={a.label}
                className="rounded-xl bg-white/10 p-4 text-left transition-colors hover:bg-white/20"
              >
                <div className="text-2xl">{a.icon}</div>
                <p className="mt-2 text-sm font-semibold">{a.label}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-300">
            <span>💳 HILLS ID ウォレット残高 <span className="font-bold text-gold-400">¥3,200</span></span>
            <span>🏅 入居 7年目 ゴールド会員</span>
          </div>
        </div>
      </div>

      {/* 3. 今日のレコメンド（回遊喚起） */}
      <Section eyebrow="For You" title="今日のおすすめ" className="!py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {recommendations.map((r) => (
            <Card key={r.title} className="flex items-start gap-3">
              <span className="text-2xl">{r.icon}</span>
              <div>
                <Badge tone="dark">{r.cat}</Badge>
                <p className="mt-2 text-sm font-medium text-ink-900">{r.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-14 lg:grid-cols-3">
        {/* 4. イベント＆アーカイブ */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink-900">イベント＆ラーニング</h2>
            <button onClick={() => onNav('archive')} className="text-sm font-semibold text-gold-600 hover:underline">
              すべて見る →
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {archives.slice(0, 4).map((a) => (
              <Card key={a.title}>
                <div className="mb-3 grid h-24 place-items-center rounded-lg bg-gradient-to-br from-ink-700 to-ink-900 text-3xl text-white/80">
                  ▶
                </div>
                <Badge>{a.tag}</Badge>
                <h3 className="mt-2 text-sm font-bold text-ink-900">{a.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{a.speaker}・{a.len}</p>
                {a.progress > 0 && (
                  <div className="mt-3">
                    <ProgressBar value={a.progress} />
                    <p className="mt-1 text-xs text-slate-400">{a.progress === 100 ? '視聴済み' : `続きから（${a.progress}%）`}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* 5-6. コミュニティ + ウェルネス */}
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">コミュニティ</h2>
              <button onClick={() => onNav('community')} className="text-sm font-semibold text-gold-600 hover:underline">
                開く →
              </button>
            </div>
            <Card>
              <p className="mb-2 text-xs font-semibold text-slate-500">ランチマッチング候補</p>
              {lunchMatches.map((l) => (
                <div key={l.name} className="flex items-center gap-3 border-b border-slate-100 py-2 last:border-0">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-600">
                    {l.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">{l.name}</p>
                    <p className="text-xs text-slate-500">{l.common}</p>
                  </div>
                  <button className="text-xs font-semibold text-gold-600">誘う</button>
                </div>
              ))}
              <div className="mt-3 space-y-2">
                {feedItems.map((f) => (
                  <div key={f.text} className="rounded-lg bg-slate-50 p-2.5">
                    <p className="text-xs font-semibold text-ink-900">{f.user} <span className="text-gold-600">{f.group}</span></p>
                    <p className="mt-0.5 text-xs text-slate-600">{f.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-ink-900">My ウェルネス</h2>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-ink-900">8,420<span className="text-sm font-normal text-slate-500"> 歩</span></p>
                  <p className="text-xs text-slate-500">今日の歩数</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600">イベント参加 12回</p>
                  <p className="text-xs text-slate-500">次回健診：7/15</p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" full onClick={() => onNav('city')}>
                  ジム・クリニックを予約
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 9. ロイヤリティ */}
      <div className="bg-gradient-to-r from-gold-600 to-gold-500">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-ink-900">
          <div>
            <p className="text-sm font-semibold">🏅 ロイヤリティ・ステータス</p>
            <p className="text-xl font-bold">ゴールド会員（入居7年）— 周年特典が利用可能です</p>
          </div>
          <Button variant="primary" onClick={() => onNav('city')}>
            限定クラブ・特典を見る
          </Button>
        </div>
      </div>
    </div>
  )
}
