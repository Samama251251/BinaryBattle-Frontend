import React from 'react';
import Editor from '@monaco-editor/react';

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
  const handleEditorWillMount = (monaco: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '1D232A' },
        { token: 'keyword', foreground: 'FF79C6' },
        { token: 'string', foreground: 'F1FA8C' },
        { token: 'number', foreground: 'BD93F9' },
        { token: 'comment', foreground: '6272A4' },
        { token: 'variable', foreground: '50FA7B' },
        { token: 'type', foreground: '8BE9FD' },
      ],
      colors: {
        'editor.background': '#1D232A',
        'editor.foreground': '#F8F9FA',
        'editorLineNumber.foreground': '#6272A4',
        'editorCursor.foreground': '#FF79C6',
        'editor.selectionBackground': '#2D3741',
        'editor.inactiveSelectionBackground': '#2D374199',
        'editorIndentGuide.background': '#2D3741',
        'editorIndentGuide.activeBackground': '#FF79C6',
        'editor.lineHighlightBackground': '#2D3741',
        'editorWhitespace.foreground': '#6272A4',
        'editorBracketMatch.background': '#2D3741',
        'editorBracketMatch.border': '#FF79C6',
      }
    });
    monaco.editor.setTheme('dracula');
  };

  const clearConsole = () => {
    setConsoleOutput('');
  };

  return (
    <div className='flex flex-col h-screen bg-base-100'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-base-300'>
        <div className='flex items-center gap-3'>
          <h1 className='text-2xl font-bold text-primary'>{title}</h1>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            difficulty.toLowerCase() === 'easy' 
              ? 'bg-success/20 text-success' 
              : 'bg-warning/20 text-warning'
          }`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 gap-4 p-4'>
        {/* Editor Section */}
        <div className='flex-1 rounded-lg overflow-hidden border border-base-300 shadow-lg'>
          <div className='flex justify-between items-center px-6 py-3 bg-base-200 border-b border-base-300'>
            <span className='font-medium text-base-content'>Code Editor</span>
            <select
              value={language}
              className='select select-sm select-bordered bg-base-100'
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          
          <Editor
            height="calc(100vh - 230px)"
            language={language}
            value={value}
            onChange={onChange}
            theme={theme}
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 20 },
              roundedSelection: true,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
            }}
            beforeMount={handleEditorWillMount}
          />
        </div>

        {/* Terminal Section */}
        <div className='w-[400px] rounded-lg overflow-hidden border border-base-300 shadow-lg'>
          <div className='flex justify-between items-center px-6 py-3 bg-base-200 border-b border-base-300'>
            <span className='font-medium text-base-content'>Terminal</span>
            <button 
              onClick={clearConsole}
              className='btn btn-ghost btn-sm px-2 min-h-0 h-8 hover:bg-base-300'
            >
              Clear
            </button>
          </div>
          <div className='h-[calc(100vh-330px)] bg-[#1D232A] p-6 overflow-auto font-mono'>
            {!consoleOutput ? (
              <div className='text-sm text-base-content/70'>Terminal&gt; Ready for execution...</div>
            ) : (
              <pre className='text-sm leading-relaxed'>
                {consoleOutput.split('\n').map((line, index) => {
                  if (line.startsWith('Test Case')) {
                    return <div key={index} className='text-base-content font-semibold mb-2'>{line}</div>;
                  } else if (line.includes('PASSED')) {
                    return <div key={index} className='text-success font-semibold'>{line}</div>;
                  } else if (line.includes('FAILED')) {
                    return <div key={index} className='text-error font-semibold'>{line}</div>;
                  } else if (line.startsWith('Execution Time:') || line.startsWith('Memory Used:')) {
                    return <div key={index} className='text-success font-semibold'>{line}</div>;
                  } else {
                    return <div key={index} className='text-base-content ml-2'>{line}</div>;
                  }
                })}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className='p-4 border-t border-base-300'>
        <button 
          onClick={onSubmit}
          className='btn btn-primary w-full h-12 text-base font-medium'
        >
          Submit Solution
        </button>
      </div>
    </div>
  );
};

export default IDE;