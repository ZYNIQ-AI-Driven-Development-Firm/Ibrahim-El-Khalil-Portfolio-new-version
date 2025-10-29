import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder, className = '' }) => {
  const quillRef = useRef(null);

  // Custom toolbar configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align',
    'code-block'
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .rich-text-editor .ql-toolbar {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px 8px 0 0 !important;
          border-bottom: none !important;
        }
        
        .rich-text-editor .ql-container {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 0 0 8px 8px !important;
          color: white !important;
          font-family: inherit !important;
        }
        
        .rich-text-editor .ql-editor {
          color: white !important;
          min-height: 200px !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.4) !important;
          font-style: italic !important;
        }
        
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: rgba(255, 255, 255, 0.7);
        }
        
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: rgba(255, 255, 255, 0.7);
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button:focus .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #ef4444;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button:focus .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #ef4444;
        }
        
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button:focus {
          background: rgba(239, 68, 68, 0.1);
          border-radius: 4px;
        }
        
        .rich-text-editor .ql-toolbar button.ql-active {
          background: rgba(239, 68, 68, 0.2);
          border-radius: 4px;
        }
        
        .rich-text-editor .ql-picker-label {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .rich-text-editor .ql-picker-options {
          background: #1f2937;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
        }
        
        .rich-text-editor .ql-picker-item {
          color: white;
        }
        
        .rich-text-editor .ql-picker-item:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        
        .rich-text-editor .ql-snow .ql-tooltip {
          background: #1f2937;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }
        
        .rich-text-editor .ql-snow .ql-tooltip input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 4px;
          padding: 8px;
        }
        
        .rich-text-editor .ql-snow .ql-tooltip .ql-preview {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .rich-text-editor .ql-editor h1,
        .rich-text-editor .ql-editor h2,
        .rich-text-editor .ql-editor h3 {
          color: #ef4444;
          font-weight: 600;
        }
        
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 12px 16px;
          margin: 16px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .rich-text-editor .ql-editor code {
          background: rgba(255, 255, 255, 0.1);
          color: #60a5fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Consolas', monospace;
        }
        
        .rich-text-editor .ql-editor pre {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
        }
        
        .rich-text-editor .ql-editor a {
          color: #60a5fa;
          text-decoration: underline;
        }
        
        .rich-text-editor .ql-editor a:hover {
          color: #3b82f6;
        }
        `
      }} />
      
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Start writing your blog content...'}
        style={{
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
};

export default RichTextEditor;