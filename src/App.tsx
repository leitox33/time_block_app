import { useState } from 'react'
import { ActivityPanel } from './components/activityPanel'
import { WeekView } from './components/weekView'
import { useSchedule } from './hooks/useSchedule'
import './App.css'

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { activities, schedule, addActivity, removeActivity, paintSlot, clearDay, copyDay } = useSchedule()

  const now = new Date()
  const dateStr = now.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  }).toUpperCase()

  return (
    <div className="app-container">
      {/* Topbar Premium */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0 0 16px rgba(59, 130, 246, 0.4), inset 0 0 8px rgba(59, 130, 246, 0.2)',
            animation: 'glow 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: '16px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            background: 'linear-gradient(90deg, #1f2937 0%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            ⏱️ TIME BLOCK
          </span>
        </div>
        <span className="mono" style={{
          fontSize: '11px',
          color: '#6b7280',
          letterSpacing: '0.08em',
          fontWeight: 600,
        }}>
          {dateStr}
        </span>
      </header>

      {/* Body */}
      <div className="content-wrapper">
        <ActivityPanel
          activities={activities}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={addActivity}
          onRemove={id => {
            removeActivity(id)
            if (selectedId === id) setSelectedId(null)
          }}
        />
        <div className="main-area">
          <WeekView
            schedule={schedule}
            activities={activities}
            selectedId={selectedId}
            onPaint={paintSlot}
            onClearDay={clearDay}
            onCopyDay={copyDay}
          />
        </div>
      </div>
    </div>
  )
}

export default App