import React, { useState } from 'react';
import { X, Lock, Globe, Info, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Repository } from '../types';

interface CreateRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRepositoryModal({ isOpen, onClose }: CreateRepositoryModalProps) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    initializeWithReadme: true,
    gitignoreTemplate: 'None',
    license: 'None',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gitignoreTemplates = [
    'None',
    'Node',
    'Python',
    'Java',
    'React',
    'Vue',
    'Angular',
    'Go',
    'Rust',
    'C++',
    'C#',
    'PHP',
  ];

  const licenses = [
    'None',
    'MIT License',
    'Apache License 2.0',
    'GNU General Public License v3.0',
    'BSD 2-Clause "Simplified" License',
    'BSD 3-Clause "New" or "Revised" License',
    'Boost Software License 1.0',
    'Creative Commons Zero v1.0 Universal',
    'Eclipse Public License 2.0',
    'GNU Affero General Public License v3.0',
    'GNU General Public License v2.0',
    'GNU Lesser General Public License v2.1',
    'Mozilla Public License 2.0',
    'The Unlicense',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Repository name is required';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.name)) {
      newErrors.name = 'Repository name can only contain letters, numbers, dots, hyphens, and underscores';
    } else if (state.repositories.some(repo => repo.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = 'Repository name already exists';
    }

    if (formData.description.length > 350) {
      newErrors.description = 'Description must be 350 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newRepository: Repository = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description || undefined,
      owner: state.user!,
      isPrivate: formData.isPrivate,
      language: 'JavaScript', // Default language
      stars: 0,
      forks: 0,
      size: 0,
      defaultBranch: 'main',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topics: [],
      hasIssues: true,
      hasPullRequests: true,
      license: formData.license !== 'None' ? formData.license : undefined,
    };

    dispatch({ type: 'ADD_REPOSITORY', payload: newRepository });
    
    setIsSubmitting(false);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      isPrivate: false,
      initializeWithReadme: true,
      gitignoreTemplate: 'None',
      license: 'None',
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create a new repository
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Repository name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Repository name *
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                {state.user?.username}/
              </span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 dark:border-dark-600 focus:ring-primary-500'
                }`}
                placeholder="my-awesome-project"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Great repository names are short and memorable.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                errors.description
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 dark:border-dark-600 focus:ring-primary-500'
              }`}
              placeholder="A short description of your repository"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.description.length}/350 characters
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Visibility
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={!formData.isPrivate}
                  onChange={() => handleInputChange('isPrivate', false)}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Public</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Anyone on the internet can see this repository. You choose who can commit.
                  </p>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={formData.isPrivate}
                  onChange={() => handleInputChange('isPrivate', true)}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Private</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    You choose who can see and commit to this repository.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Initialize repository */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Initialize this repository with:
            </label>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.initializeWithReadme}
                  onChange={(e) => handleInputChange('initializeWithReadme', e.target.checked)}
                  className="text-primary-600 focus:ring-primary-500 rounded"
                />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Add a README file</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This is where you can write a long description for your project.
                  </p>
                </div>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add .gitignore
                  </label>
                  <select
                    value={formData.gitignoreTemplate}
                    onChange={(e) => handleInputChange('gitignoreTemplate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {gitignoreTemplates.map((template) => (
                      <option key={template} value={template}>
                        {template}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Choose a license
                  </label>
                  <select
                    value={formData.license}
                    onChange={(e) => handleInputChange('license', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {licenses.map((license) => (
                      <option key={license} value={license}>
                        {license}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">You're creating a repository in your personal account.</p>
                <p>After creating the repository, you can add collaborators in the repository settings.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-dark-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Create repository
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}