/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';
import { useState } from 'react';

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [fontSize, setFontSize] = useState('16px');
  const [textColor, setTextColor] = useState('#000000');

  const applyFormat = (format: any) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const applyFontSize = (size: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, size as TextFormatType);
  };

  const applyTextColor = (color: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND,  color  as TextFormatType);
  };

  const toggleList = (type: 'ordered' | 'unordered') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND , type as TextFormatType);
  };

  return (
    <div className="flex gap-2 mb-2">
      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => applyFormat('bold')}
      >
        Bold
      </button>
      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => applyFormat('italic')}
      >
        Italic
      </button>
      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => applyFormat('underline')}
      >
        Underline
      </button>
      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => applyFormat('strikethrough')}
      >
        Strikethrough
      </button>
      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => applyFormat('blockquote')}
      >
        Blockquote
      </button>
      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => toggleList('unordered')}
      >
        Bullet List
      </button>
      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => toggleList('ordered')}
      >
        Numbered List
      </button>
      <select
        value={fontSize}
        onChange={(e) => {
          setFontSize(e.target.value);
          applyFontSize(e.target.value);
        }}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        <option value="16px">Font Size</option>
        <option value="12px">12px</option>
        <option value="16px">16px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
      </select>
      <input
        type="color"
        value={textColor}
        onChange={(e) => {
          setTextColor(e.target.value);
          applyTextColor(e.target.value);
        }}
        className="w-12 h-12"
        title="Text Color"
      />
    </div>
  );
};

export default ToolbarPlugin;
