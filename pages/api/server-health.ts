import type { NextApiRequest, NextApiResponse } from "next"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API_URL in server-health:", API_URL)
  try {
    console.log("Attempting to fetch from:", `${API_URL}/api/health`)
    const response = await fetch(`${API_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    console.log("Response status:", response.status)
    if (response.ok) {
      const data = await response.json()
      console.log("Response data:", data)
      res.status(200).json({ status: data.status })
    } else {
      console.error("Server not reachable, status:", response.status)
      res.status(response.status).json({ error: "Server nicht erreichbar" })
    }
  } catch (error) {
    console.error("Error in health check:", error)
    res.status(500).json({ error: "Fehler beim Abrufen des Serverstatus" })
  }
}

