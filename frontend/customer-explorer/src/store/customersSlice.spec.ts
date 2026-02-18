import { configureStore } from '@reduxjs/toolkit'
import reducer, { fetchInitial, fetchMore } from './customersSlice'

jest.mock('../api/customers', () => ({
  getCustomers: jest.fn(),
}))

import { getCustomers } from '../api/customers'

describe('customersSlice thunks', () => {
  const makeStore = () => configureStore({ reducer: { customers: reducer } })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetchInitial success updates state', async () => {
    ;(getCustomers as jest.Mock).mockResolvedValue({
      data: [
        { id: '1', fullName: 'Alice', email: 'alice@example.com', registrationDate: new Date().toISOString() },
      ],
      pageSize: 20,
      hasNext: true,
      cursor: 'cur1',
    })
    const store = makeStore()

    await store.dispatch(fetchInitial({ pageSize: 20, q: '' }) as any)

    const s = store.getState().customers
    expect(s.loading).toBe('succeeded')
    expect(s.data).toHaveLength(1)
    expect(s.hasNext).toBe(true)
    expect(s.cursor).toBe('cur1')
  })

  it('fetchMore success appends data', async () => {
    ;(getCustomers as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: '1', fullName: 'Alice', email: 'alice@example.com', registrationDate: new Date().toISOString() },
      ],
      pageSize: 20,
      hasNext: true,
      cursor: 'cur1',
    })
    ;(getCustomers as jest.Mock).mockResolvedValueOnce({
      data: [
        { id: '2', fullName: 'Bob', email: 'bob@example.com', registrationDate: new Date().toISOString() },
      ],
      pageSize: 20,
      hasNext: false,
      cursor: 'cur2',
    })

    const store = makeStore()
    await store.dispatch(fetchInitial({ pageSize: 20, q: '' }) as any)
    await store.dispatch(fetchMore({ pageSize: 20, q: '', cursor: 'cur1' }) as any)

    const s = store.getState().customers
    expect(s.data).toHaveLength(2)
    expect(s.data[1].id).toBe('2')
    expect(s.hasNext).toBe(false)
    expect(s.cursor).toBe('cur2')
  })

  it('fetchInitial failure sets error', async () => {
    ;(getCustomers as jest.Mock).mockRejectedValue(new Error('Network down'))
    const store = makeStore()
    await store.dispatch(fetchInitial({ pageSize: 20, q: '' }) as any)

    const s = store.getState().customers
    expect(s.loading).toBe('failed')
    expect(s.error).toBe('Network down')
  })
})
