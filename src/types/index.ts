export type Activity = {
  id: number
  name: string
  summary: string
  color: string
}

export type DayKey =
  | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  | 'friday' | 'saturday' | 'sunday'

export type WeekSchedule = {
  [day in DayKey]: (number | null)[]
}

export const DAY_META: { key: DayKey; label: string; short: string }[] = [
  { key: 'monday',    label: 'Lunes',     short: 'LUN' },
  { key: 'tuesday',  label: 'Martes',    short: 'MAR' },
  { key: 'wednesday',label: 'Miércoles', short: 'MIE' },
  { key: 'thursday', label: 'Jueves',    short: 'JUE' },
  { key: 'friday',   label: 'Viernes',   short: 'VIE' },
  { key: 'saturday', label: 'Sábado',    short: 'SAB' },
  { key: 'sunday',   label: 'Domingo',   short: 'DOM' },
]