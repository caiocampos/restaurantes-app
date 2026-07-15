import { useEffect, useState } from "react"
import type { Dish, Restaurant } from "@/types"
import { dishService, restaurantService } from "@/lib/services"
import { usePermission } from "@/hooks/usePermission"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { Badge } from "@/components/ui/badge"
import { Label } from "../ui/label"

interface DishModalProps {
  dish: Dish | null
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export function DishModal({ dish, open, onClose, onSaved }: DishModalProps) {
  const canEdit = usePermission("dishes", "update")
  const canDelete = usePermission("dishes", "delete")

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [restaurantId, setRestaurantId] = useState("")
  const [restaurantName, setRestaurantName] = useState("")

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [restSearch, setRestSearch] = useState("")
  const [restLoading, setRestLoading] = useState(false)

  useEffect(() => {
    if (dish) {
      setName(dish.name)
      setPrice(String(dish.price))
      setRestaurantId(dish.restaurant_id)
      setRestaurantName(dish.restaurantName ?? "")
      setEditing(false)
      setError("")
    }
  }, [dish])

  useEffect(() => {
    if (!editing) return
    setRestLoading(true)
    restaurantService
      .list(1, 20, { name: restSearch })
      .then((r) => setRestaurants(r.data))
      .finally(() => setRestLoading(false))
  }, [editing, restSearch])

  async function handleSave() {
    if (!dish) return
    setSaving(true)
    setError("")
    try {
      await dishService.update(dish.id, {
        name,
        price: parseFloat(price),
        restaurant_id: restaurantId,
      })
      onSaved()
      setEditing(false)
    } catch {
      setError("Erro ao salvar. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!dish || !confirm("Excluir este prato?")) return
    setSaving(true)
    try {
      await dishService.remove(dish.id)
      onSaved()
      onClose()
    } catch {
      setError("Erro ao excluir.")
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setEditing(false)
    setError("")
    onClose()
  }

  if (!dish) return null

  const restOptions = restaurants.map((r) => ({ value: r.id, label: r.name }))
  const selectedInList = restOptions.find((o) => o.value === restaurantId)
  const options = selectedInList
    ? restOptions
    : restaurantId
      ? [{ value: restaurantId, label: restaurantName }, ...restOptions]
      : restOptions

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar Prato" : "Prato"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Restaurante</Label>
                <Combobox
                  className="w-full"
                  options={options}
                  value={restaurantId}
                  placeholder="Selecionar restaurante"
                  searchPlaceholder="Buscar restaurante..."
                  onSelect={(v) => {
                    setRestaurantId(v ?? "")
                    setRestaurantName(
                      options.find((o) => o.value === v)?.label ?? ""
                    )
                  }}
                  onSearch={setRestSearch}
                  loading={restLoading}
                />
              </div>
            </>
          ) : (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  Nome
                </dt>
                <dd className="mt-0.5 font-medium">{dish.name}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  Preço
                </dt>
                <dd className="mt-0.5 font-medium">
                  {dish.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  Restaurante
                </dt>
                <dd className="mt-0.5">
                  <Badge variant="secondary">
                    {dish.restaurantName ?? "—"}
                  </Badge>
                </dd>
              </div>
            </dl>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <div>
            {canDelete && !editing && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={saving}
              >
                Excluir
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Fechar
                </Button>
                {canEdit && (
                  <Button onClick={() => setEditing(true)}>Editar</Button>
                )}
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
