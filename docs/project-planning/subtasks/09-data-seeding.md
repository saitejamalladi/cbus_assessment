# 09 — Data Seeding (DynamoDB)

- Role: DevOps
- Branch: `feature/data-seeding`

## Goals
Seed ~1–5k synthetic customer rows for demo.

## Steps
1. Seed script
   - File: `infra/db/scripts/seed.ts`
   - Generate customers with fields: `id`, `first_name`, `last_name`, `full_name`, `email`, `registration_date`
   - Batch write to DynamoDB `customers`
2. Optional: CDK Custom Resource
   - Attach to stack to run once (guard for duplicates)
3. Run locally (one-off)
   ```bash
   # With AWS creds set
   ts-node infra/db/scripts/seed.ts
   ```

## Acceptance Criteria
- Table populated with synthetic data
- No duplicate seed on re-run (idempotent or guarded)

## Deliverables
- Seed script committed
