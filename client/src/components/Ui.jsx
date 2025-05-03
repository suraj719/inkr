import { useAppContext } from "../provider/AppStates";
import Style from "./Style";
import ToolBar from "./ToolBar";
import Zoom from "./Zoom";
import UndoRedo from "./UndoRedo";
import Menu from "./Menu";
import Collaboration from "./Collaboration";
import AIFlowGenerator from "./AIFlowGenerator";

export default function Ui() {
  const { selectedElement, selectedTool, style } = useAppContext();

  return (
    <main className="ui">
      <header>
        <Menu />
        <ToolBar />
        <div style={{ display: "flex", alignItems: "center" }}>
          <AIFlowGenerator />
          <Collaboration />
        </div>
      </header>
      {(!["selection", "hand"].includes(selectedTool) || selectedElement) && (
        <Style selectedElement={selectedElement || style} />
      )}
      <footer>
        <div>
          <Zoom />
          <UndoRedo />
        </div>
      </footer>
    </main>
  );
}
