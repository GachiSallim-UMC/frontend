import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface PanelProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const Panel = ({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  titleClassName,
  descriptionClassName,
}: PanelProps) => (
  <section className={cn('rounded-lg bg-white p-5 shadow-card', className)}>
    {(title || description || action) && (
      <div className={cn('mb-4 flex items-start justify-between gap-3', headerClassName)}>
        <div>
          {title && (
            <h3 className={cn('text-body font-bold text-gray-900', titleClassName)}>{title}</h3>
          )}
          {description && (
            <p className={cn('mt-1 text-caption text-gray-500', descriptionClassName)}>
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);
