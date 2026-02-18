# 04 — Frontend UI Components

- Role: Frontend
- Branch: `feature/frontend-ui`

## Goals
Build accessible UI: Customers table, SearchBar, and InfiniteScroll sentinel.

## Steps
1. CustomersTable
   - File: `src/components/CustomersTable.tsx`
   - Use MUI `Table`, `TableHead`, `TableRow`, `TableCell`
   - Columns: ID, Full Name, Email, Registration Date
   - Format dates ISO8601 → localized
2. SearchBar
   - File: `src/components/SearchBar.tsx`
   - Use MUI `TextField`
   - Controlled input for `q`; debounce (300–500ms); on change reset list and call `fetchInitial(pageSize, q)`
3. InfiniteScrollSentinel
   - File: `src/components/InfiniteScrollSentinel.tsx`
   - IntersectionObserver to trigger `fetchMore(cursor, pageSize, q)` when visible
   - Guard with `hasNext` and `loading`
   - Use MUI `Box` for layout and optionally show `CircularProgress` during loading
4. App assembly
   - File: `src/App.tsx`
   - Compose components and connect to Redux store

## Local Run
```bash
npm run dev
# Verify search and scroll UI events (API may return mock until backend is ready)
```

## Acceptance Criteria
- Components render and trigger store updates
- Accessibility basics: focusable controls, readable table headers
- MUI components used for table and inputs; theme applied

## Deliverables
- UI components committed
