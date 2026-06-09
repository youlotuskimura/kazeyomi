import React from 'react'

// 小さな共通UI部品。モックアップの一貫した見た目を担う。

export function Badge({ children, tone = 'gold' }: { children: React.ReactNode; tone?: 'gold' | 'dark' | 'green' | 'red' }) {
  const tones: Record<string, string> = {
    gold: 'bg-gold-500/15 text-gold-600 border border-gold-500/30',
    dark: 'bg-ink-900 text-white',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border border-rose-200',
  }
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  full,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'ghost' | 'gold'
  onClick?: () => void
  full?: boolean
}) {
  const styles: Record<string, string> = {
    primary: 'bg-ink-900 text-white hover:bg-ink-800',
    gold: 'bg-gold-500 text-ink-900 hover:bg-gold-400 font-bold',
    outline: 'border border-ink-900/30 text-ink-900 hover:border-ink-900 hover:bg-ink-900/5',
    ghost: 'text-ink-700 hover:bg-ink-900/5',
  }
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${styles[variant]} ${full ? 'w-full' : ''}`}
    >
      {children}
    </button>
  )
}

export function Section({
  eyebrow,
  title,
  desc,
  children,
  className = '',
}: {
  eyebrow?: string
  title?: string
  desc?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`mx-auto max-w-6xl px-5 py-14 ${className}`}>
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-600">{eyebrow}</p>}
      {title && <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h2>}
      {desc && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{desc}</p>}
      <div className={title ? 'mt-8' : ''}>{children}</div>
    </section>
  )
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>
  )
}

// ワイヤーフレームであることを示す注記ラベル
export function WireNote({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
      {children}
    </span>
  )
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div className="h-full rounded-full bg-gold-500" style={{ width: `${value}%` }} />
    </div>
  )
}
