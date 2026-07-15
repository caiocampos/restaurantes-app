import { useCallback, useEffect, useState } from "react"
import { Plus, Search, UtensilsCrossed } from "lucide-react"
import type { Dish, Restaurant } from "@/types"
import { dishService, restaurantService } from "@/lib/services"
import { usePermission } from "@/hooks/usePermission"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox"
import { DishModal } from "@/components/modals/DishModal"
import { CreateDishModal } from "@/components/modals/CreateModals"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const PAGE_LIMIT = 12

export function DishesPage() {
  const canCreate = usePermission("dishes", "create")

  const [nameQuery, setNameQuery] = useState("")
  const [restaurantFilter, setRestaurantFilter] = useState<string | undefined>()
  const [restaurantFilterName, setRestaurantFilterName] = useState("")

  const debouncedName = useDebounce(nameQuery, 350)

  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const [filterRestaurants, setFilterRestaurants] = useState<Restaurant[]>([])
  const [filterRestSearch, setFilterRestSearch] = useState("")
  const [filterRestLoading, setFilterRestLoading] = useState(false)

  useEffect(() => {
    setFilterRestLoading(true)
    restaurantService
      .list(1, 20, { name: filterRestSearch })
      .then((r) => setFilterRestaurants(r.data))
      .finally(() => setFilterRestLoading(false))
  }, [filterRestSearch])

  const [restaurantMap, setRestaurantMap] = useState<Record<string, string>>({})

  const fetcher = useCallback(
    async (page: number) => {
      const result = await dishService.list(page, PAGE_LIMIT, {
        name: debouncedName || undefined,
        restaurant: restaurantFilter,
      })
      const unknownIds = [
        ...new Set(result.data.map((d) => d.restaurant_id)),
      ].filter((id) => id && !restaurantMap[id])
      if (unknownIds.length > 0) {
        const fetches = unknownIds.map((id) =>
          restaurantService
            .list(1, 1, {})
            .then(() => null)
            .catch(() => null)
        )
        const batchResult = await restaurantService.list(1, 50, {})
        const newEntries: Record<string, string> = {}
        batchResult.data.forEach((r) => {
          newEntries[r.id] = r.name
        })
        setRestaurantMap((prev) => ({ ...prev, ...newEntries }))
        void fetches
      }
      return { data: result.data, totalPages: result.totalPages }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedName, restaurantFilter]
  )

  const {
    items: dishes,
    loading,
    error,
    hasMore,
    sentinelRef,
    reset,
  } = useInfiniteScroll<Dish>({
    fetcher,
    deps: [debouncedName, restaurantFilter],
  })

  function handleSaved() {
    reset()
  }

  const restFilterOptions = filterRestaurants.map((r) => ({
    value: r.id,
    label: r.name,
  }))
  const selectedInFilterList = restFilterOptions.find(
    (o) => o.value === restaurantFilter
  )
  const filterOptions = selectedInFilterList
    ? restFilterOptions
    : restaurantFilter
      ? [
          { value: restaurantFilter, label: restaurantFilterName },
          ...restFilterOptions,
        ]
      : restFilterOptions

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pratos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie o cardápio dos restaurantes
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo prato
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome..."
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
          />
        </div>
        <Combobox
          className="sm:w-64"
          options={filterOptions}
          value={restaurantFilter}
          placeholder="Filtrar por restaurante"
          searchPlaceholder="Buscar restaurante..."
          onSelect={(v) => {
            setRestaurantFilter(v)
            setRestaurantFilterName(
              filterOptions.find((o) => o.value === v)?.label ?? ""
            )
          }}
          onSearch={setFilterRestSearch}
          loading={filterRestLoading}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && dishes.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <UtensilsCrossed className="h-10 w-10 opacity-30" />
          <p>Nenhum prato encontrado</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dishes.map((dish) => (
          <Card
            key={dish.id}
            className="group cursor-pointer transition-shadow hover:shadow-md"
            onClick={() =>
              setSelectedDish({
                ...dish,
                restaurantName:
                  restaurantMap[dish.restaurant_id] ?? dish.restaurantName,
              })
            }
          >
            <CardContent className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 text-sm leading-tight font-semibold transition-colors group-hover:text-primary">
                  {dish.name}
                </h3>
                <span className="text-sm font-bold whitespace-nowrap text-primary">
                  {dish.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {restaurantMap[dish.restaurant_id] ?? "…"}
              </Badge>
            </CardContent>
          </Card>
        ))}

        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={`sk-${i}`}>
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div ref={sentinelRef} className="h-4" />
      {!hasMore && dishes.length > 0 && (
        <p className="pb-4 text-center text-xs text-muted-foreground">
          Todos os pratos carregados
        </p>
      )}

      <DishModal
        dish={selectedDish}
        open={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        onSaved={handleSaved}
      />
      <CreateDishModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleSaved}
      />
    </div>
  )
}
