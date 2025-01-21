"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data
const employees = [
  { id: 1, name: "Max Mustermann" },
  { id: 2, name: "Anna Schmidt" },
  { id: 3, name: "Tom Müller" },
]

const projects = [
  { id: 1, name: "Projekt A" },
  { id: 2, name: "Projekt B" },
  { id: 3, name: "Projekt C" },
]

const employeeTimeEntries = [
  { date: "2023-05-01", start: "08:00", end: "17:00", break: "01:00", status: "Anwesend" },
  { date: "2023-05-02", start: "08:30", end: "16:30", break: "00:45", status: "Anwesend" },
  { date: "2023-05-03", start: "-", end: "-", break: "-", status: "Krank" },
  { date: "2023-05-04", start: "09:00", end: "18:00", break: "01:00", status: "Anwesend" },
  { date: "2023-05-05", start: "08:15", end: "17:15", break: "01:00", status: "Anwesend" },
]

const employeeMonthlyOverview = [
  { id: 1, name: "Max Mustermann", workedHours: 160, targetHours: 160, overtime: 0 },
  { id: 2, name: "Anna Schmidt", workedHours: 165, targetHours: 160, overtime: 5 },
  { id: 3, name: "Tom Müller", workedHours: 155, targetHours: 160, overtime: -5 },
]

const projectTimeAllocation = [
  { id: 1, name: "Projekt A", totalHours: 250, employees: 5 },
  { id: 2, name: "Projekt B", totalHours: 180, employees: 3 },
  { id: 3, name: "Projekt C", totalHours: 120, employees: 4 },
]

const projectDetailedView = [
  { task: "Planung", hours: 40, assignee: "Max Mustermann" },
  { task: "Entwicklung", hours: 80, assignee: "Anna Schmidt" },
  { task: "Testing", hours: 30, assignee: "Tom Müller" },
  { task: "Dokumentation", hours: 20, assignee: "Max Mustermann" },
]

export default function ReportingPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0].id.toString())
  const [selectedProject, setSelectedProject] = useState(projects[0].id.toString())

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reporting</h1>
      <Tabs defaultValue="employee">
        <TabsList>
          <TabsTrigger value="employee">Mitarbeiter</TabsTrigger>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="projects">Projekte</TabsTrigger>
        </TabsList>
        <TabsContent value="employee">
          <Card>
            <CardHeader>
              <CardTitle>Mitarbeiter Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-[200px] mb-4">
                  <SelectValue placeholder="Mitarbeiter auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Kommen</TableHead>
                    <TableHead>Gehen</TableHead>
                    <TableHead>Pause</TableHead>
                    <TableHead>Anwesenheit</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeTimeEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.start}</TableCell>
                      <TableCell>{entry.end}</TableCell>
                      <TableCell>{entry.break}</TableCell>
                      <TableCell>
                        {entry.start !== "-"
                          ? `${
                              Number(entry.end.split(":")[0]) -
                              Number(entry.start.split(":")[0]) -
                              Number(entry.break.split(":")[0])
                            }:${entry.end.split(":")[1]}`
                          : "-"}
                      </TableCell>
                      <TableCell>{entry.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Übersicht aller Mitarbeiter</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Gearbeitete Stunden</TableHead>
                    <TableHead>Soll-Stunden</TableHead>
                    <TableHead>Überstunden</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeMonthlyOverview.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.workedHours}</TableCell>
                      <TableCell>{employee.targetHours}</TableCell>
                      <TableCell>{employee.overtime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projekt Zeiterfassung</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">Übersicht aller Projekte</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Projektname</TableHead>
                    <TableHead>Gesamtstunden</TableHead>
                    <TableHead>Anzahl Mitarbeiter</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectTimeAllocation.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.totalHours}</TableCell>
                      <TableCell>{project.employees}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <h3 className="text-lg font-semibold my-4">Detailansicht Projekt</h3>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[200px] mb-4">
                  <SelectValue placeholder="Projekt auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aufgabe</TableHead>
                    <TableHead>Stunden</TableHead>
                    <TableHead>Zugewiesen an</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectDetailedView.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>{task.hours}</TableCell>
                      <TableCell>{task.assignee}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

