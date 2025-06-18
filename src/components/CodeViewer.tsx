import React from 'react';
import { ArrowLeft, Copy, Download, Edit, BugOff as RawOff } from 'lucide-react';

interface CodeViewerProps {
  file: string;
  onBack: () => void;
}

// Mock file contents for demonstration
const mockFileContents: Record<string, string> = {
  'src/App.tsx': `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;`,
  'package.json': `{
  "name": "github-clone",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "lucide-react": "^0.244.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,
  'README.md': `# GitHub Clone

A modern GitHub clone built with React and TypeScript.

## Features

- 🚀 Modern React with TypeScript
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Fully responsive design
- 🌙 Dark mode support
- 🔍 Search functionality
- 📊 Repository management
- 🐛 Issue tracking
- 🔄 Pull request management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/octocat/github-clone.git
cd github-clone
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.`
};

export default function CodeViewer({ file, onBack }: CodeViewerProps) {
  const fileName = file.split('/').pop() || file;
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  const content = mockFileContents[file] || '// File content would be loaded here...';
  
  const getLanguage = (ext: string) => {
    const languageMap: Record<string, string> = {
      'tsx': 'typescript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'js': 'javascript',
      'json': 'json',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml',
      'css': 'css',
      'html': 'html',
      'py': 'python',
    };
    return languageMap[ext] || 'text';
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
  };

  const lines = content.split('\n');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {file}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
            {lines.length} lines
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Download className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <div className="flex">
          {/* Line numbers */}
          <div className="flex-shrink-0 px-4 py-4 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 font-mono leading-6 select-none">
            {lines.map((_, index) => (
              <div key={index + 1} className="text-right">
                {index + 1}
              </div>
            ))}
          </div>
          
          {/* Code */}
          <div className="flex-1 p-4 font-mono text-sm leading-6 overflow-x-auto">
            <pre className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              <code className={`language-${getLanguage(fileExtension)}`}>
                {content}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}