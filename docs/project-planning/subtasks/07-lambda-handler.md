# 07 — Lambda Handler (getCustomers)

- Role: Backend
- Branch: `feature/lambda-handler`

## Goals
Implement Lambda that supports infinite scroll and case-sensitive search.

## Steps
1. Project setup
   ```bash
   cd backend/lambda
   npm init -y
   npm install aws-sdk @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
   npm install -D typescript ts-node @types/node jest ts-jest
   npx tsc --init
   ```
2. Handler implementation
   - File: `src/handlers/getCustomers.ts`
   - Parse `pageSize` (1..100), optional `cursor`, optional `q`
   - DynamoDB query on GSI by `registration_date` with `Limit = pageSize`
   - If `q`: `FilterExpression` `contains(full_name, :q) OR contains(email, :q)`
   - Map items to `{ id, fullName, email, registrationDate }`
   - Return envelope `{ data, pageSize, hasNext, cursor? }` or error envelope
3. Export Lambda
   - `index.ts` re-export handler
4. Build script
   ```bash
   npm pkg set scripts.build="tsc"
   npm run build
   ```

## Local Test (unit)
```bash
npm run test
```

## Acceptance Criteria
- Handler builds and unit tests pass
- Input validation and error envelopes implemented

## Deliverables
- Lambda handler committed
