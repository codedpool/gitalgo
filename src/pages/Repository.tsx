import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, GitFork, Eye, Code2, AlertCircle, GitPullRequest, 
  Settings, Shield, Book, FileText, Download, Copy, Check 
} from 'lucide-react';
import { repositoryService, Repository } from '../services/repositoryService';
import { useIssues } from '../hooks/useIssues';

export default function RepositoryPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('code');
  const [copied, setCopied] = useState(false);

  const { issues } = useIssues(repository?.id || '', 'open');

  useEffect(() => {
    if (owner && repo) {
      loadRepository();
    }
  }, [owner, repo]);

  const loadRepository = async () => {
    if (!owner || !repo) return;
    
    setLoading(true);
    const { repository, error } = await repositoryService.getRepository(owner, repo);
    
    if (error) {
      setError(error.message);
    } else {
      setRepository(repository);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'code', name: 'Code', icon: Code2 },
    { id: 'issues', name: 'Issues', icon: AlertCircle, count: issues.length },
    { id: 'pull-requests', name: 'Pull requests', icon: GitPullRequest, count: 0 },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'insights', name: 'Insights', icon: Book },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const copyCloneUrl = async () => {
    if (!repository) return;
    const cloneUrl = `https://github.com/${repository.owner?.username}/${repository.name}.git`;
    await navigator.clipboard.writeText(cloneUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStarRepository = async () => {
    if (!repository) return;
    
    if (repository.is_starred) {
      await repositoryService.unstarRepository(repository.id);
    } else {
      await repositoryService.starRepository(repository.id);
    }
    
    // Reload repository to get updated star count
    loadRepository();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Repository not found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {error || 'The repository you are looking for does not exist.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Go back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {repository.owner?.username}
            </button>
          </li>
          <li className="text-gray-500 dark:text-gray-400">/</li>
          <li className="text-gray-900 dark:text-white font-semibold">
            {repository.name}
          </li>
        </ol>
      </nav>

      {/* Repository Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Book className="h-5 w-5 text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {repository.owner?.username}/{repository.name}
              </h1>
              {repository.is_private && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border">
                  Private
                </span>
              )}
            </div>
            
            {repository.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {repository.description}
              </p>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>Watch</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>{repository.stars_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitFork className="h-4 w-4" />
                <span>{repository.forks_count.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={handleStarRepository}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Star className={`h-4 w-4 mr-2 ${repository.is_starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              {repository.is_starred ? 'Unstar' : 'Star'}
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <GitFork className="h-4 w-4 mr-2" />
              Fork
            </button>
            <div className="relative">
              <button 
                onClick={copyCloneUrl}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Code'}
              </button>
            </div>
          </div>
        </div>

        {repository.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {repository.topics.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
              {tab.count !== undefined && (
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'code' && (
          <div className="text-center py-12">
            <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No files yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              This repository is empty. Add some files to get started.
            </p>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-4">
            {issues.length > 0 ? (
              issues.map((issue) => (
                <div
                  key={issue.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <AlertCircle className={`h-5 w-5 mt-0.5 ${
                      issue.state === 'open' ? 'text-green-500' : 'text-purple-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                        {issue.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>
                          #{issue.number} opened {new Date(issue.created_at).toLocaleDateString()} by {issue.author?.username}
                        </span>
                        <span>{issue.comments_count} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No issues yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Issues help you track bugs and feature requests.
                </p>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'pull-requests' || activeTab === 'security' || activeTab === 'insights' || activeTab === 'settings') && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} content
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              This section would contain {activeTab.replace('-', ' ')} information and settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}