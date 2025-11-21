"use client";

import { useEffect, useRef } from "react";

export default function QuillEditor({ value, onChange, placeholder = "" }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Initialize Quill
  useEffect(() => {
    if (typeof window === "undefined" || !editorRef.current || quillRef.current) return;

    // Dynamically import Quill
    import("quill").then((QuillModule) => {
      const Quill = QuillModule.default;
      
      if (!editorRef.current || quillRef.current) return;

      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link"],
            [{ align: [] }],
            ["clean"],
          ],
        },
      });

      quillRef.current = quill;

      // Set initial value
      if (value) {
        quill.root.innerHTML = value;
      }

      // Handle text changes
      const handleChange = () => {
        const html = quill.root.innerHTML;
        if (onChangeRef.current) {
          onChangeRef.current(html);
        }
      };

      quill.on("text-change", handleChange);
    });
  }, [placeholder]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  // Update content when value prop changes externally
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  useEffect(() => {
    // Add custom styles for Quill editor
    const style = document.createElement("style");
    style.textContent = `
      .quill-editor-wrapper .ql-container {
        min-height: 200px;
        font-size: 16px;
        font-family: inherit;
      }
      .quill-editor-wrapper .ql-editor {
        min-height: 200px;
        color: #1a1a1a;
      }
      .quill-editor-wrapper .ql-editor.ql-blank::before {
        color: #6d6d6d;
        font-style: normal;
      }
      .quill-editor-wrapper .ql-toolbar {
        border-top: 1px solid #e7e7e7;
        border-left: 1px solid #e7e7e7;
        border-right: 1px solid #e7e7e7;
        border-bottom: none;
        border-radius: 8px 8px 0 0;
      }
      .quill-editor-wrapper .ql-container {
        border-bottom: 1px solid #e7e7e7;
        border-left: 1px solid #e7e7e7;
        border-right: 1px solid #e7e7e7;
        border-top: none;
        border-radius: 0 0 8px 8px;
      }
      .quill-editor-wrapper .ql-toolbar .ql-stroke {
        stroke: #1a1a1a;
      }
      .quill-editor-wrapper .ql-toolbar .ql-fill {
        fill: #1a1a1a;
      }
      .quill-editor-wrapper .ql-toolbar button:hover,
      .quill-editor-wrapper .ql-toolbar button.ql-active {
        color: #5bad6a;
      }
      .quill-editor-wrapper .ql-toolbar button:hover .ql-stroke,
      .quill-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
        stroke: #5bad6a;
      }
      .quill-editor-wrapper .ql-toolbar button:hover .ql-fill,
      .quill-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
        fill: #5bad6a;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (typeof window === "undefined") {
    return (
      <div className="quill-editor-wrapper">
        <div className="w-full px-4 py-3 border border-[#e7e7e7] rounded-lg min-h-[200px] bg-white">
          <p className="text-[#6d6d6d]">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quill-editor-wrapper">
      <div ref={editorRef} className="bg-white" />
    </div>
  );
}
