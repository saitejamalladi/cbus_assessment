import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Customer } from '../types/customer'
import { getCustomers } from '../api/customers'

export interface CustomersState {
  data: Customer[]
  pageSize: number
  hasNext: boolean
  cursor?: string
  q: string
  loading: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: CustomersState = {
  data: [],
  pageSize: 25,
  hasNext: false,
  cursor: undefined,
  q: '',
  loading: 'idle',
  error: undefined,
}

export const fetchInitial = createAsyncThunk(
  'customers/fetchInitial',
  async ({ pageSize, q }: { pageSize: number; q: string }) => {
    const resp = await getCustomers({ pageSize, q })
    return resp
  }
)

export const fetchMore = createAsyncThunk(
  'customers/fetchMore',
  async ({ cursor, pageSize, q }: { cursor?: string; pageSize: number; q: string }) => {
    const resp = await getCustomers({ pageSize, cursor, q })
    return resp
  }
)

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.q = action.payload
    },
    reset(state) {
      state.data = []
      state.cursor = undefined
      state.hasNext = false
      state.loading = 'idle'
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitial.pending, (state, action) => {
        state.loading = 'loading'
        state.error = undefined
        state.q = action.meta.arg.q
      })
      .addCase(fetchInitial.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.data = action.payload.data
        state.pageSize = action.payload.pageSize
        state.hasNext = action.payload.hasNext
        state.cursor = action.payload.cursor
      })
      .addCase(fetchInitial.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchMore.pending, (state, action) => {
        state.loading = 'loading'
        state.error = undefined
        state.q = action.meta.arg.q
      })
      .addCase(fetchMore.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.data = state.data.concat(action.payload.data)
        state.pageSize = action.payload.pageSize
        state.hasNext = action.payload.hasNext
        state.cursor = action.payload.cursor
      })
      .addCase(fetchMore.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message
      })
  },
})

export const { setSearch, reset } = customersSlice.actions
export default customersSlice.reducer
