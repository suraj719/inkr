import { useAppContext } from "../provider/AppStates";
import Style from "./Style";
import ToolBar from "./ToolBar";
import Zoom from "./Zoom";
import UndoRedo from "./UndoRedo";
import Menu from "./Menu";
import Collaboration from "./Collaboration";
import AIFlowGenerator from "./AIFlowGenerator";
import ChatPanel from "./ChatPanel";
import DiagramDescriber from "./DiagramDescriber";
import CloudSync from "./CloudSync";
// import DiagramTemplates from "./DiagramTemplates";
import { useEffect, useState } from "react";

export default function Ui() {
  const { selectedElement, selectedTool, style, setScale } = useAppContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setScale(0.75);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setScale]);

  return (
    <main className="ui">
      <header>
        <Menu />
        <ToolBar />
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <DiagramTemplates /> */}
            <AIFlowGenerator />
            <DiagramDescriber />
            <ChatPanel />
            <Collaboration />
            <CloudSync />
          </div>
        )}
      </header>
      {(!["selection", "hand"].includes(selectedTool) || selectedElement) && (
        <Style selectedElement={selectedElement || style} />
      )}
      <footer>
        <div className="footer-content">
          {isMobile && (
            <div className="action-buttons">
              {/* <DiagramTemplates /> */}
              <AIFlowGenerator />
              <DiagramDescriber />
              <ChatPanel />
              <Collaboration />
              <CloudSync />
            </div>
          )}
          <div className="control-buttons">
            <Zoom />
            <UndoRedo />
          </div>
        </div>
      </footer>
    </main>
  );
}
