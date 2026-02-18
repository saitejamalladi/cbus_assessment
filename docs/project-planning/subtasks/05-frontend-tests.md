# 05 — Frontend Unit Tests

- Role: QA/Frontend
- Branch: `feature/frontend-tests`

## Goals
Add Jest + React Testing Library and cover critical components and thunks.

## Steps
1. Install testing deps
   ```bash
   npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest whatwg-url
   npx ts-jest config:init
   ```
2. Configure Jest
   - Files: `jest.config.js`, `setupTests.ts`
   - Add `@testing-library/jest-dom` setup
3. Write tests
   - `CustomersTable.spec.tsx`: renders headers/rows
   - `SearchBar.spec.tsx`: debounces and dispatches initial fetch
   - `InfiniteScrollSentinel.spec.tsx`: triggers `fetchMore` when visible
   - `customersSlice.spec.ts`: reducer/thunks happy/error paths
4. Add npm script
   ```bash
   npm pkg set scripts.test="jest"
   ```

## Local Test
```bash
npm run test
```

## Acceptance Criteria
- All frontend tests pass locally
- Minimum coverage for components and thunks

## Deliverables
- Test suite committed
