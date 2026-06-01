'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, WifiOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getTaskLists, deleteTaskList } from '@/services/tasks/taskLists';
import { TaskList } from '@/types/TaskList';
import TaskListCard from '@/components/TaskListCard';
import ListModal from '@/components/ListModal';
import EmptyState from '@/components/EmptyState';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<TaskList | undefined>();
  const [showCompleted, setShowCompleted] = useState(false);

  const firstName = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const load = useCallback(async () => {
    try {
      setError('');
      const data = await getTaskLists();
      setLists(data);
    } catch {
      setError('Could not load lists. Is the backend running?');
    }
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this list?')) return;
    try {
      await deleteTaskList(id);
      setLists(prev => prev.filter(l => l.id !== id));
    } catch {
      alert('Could not delete list');
    }
  };

  const activeLists = lists.filter(l => l.percentage < 100);
  const completedLists = lists.filter(l => l.percentage === 100);
  const avg = lists.length ? Math.round(lists.reduce((s, l) => s + l.percentage, 0) / lists.length) : 0;

  return (
    <>
      {/* Greeting */}
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary leading-tight">
          {getGreeting()}, {firstName}!
        </h1>
        <p className="text-secondary text-xs sm:text-sm mt-1">{date}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-5 sm:mb-6 md:mb-8">
        {[
          { label: 'Lists',    value: String(lists.length),           color: '#0a7ea4' },
          { label: 'Avg.',     value: `${avg}%`,                      color: '#8B5CF6' },
          { label: 'Done',     value: String(completedLists.length),  color: '#10B981' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-center">
            <p className="text-lg sm:text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-secondary text-[10px] sm:text-xs mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-primary font-bold text-base sm:text-lg md:text-xl">My Lists</h2>
        <button
          onClick={() => { setEditingList(undefined); setModalOpen(true); }}
          className="flex items-center gap-1.5 bg-accent text-white font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-accent/90 active:scale-[0.97] transition-all text-xs sm:text-sm whitespace-nowrap shrink-0"
        >
          <Plus size={14} className="sm:w-4 sm:h-4" /> New List
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <WifiOff size={44} className="text-muted mb-3" />
          <p className="text-secondary text-sm mb-4">{error}</p>
          <button onClick={load}
            className="bg-accent text-white font-bold px-6 py-2.5 rounded-xl hover:bg-accent/90 transition-colors text-sm">
            Retry
          </button>
        </div>
      ) : lists.length === 0 ? (
        <EmptyState icon={<Plus size={44} />} title="No lists yet" subtitle="Create your first list to get started" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {activeLists.map(item => (
              <TaskListCard key={item.id} item={item}
                onClick={() => router.push(`/lists/${item.id}`)}
                onEdit={() => { setEditingList(item); setModalOpen(true); }}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>

          {activeLists.length === 0 && (
            <EmptyState icon={<Plus size={44} />} title="All done!" subtitle="All your lists are completed" />
          )}

          {completedLists.length > 0 && (
            <div className="mt-5 sm:mt-6">
              <button
                onClick={() => setShowCompleted(v => !v)}
                className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-semibold py-2 mb-3"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showCompleted ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
                </svg>
                Completed Lists ({completedLists.length})
              </button>
              {showCompleted && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {completedLists.map(item => (
                    <TaskListCard key={item.id} item={item}
                      onClick={() => router.push(`/lists/${item.id}`)}
                      onEdit={() => { setEditingList(item); setModalOpen(true); }}
                      onDelete={() => handleDelete(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <ListModal
        open={modalOpen}
        initial={editingList}
        onClose={() => setModalOpen(false)}
        onSaved={saved => {
          setLists(prev => {
            const exists = prev.find(l => l.id === saved.id);
            return exists ? prev.map(l => l.id === saved.id ? saved : l) : [saved, ...prev];
          });
        }}
      />
    </>
  );
}
