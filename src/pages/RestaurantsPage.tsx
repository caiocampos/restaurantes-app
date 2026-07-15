import { useCallback, useState } from "react"
import { MapPin, Phone, Plus, Search, Store } from "lucide-react"
import type { Restaurant } from "@/types"
import { restaurantService } from "@/lib/services"
import { usePermission } from "@/hooks/usePermission"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { RestaurantModal } from "@/components/modals/RestaurantModal"
import { CreateRestaurantModal } from "@/components/modals/CreateModals"
import { Skeleton } from "@/components/ui/skeleton"

const PAGE_LIMIT = 12

export function RestaurantsPage() {
  const canCreate = usePermission("restaurants", "create")

  const [nameQuery, setNameQuery] = useState("")
  const debouncedName = useDebounce(nameQuery, 350)

  const [selected, setSelected] = useState<Restaurant | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const fetcher = useCallback(
    (page: number) =>
      restaurantService
        .list(page, PAGE_LIMIT, { name: debouncedName || undefined })
        .then((r) => ({ data: r.data, totalPages: r.totalPages })),
    [debouncedName]
  )

  const { items, loading, error, hasMore, sentinelRef, reset } =
    useInfiniteScroll<Restaurant>({
      fetcher,
      deps: [debouncedName],
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Restaurantes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os restaurantes cadastrados
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo restaurante
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por nome..."
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && items.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <Store className="h-10 w-10 opacity-30" />
          <p>Nenhum restaurante encontrado</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <Card
            key={r.id}
            className="group cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => setSelected(r)}
          >
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Store className="h-4 w-4 text-primary" />
                </div>
                <h3 className="line-clamp-1 text-sm leading-tight font-semibold transition-colors group-hover:text-primary">
                  {r.name}
                </h3>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 shrink-0" />
                  <span className="truncate">{r.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{r.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={`sk-${i}`}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div ref={sentinelRef} className="h-4" />
      {!hasMore && items.length > 0 && (
        <p className="pb-4 text-center text-xs text-muted-foreground">
          Todos os restaurantes carregados
        </p>
      )}

      <RestaurantModal
        restaurant={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onSaved={() => {
          reset()
          setSelected(null)
        }}
      />
      <CreateRestaurantModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => reset()}
      />
    </div>
  )
}
