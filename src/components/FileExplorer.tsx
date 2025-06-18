import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { FileTreeItem } from '../types';

interface FileExplorerProps {
  files: FileTreeItem[];
  onFileSelect: (path: string) => void;
}

function FileItem({ 
  item, 
  depth = 0, 
  onFileSelect 
}: { 
  item: FileTreeItem; 
  depth?: number; 
  onFileSelect: (path: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(item.path);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div>
      <div
        className="flex items-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors rounded-md"
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center flex-1 min-w-0">
          {item.type === 'directory' && (
            <div className="mr-1 text-gray-400">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
          
          <div className="mr-3 text-gray-400">
            {item.type === 'directory' ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )
            ) : (
              <File className="h-4 w-4" />
            )}
          </div>
          
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {item.name}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          {item.size && (
            <span className="w-16 text-right">{formatSize(item.size)}</span>
          )}
          <span className="w-24 text-right">{formatDate(item.lastModified)}</span>
        </div>
      </div>
      
      {item.type === 'directory' && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileItem
              key={child.path}
              item={child}
              depth={depth + 1}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Name</span>
          <div className="flex items-center space-x-4">
            <span className="w-16 text-right">Size</span>
            <span className="w-24 text-right">Last modified</span>
          </div>
        </div>
      </div>
      <div className="p-2">
        {files.map((file) => (
          <FileItem
            key={file.path}
            item={file}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
}