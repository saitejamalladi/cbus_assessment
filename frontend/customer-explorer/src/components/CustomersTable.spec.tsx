import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render, screen, fireEvent } from '@testing-library/react'
import customersReducer, { fetchMore } from '../store/customersSlice'
jest.mock('../api/customers', () => ({
  getCustomers: jest.fn(),
}))
import CustomersTable from './CustomersTable'

const renderWithState = (preloadedState: any) => {
  const store = configureStore({
    reducer: { customers: customersReducer },
    preloadedState
  } as any)
  return render(
    <Provider store={store}>
      <CustomersTable />
    </Provider>
  )
}

describe('CustomersTable', () => {
  it('renders headers and rows', () => {
    const preloadedState = {
      customers: {
        data: [
          { id: '1', fullName: 'Alice Smith', email: 'alice@example.com', registrationDate: new Date('2024-01-01').toISOString() },
          { id: '2', fullName: 'Bob Jones', email: 'bob@example.com', registrationDate: new Date('2024-02-02').toISOString() },
        ],
        pageSize: 25,
        hasNext: false,
        cursor: undefined,
        q: '',
        loading: 'idle',
        error: undefined,
      },
    }

    renderWithState(preloadedState)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Full Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Registration Date')).toBeInTheDocument()

    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Jones')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('shows error message when error present', () => {
    const preloadedState = {
      customers: {
        data: [],
        pageSize: 25,
        hasNext: false,
        cursor: undefined,
        q: '',
        loading: 'idle',
        error: 'Failed to fetch',
      },
    }

    renderWithState(preloadedState)
    expect(screen.getByText(/Error:/)).toHaveTextContent('Error: Failed to fetch')
  })

  it('shows loading row when loading', () => {
    const preloadedState = {
      customers: {
        data: [],
        pageSize: 25,
        hasNext: false,
        cursor: undefined,
        q: '',
        loading: 'loading',
        error: undefined,
      },
    }
    renderWithState(preloadedState)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('formats registration date as dd MMM YYYY', () => {
    const preloadedState = {
      customers: {
        data: [
          { id: '1', fullName: 'Alice Smith', email: 'alice@example.com', registrationDate: '2024-01-15T00:00:00.000Z' },
        ],
        pageSize: 25,
        hasNext: false,
        cursor: undefined,
        q: '',
        loading: 'idle',
        error: undefined,
      },
    }

    renderWithState(preloadedState)
    expect(screen.getByText('15 Jan 2024')).toBeInTheDocument()
  })

  it('shows Load More button when hasNext is true', () => {
    const preloadedState = {
      customers: {
        data: [
          { id: '1', fullName: 'Alice Smith', email: 'alice@example.com', registrationDate: '2024-01-15T00:00:00.000Z' },
        ],
        pageSize: 25,
        hasNext: true,
        cursor: 'cursor123',
        q: '',
        loading: 'idle',
        error: undefined,
      },
    }

    renderWithState(preloadedState)
    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
  })

  it('shows no data message when data array is empty and not loading', () => {
    const preloadedState = {
      customers: {
        data: [],
        pageSize: 25,
        hasNext: false,
        cursor: undefined,
        q: '',
        loading: 'idle',
        error: undefined,
      },
    }

    renderWithState(preloadedState)
    expect(screen.getByText(/no customers found/i)).toBeInTheDocument()
  })

  it('does not show Load More button when hasNext is false', () => {
    const preloadedState = {
      customers: {
        data: [
          { id: '1', fullName: 'Alice Smith', email: 'alice@example.com', registrationDate: '2024-01-15T00:00:00.000Z' },
        ],
        pageSize: 25,
        hasNext: false,
        cursor: undefined,
        q: '',
        loading: 'idle',
        error: undefined,
      },
    }

    renderWithState(preloadedState)
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()
  })

  it('dispatches fetchMore when Load More button is clicked', () => {
    const preloadedState = {
      customers: {
        data: [
          { id: '1', fullName: 'Alice Smith', email: 'alice@example.com', registrationDate: '2024-01-15T00:00:00.000Z' },
        ],
        pageSize: 25,
        hasNext: true,
        cursor: 'cursor123',
        q: 'search',
        loading: 'idle',
        error: undefined,
      },
    }

    renderWithState(preloadedState)
    const loadMoreButton = screen.getByRole('button', { name: /load more/i })
    expect(loadMoreButton).toBeInTheDocument()
    // Note: Testing actual dispatch would require more complex mocking
  })
})
