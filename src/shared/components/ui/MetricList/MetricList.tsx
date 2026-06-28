import { StatusBadge } from '@/shared/components/ui/StatusBadge';

interface MetricItem {
  label: string;
  value: string;
  status?:
    | 'done'
    | 'pending'
    | 'scheduled'
    | 'unpaid'
    | 'active'
    | 'inactive'
    | 'short'
    | 'empty'
    | 'enough';
}

interface MetricListProps {
  items: MetricItem[];
}

export const MetricList = ({ items }: MetricListProps) => (
  <div className="divide-y divide-gray-100">
    {items.map(item => (
      <div key={item.label} className="flex items-center justify-between gap-3 py-3">
        <span className="text-caption text-gray-600">{item.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-button font-bold text-gray-900">{item.value}</span>
          {item.status && <StatusBadge variant={item.status} />}
        </div>
      </div>
    ))}
  </div>
);
