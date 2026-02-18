# 13 — Deployment (CDK)

- Role: DevOps
- Branch: `feature/deployment`

## Goals
Deploy the backend stack to AWS using CDK and host the React frontend as a static site.

## Steps
1. Pre-check
   - AWS credentials set; region selected (e.g., `ap-southeast-2`)
   - `npx cdk bootstrap` done
2. Synthesize and deploy
   ```bash
   cd infra/cdk
   npx cdk synth
   npx cdk deploy
   ```
3. Capture outputs
   - API Gateway URL
   - DynamoDB table name
4. Verify
   ```bash
   curl "https://<api-id>.execute-api.<region>.amazonaws.com/prod/customers?pageSize=25"
   ```

---

## Frontend Hosting (Free-tier friendly)

Option A — AWS S3 static website (simplest)
1. Build the SPA
   ```bash
   cd frontend/customer-explorer
   npm run build
   # Output: dist/
   ```
2. Create an S3 bucket and enable static hosting (CLI)
   ```bash
   export BUCKET="customer-explorer-$(date +%s)"
   aws s3 mb s3://$BUCKET
   # Optional: enable public website hosting (for quick demo)
   aws s3 website s3://$BUCKET --index-document index.html --error-document index.html
   ```
3. Upload build artifacts
   ```bash
   aws s3 sync dist/ s3://$BUCKET --delete
   ```
4. Set `VITE_API_BASE_URL` to the API Gateway base URL in the frontend `.env` before build.
5. Access via S3 website endpoint (HTTP). For HTTPS and custom domain, add CloudFront (see Option B).

Option B — AWS CloudFront + S3 (HTTPS)
1. Create S3 bucket (private) and upload `dist/`.
2. Provision CloudFront distribution pointing to S3 origin.
3. Add behavior for SPA: rewrite 404s to `/index.html`.
4. (Optional) ACM certificate for custom domain.

Option C — GitHub Pages (zero AWS infra)
1. Build the SPA (`dist/`).
2. Use GitHub Actions to deploy `dist/` to `gh-pages` branch and enable Pages.
3. Set `VITE_API_BASE_URL` to the API Gateway URL.

Notes
- S3 website hosting is quickest for demo, fits free-tier. CloudFront adds HTTPS and better performance.
- Ensure CORS on API Gateway allows your frontend origin.

## Acceptance Criteria
- CDK deploy completes without errors
- API endpoint returns data
- Frontend is accessible (S3 or GitHub Pages) and can call the API

## Deliverables
- Deployed backend stack, frontend hosting instructions, and output notes committed
