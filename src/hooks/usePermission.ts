import { useAuth } from "@/contexts/use-auth"
import { hasPermission, type Action, type ModuleName } from "@/lib/permissions"

export function usePermission(module: ModuleName, action: Action): boolean {
  const { user } = useAuth()
  return hasPermission(user?.role, module, action)
}
