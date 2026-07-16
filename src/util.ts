export const route = (path: string) =>
  `${import.meta.env.BASE_URL}${path}`.replaceAll("//", "/")

export const loginRoute = "/login"
export const baseRoute = "/"

export const returnToLogin = () => {
  window.location.href = route(loginRoute)
}
