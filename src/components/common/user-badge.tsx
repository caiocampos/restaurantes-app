import type { Role } from "@/types"
import { Badge } from "../ui/badge"
import type { ClassNameProps } from "./common-interfaces"

interface UserRoleBadgeProps extends ClassNameProps {
  userRole: Role
}

interface UserStatusBadgeProps extends ClassNameProps {
  userStatus: "enabled" | "disabled"
}

export const UserRoleBadge = ({ userRole, className }: UserRoleBadgeProps) => {
  const isAdmin = userRole === "admin"
  const variant = isAdmin ? "default" : "secondary"
  const text = isAdmin ? "Administrador" : "Usuário"
  return (
    <Badge variant={variant} className={className}>
      {text}
    </Badge>
  )
}

export const UserStatusBadge = ({
  userStatus,
  className,
}: UserStatusBadgeProps) => {
  const isEnabled = userStatus === "enabled"
  let badgeClassName = isEnabled
    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
  if (className) {
    badgeClassName += " " + className
  }
  const text = isEnabled ? "Ativo" : "Desabilitado"
  return <Badge className={badgeClassName}>{text}</Badge>
}
