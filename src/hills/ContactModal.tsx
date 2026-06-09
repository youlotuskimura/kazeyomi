import { useState } from 'react'
import { Button } from './ui'

// BtoBリード獲得フォーム（EFO配慮：最小項目・相談種別でセグメント振り分け）
export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false)
  if (!open) return null

  const purposes = ['オフィス移転・増床', 'サービス/福利厚生 導入', '健康経営', 'ビジネスマッチング']

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-3xl">✓</div>
            <h3 className="mt-4 text-xl font-bold text-ink-900">送信が完了しました</h3>
            <p className="mt-2 text-sm text-slate-600">担当より2営業日以内にご連絡します。続けて、オンライン相談の枠もご予約いただけます。</p>
            <div className="mt-5 flex flex-col gap-2">
              <Button variant="gold" full onClick={onClose}>オンライン相談を予約する（30分）</Button>
              <Button variant="ghost" full onClick={onClose}>関連資料を見る</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between bg-ink-900 px-6 py-4 text-white">
              <div>
                <p className="text-xs text-gold-400">無料・30分・営業電話はしません</p>
                <h3 className="text-lg font-bold">お問い合わせ / 移転相談</h3>
              </div>
              <button onClick={onClose} className="text-2xl text-slate-300 hover:text-white">×</button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink-900">ご相談内容 <span className="text-rose-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {purposes.map((p, i) => (
                    <button
                      key={p}
                      className={`rounded-full border px-3 py-1.5 text-sm ${i === 0 ? 'border-ink-900 bg-ink-900 text-white' : 'border-slate-300 text-slate-600 hover:border-ink-900'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-400">※ 内容に応じて最適な担当チームへ自動で振り分けます。</p>
              </div>
              {[
                { l: '会社名', ph: '株式会社サンプル' },
                { l: 'お名前', ph: '森 太郎' },
                { l: 'メールアドレス', ph: 'taro@example.com' },
                { l: '電話番号（任意）', ph: '03-0000-0000' },
              ].map((f) => (
                <div key={f.l}>
                  <label className="mb-1 block text-sm font-semibold text-ink-900">{f.l}</label>
                  <input
                    placeholder={f.ph}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-ink-900 focus:outline-none focus:ring-1 focus:ring-ink-900"
                  />
                </div>
              ))}
              <Button variant="gold" full onClick={() => setDone(true)}>
                この内容で送信する
              </Button>
              <p className="text-center text-xs text-slate-400">送信により<span className="underline">プライバシーポリシー</span>に同意したものとします。</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
