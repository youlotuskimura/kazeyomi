import { useState } from 'react'
import { properties, cases, stats } from './data'
import { Badge, Button, Card, Section, ProgressBar } from './ui'

// 未ログイン時トップ（新規検討層向け＝リード獲得最優先）
export default function PublicHome({
  onContact,
  onNav,
}: {
  onContact: () => void
  onNav: (key: string) => void
}) {
  const tabs = [
    { key: 'exec', label: '移転検討の総務・経営の方へ', copy: '街全体を、自社のオフィスに。立地・面積・働き方を、ひとつの窓口で。' },
    { key: 'hr', label: '健康経営担当の方へ', copy: '従業員の健康とエンゲージメントを、データで可視化し改善する。' },
    { key: 'worker', label: '働くワーカーの方へ', copy: '美術館も展望台も会議室も。ひとつのIDで、街がオフィスになる。' },
  ]
  const [tab, setTab] = useState(0)
  const values = [
    { icon: '🎨', t: 'Culture', d: '美術館・展望台・会員制クラブ。ヒルズの文化資産を統合IDで。' },
    { icon: '🤝', t: 'Business', d: '入居企業同士のビジネスマッチング。虎ノ門サミットを常設化。' },
    { icon: '🏅', t: 'Loyalty', d: '長期入居・周年企業への特別プログラムと限定特典。' },
  ]

  return (
    <div className="bg-white">
      {/* 1. ヒーロー */}
      <div className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-700" />
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <Badge>One ID, One City, One Network.</Badge>
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-6xl">
            働くを、<span className="text-gold-500">街の体験</span>へ。
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
            ヒルズの全アセットをひとつのIDで。テナント企業とワーカーのための統合プラットフォーム「HILLS ONE」。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="gold" onClick={onContact}>
              移転・オフィスの相談（無料）
            </Button>
            <Button variant="outline" onClick={() => onNav('archive')}>
              <span className="text-white">サービス資料を見る</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. 課題提起 × ターゲット切替タブ */}
      <Section className="!py-12">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              onClick={() => setTab(i)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                tab === i ? 'border-ink-900 bg-ink-900 text-white' : 'border-slate-300 text-slate-600 hover:border-ink-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-6 text-xl font-medium leading-relaxed text-ink-900 sm:text-2xl">{tabs[tab].copy}</p>
      </Section>

      {/* 3. 3つの提供価値 */}
      <Section eyebrow="Why HILLS ONE" title="森ビルだけの、3つの価値" className="bg-slate-50">
        <div className="grid gap-5 sm:grid-cols-3">
          {values.map((v) => (
            <Card key={v.t}>
              <div className="text-3xl">{v.icon}</div>
              <h3 className="mt-3 text-lg font-bold text-ink-900">{v.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 4. 物件・拠点ショーケース */}
      <Section eyebrow="Office" title="拠点・区画を探す" desc="主要なヒルズから、面積・特徴で検討を始められます。">
        <div className="grid gap-5 sm:grid-cols-3">
          {properties.map((p) => (
            <Card key={p.name} className="flex flex-col">
              <div className="flex items-start justify-between">
                <div className="h-28 w-full rounded-lg bg-gradient-to-br from-ink-700 to-ink-900" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                {p.tag && <Badge>{p.tag}</Badge>}
                <span className="text-xs text-emerald-600">{p.vacancy}</span>
              </div>
              <h3 className="mt-2 font-bold text-ink-900">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{p.area}</p>
              <p className="mt-2 flex-1 text-sm text-slate-600">{p.feature}</p>
              <button onClick={onContact} className="mt-4 text-sm font-semibold text-gold-600 hover:underline">
                この区画の内見を予約 →
              </button>
            </Card>
          ))}
        </div>
      </Section>

      {/* 5. 導入事例 */}
      <Section eyebrow="Customer Story" title="入居企業の成果" className="bg-slate-50">
        <div className="grid gap-5 sm:grid-cols-3">
          {cases.map((c) => (
            <Card key={c.company}>
              <p className="text-sm text-slate-500">{c.company}</p>
              <p className="mt-3 text-3xl font-bold text-ink-900">{c.value}</p>
              <p className="text-sm font-semibold text-slate-700">{c.metric}</p>
              <p className="mt-2 text-xs text-slate-500">{c.note}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 6. ビジネスマッチング ティーザー */}
      <Section eyebrow="Business Matching" title="ここでしか、繋がれない企業がいる">
        <Card className="bg-ink-900 text-white">
          <div className="grid items-center gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold">虎ノ門サミット アーカイブ</h3>
              <p className="mt-3 text-sm text-slate-300">
                入居企業1,200社のネットワーク。登壇動画・資料・参加企業録を蓄積。続きは会員登録 / お問い合わせから。
              </p>
              <div className="mt-4 max-w-xs">
                <ProgressBar value={30} />
                <p className="mt-1 text-xs text-slate-400">プレビュー視聴 30%</p>
              </div>
              <div className="mt-5">
                <Button variant="gold" onClick={onContact}>
                  続きを見る（問い合わせ）
                </Button>
              </div>
            </div>
            <div className="grid h-40 place-items-center rounded-lg bg-white/5 text-5xl">▶</div>
          </div>
        </Card>
      </Section>

      {/* 7. 数字で見るHILLS */}
      <div className="bg-ink-900 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-12 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-gold-500 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-slate-300">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. ミッドCTA + 導入の流れ */}
      <Section title="導入はかんたん3ステップ">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { n: '01', t: '相談・資料請求', d: 'オンラインで現状の課題をヒアリング。' },
            { n: '02', t: 'プラン設計・内見', d: '区画とサービスを最適に組み合わせ。' },
            { n: '03', t: '統合ID発行・運用', d: 'HILLS IDで全アセットの利用を開始。' },
          ].map((s) => (
            <Card key={s.n}>
              <span className="text-2xl font-black text-gold-500">{s.n}</span>
              <h3 className="mt-2 font-bold text-ink-900">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 9. フッター大型CTA */}
      <div className="bg-gradient-to-r from-ink-800 to-ink-700 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">まずは、情報収集から。</h2>
          <p className="mt-3 text-slate-300">移転・サービス導入のご相談はこちら。30分・無料・営業電話はしません。</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="gold" onClick={onContact}>
              オンラインで相談する
            </Button>
            <Button variant="outline" onClick={onContact}>
              <span className="text-white">3分でわかる資料（無料DL）</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
