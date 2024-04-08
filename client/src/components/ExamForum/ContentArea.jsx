import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "../../styles/ContentArea.css";

function ContentArea({ content, setContent }) {
  const editorRef = useRef(null);

  const fontSizeArr = ["8px", "9px", "10px", "12px", "14px", "16px", "20px", "24px", "32px"];
  var Size = Quill.import("attributors/style/size");
  Size.whitelist = fontSizeArr;
  Quill.register(Size, true);

  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }, { size: fontSizeArr }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ direction: "rtl" }, { align: [] }],
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
      placeholder: "תוכן הדיון...",
    });

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
