"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/projekte`

export default function ProjectManagement() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newProject, setNewProject] = useState({ name: "", client: "", status: "", budget: "" })
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Fehler beim Abrufen der Projekte:", error)
      setError(error.message || "Ein unbekannter Fehler ist aufgetreten")
      toast({
        title: "Fehler",
        description: `Projekte konnten nicht geladen werden: ${error.message || "Unbekannter Fehler"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const addedProject = await response.json()
      setProjects([...projects, addedProject])
      setNewProject({ name: "", client: "", status: "", budget: "" })
      toast({
        title: "Projekt hinzugefügt",
        description: `${newProject.name} wurde erfolgreich hinzugefügt.`,
      })
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Projekts:", error)
      toast({
        title: "Fehler",
        description: `Das Projekt konnte nicht hinzugefügt werden: ${error.message || "Unbekannter Fehler"}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Projektverwaltung</h1>
      <Card>
        <CardHeader>
          <CardTitle>Neues Projekt hinzufügen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectName">Projektname</Label>
                <Input
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Neues Projekt"
                />
              </div>
              <div>
                <Label htmlFor="clientName">Kunde</Label>
                <Input
                  id="clientName"
                  value={newProject.client}
                  onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                  placeholder="Kundenname"
                />
              </div>
              <div>
                <Label htmlFor="projectStatus">Status</Label>
                <Select
                  value={newProject.status}
                  onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                >
                  <SelectTrigger id="projectStatus">
                    <SelectValue placeholder="Wähle einen Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Planung">In Planung</SelectItem>
                    <SelectItem value="Aktiv">Aktiv</SelectItem>
                    <SelectItem value="Abgeschlossen">Abgeschlossen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="projectBudget">Budget (€)</Label>
                <Input
                  id="projectBudget"
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  placeholder="z.B. 10000"
                />
              </div>
            </div>
            <Button type="submit">Projekt hinzufügen</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Projektliste</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Lade Projekte...</p>
          ) : error ? (
            <p className="text-red-500">Fehler: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projektname</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget (€)</TableHead>
                  <TableHead>Ausgegeben (€)</TableHead>
                  <TableHead>Fortschritt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>{project.status}</TableCell>
                      <TableCell>{project.budget.toLocaleString()}</TableCell>
                      <TableCell>{project.spent.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${(project.spent / project.budget) * 100}%` }}
                          ></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Keine Projekte gefunden
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

