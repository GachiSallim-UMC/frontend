import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface PanelProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Panel = ({ title, description, action, children, className }: PanelProps) => (
  <section className={cn('rounded-lg bg-white p-5 shadow-card', className)}>
    {(title || description || action) && (
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {title && <h3 className="text-body font-bold text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-caption text-gray-500">{description}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);
