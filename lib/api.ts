import { useAuth } from "./AuthContext"

export function useApi() {
  const { token } = useAuth()

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Ein Fehler ist aufgetreten")
    }

    return response.json()
  }

  return { fetch: fetchWithAuth }
}

