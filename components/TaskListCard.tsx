import { Edit, Trash2 } from 'lucide-react';
import { TaskList } from '@/types/TaskList';

type Props = {
  item: TaskList;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TaskListCard({ item, onClick, onEdit, onDelete }: Props) {
  const color = item.idColor ?? '#3B82F6';

  return (
    <div
      className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-accent/40 active:scale-[0.99] transition-all group"
      onClick={onClick}
    >
      <div className="h-1 w-full" style={{ backgroundColor: color }} />
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-primary font-bold text-sm sm:text-base leading-snug truncate">{item.title}</h3>
            {item.subtitle && (
              <p className="text-secondary text-xs sm:text-sm mt-0.5 truncate">{item.subtitle}</p>
            )}
          </div>

          {/* Actions — always visible on mobile, hover-only on md+ */}
          <div className="flex items-center gap-1 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={e => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 rounded-lg hover:bg-card-2 active:bg-card-2 text-muted hover:text-primary transition-colors"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded-lg hover:bg-red-500/10 active:bg-red-500/10 text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <span className="text-lg sm:text-xl font-extrabold shrink-0" style={{ color }}>
            {item.percentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-border rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full transition-all" style={{ width: `${item.percentage}%`, backgroundColor: color }} />
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: color + '1A', color, border: `1px solid ${color}33` }}>
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-muted">+{item.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
