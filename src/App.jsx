import { useEffect, useMemo, useState } from 'react'
import { PixelButton, Card, Stat } from './components/RetroUI'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <Spline scene="https://prod.spline.design/OIGfFUmCnZ3VD8gH/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c0c0c]" />
      <div className="absolute inset-0 flex items-end md:items-center justify-center pb-6">
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-300 drop-shadow-[4px_4px_0_#000] tracking-widest">
            Retro Diet Quest
          </h1>
          <p className="mt-3 md:mt-4 text-white text-sm md:text-base font-semibold bg-black/50 inline-block px-4 py-2 border-2 border-yellow-300">
            Level up your health with age-based diet plans and daily quests.
          </p>
        </div>
      </div>
    </div>
  )
}

function DietPlan({ age }) {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!age) return
    // Guard: only fetch when within valid range
    if (age < 13 || age > 70) {
      setPlan(null)
      setError('Enter an age between 13 and 70 to see a plan')
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`${API_BASE}/api/diet-plan/${age}`)
      .then(async (r) => {
        const data = await r.json().catch(() => null)
        if (!r.ok) throw new Error((data && (data.detail || data.message)) || 'Failed to load plan')
        return data
      })
      .then((data) => {
        if (cancelled) return
        setPlan(data)
      })
      .catch((e) => {
        if (cancelled) return
        setPlan(null)
        setError(e.message || 'Could not load plan')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [age])

  if (!age) return null
  if (loading) return <div className="text-white">Loading...</div>
  if (error) return (
    <Card className="mt-4 bg-red-100">
      <div className="text-red-700 font-semibold">{error}</div>
    </Card>
  )
  if (!plan) return null

  const focus = Array.isArray(plan.focus) ? plan.focus.join(', ') : String(plan.focus || '')
  const meals = Array.isArray(plan.meals) ? plan.meals : []

  return (
    <Card className="mt-4">
      <h3 className="text-2xl font-extrabold text-black mb-2">Suggested Plan</h3>
      <div className="flex flex-wrap gap-3 items-center">
        <Stat label="Calories" value={plan.calories ?? ''} />
        <Stat label="Focus" value={focus} />
      </div>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        {meals.map((m, idx) => (
          <div key={idx} className="border-2 border-black p-3 bg-yellow-50">
            <div className="font-extrabold text-black">{m.name}</div>
            <ul className="list-disc ml-5 text-sm">
              {(Array.isArray(m.items) ? m.items : []).map((i, j) => (
                <li key={j}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  )
}

function App() {
  const [step, setStep] = useState('create')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])

  const numericAge = Number(age)
  const canCreate = useMemo(() => name.trim().length > 1 && numericAge >= 13 && numericAge <= 70, [name, numericAge])

  const createProfile = async () => {
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age: numericAge })
    })
    const data = await res.json()
    setUser(data)
    setStep('play')
    loadTasks(data._id)
  }

  const loadTasks = async (uid) => {
    const res = await fetch(`${API_BASE}/api/profile/${uid}/tasks`)
    const data = await res.json()
    setTasks(data)
  }

  const addTask = async (title) => {
    if (!user) return
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user._id, title })
    })
    const data = await res.json()
    setTasks(prev => [data, ...prev])
  }

  const toggleTask = async (taskId, completed) => {
    await fetch(`${API_BASE}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    })
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed } : t))
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      <Hero />

      <div className="max-w-5xl mx-auto px-4 -mt-10 md:-mt-16 relative z-10">
        {step === 'create' && (
          <Card className="bg-yellow-100">
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-black font-extrabold mb-1">Hero Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} className="w-full border-4 border-black p-2 font-mono" placeholder="e.g., Mario" />
              </div>
              <div>
                <label className="block text-black font-extrabold mb-1">Age (13-70)</label>
                <input type="number" value={age} onChange={e=>setAge(e.target.value)} className="w-full border-4 border-black p-2 font-mono" />
              </div>
              <div className="flex gap-2">
                <PixelButton onClick={createProfile} variant="primary" className="w-full" disabled={!canCreate}>Start Quest</PixelButton>
              </div>
            </div>
            <DietPlan age={numericAge} />
          </Card>
        )}

        {step === 'play' && user && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-2 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-black">
                  <div className="text-xl font-extrabold">{user.name}</div>
                  <div className="text-sm">Age: {user.age}</div>
                </div>
                <div className="flex gap-3">
                  <Stat label="Level" value={user.level ?? 1} />
                  <Stat label="XP" value={user.xp ?? 0} />
                </div>
              </div>

              <div className="mt-4">
                <TaskEditor onAdd={addTask} />
                <TaskList tasks={tasks} onToggle={toggleTask} />
              </div>
            </Card>
            <Card className="bg-yellow-100">
              <h3 className="text-black font-extrabold text-xl">Diet Plan</h3>
              <DietPlan age={user.age} />
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function TaskEditor({ onAdd }) {
  const [title, setTitle] = useState('')
  return (
    <div className="flex gap-2">
      <input className="flex-1 border-4 border-black p-2 font-mono" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Add a quest..." />
      <PixelButton onClick={() => { if(title.trim()) { onAdd(title.trim()); setTitle('') } }} variant="secondary">Add</PixelButton>
    </div>
  )
}

function TaskList({ tasks, onToggle }) {
  if (!tasks?.length) return <div className="text-black">No quests yet. Add one!</div>
  return (
    <div className="mt-3 space-y-2">
      {tasks.map(t => (
        <div key={t._id} className={`flex items-center justify-between border-4 border-black p-2 ${t.completed ? 'bg-green-200' : 'bg-white'}`}>
          <div className="text-black font-semibold">{t.title}</div>
          <PixelButton variant={t.completed ? 'danger' : 'secondary'} onClick={() => onToggle(t._id, !t.completed)}>
            {t.completed ? 'Undo' : 'Complete'}
          </PixelButton>
        </div>
      ))}
    </div>
  )
}

export default App
