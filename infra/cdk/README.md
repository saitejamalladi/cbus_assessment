# Customer Infrastructure (CDK)

## Prerequisites
- Node.js 18+
- AWS credentials with permissions to deploy DynamoDB, Lambda, and API Gateway resources
- Bootstrap your target account once via `npx cdk bootstrap`
- Build the Lambda code: `cd backend/lambda && npm run build`

## Install
```bash
cd infra/cdk
npm install
```

## Useful Commands
- `npm run build` — compile TypeScript
- `npm run synth` — generate the CloudFormation template
- `npm run cdk deploy` — deploy the stack (requires credentials)

## Deployment
1. Ensure Lambda is built: `cd ../../backend/lambda && npm run build`
2. Deploy: `npm run cdk deploy`
3. Note the outputs: API Gateway URL and DynamoDB table name
4. Seed data: `cd ../../infra/db && npm run seed`

## Outputs
- `ApiGatewayUrl`: Base URL for the API (e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod)
- `DynamoDBTableName`: Name of the customers table
```
