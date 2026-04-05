import { formatDate, isToday } from '../utils'

interface Props {
  dates: string[]
  selected: string
  onSelect: (date: string) => void
}

export default function DateSelector({ dates, selected, onSelect }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {dates.map((d) => {
        const { short, dow, isWeekend } = formatDate(d)
        const active = d === selected
        const today = isToday(d)
        return (
          <button
            key={d}
            onClick={() => onSelect(d)}
            className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border-2 transition-all min-w-[56px]
              ${active
                ? 'border-green-500 bg-green-500 text-white shadow-md'
                : 'border-gray-200 bg-white hover:border-green-300 text-gray-700'
              }`}
          >
            <span className={`text-xs font-medium ${isWeekend && !active ? (dow === '日' ? 'text-red-500' : 'text-blue-500') : ''}`}>
              {dow}
            </span>
            <span className="text-sm font-bold">{short}</span>
            {today && (
              <span className={`text-[10px] font-medium mt-0.5 ${active ? 'text-green-100' : 'text-green-600'}`}>
                今日
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
