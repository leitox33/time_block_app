import { useState, useEffect } from 'react'
import type { Activity, DayKey, WeekSchedule } from '../types'
import { DAY_META } from '../types'

function emptyWeek(): WeekSchedule {
  return Object.fromEntries(
    DAY_META.map(d => [d.key, Array(48).fill(null)])
  ) as WeekSchedule
}

export function useSchedule() {
  const [activities, setActivities] = useState<Activity[]>(() => {
    try { return JSON.parse(localStorage.getItem('tb_activities') || '[]') }
    catch { return [] }
  })

  const [schedule, setSchedule] = useState<WeekSchedule>(() => {
    try { return JSON.parse(localStorage.getItem('tb_schedule') || 'null') || emptyWeek() }
    catch { return emptyWeek() }
  })

  useEffect(() => {
    localStorage.setItem('tb_activities', JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    localStorage.setItem('tb_schedule', JSON.stringify(schedule))
  }, [schedule])

  function addActivity(name: string, summary: string, color: string) {
    setActivities(prev => [...prev, { id: Date.now(), name, summary, color }])
  }

  function removeActivity(id: number) {
    setActivities(prev => prev.filter(a => a.id !== id))
    setSchedule(prev => {
      const next = { ...prev }
      for (const { key } of DAY_META) {
        next[key] = next[key].map(s => s === id ? null : s)
      }
      return next
    })
  }

  function paintSlot(day: DayKey, index: number, activityId: number | null) {
    setSchedule(prev => {
      const slots = [...prev[day]]
      slots[index] = activityId
      return { ...prev, [day]: slots }
    })
  }

  function clearDay(day: DayKey) {
    setSchedule(prev => ({ ...prev, [day]: Array(48).fill(null) }))
  }

  function copyDay(sourceDay: DayKey, targetDay: DayKey) {
    setSchedule(prev => ({
      ...prev,
      [targetDay]: [...prev[sourceDay]]
    }))
  }

  function getActivity(id: number | null) {
    return activities.find(a => a.id === id)
  }

  return { activities, schedule, addActivity, removeActivity, paintSlot, clearDay, copyDay, getActivity }
}