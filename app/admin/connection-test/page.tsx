"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ConnectionTest() {
  const [serverStatus, setServerStatus] = useState<string>("Unbekannt")
  const [healthCheckResult, setHealthCheckResult] = useState<string>("")
  const [getResult, setGetResult] = useState<string>("")
  const [responseData, setResponseData] = useState<string>("")
  const { toast } = useToast()

  const testConnection = async () => {
    console.log("Starting connection test to:", API_URL)
    setServerStatus("Verbindung wird getestet...")
    setHealthCheckResult("")
    setGetResult("")
    setResponseData("")

    // Step 1: Perform health check using the new API route
    try {
      console.log("Initiating health check")
      const healthCheckStart = performance.now()
      const healthCheckResponse = await fetch("/api/server-health")
      const healthCheckEnd = performance.now()
      const healthCheckTime = healthCheckEnd - healthCheckStart

      console.log("Health check response:", healthCheckResponse)

      if (healthCheckResponse.ok) {
        const healthData = await healthCheckResponse.json()
        console.log("Health check data:", healthData)
        setHealthCheckResult(
          `Health check erfolgreich. Antwortzeit: ${healthCheckTime.toFixed(2)}ms. Status: ${healthData.status || "OK"}`,
        )
        toast({
          title: "Health Check erfolgreich",
          description: `Antwortzeit: ${healthCheckTime.toFixed(2)}ms. Status: ${healthData.status}`,
        })
      } else {
        console.error("Health check failed with status:", healthCheckResponse.status)
        const errorText = await healthCheckResponse.text()
        console.error("Error response:", errorText)
        setHealthCheckResult(`Health check fehlgeschlagen: ${errorText || "Unbekannter Fehler"}`)
        setServerStatus("Fehler")
        toast({
          title: "Fehler beim Health Check",
          description: `Status: ${healthCheckResponse.status}, Fehler: ${errorText}`,
          variant: "destructive",
        })
        return
      }
    } catch (error) {
      console.error("Health check error:", error)
      setHealthCheckResult(`Health check fehlgeschlagen: ${error.message}`)
      setServerStatus("Fehler")
      toast({
        title: "Fehler beim Health Check",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    // Step 2: Test GET method on a table (we'll use the 'mitarbeiter' table as an example)
    try {
      console.log("Initiating GET request to:", `${API_URL}/api/mitarbeiter`)
      const getResponse = await fetch(`${API_URL}/api/mitarbeiter`)

      console.log("GET response:", getResponse)

      if (getResponse.ok) {
        const data = await getResponse.json()
        console.log("GET data:", data)
        setGetResult("GET-Anfrage erfolgreich")
        setResponseData(JSON.stringify(data, null, 2))
        setServerStatus("Verbunden")
        toast({
          title: "GET-Anfrage erfolgreich",
          description: "Mitarbeiter-Daten wurden erfolgreich abgerufen.",
        })
      } else {
        console.error("GET request failed with status:", getResponse.status)
        const errorText = await getResponse.text()
        console.error("Error response:", errorText)
        setGetResult(`GET-Anfrage fehlgeschlagen: ${errorText}`)
        setServerStatus("Fehler")
        toast({
          title: "Fehler bei GET-Anfrage",
          description: `Status: ${getResponse.status}, Fehler: ${errorText}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("GET request error:", error)
      setGetResult(`GET-Anfrage fehlgeschlagen: ${error.message}`)
      setServerStatus("Fehler")
      toast({
        title: "Fehler bei GET-Anfrage",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const testDirectApiCall = async () => {
    try {
      console.log("Testing direct API call to:", `${API_URL}/api/health`)
      const response = await fetch(`${API_URL}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log("Direct API call response:", response)
      if (response.ok) {
        const data = await response.json()
        console.log("Direct API call data:", data)
        toast({
          title: "Direkter API-Aufruf erfolgreich",
          description: `Status: ${data.status || "OK"}`,
        })
      } else {
        console.error("Direct API call failed with status:", response.status)
        toast({
          title: "Fehler beim direkten API-Aufruf",
          description: `Status: ${response.status}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Direct API call error:", error)
      toast({
        title: "Fehler beim direkten API-Aufruf",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Verbindungstest</h1>
      <Card>
        <CardHeader>
          <CardTitle>Server-Verbindung testen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection}>Verbindung testen</Button>
          <Button onClick={testDirectApiCall} className="ml-2">
            Direkter API-Test
          </Button>
          <div>
            <strong>Zielserver:</strong> {API_URL}
          </div>
          <div>
            <strong>Server-Status:</strong> {serverStatus}
          </div>
          <div>
            <strong>Health Check-Ergebnis:</strong> {healthCheckResult}
          </div>
          <div>
            <strong>GET-Anfrage-Ergebnis:</strong> {getResult}
          </div>
          {responseData && (
            <div>
              <strong>Server-Antwort (Mitarbeiter-Daten):</strong>
              <pre className="mt-2 p-4 bg-gray-100 rounded-md overflow-auto max-h-60">{responseData}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

