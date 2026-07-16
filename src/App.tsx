import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"
import { LoginPage } from "@/pages/LoginPage"
import { DishesPage } from "@/pages/DishesPage"
import { RestaurantsPage } from "@/pages/RestaurantsPage"
import { UsersPage } from "@/pages/UsersPage"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL ?? ""}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dishes" replace />} />
              <Route path="/dishes" element={<DishesPage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dishes" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
