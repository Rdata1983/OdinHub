"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"

// Example data
const projects = ["Projekt A", "Projekt B", "Projekt C", "Projekt D", "Projekt E"]
const activities = [
  "Planung",
  "Entwicklung",
  "Testing",
  "Meeting",
  "Dokumentation",
  "Kundensupport",
  "Bugfixing",
  "Refactoring",
  "Deployment",
  "Schulung",
]

export default function TimeTracking() {
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedActivity, setSelectedActivity] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [timeEntries, setTimeEntries] = useState([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Here we would normally load the data for the current date
    const mockTimeEntries = [
      { project: "Projekt A", activity: "Entwicklung", start: "09:00", end: "10:30" },
      { project: "Projekt B", activity: "Meeting", start: "10:45", end: "11:15" },
      { project: "Projekt A", activity: "Testing", start: "11:30", end: "13:00" },
      { project: "Projekt C", activity: "Planung", start: "14:00", end: "16:30" },
    ]
    setTimeEntries(mockTimeEntries)
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

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleStartTracking = () => {
    if (selectedProject && selectedActivity) {
      setIsTracking(true)
      setElapsedTime(0)
      toast({
        title: "Zeiterfassung gestartet",
        description: `Projekt: ${selectedProject}, Aktivität: ${selectedActivity}`,
      })
    } else {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie ein Projekt und eine Aktivität aus.",
        variant: "destructive",
      })
    }
  }

  const handleStopTracking = () => {
    setIsTracking(false)
    toast({
      title: "Zeiterfassung beendet",
      description: `Projekt: ${selectedProject}, Aktivität: ${selectedActivity}, Dauer: ${formatTime(elapsedTime)}`,
    })
    // Here we would save the time entry
  }

  const changeDate = (days) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Zeiterfassung</CardTitle>
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
                      <SelectItem key={project} value={project}>
                        {project}
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
                      <SelectItem key={activity} value={activity}>
                        {activity}
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
          <div className="relative h-12">
            {timeEntries.map((entry, index) => {
              const startMinutes =
                Number.parseInt(entry.start.split(":")[0]) * 60 + Number.parseInt(entry.start.split(":")[1])
              const endMinutes =
                Number.parseInt(entry.end.split(":")[0]) * 60 + Number.parseInt(entry.end.split(":")[1])
              const startPercentage = (startMinutes / 1440) * 100
              const width = ((endMinutes - startMinutes) / 1440) * 100

              return (
                <div
                  key={index}
                  className="absolute h-full rounded-md"
                  style={{
                    left: `${startPercentage}%`,
                    width: `${width}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                  }}
                  title={`${entry.project} - ${entry.activity} (${entry.start} - ${entry.end})`}
                />
              )
            })}
          </div>
          <div className="mt-2 text-xs flex justify-between">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Letzte Projekte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {projects.slice(0, 4).map((project) => (
              <Button key={project} variant="outline" onClick={() => setSelectedProject(project)}>
                {project}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

