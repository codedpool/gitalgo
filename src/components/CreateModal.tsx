import React, { useState } from 'react';
import { X, Book, Package, Users, FileText, Folder, Code } from 'lucide-react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRepository: () => void;
}

export default function CreateModal({ isOpen, onClose, onCreateRepository }: CreateModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const createOptions = [
    {
      id: 'repository',
      title: 'Repository',
      description: 'Create a new repository to store your code',
      icon: Book,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      action: () => {
        onClose();
        onCreateRepository();
      }
    },
    {
      id: 'project',
      title: 'Project',
      description: 'Organize your work with project boards',
      icon: Package,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      action: () => {
        // TODO: Implement project creation
        console.log('Create project');
        onClose();
      }
    },
    {
      id: 'organization',
      title: 'Organization',
      description: 'Collaborate with others in an organization',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      action: () => {
        // TODO: Implement organization creation
        console.log('Create organization');
        onClose();
      }
    },
    {
      id: 'gist',
      title: 'Gist',
      description: 'Share code snippets and notes',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      action: () => {
        // TODO: Implement gist creation
        console.log('Create gist');
        onClose();
      }
    },
    {
      id: 'codespace',
      title: 'Codespace',
      description: 'Cloud development environment',
      icon: Code,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
      action: () => {
        // TODO: Implement codespace creation
        console.log('Create codespace');
        onClose();
      }
    },
    {
      id: 'import',
      title: 'Import repository',
      description: 'Import code from another repository',
      icon: Folder,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20',
      action: () => {
        // TODO: Implement repository import
        console.log('Import repository');
        onClose();
      }
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create something new
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {createOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.action}
                onMouseEnter={() => setSelectedOption(option.id)}
                onMouseLeave={() => setSelectedOption(null)}
                className={`group relative p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedOption === option.id
                    ? 'border-primary-500 shadow-lg shadow-primary-500/20 scale-105'
                    : 'border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600'
                } bg-gradient-to-br ${option.bgColor} hover:shadow-lg`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${option.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <option.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </button>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Quick actions
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  onClose();
                  onCreateRepository();
                }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Book className="h-4 w-4 mr-2" />
                New repository
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">
                <FileText className="h-4 w-4 mr-2" />
                New gist
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">
                <Folder className="h-4 w-4 mr-2" />
                Import repository
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}