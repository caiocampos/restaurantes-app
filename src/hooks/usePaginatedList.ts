import { useCallback, useEffect, useState } from "react"

interface UsePaginatedListOptions<T> {
  fetcher: (
    page: number,
    limit: number
  ) => Promise<{ data: T[]; total: number; totalPages: number }>
  limit?: number
  deps?: unknown[]
}

export function usePaginatedList<T>({
  fetcher,
  limit = 10,
  deps = [],
}: UsePaginatedListOptions<T>) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    (p: number) => {
      setLoading(true)
      setError(null)
      fetcher(p, limit)
        .then(({ data, total: t, totalPages: tp }) => {
          setItems(data)
          setTotal(t)
          setTotalPages(tp)
          setPage(p)
        })
        .catch(() => setError("Erro ao carregar dados"))
        .finally(() => setLoading(false))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [limit, ...deps]
  )

  useEffect(() => {
    load(1)
  }, [load])

  return {
    items,
    page,
    total,
    totalPages,
    loading,
    error,
    goToPage: load,
    refresh: () => load(page),
  }
}
