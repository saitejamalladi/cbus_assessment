# 10 — CI Pipeline (GitHub Actions)

- Role: DevOps
- Branch: `feature/ci-pipeline`

## Goals
Set up CI to build and test frontend and backend.

## Steps
1. Workflow: `.github/workflows/ci.yml`
   - Node 18 matrix for `frontend/customer-explorer` and `backend/lambda`
   - Steps: checkout, setup-node, install, build, test
2. Optional deploy workflow (manual)
   - `.github/workflows/deploy.yml`: synth + manual approval deploy

## Local Test
- N/A (run via GitHub)

## Acceptance Criteria
- CI runs tests on PRs
- Optional deploy workflow available with manual gate

## Deliverables
- CI workflow files committed
