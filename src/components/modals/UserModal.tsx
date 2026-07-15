import { useEffect, useState } from "react"
import type { User } from "@/types"
import { userService } from "@/lib/services"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"

interface UserModalProps {
  user: User | null
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export function UserModal({ user, open, onClose, onSaved }: UserModalProps) {
  const canEdit = usePermission("users", "update")
  const canDelete = usePermission("users", "delete")

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState<"admin" | "user">("user")

  useEffect(() => {
    if (user) {
      setName(user.name)
      setLastName(user.lastName)
      setRole(user.role)
      setEditing(false)
      setError("")
    }
  }, [user])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    setError("")
    try {
      await userService.update(user.id, { name, lastName, role })
      onSaved()
      setEditing(false)
    } catch {
      setError("Erro ao salvar. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleEnabled() {
    if (!user) return
    if (
      !confirm(
        user.enabled ? "Desabilitar este usuário?" : "Reabilitar este usuário?"
      )
    )
      return
    setSaving(true)
    try {
      if (user.enabled) {
        await userService.disable(user.id)
      } else {
        await userService.enable(user.id)
      }
      onSaved()
      onClose()
    } catch {
      setError("Erro ao alterar status.")
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setEditing(false)
    setError("")
    onClose()
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar Usuário" : "Usuário"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Sobrenome</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as "admin" | "user")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  Nome completo
                </dt>
                <dd className="mt-0.5 font-medium">
                  {user.name} {user.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  Role
                </dt>
                <dd className="mt-0.5">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role === "admin" ? "Administrador" : "Usuário"}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  Status
                </dt>
                <dd className="mt-0.5">
                  <Badge variant={user.enabled ? "success" : "destructive"}>
                    {user.enabled ? "Ativo" : "Desabilitado"}
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
                variant={user.enabled ? "destructive" : "outline"}
                size="sm"
                onClick={handleToggleEnabled}
                disabled={saving}
              >
                {user.enabled ? "Desabilitar" : "Reabilitar"}
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
