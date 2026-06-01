type Props = { icon: React.ReactNode; title: string; subtitle: string };

export default function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-muted mb-4">{icon}</div>
      <h3 className="text-primary font-semibold text-base mb-1">{title}</h3>
      <p className="text-secondary text-sm max-w-xs">{subtitle}</p>
    </div>
  );
}
