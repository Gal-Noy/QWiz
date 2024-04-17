import React, { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./ContentArea.css";

/**
 * Renders a content area component with a Quill editor.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.content - The initial content of the editor.
 * @param {Function} props.setContent - A function to update the content of the editor.
 * @returns {JSX.Element} The rendered ContentArea component.
 */
function ContentArea(props) {
  const { content, setContent } = props;

  // Quill editor instance
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

      // Add event listener to change direction to right when text area is clicked
      const rightAlignDirection = () => {
        newEditor.format("direction", "rtl");
        newEditor.format("align", "right");
        editorRef.current.removeEventListener("click", rightAlignDirection);
      };
      editorRef.current.addEventListener("click", rightAlignDirection);

      // Set content passed from parent component (if any, e.g. when editing a comment)
      newEditor.container.firstChild.innerHTML = content;

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
