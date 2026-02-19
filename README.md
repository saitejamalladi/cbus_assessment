# Customer Data Explorer

A full-stack web application for exploring customer data with infinite scroll and search functionality. Built with React, TypeScript, Redux Toolkit, AWS Lambda, API Gateway, and DynamoDB.

Live application: https://d2do4hucyqhan4.cloudfront.net/

## Features

- **Infinite Scroll**: Load more customers as you scroll
- **Search**: Search by name or email
- **Responsive UI**: Material UI components
- **Serverless Backend**: AWS Lambda with API Gateway
- **Data Storage**: DynamoDB with GSI for efficient queries

## Architecture

![Architecture Diagram](docs/architecture.png)

## Sequence Diagram

```mermaid
sequenceDiagram
  autonumber
  participant User
  participant FE as React App (Redux Toolkit)
  participant API as API Gateway
  participant L as Lambda (getCustomers)
  participant DB as DynamoDB (customers)
  User->>FE: Navigate to Customers
  FE->>API: GET /customers?pageSize=25&q=
  API->>L: Invoke Lambda (initial load)
  L->>DB: Query by registration_date desc, limit 25 (no filter)
  DB-->>L: Items + LastEvaluatedKey
  L-->>API: 200 {data, pageSize, hasNext: true, cursor}
  API-->>FE: JSON response
  FE->>User: Render table (rows)
  User->>FE: Type search term "John"
  FE->>API: GET /customers?pageSize=25&q=John
  API->>L: Invoke Lambda (search initial)
  L->>DB: Query by registration_date desc, limit 25 with FilterExpression contains(full_name, "John") OR contains(email, "John")
  DB-->>L: Filtered items + LastEvaluatedKey
  L-->>API: 200 {data, pageSize, hasNext: true, cursor}
  API-->>FE: JSON response
  FE->>User: Replace list with filtered rows
  User->>FE: Scroll near bottom
  FE->>API: GET /customers?pageSize=25&cursor=eyJ...&q=John
  API->>L: Invoke Lambda (load more)
  L->>DB: Query with ExclusiveStartKey (same FilterExpression)
  DB-->>L: Next items + LastEvaluatedKey
  alt hasNext
    L-->>API: 200 {data, pageSize, hasNext: true, cursor}
  else no more
    L-->>API: 200 {data, pageSize, hasNext: false}
  end
  API-->>FE: JSON response
  FE->>User: Append rows to list
```

*For more details, refer to [docs/tech-design.md](docs/tech-design.md)*

## Quick Start

### Prerequisites

- Node.js 20
- AWS CLI configured with credentials
- CDK bootstrapped account

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   cd cbus-assessment

   # Frontend
   cd frontend/customer-explorer
   npm install

   # Backend
   cd ../../backend/lambda
   npm install
   npm run build
   ```

2. **Start frontend dev server**
   ```bash
   cd frontend/customer-explorer
   npm run dev
   ```
   Open http://localhost:5173

3. **Run tests**
   ```bash
   # Frontend
   cd frontend/customer-explorer
   npm run test

   # Backend
   cd ../../backend/lambda
   npm run test
   ```

### Deployment

1. **Deploy infrastructure and frontend**
   ```bash
   cd infra/cdk
   npm run cdk deploy
   ```

2. **Seed data**
   ```bash
   cd ../db
   npm run seed
   ```

3. **Access the application**
   - Frontend: Check CDK outputs for `FrontendUrl`
   - API: Check CDK outputs for `ApiGatewayUrl`

## API Usage

See [API Documentation](docs/api.md) for endpoint details.

Example:
```bash
curl "https://<api-id>.execute-api.<region>.amazonaws.com/prod/customers?pageSize=25&q=John"
```

## Documentation

- [Functional Requirements](docs/functional-requirements.md)
- [Technical Design](docs/tech-design.md)
- [Local Runbook](docs/local-runbook.md)
- [API Reference](docs/api.md)
