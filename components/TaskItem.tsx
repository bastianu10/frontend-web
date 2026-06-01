import { Trash2, Edit } from 'lucide-react';
import { Task, TaskPriority } from '@/types/Task';

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  low: '#6B7280', medium: '#F59E0B', high: '#EF4444',
};

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const color = PRIORITY_COLOR[task.priority];

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0 group">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
        style={{ borderColor: task.completed ? '#0a7ea4' : '#4A5258', backgroundColor: task.completed ? '#0a7ea4' : 'transparent' }}
      >
        {task.completed && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-muted' : 'text-primary'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-secondary mt-0.5 truncate">{task.description}</p>
        )}
      </div>

      {/* Priority badge */}
      <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0 hidden sm:inline"
        style={{ backgroundColor: color + '22', color }}>
        {task.priority}
      </span>
      {/* Dot on very small screens */}
      <span className="w-2 h-2 rounded-full shrink-0 sm:hidden" style={{ backgroundColor: color }} />

      {/* Actions — always visible on mobile, hover on desktop */}
      <div className="flex items-center gap-1 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1 rounded-lg hover:bg-card-2 active:bg-card-2 text-muted hover:text-primary transition-colors"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 rounded-lg hover:bg-red-500/10 active:bg-red-500/10 text-muted hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
