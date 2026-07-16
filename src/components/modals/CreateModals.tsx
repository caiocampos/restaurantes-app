import { useState } from "react"
import { RoleEnum, type Restaurant } from "@/types"
import { dishService, restaurantService, userService } from "@/lib/services"
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
import { Label } from "@/components/ui/label"
import { RestaurantCombobox } from "../common/restaurant-combobox"
import type { AxiosError } from "axios"

interface CreateDishModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateDishModal({
  open,
  onClose,
  onCreated,
}: CreateDishModalProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [restaurantId, setRestaurantId] = useState("")
  const [restaurantName, setRestaurantName] = useState("")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [restLoading, setRestLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function handleOpenChange(o: boolean) {
    if (!o) {
      setName("")
      setPrice("")
      setRestaurantId("")
      setError("")
      onClose()
    }
  }

  function handleRestSearch(q: string) {
    setRestLoading(true)
    restaurantService
      .list(1, 20, { name: q })
      .then((r) => setRestaurants(r.data))
      .finally(() => setRestLoading(false))
  }

  async function handleSubmit() {
    if (!name || !price || !restaurantId) {
      setError("Preencha todos os campos.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await dishService.create({
        name,
        price: parseFloat(price),
        restaurant_id: restaurantId,
      })
      onCreated()
      handleOpenChange(false)
    } catch {
      setError("Erro ao criar prato.")
    } finally {
      setSaving(false)
    }
  }

  const options = restaurants.map((r) => ({ value: r.id, label: r.name }))

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Prato</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
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
            <RestaurantCombobox
              options={options}
              handleRestSearch={handleRestSearch}
              setRestaurantId={(id) => setRestaurantId(id ?? "")}
              restaurantName={restaurantName}
              setRestaurantName={setRestaurantName}
              isLoading={restLoading}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Criando..." : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CreateRestaurantModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateRestaurantModal({
  open,
  onClose,
  onCreated,
}: CreateRestaurantModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function handleOpenChange(o: boolean) {
    if (!o) {
      setName("")
      setPhone("")
      setAddress("")
      setError("")
      onClose()
    }
  }

  async function handleSubmit() {
    if (!name || !phone || !address) {
      setError("Preencha todos os campos.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await restaurantService.create({ name, phone, address })
      onCreated()
      handleOpenChange(false)
    } catch {
      setError("Erro ao criar restaurante.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Restaurante</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Criando..." : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CreateUserModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateUserModal({
  open,
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState("user")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function handleOpenChange(o: boolean) {
    if (!o) {
      setUsername("")
      setPassword("")
      setName("")
      setLastName("")
      setRole("user")
      setError("")
      onClose()
    }
  }

  async function handleSubmit() {
    if (!username || !password || !name || !lastName) {
      setError("Preencha todos os campos.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await userService.create({ username, password, name, lastName, role })
      onCreated()
      handleOpenChange(false)
    } catch (e: unknown) {
      setError(
        (e as AxiosError<{ message: string }>)?.response?.data?.message ??
          "Erro ao criar usuário."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <div className="space-y-2">
            <Label>Usuário</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value ?? RoleEnum.USER)}
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
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Criando..." : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
