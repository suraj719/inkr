import { Route, Routes, Navigate } from "react-router-dom";
import WorkSpace from "./views/WorkSpace";
import { AppContextProvider } from "./provider/AppStates";
import Canvas from "./components/Canvas";
import Ui from "./components/Ui";
import { Toaster } from "react-hot-toast";
import "./styles/AIFlowGenerator.css";
import "./styles/index.css";

function App() {
  return (
    <AppContextProvider>
      <Canvas />
      <Ui />
      <Toaster position="top-right" />
    </AppContextProvider>
  );
}

export default App;