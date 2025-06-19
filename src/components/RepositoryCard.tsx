import React from 'react';
import { Star, GitFork, Circle, Calendar, Lock } from 'lucide-react';
import { Repository } from '../services/repositoryService';

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
      className="group bg-white/70 dark:bg-dark-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50 p-6 hover:shadow-2xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/5 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-primary-500/30 dark:hover:border-primary-400/30"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 group-hover:underline">
              {repository.owner?.username}/{repository.name}
            </h3>
            {repository.is_private && (
              <div className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Lock className="h-3 w-3 mr-1" />
                Private
              </div>
            )}
          </div>
          
          {repository.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
              {repository.description}
            </p>
          )}

          {repository.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {repository.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 cursor-pointer transition-all duration-200 border border-blue-200/50 dark:border-blue-800/50"
                >
                  {topic}
                </span>
              ))}
              {repository.topics.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100/50 dark:bg-dark-700/50 rounded-full">
                  +{repository.topics.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            {repository.language && (
              <div className="flex items-center space-x-2 group/lang">
                <Circle 
                  className="h-3 w-3 transition-transform duration-200 group-hover/lang:scale-110" 
                  fill={languageColors[repository.language] || '#8b949e'}
                  color={languageColors[repository.language] || '#8b949e'}
                />
                <span className="font-medium">{repository.language}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1 group/star">
              <Star className="h-4 w-4 transition-all duration-200 group-hover/star:text-yellow-500 group-hover/star:scale-110" />
              <span className="font-medium">{repository.stars_count.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-1 group/fork">
              <GitFork className="h-4 w-4 transition-all duration-200 group-hover/fork:text-blue-500 group-hover/fork:scale-110" />
              <span className="font-medium">{repository.forks_count.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(repository.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}