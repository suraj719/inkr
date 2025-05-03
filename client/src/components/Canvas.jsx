import { useState, useEffect, useRef } from "react";
import useCanvas from "../hooks/useCanvas";
import { useAppContext } from "../provider/AppStates";
import ParticipantIcon from "./ParticipantIcon";

export default function Canvas() {
  const {
    canvasRef,
    dimension,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    translate,
    scale,
    scaleOffset,
  } = useCanvas();
  const { selectedElement, elements = [], setElements, selectedTool, session } = useAppContext();
  const [editingText, setEditingText] = useState(null);
  const isEditingRef = useRef(false);

  // Update element's editing state when editingText changes
  useEffect(() => {
    if (!elements) return;
    
    const updateEditingState = (isEditing) => {
      if (isEditingRef.current === isEditing) return;
      isEditingRef.current = isEditing;
      
      setElements(prevElements => 
        (prevElements || []).map(element => 
          element.id === editingText?.id 
            ? { ...element, isEditing }
            : element
        )
      );
    };

    if (editingText) {
      updateEditingState(true);
    } else {
      updateEditingState(false);
    }
  }, [editingText, setElements]);

  const handleDoubleClick = (event) => {
    if (!selectedElement || selectedElement.tool !== "text") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - translate.x * scale + scaleOffset.x) / scale;
    const y = (event.clientY - rect.top - translate.y * scale + scaleOffset.y) / scale;
    
    if (x >= selectedElement.x1 && x <= selectedElement.x2 && 
        y >= selectedElement.y1 && y <= selectedElement.y2) {
      setEditingText({
        id: selectedElement.id,
        text: selectedElement.text || "",
        x: selectedElement.x1,
        y: selectedElement.y1,
        width: selectedElement.x2 - selectedElement.x1,
        height: selectedElement.y2 - selectedElement.y1,
        fontSize: selectedElement.fontSize || 16
      });
    }
  };

  const handleTextEdit = (event) => {
    if (!editingText) return;

    const newText = event.target.value;
    setElements(prevElements => 
      (prevElements || []).map(element => 
        element.id === editingText.id 
          ? { ...element, text: newText }
          : element
      )
    );
    setEditingText(prev => ({ ...prev, text: newText }));
  };

  const handleTextEditComplete = () => {
    if (!editingText) return;

    setElements(prevElements => 
      (prevElements || []).map(element => 
        element.id === editingText.id 
          ? { ...element, text: editingText.text, isEditing: false }
          : element
      )
    );
    setEditingText(null);
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={dimension.width}
        height={dimension.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      {session && <ParticipantIcon />}
      {editingText && (
        <div
          style={{
            position: "absolute",
            left: editingText.x * scale + translate.x * scale - scaleOffset.x,
            top: editingText.y * scale + translate.y * scale - scaleOffset.y,
            width: editingText.width * scale,
            height: editingText.height * scale,
            zIndex: 1000,
          }}
        >
          <input
            type="text"
            value={editingText.text}
            onChange={handleTextEdit}
            onBlur={handleTextEditComplete}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTextEditComplete();
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              fontSize: `${editingText.fontSize * scale}px`,
              padding: "0",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "Arial",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
