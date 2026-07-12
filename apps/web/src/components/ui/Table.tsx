import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function Table<T>({ columns, data, keyExtractor, onRowClick, className }: TableProps<T>) {
  return (
    <div className={cn('glass-card overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-6 py-3 text-left text-2xs font-semibold text-muted uppercase tracking-wider',
                    'bg-white/[0.02]',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'border-b border-white/[0.03] last:border-0',
                  'transition-colors duration-150',
                  'hover:bg-white/[0.02]',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-6 py-4 text-sm text-white/80', col.className)}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
