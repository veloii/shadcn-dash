import { Color } from '@/lib/utils'

export type ChartProps<T> = {
  color: Color
  data: T[]
  x: keyof T
  y: keyof T
  height?: number
}
