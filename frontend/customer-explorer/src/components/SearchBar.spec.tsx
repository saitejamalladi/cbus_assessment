import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import customersReducer from '../store/customersSlice'
jest.mock('../api/customers', () => ({
  getCustomers: jest.fn().mockResolvedValue({ data: [], pageSize: 20, hasNext: false }),
}))
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  const setupStoreAndRender = () => {
    const store = configureStore({ reducer: { customers: customersReducer } })
    const spy = jest.spyOn(store, 'dispatch')
    const view = render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    )
    return { store, spy, ...view }
  }

  it('dispatches initial fetch on mount', async () => {
    const { store } = setupStoreAndRender()

    await waitFor(() => expect(store.getState().customers.loading === 'succeeded' || store.getState().customers.loading === 'loading').toBeTruthy())
  })

})
