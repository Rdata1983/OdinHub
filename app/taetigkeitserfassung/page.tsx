"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`

export default function ActivityTracking() {
  const [projects, setProjects] = useState([])
  const [activities, setActivities] = useState([])
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedActivity, setSelectedActivity] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [timeEntries, setTimeEntries] = useState([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [manualStartTime, setManualStartTime] = useState("")
  const [manualEndTime, setManualEndTime] = useState("")
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
    fetchActivities()
  }, [])

  useEffect(() => {
    fetchTimeEntries()
  }, [currentDate])

  useEffect(() => {
    let interval
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTracking])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projekte`)
      if (!response.ok) throw new Error("Fehler beim Laden der Projekte")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Fehler beim Laden der Projekte:", error)
      toast({
        title: "Fehler",
        description: "Projekte konnten nicht geladen werden.",
        variant: "destructive",
      })
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/taetigkeiten`)
      if (!response.ok) throw new Error("Fehler beim Laden der Tätigkeiten")
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error("Fehler beim Laden der Tätigkeiten:", error)
      toast({
        title: "Fehler",
        description: "Tätigkeiten konnten nicht geladen werden.",
        variant: "destructive",
      })
    }
  }

  const fetchTimeEntries = async () => {
    try {
      const response = await fetch(`${API_URL}/zeiterfassungen?date=${currentDate.toISOString().split("T")[0]}`)
      if (!response.ok) throw new Error("Fehler beim Laden der Zeiterfassungen")
      const data = await response.json()
      setTimeEntries(data)
    } catch (error) {
      console.error("Fehler beim Laden der Zeiterfassungen:", error)
      toast({
        title: "Fehler",
        description: "Zeiterfassungen konnten nicht geladen werden.",
        variant: "destructive",
      })
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleStartTracking = async () => {
    if (selectedProject && selectedActivity) {
      try {
        const response = await fetch(`${API_URL}/zeiterfassungen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projektId: selectedProject,
            taetigkeitId: selectedActivity,
            startZeit: new Date().toISOString(),
          }),
        })
        if (!response.ok) throw new Error("Fehler beim Starten der Zeiterfassung")
        const data = await response.json()
        setCurrentSessionId(data.id) // Save the session ID
        setIsTracking(true)
        setElapsedTime(0)
        toast({
          title: "Zeiterfassung gestartet",
          description: `Projekt: ${selectedProject}, Aktivität: ${selectedActivity}`,
        })
      } catch (error) {
        console.error("Fehler beim Starten der Zeiterfassung:", error)
        toast({
          title: "Fehler",
          description: "Zeiterfassung konnte nicht gestartet werden.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie ein Projekt und eine Aktivität aus.",
        variant: "destructive",
      })
    }
  }

  const handleStopTracking = async () => {
    if (!currentSessionId) {
      console.error("Keine aktive Zeiterfassung gefunden")
      return
    }
    try {
      const response = await fetch(`${API_URL}/zeiterfassungen/${currentSessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endZeit: new Date().toISOString(),
        }),
      })
      if (!response.ok) throw new Error("Fehler beim Beenden der Zeiterfassung")
      setIsTracking(false)
      setCurrentSessionId(null) // Reset the session ID
      toast({
        title: "Zeiterfassung beendet",
        description: `Projekt: ${selectedProject}, Aktivität: ${selectedActivity}, Dauer: ${formatTime(elapsedTime)}`,
      })
      fetchTimeEntries() // Aktualisiere die Zeiterfassungen
    } catch (error) {
      console.error("Fehler beim Beenden der Zeiterfassung:", error)
      toast({
        title: "Fehler",
        description: "Zeiterfassung konnte nicht beendet werden.",
        variant: "destructive",
      })
    }
  }

  const changeDate = (days) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate)
  }

  const handleManualTimeEntry = async () => {
    if (selectedProject && selectedActivity && manualStartTime && manualEndTime) {
      try {
        const response = await fetch(`${API_URL}/zeiterfassungen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projektId: selectedProject,
            taetigkeitId: selectedActivity,
            startZeit: `${currentDate.toISOString().split("T")[0]}T${manualStartTime}:00`,
            endZeit: `${currentDate.toISOString().split("T")[0]}T${manualEndTime}:00`,
          }),
        })
        if (!response.ok) throw new Error("Fehler beim Eintragen der manuellen Zeit")
        toast({
          title: "Manuelle Zeit eingetragen",
          description: `Projekt: ${selectedProject}, Tätigkeit: ${selectedActivity}, Von: ${manualStartTime}, Bis: ${manualEndTime}`,
        })
        setManualStartTime("")
        setManualEndTime("")
        fetchTimeEntries() // Aktualisiere die Zeiterfassungen
      } catch (error) {
        console.error("Fehler beim Eintragen der manuellen Zeit:", error)
        toast({
          title: "Fehler",
          description: "Manuelle Zeit konnte nicht eingetragen werden.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tätigkeitserfassung</h1>

      <Card>
        <CardHeader>
          <CardTitle>Neue Tätigkeit erfassen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project">Projekt</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Wähle ein Projekt" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="activity">Tätigkeit</Label>
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger id="activity">
                    <SelectValue placeholder="Wähle eine Tätigkeit" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button onClick={isTracking ? handleStopTracking : handleStartTracking} className="w-1/2">
                {isTracking ? (
                  <>
                    <Pause className="mr-2" /> Stopp
                  </>
                ) : (
                  <>
                    <Play className="mr-2" /> Start
                  </>
                )}
              </Button>
              <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manuelle Zeiteingabe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manualStartTime">Startzeit</Label>
                <Input
                  id="manualStartTime"
                  type="time"
                  value={manualStartTime}
                  onChange={(e) => setManualStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="manualEndTime">Endzeit</Label>
                <Input
                  id="manualEndTime"
                  type="time"
                  value={manualEndTime}
                  onChange={(e) => setManualEndTime(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleManualTimeEntry}>Zeit eintragen</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>
              {currentDate.toLocaleDateString("de-DE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="relative h-12">
              {timeEntries.map((entry, index) => {
                const startDate = new Date(entry.startZeit)
                const endDate = new Date(entry.endZeit)
                const startMinutes = startDate.getHours() * 60 + startDate.getMinutes()
                const endMinutes = endDate.getHours() * 60 + endDate.getMinutes()
                const startPercentage = (startMinutes / 1440) * 100
                const width = ((endMinutes - startMinutes) / 1440) * 100

                return (
                  <Tooltip key={entry.id}>
                    <TooltipTrigger>
                      <div
                        className="absolute h-full rounded-md cursor-pointer"
                        style={{
                          left: `${startPercentage}%`,
                          width: `${width}%`,
                          backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {entry.projektName} - {entry.taetigkeitName}
                      </p>
                      <p>
                        {startDate.toLocaleTimeString()} - {endDate.toLocaleTimeString()}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </TooltipProvider>
          <div className="mt-2 text-xs flex justify-between">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

