import { useState } from 'react'
import type { Activity, DayKey, WeekSchedule } from '../types'
import { DAY_META } from '../types'
import { DayTimeline } from './dayTimeLine'

interface Props {
  schedule: WeekSchedule
  activities: Activity[]
  selectedId: number | null
  onPaint: (day: DayKey, index: number, activityId: number | null) => void
  onClearDay: (day: DayKey) => void
  onCopyDay: (sourceDay: DayKey, targetDay: DayKey) => void
}

export function WeekView({ schedule, activities, selectedId, onPaint, onClearDay, onCopyDay }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copyModal, setCopyModal] = useState<{ from: DayKey; open: boolean }>({ from: 'monday', open: false })

  const currentDay = DAY_META[currentIndex]

  function prev() {
    setCurrentIndex(i => (i === 0 ? DAY_META.length - 1 : i - 1))
  }

  function next() {
    setCurrentIndex(i => (i === DAY_META.length - 1 ? 0 : i + 1))
  }

  function hoursPlanned(day: DayKey) {
    return Math.round(schedule[day].filter(s => s !== null).length / 2)
  }

  function dayColors(day: DayKey) {
    const ids = [...new Set(schedule[day].filter((s): s is number => s !== null))]
    return ids.slice(0, 5).map(id => activities.find(a => a.id === id)?.color).filter(Boolean) as string[]
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

      {/* ── Tabs de días ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        gap: '2px',
        padding: '12px 16px 0',
        borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
        background: 'rgba(255, 255, 255, 0.7)',
        overflowX: 'auto',
        backdropFilter: 'blur(8px)',
      }}>
        {DAY_META.map(({ key, short }, idx) => {
          const active = idx === currentIndex
          const hours = hoursPlanned(key)
          const colors = dayColors(key)

          return (
            <button
              key={key}
              onClick={() => setCurrentIndex(idx)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px 12px',
                border: 'none',
                borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
                borderRadius: '4px 4px 0 0',
        background: active ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                cursor: 'pointer',
                minWidth: '70px',
                flexShrink: 0,
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.04)')}
              onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <span
                className="mono"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#2563eb' : '#6b7280',
                  transition: 'color 0.2s',
                }}
              >
                {short}
              </span>

              {/* Dots de colores mejorados */}
              <div style={{ display: 'flex', gap: '3px', height: '6px', alignItems: 'center' }}>
                {colors.length > 0
                  ? colors.map((c, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          background: c,
                          boxShadow: `0 0 8px ${c}99`,
                          transition: 'all 0.2s ease'
                        }} 
                      />
                    ))
                  : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)' }} />
                }
              </div>
              
              {hours > 0 && (
                <span style={{ fontSize: '9px', color: '#3b82f6', fontWeight: 600 }}>
                  {hours}h
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Header del día activo ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(249, 250, 251, 0.5) 100%)',
        backdropFilter: 'blur(8px)',
      }}>
        {/* Flecha anterior */}
        <button 
          onClick={prev} 
          style={{
            ...navBtn,
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: '#2563eb',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; 
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'; 
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ← 
        </button>

        {/* Nombre + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, marginLeft: '20px' }}>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937', letterSpacing: '-0.01em', display: 'block' }}>
              {currentDay.label}
            </span>
            {hoursPlanned(currentDay.key) > 0 && (
              <span className="mono" style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '0.05em' }}>
                {hoursPlanned(currentDay.key)}h planificadas
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Botón copiar mejorado */}
          {hoursPlanned(currentDay.key) > 0 && (
            <button
              onClick={() => setCopyModal({ from: currentDay.key, open: true })}
              className="btn btn-secondary btn-small"
              style={{
                padding: '8px 14px',
                fontSize: '12px',
              }}
              title="Copiar este día a otros días"
            >
              📋 Copiar
            </button>
          )}

          {/* Botón limpiar */}
          {hoursPlanned(currentDay.key) > 0 && (
            <button
              onClick={() => onClearDay(currentDay.key)}
              className="btn btn-danger btn-small"
              style={{
                padding: '8px 14px',
                fontSize: '12px',
              }}
              title="Limpiar todas las actividades"
            >
              🗑️ Limpiar
            </button>
          )}

          {/* Flecha siguiente */}
          <button 
            onClick={next}
            style={{
              ...navBtn,
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { 
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; 
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'; 
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <DayTimeline
          day={currentDay.key}
          slots={schedule[currentDay.key]}
          activities={activities}
          selectedId={selectedId}
          onPaint={onPaint}
        />
      </div>

      {/* Modal de copiar día */}
      {copyModal.open && (
        <div className="modal">
          <div className="modal-content">
            <h2 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
              📋 Copiar {DAY_META.find(d => d.key === copyModal.from)?.label}
            </h2>
            <p style={{ marginTop: 0, marginBottom: '24px', fontSize: '13px', color: '#6b7280' }}>
              Selecciona el día donde deseas copiar todas las actividades
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {DAY_META.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    onCopyDay(copyModal.from, key)
                    setCopyModal({ from: 'monday', open: false })
                  }}
                  disabled={key === copyModal.from}
                  className={key === copyModal.from ? '' : 'btn btn-secondary'}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'Syne, sans-serif',
                    cursor: key === copyModal.from ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    opacity: key === copyModal.from ? 0.4 : 1,
                    background: key === copyModal.from ? 'rgba(59, 130, 246, 0.04)' : undefined,
                    color: key === copyModal.from ? '#6b7280' : undefined,
                    border: key === copyModal.from ? '1px solid rgba(59, 130, 246, 0.2)' : undefined,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCopyModal({ from: 'monday', open: false })}
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '13px',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const navBtn: React.CSSProperties = {
  background: 'none',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  color: '#6b7280',
  fontSize: '14px',
  cursor: 'pointer',
  padding: '5px 12px',
  fontFamily: 'Syne, sans-serif',
  transition: 'all 0.1s',
  lineHeight: 1,
}