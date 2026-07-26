import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends { id?: string | number; choreId?: string | number }> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

export const DataTable = <T extends { id?: string | number; choreId?: string | number }>({
  columns,
  data,
  emptyMessage = '데이터가 없습니다.',
  className,
}: DataTableProps<T>) => {
  return (
    <div className={cn('w-full overflow-x-auto rounded-[18px] bg-white shadow-card', className)}>
      <table className="w-full text-caption">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map(col => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className={cn(
                  'px-4 py-3 font-medium text-gray-500',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  !col.align && 'text-left',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={row.id ?? row.choreId}
                className="border-b border-gray-100 transition-colors hover:bg-gray-100"
              >
                {columns.map(col => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      'px-4 py-3 text-gray-700',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                    )}
                  >
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
