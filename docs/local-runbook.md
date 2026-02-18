# Local Development and Testing Runbook

This guide covers how to run and test the Customer Data Explorer application locally.

## Prerequisites

- Node.js 18+
- AWS credentials configured (for backend testing with real DynamoDB)
- Git

## Frontend Development

### Start Development Server

```bash
cd frontend/customer-explorer
npm install
npm run dev
```

The app will be available at http://localhost:5173

### Run Frontend Tests

```bash
cd frontend/customer-explorer
npm run test
```

## Backend Testing

### Run Unit Tests

```bash
cd backend/lambda
npm install
npm run test
```

### Build Lambda

```bash
cd backend/lambda
npm run build
```

## Data Seeding (One-time)

To populate the DynamoDB table with test data:

```bash
cd infra/db
npm install
npm run seed
```

This requires AWS credentials and the table to be deployed.

## Manual API Testing

After deploying the infrastructure, test the API endpoints:

### Get Customers (Initial Load)

```bash
curl "https://<api-id>.execute-api.<region>.amazonaws.com/prod/customers?pageSize=25"
```

### Search Customers

```bash
curl "https://<api-id>.execute-api.<region>.amazonaws.com/prod/customers?pageSize=25&q=John"
```

### Load More (Pagination)

```bash
curl "https://<api-id>.execute-api.<region>.amazonaws.com/prod/customers?pageSize=25&cursor=<base64-token>&q=John"
```

Replace `<api-id>`, `<region>`, and `<base64-token>` with actual values from your deployment.

## Infrastructure

### CDK Synth

```bash
cd infra/cdk
npm install
npm run synth
```

### CDK Deploy

```bash
cd infra/cdk
npm run cdk deploy
```

Requires AWS credentials.

## Troubleshooting

- If frontend tests fail, ensure all dependencies are installed.
- For backend tests, ensure AWS credentials are set if testing with real DynamoDB.
- API testing requires the stack to be deployed and seeded.

## CI/CD

CI runs automatically on PRs. For deployment, use the GitHub Actions deploy workflow with manual approval.
