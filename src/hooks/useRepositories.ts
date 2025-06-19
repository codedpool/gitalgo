import { useState, useEffect } from 'react';
import { repositoryService, Repository } from '../services/repositoryService';

export function useRepositories(userId?: string) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadRepositories();
  }, [userId]);

  const loadRepositories = async () => {
    setLoading(true);
    const { repositories, error } = await repositoryService.getRepositories(userId);
    setRepositories(repositories);
    setError(error);
    setLoading(false);
  };

  const createRepository = async (data: any) => {
    const { repository, error } = await repositoryService.createRepository(data);
    if (repository) {
      setRepositories(prev => [repository, ...prev]);
    }
    return { repository, error };
  };

  const starRepository = async (repositoryId: string) => {
    const { error } = await repositoryService.starRepository(repositoryId);
    if (!error) {
      setRepositories(prev => 
        prev.map(repo => 
          repo.id === repositoryId 
            ? { ...repo, is_starred: true, stars_count: repo.stars_count + 1 }
            : repo
        )
      );
    }
    return { error };
  };

  const unstarRepository = async (repositoryId: string) => {
    const { error } = await repositoryService.unstarRepository(repositoryId);
    if (!error) {
      setRepositories(prev => 
        prev.map(repo => 
          repo.id === repositoryId 
            ? { ...repo, is_starred: false, stars_count: repo.stars_count - 1 }
            : repo
        )
      );
    }
    return { error };
  };

  return {
    repositories,
    loading,
    error,
    createRepository,
    starRepository,
    unstarRepository,
    refetch: loadRepositories,
  };
}