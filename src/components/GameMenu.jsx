import React from 'react'

function NeonButton({ children, variant = 'primary', onClick }) {
  const colors = {
    primary: 'from-cyan-400 to-blue-500 shadow-cyan-500/40',
    secondary: 'from-fuchsia-400 to-pink-500 shadow-pink-500/40',
    danger: 'from-amber-400 to-red-500 shadow-amber-500/40'
  }
  return (
    <button
      onClick={onClick}
      className={`relative w-full select-none overflow-hidden rounded-2xl px-6 py-3 font-semibold tracking-wide text-white transition-all duration-200
                  bg-gradient-to-br ${colors[variant]} shadow-[0_0_24px_var(--tw-shadow-color)]
                  hover:shadow-[0_0_36px_var(--tw-shadow-color)] hover:scale-[1.03] active:scale-[0.98]
                  before:absolute before:inset-0 before:rounded-2xl before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-10
                  after:pointer-events-none after:absolute after:inset-[-2px] after:rounded-2xl after:bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.35),transparent_60%)]`}
    >
      <span className="drop-shadow-[0_2px_10px_rgba(0,255,255,0.4)]">{children}</span>
    </button>
  )
}

function Panel({ children }) {
  return (
    <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-white/10 p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
      {/* subtle inner border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/20 [box-shadow:inset_0_0_40px_rgba(0,200,255,0.08)]" />
      {children}
    </div>
  )
}

export default function GameMenu() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0b0f14] via-[#080b10] to-[#06080c] text-white">
      {/* animated background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 animate-blob-slow rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-[28rem] w-[28rem] animate-blob-slower rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-10 h-72 w-72 animate-blob-slowest rounded-full bg-blue-500/20 blur-3xl" />

      {/* subtle moving noise/gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,0,200,0.06),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(0,150,255,0.05),transparent_50%)] animate-gradient-shift" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-screen-xl items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl animate-pop-in">
          <Panel>
            <div className="relative space-y-6">
              <div className="text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-[0.2em] drop-shadow-[0_6px_24px_rgba(0,255,255,0.35)]">
                  GAME MENU
                </h1>
                <p className="mt-3 text-sm md:text-base text-white/80">
                  Select an option to begin. Futuristic HUD vibes with neon glow and glass finish.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <NeonButton variant="primary">Play</NeonButton>
                <NeonButton variant="secondary">Settings</NeonButton>
                <NeonButton variant="danger">Exit</NeonButton>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

export { NeonButton, Panel }
