import { useEffect, useState } from "react"
import type { Restaurant } from "@/types"
import { restaurantService } from "@/lib/services"
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
import { Label } from "../ui/label"
import { ActionEnum, ModuleNameEnum } from "@/lib/permissions"

interface RestaurantModalProps {
  restaurant: Restaurant | null
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export function RestaurantModal({
  restaurant,
  open,
  onClose,
  onSaved,
}: RestaurantModalProps) {
  const canEdit = usePermission(ModuleNameEnum.RESTAURANTS, ActionEnum.UPDATE)
  const canDelete = usePermission(ModuleNameEnum.RESTAURANTS, ActionEnum.DELETE)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {
    if (restaurant) {
      const updateValues = async () => {
        setName(restaurant.name)
        setPhone(restaurant.phone)
        setAddress(restaurant.address)
        setEditing(false)
        setError("")
      }
      updateValues()
    }
  }, [restaurant])

  async function handleSave() {
    if (!restaurant) return
    setSaving(true)
    setError("")
    try {
      await restaurantService.update(restaurant.id, { name, phone, address })
      onSaved()
      setEditing(false)
    } catch {
      setError("Erro ao salvar. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!restaurant || !confirm("Excluir este restaurante?")) return
    setSaving(true)
    try {
      await restaurantService.remove(restaurant.id)
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

  if (!restaurant) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar Restaurante" : "Restaurante"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </>
          ) : (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  Nome
                </dt>
                <dd className="mt-0.5 font-medium">{restaurant.name}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  Telefone
                </dt>
                <dd className="mt-0.5 font-medium">{restaurant.phone}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  Endereço
                </dt>
                <dd className="mt-0.5 font-medium">{restaurant.address}</dd>
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
