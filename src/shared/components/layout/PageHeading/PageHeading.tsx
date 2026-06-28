import type { ReactNode } from 'react';

interface PageHeadingProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageHeading = ({ title, description, actions }: PageHeadingProps) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h2 className="text-key-number font-bold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-caption text-gray-500">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);
