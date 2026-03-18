import { useAuth } from "@clerk/clerk-react"

export function useApi() {
  const { getToken } = useAuth()

  async function apiFetch(path, options = {}) {
    const token = await getToken()
    return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
  }

  return { apiFetch }
}
