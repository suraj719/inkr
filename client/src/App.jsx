import { Route, Routes, Navigate } from "react-router-dom";
import WorkSpace from "./views/WorkSpace";
import { AppContextProvider } from "./provider/AppStates";
import { Toaster } from "react-hot-toast";
import "./styles/AIFlowGenerator.css";
import "./styles/index.css";

function App() {
  return (
    <AppContextProvider>
      <Routes>
        <Route path="/" element={<WorkSpace />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="top-right" />
    </AppContextProvider>
  );
}

export default App;