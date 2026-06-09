import { Role } from './data'
import { Button } from './ui'

// グローバルヘッダー。
// モック操作用に「ログイン状態」「ロール（ワーカー/管理者）」を切り替えるトグルを内蔵。
export default function Header({
  loggedIn,
  role,
  onLogin,
  onLogout,
  onRoleChange,
  onContact,
  onNav,
}: {
  loggedIn: boolean
  role: Role
  onLogin: () => void
  onLogout: () => void
  onRoleChange: (r: Role) => void
  onContact: () => void
  onNav: (key: string) => void
}) {
  const publicNav = [
    { key: 'search', label: 'オフィスを探す' },
    { key: 'features', label: 'できること' },
    { key: 'culture', label: '街・カルチャー' },
    { key: 'matching', label: 'ビジネスマッチング' },
    { key: 'archive', label: 'イベント' },
  ]
  const memberNav =
    role === 'admin'
      ? [
          { key: 'home', label: 'ダッシュボード' },
          { key: 'health', label: '健康経営' },
          { key: 'matching', label: 'マッチング' },
          { key: 'archive', label: 'アーカイブ' },
        ]
      : [
          { key: 'home', label: 'ホーム' },
          { key: 'city', label: '街を使う' },
          { key: 'community', label: 'コミュニティ' },
          { key: 'archive', label: 'イベント' },
        ]
  const nav = loggedIn ? memberNav : publicNav

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <button onClick={() => onNav('home')} className="flex items-center gap-2 text-white">
          <span className="grid h-8 w-8 place-items-center rounded bg-gold-500 font-black text-ink-900">H</span>
          <span className="text-lg font-bold tracking-wide">
            HILLS <span className="text-gold-500">ONE</span>
          </span>
        </button>

        <nav className="hidden flex-1 items-center gap-5 lg:flex">
          {nav.map((n) => (
            <button
              key={n.key}
              onClick={() => onNav(n.key)}
              className="text-sm font-medium text-slate-200 transition-colors hover:text-gold-400"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {loggedIn ? (
            <>
              {/* ロール切替（モック用） */}
              <div className="hidden items-center rounded-full bg-white/10 p-0.5 text-xs sm:flex">
                <button
                  onClick={() => onRoleChange('worker')}
                  className={`rounded-full px-3 py-1 font-semibold ${role === 'worker' ? 'bg-gold-500 text-ink-900' : 'text-slate-300'}`}
                >
                  ワーカー
                </button>
                <button
                  onClick={() => onRoleChange('admin')}
                  className={`rounded-full px-3 py-1 font-semibold ${role === 'admin' ? 'bg-gold-500 text-ink-900' : 'text-slate-300'}`}
                >
                  企業管理者
                </button>
              </div>
              <button className="relative text-slate-200 hover:text-white" title="通知">
                <span className="text-xl">🔔</span>
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500" />
              </button>
              <button onClick={onLogout} className="text-sm font-medium text-slate-300 hover:text-white">
                ログアウト
              </button>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gold-500 font-bold text-ink-900">森</div>
            </>
          ) : (
            <>
              <button onClick={() => onNav('archive')} className="hidden text-sm font-medium text-slate-200 hover:text-gold-400 sm:block">
                資料ダウンロード
              </button>
              <button onClick={onLogin} className="text-sm font-medium text-slate-200 hover:text-white">
                ログイン
              </button>
              <Button variant="gold" onClick={onContact}>
                相談する
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
