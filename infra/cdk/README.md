# Customer Infrastructure (CDK)

## Prerequisites
- Node.js 18+
- AWS credentials with permissions to deploy DynamoDB, Lambda, and API Gateway resources
- Bootstrap your target account once via `npx cdk bootstrap`

## Install
```bash
cd infra/cdk
npm install
```

## Useful Commands
- `npm run build` — compile TypeScript
- `npm run synth` — generate the CloudFormation template
- `npm run cdk deploy` — deploy the stack (requires credentials)
```
