import { useState, useEffect } from 'react'

const TARGET = Date.now() + 1000 * 60 * 60 * 24 * 3

function getTimeLeft() {
  const diff = Math.max(0, TARGET - Date.now())
  return {
    hours:   Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function AnnouncementBar({ onDismiss }) {
  const [time, setTime] = useState(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="sticky top-0 z-30 bg-black">
      <div className="flex items-center justify-between px-5 py-6">
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <span
            className="text-white text-[11px] font-semibold tracking-[0.12em] uppercase"
          >
            Once it's gone it's gone
          </span>

          <div className="w-px h-3 bg-white/20" />

          <div className="flex items-center gap-1 text-white/70 text-[11px] font-mono tracking-wider">
            <span className="text-white font-bold">{time ? pad(time.hours) : '--'}</span>
            <span className="opacity-40">:</span>
            <span className="text-white font-bold">{time ? pad(time.minutes) : '--'}</span>
            <span className="opacity-40">:</span>
            <span className="text-white font-bold">{time ? pad(time.seconds) : '--'}</span>
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            onClick={onDismiss}
            className="text-white/30 hover:text-white/80 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
