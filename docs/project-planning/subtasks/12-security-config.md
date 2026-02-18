# 12 — Security & Config

- Role: DevSecOps
- Branch: `feature/security-config`

## Goals
Apply environment configuration and basic security hygiene.

## Steps
1. AWS credentials & profiles
   - Follow `Prerequisites` in `docs/tech-design.md`
   - Use IAM user profile (avoid root keys)
2. Environment variables
   - Frontend (.env): `VITE_API_BASE_URL` set to your API Gateway base URL
     - File: `frontend/customer-explorer/.env`
     - Example:
       ```env
       VITE_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com/prod
       ```
   - Lambda (CDK env): `TABLE_NAME`, `INDEX_NAME`, allowed origins for CORS
     - Configure via CDK stack (Lambda environment), not Secrets Manager
     - Example (CDK): `lambdaFn.addEnvironment('TABLE_NAME', table.tableName)`
 3. .env hygiene
   - Ensure `.env` is in `.gitignore`
   - Do not commit any environment files containing keys/URLs you consider sensitive
3. CORS
   - Restrict origins to local dev and planned hosting origin
4. Secrets management
   - No AWS Secrets Manager for MVP; use `.env` locally and CDK Lambda environment for deploy
   - Avoid hardcoded values in code; prefer environment configuration

## Acceptance Criteria
- Config documented and applied without exposing secrets

## Deliverables
- Config updates and documentation committed
