// フッター。会員/非会員で導線の重心は変わるが、モックでは共通表示。
export default function Footer({ loggedIn }: { loggedIn: boolean }) {
  const cols = loggedIn
    ? [
        { h: 'サービス', items: ['街を使う', 'イベント', 'コミュニティ', 'ウェルネス'] },
        { h: '管理', items: ['従業員管理', '健康経営', 'ファシリティ', '請求・契約'] },
        { h: 'サポート', items: ['ヘルプ', '担当に相談', '設定', 'HILLS ID'] },
      ]
    : [
        { h: 'オフィス', items: ['拠点一覧', '区画検索', '導入事例', '料金'] },
        { h: 'プラットフォーム', items: ['できること', '街・カルチャー', 'マッチング', '資料DL'] },
        { h: '会社情報', items: ['森ビルについて', '採用', 'お問い合わせ', 'プライバシー'] },
      ]
  return (
    <footer className="bg-ink-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <span className="grid h-8 w-8 place-items-center rounded bg-gold-500 font-black text-ink-900">H</span>
            <span className="text-lg font-bold">HILLS <span className="text-gold-500">ONE</span></span>
          </div>
          <p className="mt-3 text-xs text-slate-400">One ID, One City, One Network.</p>
          <div className="mt-4 flex gap-2 text-xs">
            <span className="rounded border border-white/20 px-2 py-1">日本語</span>
            <span className="rounded border border-white/20 px-2 py-1">EN</span>
            <span className="rounded border border-white/20 px-2 py-1">中文</span>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="text-sm font-bold text-white">{c.h}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {c.items.map((i) => (
                <li key={i} className="hover:text-gold-400 cursor-pointer">{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © 2026 HILLS ONE（モックアップ）. これは提案用の架空デモであり、森ビル株式会社の公式サービスではありません。
      </div>
    </footer>
  )
}
