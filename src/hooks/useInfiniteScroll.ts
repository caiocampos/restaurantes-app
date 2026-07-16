import { useCallback, useEffect, useRef, useState } from "react"

interface UseInfiniteScrollOptions<T> {
  fetcher: (page: number) => Promise<{ data: T[]; totalPages: number }>
  debouncedQuery?: string
  idQuery?: string
}

export function useInfiniteScroll<T>({
  fetcher,
  debouncedQuery,
  idQuery,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hasMore = page <= totalPages

  const reset = useCallback(
    () =>
      (async () => {
        setItems([])
        setPage(1)
        setTotalPages(1)
        setError(null)
      })(),
    []
  )

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, idQuery])

  useEffect(() => {
    if (loading) return
    const start = async () => {
      setLoading(true)
      setError(null)
    }
    start()

    fetcher(page)
      .then(({ data, totalPages: tp }) => {
        setItems((prev) => (page === 1 ? data : [...prev, ...data]))
        setTotalPages(tp)
      })
      .catch(() => setError("Erro ao carregar dados"))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedQuery, idQuery])

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
