import { useState } from "react";
import { Delete, Download, Folder, MenuIcon, Xmark } from "../assets/icons";
import { useAppContext } from "../provider/AppStates";
import { saveElements, uploadElements } from "../helper/element";
import CloudSync from "./CloudSync";

export default function Menu() {
  const { elements, setElements } = useAppContext();
  const [show, setShow] = useState(false);

  return (
    <div className="menu">
      <button
        className="menuBtn"
        type="button"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? <Xmark /> : <MenuIcon />}
      </button>

      {show && (
        <MenuBox
          elements={elements}
          setElements={setElements}
          setShow={setShow}
        />
      )}
    </div>
  );
}

function MenuBox({ elements, setElements, setShow }) {
  const uploadJson = () => uploadElements(setElements);
  const saveAsPNG = () => saveElements(elements, "png");
  const saveAsINKR = () => saveElements(elements, "inkr");
  const reset = () => setElements([]);

  return (
    <>
      <div className="menuBlur" onClick={() => setShow(false)}></div>
      <section className="menuItems">
        <button className="menuItem" type="button" onClick={uploadJson}>
          <Folder /> <span>Open</span>
        </button>
        <button className="menuItem" type="button" onClick={saveAsPNG}>
          <Download /> <span>Save as PNG</span>
        </button>
        <button className="menuItem" type="button" onClick={saveAsINKR}>
          <Download /> <span>Save as INKR</span>
        </button>
        <button className="menuItem" type="button" onClick={reset}>
          <Delete /> <span>Reset the canvas</span>
        </button>
      </section>
    </>
  );
}
