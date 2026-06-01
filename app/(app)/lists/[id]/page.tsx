'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, ArrowLeft } from 'lucide-react';
import { getTaskListById } from '@/services/tasks/taskLists';
import { getTaskItems, toggleTaskItem, deleteTaskItem } from '@/services/tasks/taskItems';
import { TaskList } from '@/types/TaskList';
import { Task } from '@/types/Task';
import TaskItem from '@/components/TaskItem';
import TaskModal from '@/components/TaskModal';
import EmptyState from '@/components/EmptyState';

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [list, setList] = useState<TaskList | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [showCompleted, setShowCompleted] = useState(false);

  const load = useCallback(async () => {
    try {
      const [l, t] = await Promise.all([getTaskListById(id), getTaskItems(id)]);
      setList(l); setTasks(t);
    } catch {
      alert('Could not load tasks');
    }
  }, [id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    try { await toggleTaskItem(id, taskId, !task.completed); }
    catch { setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: task.completed } : t)); }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try { await deleteTaskItem(id, taskId); }
    catch { await load(); }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const color = list?.idColor ?? '#0a7ea4';
  const total = tasks.length;
  const done = completedTasks.length;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Back */}
      <button onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-secondary hover:text-primary transition-colors mb-4 sm:mb-6 text-sm font-medium px-2 py-1.5 rounded-lg hover:bg-card-2 -ml-2">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Title */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary leading-tight break-words">
          {list?.title}
        </h1>
        {list?.subtitle && <p className="text-secondary text-sm mt-1">{list.subtitle}</p>}
      </div>

      {/* Progress card */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-5 sm:mb-8">
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="min-w-0">
            <p className="text-secondary text-xs sm:text-sm">
              {done} of {total} task{total !== 1 ? 's' : ''} completed
            </p>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold shrink-0 px-3 py-1 rounded-xl"
            style={{ color, backgroundColor: color + '22' }}>
            {percentage}%
          </span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: color }} />
        </div>
      </div>

      {/* Tasks header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-primary font-bold text-base sm:text-lg">Tasks</h2>
        <button
          onClick={() => { setEditingTask(undefined); setModalOpen(true); }}
          className="flex items-center gap-1.5 text-white font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:opacity-90 active:scale-[0.97] transition-all text-xs sm:text-sm whitespace-nowrap shrink-0"
          style={{ backgroundColor: color }}
        >
          <Plus size={14} className="sm:w-4 sm:h-4" /> Add Task
        </button>
      </div>

      {/* Active tasks */}
      <div className="bg-card border border-border rounded-2xl px-4 sm:px-5">
        {activeTasks.length === 0 && completedTasks.length === 0 ? (
          <EmptyState icon={<Plus size={36} />} title="No tasks yet" subtitle="Add your first task to get started" />
        ) : activeTasks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-primary font-semibold text-sm">All done!</p>
            <p className="text-secondary text-xs mt-1">No pending tasks</p>
          </div>
        ) : (
          activeTasks.map(task => (
            <TaskItem key={task.id} task={task}
              onToggle={handleToggle}
              onEdit={t => { setEditingTask(t); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div className="mt-3 sm:mt-4">
          <button
            onClick={() => setShowCompleted(v => !v)}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-semibold py-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {showCompleted ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
            </svg>
            Completed ({completedTasks.length})
          </button>
          {showCompleted && (
            <div className="bg-card border border-border rounded-2xl px-4 sm:px-5 mt-2">
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task}
                  onToggle={handleToggle}
                  onEdit={t => { setEditingTask(t); setModalOpen(true); }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        listId={id}
        initial={editingTask}
        onClose={() => setModalOpen(false)}
        onSaved={saved => {
          setTasks(prev => {
            const exists = prev.find(t => t.id === saved.id);
            return exists ? prev.map(t => t.id === saved.id ? saved : t) : [saved, ...prev];
          });
        }}
      />
    </>
  );
}
