import { archives, matches } from './data'
import { Badge, Button, Card, Section, ProgressBar } from './ui'

// 主要機能のディテール画面（ストック型施策の体現）。
// ナビゲーションのリンク先を成立させ、要件を画面で示す。

export function ArchivePage({ onContact, loggedIn }: { onContact: () => void; loggedIn: boolean }) {
  const filters = ['すべて', 'SUMMIT', 'SEMINAR', 'WELLNESS', 'CULTURE']
  return (
    <div className="bg-slate-50 min-h-screen">
      <Section
        eyebrow="Stock #1 / #2"
        title="イベント＆ラーニング・アーカイブ"
        desc="開催して終わりにしない。すべての講演・サミットを動画・資料・文字起こし付きで蓄積し、検索・再視聴できる資産にします。"
      >
        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((f, i) => (
            <span
              key={f}
              className={`rounded-full border px-3 py-1 text-sm ${i === 0 ? 'border-ink-900 bg-ink-900 text-white' : 'border-slate-300 text-slate-600'}`}
            >
              {f}
            </span>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {archives.map((a) => (
            <Card key={a.title}>
              <div className="mb-3 grid h-28 place-items-center rounded-lg bg-gradient-to-br from-ink-700 to-ink-900 text-4xl text-white/80">
                ▶
              </div>
              <Badge>{a.tag}</Badge>
              <h3 className="mt-2 text-sm font-bold text-ink-900">{a.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{a.speaker}・{a.len}</p>
              {loggedIn && a.progress > 0 && (
                <div className="mt-3">
                  <ProgressBar value={a.progress} />
                </div>
              )}
              {!loggedIn && (
                <p className="mt-3 text-xs text-amber-700">🔒 冒頭のみ視聴可。続きは登録 / 問い合わせ</p>
              )}
            </Card>
          ))}
        </div>
        {!loggedIn && (
          <Card className="mt-8 bg-ink-900 text-center text-white">
            <h3 className="text-lg font-bold">続きは、無料の資料ダウンロード or ご登録で。</h3>
            <p className="mt-2 text-sm text-slate-300">フォーム入力でアーカイブ全編がアンロックされます（リードフック）。</p>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="gold" onClick={onContact}>資料をダウンロード（無料）</Button>
            </div>
          </Card>
        )}
      </Section>
    </div>
  )
}

export function MatchingPage({ onContact }: { onContact: () => void }) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Section
        eyebrow="Stock #3"
        title="ビジネスマッチング・ハブ / 虎ノ門サミット常設"
        desc="入居企業1,200社のネットワークを資産化。協業・発注・採用の募集、商談ログ、サミットのアーカイブを一元管理します。"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-ink-900">募集一覧</h3>
            {matches.map((m) => (
              <Card key={m.company} className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink-900">{m.company}</span>
                    <Badge tone={m.status === '新着' ? 'gold' : 'dark'}>{m.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{m.want}</p>
                  <div className="mt-2 flex gap-1">
                    {m.tags.map((t) => (
                      <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">#{t}</span>
                    ))}
                  </div>
                </div>
                <Button variant="outline" onClick={onContact}>コンタクト</Button>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Card>
              <h3 className="font-bold text-ink-900">マッチング履歴（ストック）</h3>
              <p className="mt-1 text-xs text-slate-500">担当交代でも引継げる商談ログ</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="border-l-2 border-gold-500 pl-2">5/20 D社と初回商談（実証実験）</li>
                <li className="border-l-2 border-slate-200 pl-2">4/12 E社へ発注見積依頼</li>
                <li className="border-l-2 border-slate-200 pl-2">3/03 虎ノ門サミットで名刺交換</li>
              </ul>
            </Card>
            <Card className="bg-ink-900 text-white">
              <h3 className="font-bold">コンシェルジュ仲介</h3>
              <p className="mt-2 text-sm text-slate-300">森ビルが最適な企業をご紹介します。</p>
              <div className="mt-3">
                <Button variant="gold" full onClick={onContact}>仲介を依頼</Button>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  )
}

export function HealthPage() {
  const depts = [
    { d: '営業部', s: 78 }, { d: '開発部', s: 71 }, { d: '管理部', s: 84 }, { d: 'CS部', s: 69 },
  ]
  return (
    <div className="bg-slate-50 min-h-screen">
      <Section
        eyebrow="Stock #4"
        title="健康経営ダッシュボード"
        desc="従業員の健康・運動・イベント参加・満足度を経年で可視化。契約継続のROIを数値で示し、解約理由を潰します。"
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <Card><p className="text-sm text-slate-500">総合スコア</p><p className="mt-2 text-4xl font-bold text-ink-900">76</p><Badge tone="green">前年比 +9</Badge></Card>
          <Card><p className="text-sm text-slate-500">同業ベンチマーク</p><p className="mt-2 text-4xl font-bold text-ink-900">上位23%</p><Badge tone="green">同規模テナント中</Badge></Card>
          <Card><p className="text-sm text-slate-500">イベント参加率</p><p className="mt-2 text-4xl font-bold text-ink-900">61%</p><Badge tone="green">+12pt</Badge></Card>
        </div>
        <Card className="mt-6">
          <p className="mb-4 text-sm font-semibold text-ink-900">部署別スコア（個人特定不可の集計値）</p>
          <div className="space-y-3">
            {depts.map((h) => (
              <div key={h.d} className="flex items-center gap-3">
                <span className="w-16 text-sm text-ink-900">{h.d}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-ink-700" style={{ width: `${h.s}%` }} />
                </div>
                <span className="w-8 text-right text-sm font-bold text-ink-900">{h.s}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="primary">健康経営優良法人 申請レポートを出力</Button>
            <Button variant="outline">CSV / PDF ダウンロード</Button>
          </div>
        </Card>
      </Section>
    </div>
  )
}

// 軽量プレースホルダー（街を使う / コミュニティ / 探す / できること / カルチャー）
export function SimplePage({ title, desc, items }: { title: string; desc: string; items: { icon: string; t: string; d: string }[] }) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Section title={title} desc={desc}>
        <div className="grid gap-5 sm:grid-cols-3">
          {items.map((it) => (
            <Card key={it.t}>
              <div className="text-3xl">{it.icon}</div>
              <h3 className="mt-3 font-bold text-ink-900">{it.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{it.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}
