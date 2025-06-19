import { useState, useEffect } from 'react';
import { issueService, Issue } from '../services/issueService';

export function useIssues(repositoryId: string, state?: 'open' | 'closed') {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (repositoryId) {
      loadIssues();
    }
  }, [repositoryId, state]);

  const loadIssues = async () => {
    setLoading(true);
    const { issues, error } = await issueService.getIssues(repositoryId, state);
    setIssues(issues);
    setError(error);
    setLoading(false);
  };

  const createIssue = async (data: any) => {
    const { issue, error } = await issueService.createIssue({
      ...data,
      repositoryId,
    });
    if (issue) {
      setIssues(prev => [issue, ...prev]);
    }
    return { issue, error };
  };

  const updateIssue = async (issueId: string, updates: any) => {
    const { issue, error } = await issueService.updateIssue(issueId, updates);
    if (issue) {
      setIssues(prev => 
        prev.map(i => i.id === issueId ? issue : i)
      );
    }
    return { issue, error };
  };

  const closeIssue = async (issueId: string) => {
    const { error } = await issueService.closeIssue(issueId);
    if (!error) {
      setIssues(prev => 
        prev.map(i => 
          i.id === issueId 
            ? { ...i, state: 'closed', closed_at: new Date().toISOString() }
            : i
        )
      );
    }
    return { error };
  };

  return {
    issues,
    loading,
    error,
    createIssue,
    updateIssue,
    closeIssue,
    refetch: loadIssues,
  };
}