# 08 — Backend Unit Tests

- Role: QA/Backend
- Branch: `feature/backend-tests`

## Goals
Add Jest tests for validation, query construction, and response mapping.

## Steps
1. Test config
   - Ensure `jest`/`ts-jest` configured in `backend/lambda`
2. Write tests
   - `validateQuery.test.ts`: pageSize bounds, cursor/q parsing
   - `queryCustomers.test.ts`: builds correct DynamoDB params with and without `q`, respects cursor
   - `responseMapping.test.ts`: maps DynamoDB items to API shape
   - `errorHandling.test.ts`: 400 and 500 envelopes

## Local Test
```bash
npm run test
```

## Acceptance Criteria
- All backend tests pass
- Coverage includes validation, filter, pagination, error mapping

## Deliverables
- Backend test suite committed
