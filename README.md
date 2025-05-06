# INKR - Interactive Flow Diagram Editor

**INKR** is a modern, collaborative web application for creating and editing flow diagrams with real-time collaboration and AI-powered features. Whether you're planning, brainstorming, or documenting workflows, INKR offers an intuitive and powerful canvas to bring your ideas to life.

🌐 [Live URL](https://inkr7.vercel.app) &nbsp;&nbsp;&nbsp;🎬 [Watch Demo](https://youtu.be/stdTOOgYQGM)

---

# ✨ Features

### 🎨 Interactive Canvas

- Drag-and-drop flow diagram creation
- Shapes: rectangles, circles, diamonds, arrows, lines
- Text annotation support
- Zoom in/out and responsive panning
- Undo/Redo actions
- Fully responsive on desktop and mobile

### 🤝 Real-Time Collaboration

- Shareable session links for collaborative editing
- Live sync across all connected users
- Built-in **voice chat** and **live chat**
- Presence indicators (see who’s online and editing)

### 🤖 AI-Powered Tools

- **AI Flow Generator**: Convert plain text into structured flow diagrams
- **Diagram Describer**: Auto-generate descriptions of your diagrams
- Powered by **Mistral AI**

### ☁️ Cloud Save

- Save and sync your diagrams directly to **Google Drive** or **Dropbox**
- Access and edit your work from anywhere

### 💾 File Management

- Export diagrams as **PNG** or in proprietary **INKR format**
- Import existing INKR diagrams
- Reset canvas to start fresh

### 🎨 Styling Options

- Customize stroke width, style, and color
- Adjust fill colors and opacity
- Apply consistent themes and visual styles

---

## 🛠️ Tech Stack

- **React.js** – frontend framework
- **Framer Motion** – animations
- **Socket.io** – real-time collaboration
- **Mistral AI API** – AI-powered tools
- **React Router** – routing
- **React Hot Toast** – toast notifications

---

## ⚙️ Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Mistral AI API key

---

## 🚀 Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/suraj719/inkr.git
   cd inkr
   ```
2. Install dependencies in both client & server:

   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```
   VITE_APP_MISTRAL_API_KEY = your_api_key_here
   VITE_APP_SERVER_URL = server_url
   ```
4. Create a `.env` file in the server directory:

   ```
   CLIENT_URL = frontend_url
   ```

5. Start the application:

   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`
