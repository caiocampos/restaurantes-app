import axios, { type AxiosRequestConfig } from "axios"
import type { AuthSession } from "@/types"
import { authService } from "./services"
import { returnToLogin } from "@/util"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"

export const api = axios.create({ baseURL: BASE_URL })

const SESSION_KEY = "restaurantes_session"

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    return null
  }
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

api.interceptors.request.use((config) => {
  const session = getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    const session = getSession()
    if (!session?.refreshToken) {
      clearSession()
      returnToLogin()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers = {
          ...(original.headers ?? {}),
          Authorization: `Bearer ${token}`,
        }
        return api(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const data = await authService.refresh(session.refreshToken)

      saveSession({ ...session, ...data })
      processQueue(null, data.accessToken)
      original.headers = {
        ...(original.headers ?? {}),
        Authorization: `Bearer ${data.accessToken}`,
      }
      return api(original)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearSession()
      returnToLogin()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
