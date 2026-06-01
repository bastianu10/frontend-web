'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { getTaskLists } from '@/services/tasks/taskLists';
import { TaskList } from '@/types/TaskList';
import TaskListCard from '@/components/TaskListCard';
import EmptyState from '@/components/EmptyState';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [allLists, setAllLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setAllLists(await getTaskLists());
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const q = query.trim().toLowerCase();
  const results = q
    ? allLists.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.subtitle?.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q))
      )
    : [];

  return (
    <>
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary mb-4 sm:mb-5">Search</h1>

        {/* Search input */}
        <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-accent transition-colors">
          <Search size={18} className="text-muted shrink-0" />
          <input
            value={query} onChange={e => setQuery(e.target.value)} autoFocus
            placeholder="Search by title, description or tag…"
            className="flex-1 bg-transparent text-primary placeholder-muted focus:outline-none text-sm min-w-0"
          />
          {query && (
            <button onClick={() => setQuery('')}
              className="text-muted hover:text-primary transition-colors p-0.5 shrink-0">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !q ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search size={44} className="text-border mb-3" />
          <p className="text-secondary text-sm">Type to search your lists</p>
        </div>
      ) : results.length === 0 ? (
        <EmptyState icon={<Search size={44} />} title="No results" subtitle={`No lists match "${query}"`} />
      ) : (
        <>
          <p className="text-secondary text-xs sm:text-sm mb-3 sm:mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {results.map(item => (
              <TaskListCard key={item.id} item={item}
                onClick={() => router.push(`/lists/${item.id}`)}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
