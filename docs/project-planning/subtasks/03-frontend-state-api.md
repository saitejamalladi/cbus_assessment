# 03 — Frontend State & API Client

- Role: Frontend
- Branch: `feature/frontend-state-api`

## Goals
Implement Redux Toolkit slice and API client supporting infinite scroll and case-sensitive search.

## Steps
1. Add slice
   - File: `src/store/customersSlice.ts`
   - State: `{ data, pageSize, hasNext, cursor, q, loading, error }`
   - Thunks: `fetchInitial(pageSize, q)`, `fetchMore(cursor, pageSize, q)`
2. Add types
   - File: `src/types/customer.ts`
   - `Customer { id: string; fullName: string; email: string; registrationDate: string }`
3. Add API client
   - File: `src/api/customers.ts`
   - `GET /customers?pageSize=25&cursor?&q?`
4. Wire slice to store
   - Update `src/store/index.ts`

## Local Test
```bash
npm run dev
# Dispatch thunks from a temporary page or use a simple effect
```

## Acceptance Criteria
- Slice compiles; API client hits placeholder endpoint (to be enabled post-backend)
- State updates for initial and subsequent loads

## Deliverables
- Customers slice and API client committed
