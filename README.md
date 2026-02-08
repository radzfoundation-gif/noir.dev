# NOIR AI - SaaS Fullstack AI Web Generator

![NOIR AI Badge](https://img.shields.io/badge/Status-Beta-blueviolet?style=for-the-badge&logo=react)
![Tech Stack](https://img.shields.io/badge/Stack-React%20|%20Vite%20|%20Tailwind%20|%20Express-blue?style=for-the-badge)

**NOIR AI** is a premium SaaS application that transforms your ideas into complete, production-ready fullstack web applications using advanced AI models. It leverages the power of Multimodal LLMs to generate high-quality code across frontend and backend.

## ✨ Features

- **🚀 Prompt-to-App**: Describe your vision in plain English, and get a fully functional fullstack app instantly.
- **🏗️ Fullstack Generation**: Automatically generates React frontends, Express/Node.js backends, and database schemas.
- **🧠 Multi-Model Support**: Switch between top-tier models:
  - **Claude 3.5 Sonnet**: Fast, intelligent, and precise.
  - **Claude 3 Opus (Pro)**: Maximum reasoning for complex architectures.
  - **Gemini 2.0 Flash**: Ultra-fast, low latency generation.
- **💎 Premium UI/UX**: "Noir" aesthetic featuring glassmorphism, smooth Framer Motion animations, and a responsive dark mode interface.
- **⚡ Live Workbench**: Real-time editing and previewing of generated applications in a secure sandbox.
- **🔧 Integrated Backend**: Built-in support for API generation, authentication, and database migrations.
- **📧 Automated Workflow**: Seamless transition from design concept to deployed application.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, TailwindCSS v3, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, Supabase.
- **AI Integration**: OpenAI SDK (compatible with OpenRouter & Sumopod API).
- **Styling**: PostCSS, Autoprefixer, Custom Tailwind Theme.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase Project (for Auth & Database)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/noir-ai.git
    cd noir-ai
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory:
    ```env
    # .env
    SUMOPOD_API_KEY=your_sumopod_api_key
    RESEND_API_KEY=your_resend_api_key
    VITE_API_URL=http://localhost:3001
    PORT=3001
    
    # Supabase
    SUPABASE_URL=your_supabase_project_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Access the App**:
    Open `http://localhost:5173`.

## 📖 Usage Guide

1.  **Describe Your App**: Enter your application requirements in the prompt box (e.g., "A modern CRM for real estate agents").
2.  **Select Model**: Choose the AI brain that best fits your project's complexity.
3.  **Generate**: Click the **"Generate Application"** button. The AI will architect the frontend, backend, and database.
4.  **Preview & Edit**: Use the Workbench to see your app in action and make real-time adjustments.
5.  **Export**: Download the full source code as a ZIP file, ready for deployment.

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
