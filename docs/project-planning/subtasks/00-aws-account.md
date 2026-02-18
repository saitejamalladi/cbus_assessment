# 00 — AWS Account & Credentials Setup

- Role: DevOps
- Branch: `feature/aws-account-setup`

## Goals
Prepare an AWS account and local credentials to enable CDK deploys and AWS CLI usage.

## Steps
1. Create AWS account
   - Go to https://aws.amazon.com/ and create a new account.
   - Sign in as the root user (email used to create the account).
   - Enable MFA on the root user (Security best practice).

2. Create IAM user for CLI/CDK (recommended)
   - AWS Console → IAM → Users → Add user (e.g., `cbus-dev`), select "Access key - Programmatic access".
   - Attach policy: `AdministratorAccess` (for quick CDK setup in a sandbox account). You can restrict later.
   - Create access key; download the `.csv` securely.

3. Configure credentials on macOS
   - Using AWS CLI (preferred):
     ```bash
     aws configure
     # AWS Access Key ID: <YOUR_ACCESS_KEY_ID>
     # AWS Secret Access Key: <YOUR_SECRET_ACCESS_KEY>
     # Default region name: ap-southeast-2  # choose your region
     # Default output format: json
     ```
   - Or set environment variables for the current shell:
     ```bash
     export AWS_ACCESS_KEY_ID="<YOUR_ACCESS_KEY_ID>"
     export AWS_SECRET_ACCESS_KEY="<YOUR_SECRET_ACCESS_KEY>"
     export AWS_DEFAULT_REGION="ap-southeast-2"
     ```
   - Optional named profile:
     - Create `~/.aws/credentials` and `~/.aws/config` for a profile (e.g., `cbus`).
     - Use `AWS_PROFILE=cbus` during CDK/CLI commands.

4. Verify credentials
   ```bash
   aws sts get-caller-identity
   # Should return your account, user ARN
   ```

5. Bootstrap CDK (first time per account/region)
   ```bash
   cd infra/cdk
   npx cdk bootstrap
   ```

## Acceptance Criteria
- AWS CLI returns identity successfully
- CDK bootstrap completes

## Deliverables
- None (account-level); proceed to infrastructure subtask after verification
