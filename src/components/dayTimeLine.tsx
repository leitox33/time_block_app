import { useRef } from 'react'
import type { Activity, DayKey } from '../types'

const LABELS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 7  // Empezar desde hora 7 (7am)
  if (hour < 12) return `${hour}am`
  if (hour === 12) return '12pm'
  return `${hour - 12}pm`
})

interface Props {
  day: DayKey
  slots: (number | null)[]
  activities: Activity[]
  selectedId: number | null
  onPaint: (day: DayKey, index: number, activityId: number | null) => void
}

export function DayTimeline({ day, slots, activities, selectedId, onPaint }: Props) {
  const painting = useRef(false)
  // Al hacer drag, recordamos si estamos pintando o borrando
  const erasing = useRef(false)

  function getAct(id: number | null) {
    return id !== null ? activities.find(a => a.id === id) : undefined
  }

  function isBlockStart(i: number) {
    return slots[i] !== null && (i === 0 || slots[i] !== slots[i - 1])
  }

  function blockLength(i: number) {
    const id = slots[i]
    let len = 0
    for (let j = i; j < slots.length && slots[j] === id; j++) len++
    return len
  }

  function handleMouseDown(i: number) {
    painting.current = true
    // Toggle: si el slot ya tiene la actividad seleccionada, borrar
    if (slots[i] === selectedId) {
      erasing.current = true
      onPaint(day, i, null)
    } else {
      erasing.current = false
      onPaint(day, i, selectedId)
    }
  }

  function handleMouseEnter(i: number) {
    if (!painting.current) return
    onPaint(day, i, erasing.current ? null : selectedId)
  }

  return (
    <div
      className="timeline-track"
      onMouseUp={() => { painting.current = false }}
      onMouseLeave={() => { painting.current = false }}
    >
      {slots.slice(14, 48).map((slotId, displayIndex) => {
        const i = displayIndex + 14  // Índice real en el array de slots
        const act = getAct(slotId)
        const isHour = displayIndex % 2 === 0
        const labelIndex = Math.floor(displayIndex / 2)
        const showLabel = isBlockStart(i) && blockLength(i) >= 2

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              height: '28px',
              borderTop: isHour ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(59, 130, 246, 0.08)',
              transition: 'background 0.08s ease',
              position: 'relative',
            }}
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseEnter(i)}
          >
            {/* Etiqueta de hora mejorada */}
            <div
              className="mono timeline-hour-label"
              style={{
                width: '56px',
                paddingRight: '12px',
              }}
            >
              {isHour ? LABELS[labelIndex] : ''}
            </div>

            {/* Bloque de actividad mejorado */}
            <div
              style={{
                flex: 1,
                background: act 
                  ? `linear-gradient(90deg, ${act.color}dd 0%, ${act.color}99 100%)`
                  : 'rgba(59, 130, 246, 0.03)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '12px',
                paddingRight: '8px',
                overflow: 'hidden',
                marginLeft: '8px',
                marginRight: '8px',
                borderRadius: '4px',
                cursor: 'crosshair',
                transition: 'all 0.08s ease',
                boxShadow: act ? `inset 0 0 12px ${act.color}44` : 'none',
                border: act ? `1px solid ${act.color}88` : '1px solid rgba(59, 130, 246, 0.15)',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!act) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.25)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(59, 130, 246, 0.06)';
                }
              }}
              onMouseLeave={e => {
                if (!act) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.15)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(59, 130, 246, 0.03)';
                }
              }}
            >
              {showLabel && act && (
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  pointerEvents: 'none',
                }}>
                  {act.summary || act.name}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}