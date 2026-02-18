# 02 — Frontend Scaffold (React + Vite + TypeScript)

- Role: Frontend
- Branch: `feature/frontend-scaffold`

## Goals
Scaffold a React app (Vite) with TypeScript and Redux Toolkit to support infinite scroll and search.

## Steps
1. Create Vite React app (TypeScript)
   ```bash
   cd frontend
   npm create vite@latest customer-explorer -- --template react-ts
   cd customer-explorer
   npm install
   ```
2. Add Redux Toolkit and react-redux
   ```bash
   npm install @reduxjs/toolkit react-redux
   ```
3. Install Material UI (MUI)
    ```bash
    npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
    ```
3. Set up store and provider
    - Create `src/store/index.ts` and wrap app in `Provider` inside `src/main.tsx`.
    - Wrap the app with MUI `ThemeProvider` and a base theme.
       Example (snippet in `src/main.tsx`):
       ```tsx
       import { ThemeProvider, createTheme } from '@mui/material/styles';
       const theme = createTheme();
       // ...
       <Provider store={store}>
          <ThemeProvider theme={theme}>
             <App />
          </ThemeProvider>
       </Provider>
       ```
4. Add base app layout
   - Implement `src/App.tsx` with a placeholder Customers view.
5. Add script aliases
   ```bash
   npm pkg set scripts.dev="vite"
   npm pkg set scripts.build="tsc && vite build"
   npm pkg set scripts.start="vite preview"
   npm pkg set scripts.test="jest"
   ```

## Local Run
```bash
npm run dev
# Visit http://localhost:5173
```

## Acceptance Criteria
- React (Vite) app runs locally
- Redux store integrated and provider wraps the app
- MUI installed and theme applied via `ThemeProvider`

## Deliverables
- Frontend scaffold committed to branch
