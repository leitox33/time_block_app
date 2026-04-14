import { useState } from 'react'
import type { Activity } from '../types'

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#ec4899', '#f43f5e',
]

interface Props {
  activities: Activity[]
  selectedId: number | null
  onSelect: (id: number | null) => void
  onAdd: (name: string, summary: string, color: string) => void
  onRemove: (id: number) => void
}

export function ActivityPanel({ activities, selectedId, onSelect, onAdd, onRemove }: Props) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [summary, setSummary] = useState('')
  const [color, setColor] = useState('#3b82f6')

  function submit() {
    if (!name.trim()) return
    onAdd(name.trim(), summary.trim(), color)
    setName(''); setSummary(''); setColor('#3b82f6')
    setAdding(false)
  }

  return (
    <aside
      className="activity-panel"
      style={{
        minWidth: '260px',
        width: '260px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Título */}
      <div className="activity-panel-header">
        <h3 className="activity-panel-title">
          🎯 Actividades
        </h3>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="btn btn-primary btn-small"
            title="Crear nueva actividad"
          >
            +
          </button>
        )}
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: '4px', minHeight: 0, width: '100%' }}>
        {activities.length === 0 && !adding && (
          <div className="empty-state" style={{ padding: '32px 16px' }}>
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">Sin actividades</div>
            <p style={{ margin: 0, fontSize: '11px', color: '#778899' }}>
              Crea una para empezar
            </p>
          </div>
        )}

        {activities.map(act => (
          <div
            key={act.id}
            className={`activity-item ${selectedId === act.id ? 'selected' : ''}`}
            onClick={() => onSelect(selectedId === act.id ? null : act.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: selectedId === act.id 
                ? `linear-gradient(135deg, ${act.color}22 0%, ${act.color}11 100%)`
                : 'rgba(59, 130, 246, 0.05)',
              borderLeft: `3px solid ${selectedId === act.id ? act.color : 'transparent'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              border: selectedId === act.id ? `1px solid ${act.color}40` : '1px solid transparent',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, ${act.color}33 0%, ${act.color}1a 100%)`;
            }}
            onMouseLeave={e => {
              if (selectedId !== act.id) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(59, 130, 246, 0.05)';
              }
            }}
          >
            {/* Color dot mejorado */}
            <div style={{
              width: '32px', 
              height: '32px', 
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${act.color} 0%, ${act.color}dd 100%)`,
              flexShrink: 0,
              boxShadow: selectedId === act.id 
                ? `0 0 16px ${act.color}66, inset 0 0 8px ${act.color}44`
                : `0 2px 8px ${act.color}33`,
              transition: 'all 0.2s ease',
            }} />

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8e8e8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {act.name}
              </div>
              {act.summary && (
                <div style={{ fontSize: '11px', color: '#a0aec0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {act.summary}
                </div>
              )}
            </div>

            {/* Botón eliminar */}
            <button
              onClick={e => { e.stopPropagation(); onRemove(act.id) }}
              className="btn btn-danger btn-small"
              style={{ padding: '4px 8px', fontSize: '12px' }}
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Formulario */}
      {adding && (
        <div className="anim-slide-up" style={{ padding: '12px', borderTop: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label className="label" style={{ marginBottom: '4px', display: 'block' }}>Nombre *</label>
            <input
              autoFocus
              placeholder="Ej: Estudiar, Ejercicio..."
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={inputStyle}
            />
          </div>
          
          <div>
            <label className="label" style={{ marginBottom: '4px', display: 'block' }}>Resumen</label>
            <input
              placeholder="Ej: 1 hora"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={inputStyle}
            />
          </div>

          {/* Color swatches mejorados */}
          <div>
            <label className="label" style={{ marginBottom: '6px', display: 'block' }}>Color</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '4px 0' }}>
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '6px', background: c,
                    border: 'none', cursor: 'pointer', padding: 0,
                    outline: color === c ? `2px solid ${c}` : 'none',
                    outlineOffset: '3px',
                    transform: color === c ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    boxShadow: color === c ? `0 0 12px ${c}88` : 'none',
                  }}
                  title={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={submit} className="btn btn-primary" style={{ flex: 1 }}>Agregar</button>
            <button onClick={() => { setAdding(false); setName(''); setSummary(''); setColor('#3b82f6') }} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
          </div>
        </div>
      )}

    </aside>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid #2a3f66',
  borderRadius: '8px',
  color: '#e8e8e8',
  padding: '10px 12px',
  fontFamily: 'inherit',
  fontSize: '13px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  outline: 'none',
}