# 06 — CDK Infra Scaffold (DynamoDB, Lambda, API Gateway)

- Role: DevOps
- Branch: `feature/cdk-infra-scaffold`

## Goals
Create an AWS CDK (TypeScript) app provisioning DynamoDB `customers`, Lambda, and API Gateway with CORS.

## Steps
1. Initialize CDK app
   ```bash
   cd infra/cdk
   npm init -y
   npm install aws-cdk-lib constructs
   npm install -D typescript ts-node @types/node
   npx tsc --init
   mkdir -p bin lib
   ```
2. CDK entry and stack
   - `bin/app.ts`: init CDK app and stack
   - `lib/customer-stack.ts`: define DynamoDB table, Lambda, API Gateway
3. Resources
   - DynamoDB table `customers` (PK: `id`), attributes: `full_name`, `email`, `registration_date`, GSI `registration_date_index`
   - Lambda (Node.js 18) with env vars and IAM dynamodb read perms; timeout 10s
   - API Gateway REST: `/customers` GET; CORS allow dev origin
4. Bootstrap (first time only)
   ```bash
   # Ensure AWS credentials are set (see prerequisites in tech design)
   npx cdk bootstrap
   ```

## Build & Synth
```bash
npx cdk synth
```

## Acceptance Criteria
- CDK synth succeeds and renders expected resources

## Deliverables
- CDK app committed
