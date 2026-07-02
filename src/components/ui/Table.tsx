type Column<T> = {
  key: string
  label: string
  render: (row: T) => React.ReactNode
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
}

export function Table<T>({ columns, data, emptyMessage = 'Nenhum item encontrado' }: TableProps<T>) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-primary/10">
            {columns.map(col => (
              <th
                key={col.key}
                className="text-left text-xs font-semibold text-primary uppercase tracking-wide px-6 py-4"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-sm text-text/50 py-12"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-primary/5 last:border-0 hover:bg-surface/50 transition-colors"
              >
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-sm text-text">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}