import { useState } from 'react'
import { Role } from './hills/data'
import Header from './hills/Header'
import Footer from './hills/Footer'
import PublicHome from './hills/PublicHome'
import WorkerHome from './hills/WorkerHome'
import AdminHome from './hills/AdminHome'
import ContactModal from './hills/ContactModal'
import { ArchivePage, MatchingPage, HealthPage, SimplePage } from './hills/FeaturePages'
import { Button } from './hills/ui'

// HILLS ONE — 森ビル オフィス事業向け統合プラットフォーム モックアップ
// 認証状態（loggedIn）とロール（worker/admin）で画面を出し分ける。
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [role, setRole] = useState<Role>('worker')
  const [page, setPage] = useState('home')
  const [contactOpen, setContactOpen] = useState(false)

  const go = (key: string) => {
    setPage(key)
    window.scrollTo({ top: 0 })
  }
  const openContact = () => setContactOpen(true)

  function renderPage() {
    // ホーム：認証状態とロールで出し分け
    if (page === 'home') {
      if (!loggedIn) return <PublicHome onContact={openContact} onNav={go} />
      return role === 'admin' ? (
        <AdminHome onContact={openContact} onNav={go} />
      ) : (
        <WorkerHome onNav={go} />
      )
    }
    if (page === 'archive') return <ArchivePage onContact={openContact} loggedIn={loggedIn} />
    if (page === 'matching') return <MatchingPage onContact={openContact} />
    if (page === 'health') return <HealthPage />
    if (page === 'city')
      return (
        <SimplePage
          title="街を使う（回遊）"
          desc="商業・飲食のモバイルオーダー、美術館・展望台のワーカー特典、館内ナビ・会議室予約をHILLS IDで。"
          items={[
            { icon: '🍽️', t: 'モバイルオーダー・優待', d: '館内飲食を事前注文・テナント割引。' },
            { icon: '🖼️', t: '美術館・展望台 特典', d: '社員価格のチケットと限定鑑賞会。' },
            { icon: '🧭', t: '館内ナビ・会議室予約', d: '混雑状況とラウンジ・会議室の空き予約。' },
            { icon: '🏛️', t: '会員制クラブ', d: '会員ランクに応じたクラブ・ラウンジ利用。' },
            { icon: '🚶', t: '回遊パスポート', d: '街の利用履歴を蓄積しレコメンド。' },
            { icon: '💳', t: 'HILLS ID ウォレット', d: 'ポイント・特典・電子社員証を一元管理。' },
          ]}
        />
      )
    if (page === 'community')
      return (
        <SimplePage
          title="コミュニティ（ワーカーSNS）"
          desc="興味タグ・部活・テーマ別グループ、1on1ランチマッチング、スキルシェアでワーカー同士をつなぐ。"
          items={[
            { icon: '🏃', t: '部活・興味グループ', d: 'ランニング、読書、勉強会など。' },
            { icon: '🍱', t: 'ランチマッチング', d: '別テナントの人と共通の興味でマッチ。' },
            { icon: '💡', t: 'スキルシェア', d: '社外の知見を気軽に交換。' },
            { icon: '📣', t: 'タイムライン・掲示板', d: 'グループの新着・告知をフィード表示。' },
          ]}
        />
      )
    if (page === 'search')
      return (
        <SimplePage
          title="オフィスを探す"
          desc="拠点・面積・賃料レンジで検討。事例とともに、内見・オンライン相談へ。"
          items={[
            { icon: '🏙️', t: '拠点一覧', d: '虎ノ門 / 麻布台 / 六本木 ほか。' },
            { icon: '📐', t: '区画・面積検索', d: '坪数・賃料レンジで絞り込み。' },
            { icon: '📈', t: '導入事例', d: '入居企業の成果を定量で。' },
          ]}
        />
      )
    if (page === 'features')
      return (
        <SimplePage
          title="プラットフォームでできること"
          desc="ワーカー・総務人事・経営層、それぞれの価値を統合IDで提供します。"
          items={[
            { icon: '👤', t: 'ワーカー向け', d: '文化・健康・回遊・コミュニティ。' },
            { icon: '🧑‍💼', t: '総務・人事向け', d: '管理・福利厚生・健康経営の可視化。' },
            { icon: '🏢', t: '経営層向け', d: 'ビジネスマッチング・ブランド・採用力。' },
          ]}
        />
      )
    if (page === 'culture')
      return (
        <SimplePage
          title="ヒルズの街・カルチャー"
          desc="美術館・展望台・会員制クラブなど、森ビルだけの文化資産。"
          items={[
            { icon: '🎨', t: '美術館', d: 'アートとビジネスが交差する日常。' },
            { icon: '🌃', t: '展望台 / TOKYO NODE', d: '眺望と体験型コンテンツ。' },
            { icon: '🥂', t: '会員制クラブ', d: 'ビジネスと交流の特別な場。' },
          ]}
        />
      )
    return null
  }

  return (
    <div className="min-h-screen font-sans text-ink-900">
      <Header
        loggedIn={loggedIn}
        role={role}
        onLogin={() => {
          setLoggedIn(true)
          go('home')
        }}
        onLogout={() => {
          setLoggedIn(false)
          go('home')
        }}
        onRoleChange={(r) => {
          setRole(r)
          go('home')
        }}
        onContact={openContact}
        onNav={go}
      />

      {renderPage()}

      <Footer loggedIn={loggedIn} />

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {/* モバイル固定CTA（未ログイン時のみ＝常時CV露出） */}
      {!loggedIn && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:hidden">
          <div className="flex-1">
            <Button variant="outline" full onClick={openContact}>資料DL</Button>
          </div>
          <div className="flex-1">
            <Button variant="gold" full onClick={openContact}>相談する</Button>
          </div>
        </div>
      )}

      {/* デモ操作ヒント（提案レビュー用） */}
      <DemoHint loggedIn={loggedIn} />
    </div>
  )
}

function DemoHint({ loggedIn }: { loggedIn: boolean }) {
  const [show, setShow] = useState(true)
  if (!show) return null
  return (
    <div className="fixed bottom-20 right-4 z-30 max-w-xs rounded-xl bg-ink-900 p-4 text-xs text-slate-200 shadow-xl sm:bottom-4">
      <div className="flex items-start justify-between gap-2">
        <p className="font-bold text-gold-400">モックアップ操作ガイド</p>
        <button onClick={() => setShow(false)} className="text-slate-400 hover:text-white">×</button>
      </div>
      <p className="mt-2 leading-relaxed">
        {loggedIn
          ? 'ヘッダー右の「ワーカー / 企業管理者」で出し分けを切替。ログアウトで新規検討層TOPに戻ります。'
          : '右上「ログイン」で既存テナント向けTOPに切替。ログイン後、ロール切替が可能です。'}
      </p>
    </div>
  )
}
