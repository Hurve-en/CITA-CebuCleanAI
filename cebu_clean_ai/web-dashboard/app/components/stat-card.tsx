import { ReactNode } from 'react';
import { cn } from './utils';

export function StatCard({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string;
  change?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
        {change && <p className={cn('text-xs mt-1', change.startsWith('+') ? 'text-emerald-400' : 'text-amber-400')}>{change}</p>}
      </div>
      {icon}
    </div>
  );
}
