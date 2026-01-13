"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SortControl: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'desc';

  const handleSort = (order: 'asc' | 'desc') => {
    router.push(`/?sort=${order}`);
  };

  return (
    <div className="sort-controls">
      <button 
        className={`sort-btn ${currentSort === 'desc' ? 'active' : ''}`}
        onClick={() => handleSort('desc')}
      >
        新しい順
      </button>
      <button 
        className={`sort-btn ${currentSort === 'asc' ? 'active' : ''}`}
        onClick={() => handleSort('asc')}
      >
        古い順
      </button>
    </div>
  );
};

export default SortControl;
