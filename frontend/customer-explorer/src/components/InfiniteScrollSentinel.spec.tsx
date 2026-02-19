import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, waitFor } from '@testing-library/react'
import { act } from 'react'
import customersReducer from '../store/customersSlice'
jest.mock('../api/customers', () => ({
  getCustomers: jest.fn().mockResolvedValue({ data: [], pageSize: 20, hasNext: false }),
}))
import InfiniteScrollSentinel from './InfiniteScrollSentinel'

describe('InfiniteScrollSentinel', () => {
  const setup = (preloadedState?: any) => {
    const store = configureStore({ reducer: { customers: customersReducer }, preloadedState } as any)
    const view = render(
      <Provider store={store}>
        <InfiniteScrollSentinel />
      </Provider>
    )
    return { store, ...view }
  }

  it('triggers fetchMore when becoming visible and hasNext', async () => {
    const preloadedState = {
      customers: {
        data: [],
        pageSize: 25,
        hasNext: true,
        cursor: undefined,
        q: '',
        loading: 'idle',
        error: undefined,
      },
    }
    const { store } = setup(preloadedState)

    const io = (globalThis as any).__lastIO
    expect(io).toBeDefined()
    act(() => {
      io.trigger(true)
    })

    await waitFor(() => expect(store.getState().customers.loading === 'loading' || store.getState().customers.loading === 'succeeded').toBeTruthy())
  })
})
