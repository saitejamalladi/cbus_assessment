# 11 — Local Runbook & Testing

- Role: QA
- Branch: `feature/local-runbook`

## Goals
Document local development and testing steps for frontend and backend.

## Steps
1. Frontend dev server
   ```bash
   cd frontend/customer-explorer
   npm run dev
   # http://localhost:5173
   ```
2. Backend unit tests
   ```bash
   cd backend/lambda
   npm run test
   ```
3. Manual API testing (after deploy)
   - Use `curl` or Postman against API Gateway URL
   - Examples:
   ```bash
   curl "https://<api-id>.execute-api.<region>.amazonaws.com/prod/customers?pageSize=25"
   curl "https://<api-id>.execute-api.<region>.amazonaws.com/prod/customers?pageSize=25&q=John"
   curl "https://<api-id>.execute-api.<region>.amazonaws.com/prod/customers?pageSize=25&cursor=<token>&q=John"
   ```

## Acceptance Criteria
- Clear steps to run and test locally
- Example commands verified

## Deliverables
- Runbook committed
