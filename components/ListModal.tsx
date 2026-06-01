'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TaskList } from '@/types/TaskList';
import { createTaskList, updateTaskList } from '@/services/tasks/taskLists';

const COLORS = ['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EF4444','#EC4899','#06B6D4','#F97316'];

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (list: TaskList) => void;
  initial?: TaskList;
};

export default function ListModal({ open, onClose, onSaved, initial }: Props) {
  const isEdit = !!initial;
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '');
      setSubtitle(initial?.subtitle ?? '');
      setTags(initial?.tags.join(', ') ?? '');
      setColor(initial?.idColor ?? COLORS[0]);
      setError('');
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    setLoading(true); setError('');
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      const data = { title: title.trim(), subtitle: subtitle.trim(), tags: tagList, idColor: color, idIcon: 'list' };
      const list = isEdit && initial ? await updateTaskList(initial.id, data) : await createTaskList(data);
      onSaved(list);
      onClose();
    } catch {
      setError(`Could not ${isEdit ? 'update' : 'create'} list`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-card border border-border w-full md:max-w-md rounded-t-3xl md:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Handle (mobile) */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 md:hidden" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-primary font-bold text-xl">{isEdit ? 'Edit List' : 'New List'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-card-2 text-muted hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Title *">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Study Notes" autoFocus
              className="w-full bg-card-2 border border-border rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm" />
          </Field>
          <Field label="Description">
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Optional"
              className="w-full bg-card-2 border border-border rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm" />
          </Field>
          <Field label="Tags (comma separated)">
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="school, important"
              className="w-full bg-card-2 border border-border rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm" />
          </Field>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase tracking-wide block mb-3">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: c, outline: color === c ? '3px solid white' : 'none', outlineOffset: '2px' }}>
                  {color === c && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
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
            className="w-full text-white font-bold py-3.5 rounded-xl transition-opacity disabled:opacity-60 flex items-center justify-center text-sm"
            style={{ backgroundColor: color }}>
            {loading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : (isEdit ? 'Save Changes' : 'Create List')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-secondary uppercase tracking-wide block mb-2">{label}</label>
      {children}
    </div>
  );
}
