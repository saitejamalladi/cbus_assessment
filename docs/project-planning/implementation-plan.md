# Implementation Plan — Customer Data Explorer

This plan breaks the build into 14 focused subtasks aligned to typical roles. Each subtask follows the same workflow: create a feature branch from `main`, implement, run local tests, build, and commit. Developers will manually raise PRs after validation.

## Roles
- Frontend
- Backend
- DevOps
- QA
- Docs

## Subtasks Overview
0. AWS Account & Credentials Setup — DevOps
1. Repo Init & Standards — DevOps
2. Frontend Scaffold (React + Vite + TS) — Frontend
3. Frontend State & API Client — Frontend
4. Frontend UI Components — Frontend
5. Frontend Unit Tests — QA/Frontend
6. CDK Infra Scaffold (DynamoDB, Lambda, API Gateway) — DevOps
7. Lambda Handler (getCustomers) — Backend
8. Backend Unit Tests — QA/Backend
9. Data Seeding (DynamoDB) — DevOps
10. CI Pipeline (GitHub Actions) — DevOps
11. Local Runbook & Testing — QA
12. Security & Config — DevSecOps
13. Deployment (CDK) — DevOps
14. Documentation & Tech Design Refresh — Docs

Refer to each subtask for step-by-step instructions and acceptance criteria:
- See files under `docs/project-planning/subtasks/`:
  - `00-aws-account.md`
  - `01-repo-init.md`
  - `02-frontend-scaffold.md`
  - `03-frontend-state-api.md`
  - `04-frontend-ui.md`
  - `05-frontend-tests.md`
  - `06-cdk-infra-scaffold.md`
  - `07-lambda-handler.md`
  - `08-backend-tests.md`
  - `09-data-seeding.md`
  - `10-ci-pipeline.md`
  - `11-local-runbook.md`
  - `12-security-config.md`
  - `13-deployment.md`
  - `14-documentation.md`
