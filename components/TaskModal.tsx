'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, TaskPriority } from '@/types/Task';
import { createTaskItem, updateTaskItem } from '@/services/tasks/taskItems';

const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low',    label: 'Low',    color: '#6B7280' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high',   label: 'High',   color: '#EF4444' },
];

type Props = {
  open: boolean;
  listId: string;
  onClose: () => void;
  onSaved: (task: Task) => void;
  initial?: Task;
};

export default function TaskModal({ open, listId, onClose, onSaved, initial }: Props) {
  const isEdit = !!initial;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '');
      setDescription(initial?.description ?? '');
      setPriority(initial?.priority ?? 'medium');
      setError('');
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    setLoading(true); setError('');
    try {
      const task = isEdit && initial
        ? await updateTaskItem(listId, initial.id, { title: title.trim(), description: description.trim() || undefined, priority })
        : await createTaskItem({ listId, title: title.trim(), description: description.trim() || undefined, priority, completed: false });
      onSaved(task);
      onClose();
    } catch {
      setError(`Could not ${isEdit ? 'update' : 'create'} task`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-card border border-border w-full md:max-w-md rounded-t-3xl md:rounded-2xl p-6">
        {/* Handle (mobile) */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 md:hidden" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-primary font-bold text-xl">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-card-2 text-muted hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-secondary uppercase tracking-wide block mb-2">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" autoFocus
              className="w-full bg-card-2 border border-border rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-secondary uppercase tracking-wide block mb-2">Notes</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add details (optional)" rows={2}
              className="w-full bg-card-2 border border-border rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none text-sm" />
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase tracking-wide block mb-3">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button key={p.value} onClick={() => setPriority(p.value)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                  style={{
                    backgroundColor: priority === p.value ? p.color + '22' : '#252729',
                    border: `1.5px solid ${priority === p.value ? p.color : '#2D3235'}`,
                    color: priority === p.value ? p.color : '#9BA1A6',
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button onClick={handleSave} disabled={loading}
            className="w-full bg-accent text-white font-bold py-3.5 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center text-sm">
            {loading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : (isEdit ? 'Save Changes' : 'Add Task')}
          </button>
        </div>
      </div>
    </div>
  );
}
