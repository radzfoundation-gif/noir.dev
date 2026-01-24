# NOIR AI - SaaS Design-to-Code Platform

![NOIR AI Badge](https://img.shields.io/badge/Status-Beta-blueviolet?style=for-the-badge&logo=react)
![Tech Stack](https://img.shields.io/badge/Stack-React%20|%20Vite%20|%20Tailwind%20|%20Express-blue?style=for-the-badge)

**NOIR AI** is a premium SaaS application that transforms UI design images into production-ready code using advanced AI models. It leverages the power of Multimodal LLMs (via OpenRouter) to understand visual designs and generate clean, responsive HTML/TailwindCSS or React code.

## ✨ Features

- **🎨 Design to Code**: Drag & Drop any UI screenshot or design mockup, and get the code instantly.
- **🧠 Multi-Model Support**: Switch between top-tier models:
  - **Claude 3.5 Sonnet**: Fast, intelligent, and free (via OpenRouter).
  - **Claude 3 Opus (Pro)**: Maximum reasoning for complex layouts.
  - **Gemini 2.0 Flash**: Ultra-fast, low latency generation.
- **💎 Premium UI/UX**: "Noir" aesthetic featuring glassmorphism, smooth Framer Motion animations, and a responsive dark mode interface.
- **⚡ Live Preview**: Real-time rendering of generated code in a secure sandbox.
- **🔧 Customizable Output**: Add specific instructions (e.g., "Make it mobile responsive", "Use grid layout") to guide the AI.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, TailwindCSS v3, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.
- **AI Integration**: OpenAI SDK (compatible with OpenRouter API).
- **Styling**: PostCSS, Autoprefixer, Custom Tailwind Theme.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- An **OpenRouter API Key** (Get one at [openrouter.ai](https://openrouter.ai))

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/your-username/noir-ai.git
    cd noir-ai
    ```

2.  **Install Dependencies**:
    This will install packages for both frontend and backend.
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory (or edit the existing one):
    ```env
    # .env
    OPENROUTER_API_KEY=sk-or-your-api-key-here
    VITE_API_URL=http://localhost:3001
    PORT=3001
    ```

4.  **Run Development Server**:
    Start both the frontend (Vite) and backend (Express) concurrently:
    ```bash
    npm run dev
    ```

5.  **Access the App**:
    Open your browser and navigate to `http://localhost:5173`.

## 📖 Usage Guide

1.  **Upload Design**: Drag and drop your UI image (screenshot, Figma export, etc.) into the upload zone.
2.  **Select Model**: Use the dropdown to choose your preferred AI model.
    - *Tip: Start with Gemini Flash for speed, or Claude Opus for precision.*
3.  **Add Instructions**: (Optional) Type specific requirements like "Use blue gradients for buttons" or "Add a navbar".
4.  **Generate**: Click the **"Generate Code"** button. The AI will process the image and stream the code back.
5.  **Preview & Copy**: Switch between the "Code" and "Preview" tabs. Click "Copy" to use the code in your project.

## 📂 Project Structure

```
noir-ai/
├── server/
│   └── index.js          # Express API Gateway & OpenRouter integration
├── src/
│   ├── components/
│   │   ├── Generator.tsx   # Main Application Logic
│   │   ├── ImageUpload.tsx # Drag & Drop Component
│   │   ├── CodePreview.tsx # Code Editor & Live Preview
│   │   ├── ModelSelector.tsx # AI Model Dropdown
│   │   └── Layout.tsx      # App Shell & Navigation
│   ├── App.tsx           # Root Component
│   └── index.css         # Global Styles & Tailwind Directives
├── tailwind.config.js    # Design System Tokens
└── package.json          # Dependencies & Scripts
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**built with 💜 by Noir Labs**
