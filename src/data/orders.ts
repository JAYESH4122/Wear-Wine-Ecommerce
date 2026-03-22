export type OrderStatus = 'Delivered' | 'Processing'

export type OrderSummary = {
  id: string
  date: string
  total: number
  status: OrderStatus
  items: number
}

export const orders: OrderSummary[] = [
  { id: 'ORD-2023-010', date: 'Oct 24, 2023', total: 129.99, status: 'Delivered', items: 2 },
  { id: 'ORD-2023-089', date: 'Nov 12, 2023', total: 84.5, status: 'Processing', items: 1 },
]

