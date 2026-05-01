# CodeBase Explainer Tool

> AI-powered web application that helps developers instantly understand unfamiliar codebases through visual structure mapping, dependency analysis, and intelligent explanations.

---

## 🚀 Features

### Core Features
- 🔗 **GitHub URL Input** - Paste any public GitHub repository URL for instant analysis
- 📁 **ZIP File Upload** - Upload local projects as ZIP files
- 🌳 **Interactive File Tree** - VS Code-like explorer with expandable folders
- 🕸️ **Dependency Graph** - Interactive visualization of file imports and module relationships
- 🤖 **AI File Explanations** - Smart explanations for any file with complexity analysis
- 🧠 **Agentic AI Workflow** - Step-by-step reasoning before responding

### Premium Features
- 🎯 **"Where Should I Start?"** - Smart learning path for beginners with roadmap cards
- 🏗️ **Architecture Diagram Generator** - Auto-generated system architecture with Mermaid.js
- 💬 **"Ask Repo Anything" Chatbot** - Contextual Q&A with repository knowledge
- ⚙️ **Live Prompt Editor** - Edit AI prompts in real-time with config management

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│         FRONTEND (Next.js)      │
│  - Landing Page & Dashboard     │
│  - File Tree Viewer             │
│  - Dependency Graph (React Flow)│
│  - Architecture Diagrams        │
│  - AI Chat Interface           │
│  - Prompt Editor UI             │
└────────────┬────────────────────┘
             │ REST API
┌────────────▼────────────────────┐
│      BACKEND (FastAPI)          │
│  - GitHub API Integration       │
│  - Repository Parser            │
│  - AST Analysis & Dependencies  │
│  - AI Engine (OpenAI/Gemini)    │
│  - Graph Builder (NetworkX)     │
│  - Chat Service                 │
└────────────┬────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
  GitHub API      AI APIs
  (Repo fetch)  (OpenAI/Gemini)
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Components**: Shadcn UI, Radix UI
- **Graphs**: React Flow, Mermaid.js
- **State**: Zustand

### Backend
- **Framework**: FastAPI (Python)
- **Parsing**: Tree-sitter, AST parsers
- **Graphs**: NetworkX
- **AI**: OpenAI GPT-4o / Gemini
- **Storage**: Supabase / PostgreSQL

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- OpenAI or Gemini API key

### 1. Clone & Install

```bash
git clone https://github.com/your-username/codebase-explainer.git
cd codebase-explainer

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### 2. Environment Setup

Copy the environment files:

```bash
# Frontend
cp .env.example .env.local

# Backend
cp backend/env.example backend/.env
```

Add your API keys:

```bash
# backend/.env
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
GITHUB_TOKEN=your_github_token_here
```

### 3. Run Development Servers

```bash
# Start backend (terminal 1)
cd backend
python main.py

# Start frontend (terminal 2)
npm run dev
```

### 4. Open Application

Visit `http://localhost:3000`

---

## 🤖 AI Agent Workflow

1. **Repository Analysis** - Detect project type, entry point, and core modules
2. **Dependency Mapping** - Build interactive graph of file relationships
3. **Smart Prioritization** - Identify what to explain first for beginners
4. **Contextual Explanations** - Generate file-specific insights with connections
5. **Learning Path Generation** - Create step-by-step onboarding roadmap
6. **Architecture Visualization** - Auto-generate system diagrams
7. **Interactive Q&A** - Answer questions with repository context

---

## 📁 Project Structure

```
codebase-explainer/
├── app/                     # Next.js app router
│   ├── page.tsx             # Landing page
│   ├── dashboard/           # Main dashboard
│   └── globals.css          # Global styles
├── components/              # React components
│   └── ui/                  # Shadcn UI components
├── lib/                     # Utilities & API client
├── backend/                 # FastAPI backend
│   ├── main.py              # Main server
│   ├── services/            # Business logic
│   ├── models/               # Data models
│   └── config/              # Configuration
├── public/                  # Static assets
└── README.md
```

---

## 🔧 Configuration

### AI Prompts
Edit AI behavior via the live prompt editor or modify `backend/config/prompts.json`:

```json
{
  "file_explanation": "You are an expert software engineer...",
  "learning_path": "You are helping developers understand...",
  "architecture_diagram": "You are a software architect..."
}
```

### Environment Variables
```bash
# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=...

# GitHub
GITHUB_TOKEN=ghp_...

# Database (optional)
SUPABASE_URL=...
SUPABASE_KEY=...

# App URLs
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Backend (Render)
1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push

### Environment Variables for Production
- `OPENAI_API_KEY`
- `GITHUB_TOKEN`
- `SUPABASE_URL` (if using database)

---

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
npm test
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking
npm run type-check
```

---

## 🔒 Security

- API keys stored in environment variables
- Input validation on all endpoints
- CORS configuration for cross-origin requests
- Rate limiting on API endpoints
- Secure file upload handling

---

## 📊 Features in Detail

### File Tree Viewer
- VS Code-like interface
- Expandable/collapsible folders
- File type icons and language detection
- Search functionality
- Click to inspect files

### Dependency Graph
- Interactive nodes and edges
- Zoom and pan controls
- File relationship visualization
- Import/export dependencies
- Color-coded by file type

### AI Explanations
- File summary and purpose
- Main functions/classes
- Connection analysis
- Complexity assessment
- Beginner-friendly explanations

### Learning Paths
- Step-by-step roadmap
- Time estimates
- Priority ordering
- Contextual explanations
- Interactive navigation

### Architecture Diagrams
- Auto-generated system views
- Frontend/backend separation
- Data flow visualization
- Export to PNG/SVG
- Fullscreen mode

### Chat Interface
- Repository context awareness
- File reference linking
- Streaming responses
- Chat history
- Follow-up suggestions

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## � License

MIT License - see LICENSE file for details

---

## 👥 Team

Built with ❤️ for the Veersa Hackathon 2026

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@codebase-explainer.dev