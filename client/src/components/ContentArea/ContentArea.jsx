import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./ContentArea.css";

function ContentArea({ content, setContent }) {
  const editorRef = useRef(null);

  const toolbarOptions = [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: "justify" }, { align: "" }, { align: "center" }, { align: "right" }, { direction: "rtl" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    ["link", "image"],
    ["clean"],
  ];

  useEffect(() => {
    const editor = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions,
      },
    });

    const activateRTLandRightAlign = () => {
      editor.format("direction", "rtl");
      editor.format("align", "right");
      editorRef.current.removeEventListener("click", activateRTLandRightAlign);
    };

    editorRef.current.addEventListener("click", activateRTLandRightAlign);

    editor.on("text-change", () => {
      setContent(editor.root.innerHTML);
    });

    editor.root.innerHTML = content;
  }, []);

  return (
    <div className="content-area">
      <div ref={editorRef} />
    </div>
  );
}

export default ContentArea;
