import React from 'react';
import { Star, GitFork, Circle, Calendar } from 'lucide-react';
import { Repository } from '../types';

interface RepositoryCardProps {
  repository: Repository;
  onClick?: () => void;
}

const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
};

export default function RepositoryCard({ repository, onClick }: RepositoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)} weeks ago`;
    return `Updated ${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-gray-900/25 transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              {repository.owner.username}/{repository.name}
            </h3>
            {repository.isPrivate && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                Private
              </span>
            )}
          </div>
          
          {repository.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {repository.description}
            </p>
          )}

          {repository.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {repository.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer transition-colors"
                >
                  {topic}
                </span>
              ))}
              {repository.topics.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{repository.topics.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {repository.language && (
              <div className="flex items-center space-x-1">
                <Circle 
                  className="h-3 w-3" 
                  fill={languageColors[repository.language] || '#8b949e'}
                  color={languageColors[repository.language] || '#8b949e'}
                />
                <span>{repository.language}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>{repository.stars.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <GitFork className="h-4 w-4" />
              <span>{repository.forks.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(repository.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}