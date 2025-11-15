import React from 'react'

export function PixelButton({ children, onClick, variant = 'primary', className = '' }) {
  const colors = {
    primary: 'bg-yellow-300 text-black border-4 border-black hover:translate-y-0.5',
    secondary: 'bg-green-300 text-black border-4 border-black hover:translate-y-0.5',
    danger: 'bg-red-300 text-black border-4 border-black hover:translate-y-0.5'
  }
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-extrabold shadow-[4px_4px_0_0_#000] active:shadow-[2px_2px_0_0_#000] active:translate-y-0.5 transition-transform ${colors[variant]} ${className}`}
    >
      <span className="tracking-widest">{children}</span>
    </button>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white/80 backdrop-blur border-4 border-black p-4 shadow-[6px_6px_0_0_#000] ${className}`}>
      {children}
    </div>
  )
}

export function Stat({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-xs uppercase tracking-widest text-black/70">{label}</div>
      <div className="px-2 py-1 bg-black text-yellow-300 border-2 border-black font-mono text-sm">{value}</div>
    </div>
  )
}
