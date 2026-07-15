import { useCallback, useEffect, useRef, useState } from "react"

interface UseInfiniteScrollOptions<T> {
  fetcher: (page: number) => Promise<{ data: T[]; totalPages: number }>
  deps?: unknown[]
}

export function useInfiniteScroll<T>({
  fetcher,
  deps = [],
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hasMore = page <= totalPages

  const reset = useCallback(() => {
    setItems([])
    setPage(1)
    setTotalPages(1)
    setError(null)
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    reset()
  }, deps)

  useEffect(() => {
    if (loading) return
    setLoading(true)
    setError(null)

    fetcher(page)
      .then(({ data, totalPages: tp }) => {
        setItems((prev) => (page === 1 ? data : [...prev, ...data]))
        setTotalPages(tp)
      })
      .catch(() => setError("Erro ao carregar dados"))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ...deps])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && page < totalPages) {
          setPage((p) => p + 1)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loading, page, totalPages])

  return { items, loading, error, hasMore, sentinelRef, reset }
}
