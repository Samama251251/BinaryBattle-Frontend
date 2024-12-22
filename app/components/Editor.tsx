import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface IDEProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  theme: string;
}

const IDE = ({ value, onChange, language, theme }: IDEProps) => {
  const { data: session, status } = useSession();
  const [editor, setEditor] = useState(null);
  const [output, setOutput] = useState('');

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

  return (
    <section className='bg-base-300 fixed w-full h-full'>
      <div className='flex items-center justify-between px-4'>
        <div className='flex items-center'>
          <Link href='/' className='btn btn-square btn-ghost'>
            <i className="fi fi-rr-angle-circle-left text-xl pt-2"></i>
          </Link>
          <h1 className='text-3xl p-4 font-bold'>Finding the Shortest Path</h1>
          <span className='badge badge-success p-3 font-bold'>Easy</span>
        </div>

        <div className='flex items-center gap-2'>
          <button className='btn btn-neutral hover:btn-outline flex items-center'>
          <i className="fi fi-br-play"></i>
          Test
          </button>
          <button className='btn btn-neutral hover:btn-outline flex items-center'>
          <i className="fi fi-rr-cloud-upload-alt"></i>
          Submit
          </button>
          <button className='btn btn-circle btn-ghost'>
            <img src={session?.user?.image || '/images/logo.png'} alt='logo' className='w-10 rounded-full' />
          </button>
        </div>
      </div>
      <div className='flex flex-row w-full font-poppins h-screen p-2 bg-base-300 text-base-content font-mono'>
        <div className='flex flex-col w-1/2 bg-base-100 py-2 rounded-lg h-5/6'>
        <span className='w-full bg-base-200 px-4 py-2 mb-4 flex items-center justify-between relative -mt-2 rounded-lg'>
          <b>Code</b>
          <select
            id="language-select"
            className='select select-sm bg-base-200'
            value={language}
            onChange={(e) => onChange(e.target.value)}
            >
            <option value="javascript">JS</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
          </span>
          <Editor
            className='w-full'
            language={language}
            value={value}
            onChange={onChange}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
            theme={theme}
            options={{
              fontSize: 16,
              tabSize: 4,
              quickSuggestions: true,
              dropIntoEditor: { enabled: true },
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              autoIndent: 'full',
              dragAndDrop: true,
            }}
            />
        </div>
        <div className='flex flex-col w-1/2 h-5/6 px-2 gap-4'>
          <div className='flex flex-col h-1/2 w-full bg-base-100 rounded-lg p-4 overflow-y-auto'> 
            Problem Statement
          </div>

          <div className='w-full h-1/2 overflow-scroll bg-base-100 rounded-md'>
              <div className="p-4">
                <pre className='whitespace-pre-wrap overflow-y-auto'>Terminal{">\n"}{output}</pre>
              </div>
          </div>

      </div>
      </div>
  </section>
  );
};

export default IDE;