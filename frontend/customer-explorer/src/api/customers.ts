import type { Customer } from '../types/customer'

export interface CustomersResponse {
  data: Customer[]
  pageSize: number
  hasNext: boolean
  cursor?: string
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || ''

export async function getCustomers(params: {
  pageSize: number
  cursor?: string
  q?: string
}): Promise<CustomersResponse> {
  if (!baseUrl) {
    // Fallback mock for local dev before backend is available
    return {
      data: Array.from({ length: Math.min(params.pageSize, 5) }).map((_, i) => ({
        id: `mock-${i + 1}`,
        fullName: `Mock User ${i + 1}`,
        email: `mock${i + 1}@example.com`,
        registrationDate: new Date().toISOString(),
      })),
      pageSize: params.pageSize,
      hasNext: false,
    }
  }

  const url = new URL(`${baseUrl}/customers`)
  url.searchParams.set('pageSize', String(params.pageSize))
  if (params.cursor) url.searchParams.set('cursor', params.cursor)
  if (params.q !== undefined) url.searchParams.set('q', params.q)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return (await res.json()) as CustomersResponse
}
