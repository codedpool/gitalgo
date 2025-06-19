import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Profile: {username}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Profile page for {username}
        </p>
      </div>
    </div>
  );
}