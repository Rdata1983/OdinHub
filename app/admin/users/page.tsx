"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/mitarbeiter`

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newUser, setNewUser] = useState({
    vorname: "",
    nachname: "",
    email: "",
    passwort: "",
    rolle: "",
    abteilung: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Fehler beim Abrufen der Benutzer:", error)
      setError(error.message || "Ein unbekannter Fehler ist aufgetreten")
      toast({
        title: "Fehler",
        description: `Benutzer konnten nicht geladen werden: ${error.message || "Unbekannter Fehler"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const addedUser = await response.json()
      setUsers([...users, addedUser])
      setNewUser({ vorname: "", nachname: "", email: "", passwort: "", rolle: "", abteilung: "" })
      toast({
        title: "Benutzer hinzugefügt",
        description: `${newUser.vorname} ${newUser.nachname} wurde erfolgreich hinzugefügt.`,
      })
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Benutzers:", error)
      toast({
        title: "Fehler",
        description: `Der Benutzer konnte nicht hinzugefügt werden: ${error.message || "Unbekannter Fehler"}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Benutzerverwaltung</h1>
      <Card>
        <CardHeader>
          <CardTitle>Neuen Benutzer hinzufügen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vorname">Vorname</Label>
                <Input
                  id="vorname"
                  value={newUser.vorname}
                  onChange={(e) => setNewUser({ ...newUser, vorname: e.target.value })}
                  placeholder="Vorname"
                />
              </div>
              <div>
                <Label htmlFor="nachname">Nachname</Label>
                <Input
                  id="nachname"
                  value={newUser.nachname}
                  onChange={(e) => setNewUser({ ...newUser, nachname: e.target.value })}
                  placeholder="Nachname"
                />
              </div>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="E-Mail-Adresse"
                />
              </div>
              <div>
                <Label htmlFor="passwort">Passwort</Label>
                <Input
                  id="passwort"
                  type="password"
                  value={newUser.passwort}
                  onChange={(e) => setNewUser({ ...newUser, passwort: e.target.value })}
                  placeholder="Passwort"
                />
              </div>
              <div>
                <Label htmlFor="rolle">Rolle</Label>
                <Select value={newUser.rolle} onValueChange={(value) => setNewUser({ ...newUser, rolle: value })}>
                  <SelectTrigger id="rolle">
                    <SelectValue placeholder="Wähle eine Rolle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mitarbeiter">Mitarbeiter</SelectItem>
                    <SelectItem value="Projektleiter">Projektleiter</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="abteilung">Abteilung</Label>
                <Input
                  id="abteilung"
                  value={newUser.abteilung}
                  onChange={(e) => setNewUser({ ...newUser, abteilung: e.target.value })}
                  placeholder="Abteilung"
                />
              </div>
            </div>
            <Button type="submit">Benutzer hinzufügen</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Benutzerliste</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Lade Benutzer...</p>
          ) : error ? (
            <p className="text-red-500">Fehler: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead>Abteilung</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{`${user.vorname || ""} ${user.nachname || ""}`}</TableCell>
                      <TableCell>{user.email || ""}</TableCell>
                      <TableCell>{user.rolle || ""}</TableCell>
                      <TableCell>{user.abteilung || ""}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Keine Benutzer gefunden
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

