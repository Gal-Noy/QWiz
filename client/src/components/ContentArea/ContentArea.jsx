import React, { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./ContentArea.css";

function ContentArea({ content, setContent }) {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  const toolbarOptions = [
    [{ header: [false, 1, 2, 3] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: "justify" }, { align: "" }, { align: "center" }, { align: "right" }, { direction: "rtl" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    ["link", "image"],
    ["clean"],
  ];

  useEffect(() => {
    if (!editor) {
      const newEditor = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });

      newEditor.on("text-change", () => {
        setContent(newEditor.root.innerHTML);
      });

      setEditor(newEditor);
    } else {
      editor.root.innerHTML = content;
    }
  }, []);

  return (
    <div className="content-area">
      <div ref={editorRef} />
    </div>
  );
}

export default ContentArea;
