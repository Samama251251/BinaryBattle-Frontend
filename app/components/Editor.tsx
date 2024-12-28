import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
interface IDEProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  theme: string;
  title: string;
  difficulty: string;
  onSubmit: () => void;
  consoleOutput: string;
  setConsoleOutput: (output: string) => void;
}

const IDE = ({ value, onChange, language, theme, title, difficulty, onSubmit, consoleOutput, setConsoleOutput }: IDEProps) => {
  const { data: session, status } = useSession();
  const [editor, setEditor] = useState(null);

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '282A36' },
        { token: 'keyword', foreground: 'FF79C6' },
        { token: 'string', foreground: 'F1FA8C' },
        { token: 'number', foreground: 'BD93F9' },
        { token: 'comment', foreground: '6272A4' },
        { token: 'variable', foreground: '50FA7B' },
        { token: 'type', foreground: '8BE9FD' },
      ],
      colors: {
        'editor.background': '#282A36',
        'editorLineNumber.foreground': '#6272A4',
        'editorCursor.foreground': '#FF79C6',
        'editor.selectionBackground': '#44475A',
        'editor.inactiveSelectionBackground': '#44475A99',
        'editorIndentGuide.background': '#6272A4',
        'editorIndentGuide.activeBackground': '#FF79C6',
        'editor.lineHighlightBackground': '#44475A',
        'editorWhitespace.foreground': '#6272A4',
        'editorBracketMatch.background': '#44475A',
        'editorBracketMatch.border': '#FF79C6',
      }
    });
    monaco.editor.setTheme('dracula');
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setEditor(editor);
  };

  const handleConsoleOutput = (output: string) => {
    setConsoleOutput(output);
  };

  const clearConsole = () => {
    setConsoleOutput('');
  };

  return (
    <div className='flex flex-col h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between p-4'>
        <div className='flex items-center gap-2'>
          <h1 className='text-xl font-bold'>{title}</h1>
          <span className={`badge ${difficulty.toLowerCase() === 'easy' ? 'badge-success' : 'badge-warning'}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 gap-2 p-2'>
        {/* Editor Section */}
        <div className='flex-1'>
          <div className='flex justify-between items-center px-4 py-2 bg-base-300 rounded-t-lg'>
            <span>Code</span>
            <select
              value={language}
              className='select select-sm select-ghost'
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          
          <Editor
            height="calc(100vh - 200px)"
            language={language}
            value={value}
            onChange={onChange}
            theme={theme}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Updated Terminal Section */}
        <div className='w-[400px]'>
          <div className='flex justify-between items-center px-4 py-2 bg-base-300 rounded-t-lg'>
            <span>Terminal</span>
            <button 
              onClick={clearConsole}
              className='btn btn-ghost btn-xs'
            >
              Clear
            </button>
          </div>
          <div className='h-[calc(100vh-300px)] bg-base-200 rounded-b-lg p-4 overflow-auto'>
            <pre className='text-sm font-mono whitespace-pre-wrap'>
              {consoleOutput || 'Terminal> Waiting for output...'}
            </pre>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className='p-2'>
        <button 
          onClick={onSubmit}
          className='btn btn-primary w-full'
        >
          Submit Solution
        </button>
      </div>
    </div>
  );
};

export default IDE;