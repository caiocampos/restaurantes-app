import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Search, Users } from "lucide-react"
import type { User } from "@/types"
import { userService } from "@/lib/services"
import { usePermission } from "@/hooks/usePermission"
import { usePaginatedList } from "@/hooks/usePaginatedList"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserModal } from "@/components/modals/UserModal"
import { CreateUserModal } from "@/components/modals/CreateModals"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

const PAGE_LIMIT = 10

export function UsersPage() {
  const canCreate = usePermission("users", "create")

  const [nameQuery, setNameQuery] = useState("")
  const debouncedName = useDebounce(nameQuery, 350)

  const [selected, setSelected] = useState<User | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const { items, page, total, totalPages, loading, error, goToPage, refresh } =
    usePaginatedList<User>({
      fetcher: (p, limit) =>
        userService.list(p, limit, { name: debouncedName || undefined }),
      limit: PAGE_LIMIT,
      deps: [debouncedName],
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            {total}{" "}
            {total === 1 ? "usuário cadastrado" : "usuários cadastrados"}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo usuário
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
          <Users className="h-10 w-10 opacity-30" />
          <p>Nenhum usuário encontrado</p>
        </div>
      )}

      {(loading || items.length > 0) && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                    <TableRow
                      key={i}
                      className="cursor-default hover:bg-transparent"
                    >
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : items.map((u) => (
                    <TableRow key={u.id} onClick={() => setSelected(u)}>
                      <TableCell className="font-medium">
                        {u.name} {u.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === "admin" ? "default" : "secondary"}
                        >
                          {u.role === "admin" ? "Admin" : "Usuário"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.enabled ? "success" : "destructive"}>
                          {u.enabled ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <UserModal
        user={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onSaved={() => {
          refresh()
          setSelected(null)
        }}
      />
      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={refresh}
      />
    </div>
  )
}
