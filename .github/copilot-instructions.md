# AI Agent Coding Guidelines for Ibrahim-El-Khalil-Portfolio

## Project Overview
This repository hosts an interactive portfolio application with a 3D business card, AI-powered chat, and an admin dashboard. It is built using a modern tech stack, including React, FastAPI, and MongoDB. The project is containerized with Docker and supports both development and production environments.

## Key Components
- **Frontend**: Located in `frontend/`, built with React and styled using Tailwind CSS. Key files include:
  - `src/components/` for reusable UI components (e.g., `BusinessCardPage.js`, `AiChat.js`).
  - `src/services/` for API integrations (e.g., `apiService.js`, `geminiService.js`).
- **Backend**: Located in `backend/`, built with FastAPI. Key files include:
  - `server.py` for API endpoints.
  - `database.py` for MongoDB integration.
  - `models.py` for Pydantic data models.
- **Database**: MongoDB is used for persistent storage. Collections include `profile`, `experience`, `skills`, and `analytics`.
- **AI Integration**: Google Gemini API powers the AI chat assistant.

## Development Workflows
### Setting Up the Environment
1. Install dependencies:
   - Frontend: `yarn install` in `frontend/`.
   - Backend: `pip install -r requirements.txt` in `backend/`.
2. Configure environment variables:
   - Copy `.env.example` to `.env` in both `frontend/` and `backend/`.
   - Update API keys and database connection strings.

### Running the Application
- **Frontend**: `yarn start` in `frontend/`.
- **Backend**: `uvicorn server:app --reload --host 0.0.0.0 --port 8001` in `backend/`.
- Access the app at `http://localhost:3000`.

### Testing
- Use `curl` commands (examples in `README.md`) to test API endpoints.
- Manual testing steps are outlined in the `README.md`.

## Project-Specific Conventions
- **Component Structure**: Each React component has a dedicated file in `src/components/`.
- **API Services**: Use `apiService.js` for backend communication and `geminiService.js` for AI interactions.
- **Styling**: Tailwind CSS is used for all styling. Avoid inline styles.
- **Data Models**: Define all backend data models in `models.py` using Pydantic.

## Integration Points
- **Frontend-Backend Communication**: The frontend communicates with the backend via REST APIs. Update the `REACT_APP_BACKEND_URL` in `frontend/.env` to point to the backend server.
- **AI Chat**: Integrated using Google Gemini API. Update the `REACT_APP_GEMINI_API_KEY` in `frontend/.env`.
- **Database**: MongoDB connection is configured in `backend/.env`.

## Tips for AI Agents
- **Follow Existing Patterns**: Adhere to the established structure for components, services, and models.
- **Use the README**: Refer to the `README.md` for detailed setup and testing instructions.
- **Validate Changes**: Test all changes locally before committing. Use the provided `curl` commands for API testing.
- **Document Updates**: Update relevant documentation (e.g., `README.md`, `instructions.md`) when making significant changes.

## Example Tasks
- **Add a New API Endpoint**:
  1. Define the endpoint in `server.py`.
  2. Add the corresponding data model in `models.py`.
  3. Update `apiService.js` to include the new endpoint.
- **Create a New Component**:
  1. Add the component file in `src/components/`.
  2. Use Tailwind CSS for styling.
  3. Import and use the component in `App.js` or another relevant file.

For any questions or clarifications, refer to the `README.md` or contact the repository owner.