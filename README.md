# AI-Powered Password Strength Checker

A modern web application that uses AI (via OpenRouter API) to analyze password strength and provide intelligent, contextual suggestions for stronger passwords. The application features a beautiful, responsive UI with multiple themes and real-time password analysis.

## 🌟 Features

- **AI-Powered Analysis**: Uses GPT-3.5 through OpenRouter API for intelligent password assessment
- **Smart Suggestions**: 
  - Generates password suggestions that maintain context with the original input
  - Ensures minimum 16-character length for suggested passwords
  - Includes a mix of uppercase, lowercase, numbers, and special characters
- **Real-time Feedback**:
  - Instant strength assessment (Weak/Medium/Strong)
  - Score-based evaluation (0-2)
  - Contextual suggestions for improvement
- **Modern UI/UX**:
  - Responsive design
  - Password strength visualization
  - Animated feedback
  - Multiple themes (Cyberpunk/Pastel)

## 🛠️ Tech Stack

### Backend
- FastAPI (Python web framework)
- OpenRouter API (AI integration)
- aiohttp (Async HTTP client)
- python-dotenv (Environment management)
- Uvicorn (ASGI server)

### Frontend
- React with TypeScript
- Vite (Build tool)
- Framer Motion (Animations)
- TailwindCSS (Styling)
- Three.js & React Three Fiber (3D effects)

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenRouter API key (Get one from [OpenRouter](https://openrouter.ai/))

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and replace `your-openrouter-api-key-here` with your actual OpenRouter API key.

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will run on http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:5173

## 📝 API Endpoints

### POST /check-password
Checks password strength and provides suggestions.

Request body:
```json
{
  "password": "string"
}
```

Response:
```json
{
  "score": 0-2,
  "suggestion": "string"
}
```

## 🔒 Password Scoring Criteria

- **Score 0 (Weak)**:
  - Too short
  - Lacks complexity
  - Common patterns

- **Score 1 (Medium)**:
  - Decent length
  - Some complexity
  - Room for improvement

- **Score 2 (Strong)**:
  - 16+ characters
  - Mix of character types
  - High complexity

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenRouter API for providing AI capabilities
- The FastAPI team for the amazing framework
- React and Vite teams for the frontend tools 