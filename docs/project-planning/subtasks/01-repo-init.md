# 01 — Repo Init & Standards

- Role: DevOps
- Branch: `feature/repo-init`

## Goals
Initialize the repository with baseline tooling and conventions to ensure consistency.

## Steps
1. Create git repo and initial commit
   ```bash
   git init
   git checkout -b feature/repo-init
   echo "# Customer Data Explorer" > README.md
   git add README.md
   git commit -m "chore: init repo with README"
   ```
2. Add `.editorconfig`, `.gitignore`, and Node version file
   ```bash
   echo "root = true\n[*]\nend_of_line = lf\nindent_style = space\nindent_size = 2" > .editorconfig
   echo "node_modules/\n.dist/\n.out/\n.env\n.DS_Store" > .gitignore
   echo "18" > .nvmrc
   git add .editorconfig .gitignore .nvmrc
   git commit -m "chore: add editorconfig, gitignore, nvmrc"
   ```
3. Add repository structure placeholders
   ```bash
   mkdir -p frontend backend/lambda infra/cdk docs
   git add frontend backend/lambda infra/cdk docs
   git commit -m "chore: scaffold folders"
   ```

## Build & Test
- N/A (structure only)

## Acceptance Criteria
- Repo initialized with basic config files
- Folder structure present

## Deliverables
- Initial branch with repository standards
