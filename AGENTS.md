# Agent Hackathon Operating Rules

This document outlines the strict engineering standards, architectural rules, and operational guidelines for this hackathon project.

---

## 1. Frontend Standards
* **Tech Stack**: Use exclusively **React 19**, **TypeScript**, and **Tailwind CSS** for frontend components.
* **Component Constraints**: 
  * Do **NOT** install external UI component libraries without explicit permission.
  * Do **NOT** alter `tailwind.config.ts` or theme configuration without explicit permission.
* **Resilience & UX**:
  * Implement robust error handling and loading skeletons/states for **every** asynchronous call.
  * **Never** assume an API call returns `200 OK`; always handle non-2xx status codes, network errors, and edge cases gracefully.

---

## 2. Backend Standards
* **Tech Stack**: FastAPI, Python, SQLModel, Alembic.
* **Directory Structure**:
  * **Schemas & Data Models**: Keep all data models and schemas organized strictly in `backend/app/models/` using **SQLModel**.
  * **API Routes**: Keep all endpoints and routers strictly organized in `backend/app/api/`.
* **Database & Migrations**:
  * Automatically generate and apply Alembic migrations whenever schemas or database models are modified:
    ```bash
    uv run alembic revision --autogenerate -m "<migration_description>"
    uv run alembic upgrade head
    ```

---

## 3. Workflow & Code Modification Rules
* **Scoped Diffs**: Keep code changes minimal, clean, and strictly scoped to the files requested.
* **No Unnecessary Refactoring**: Do not reformat or modify unrelated components, config files, or helper utilities unless directly required by the task.
* **Type Safety**: Maintain strict TypeScript typing across the frontend and complete Pydantic/SQLModel type annotations across the backend.
