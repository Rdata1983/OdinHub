"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAppConfig } from "@/lib/app-config"

export default function AdminDashboard() {
  const { config, setConfig } = useAppConfig()

  const toggleKioskMode = () => {
    setConfig({ ...config, kioskModeEnabled: !config.kioskModeEnabled })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="projects">Projekte</TabsTrigger>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="reports">Berichte</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Übersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Hier können Sie eine Übersicht Ihrer wichtigsten Kennzahlen sehen.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Verbindungstest</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Testen Sie die Verbindung zum Server.</p>
              <Link href="/admin/connection-test" className="text-blue-500 hover:underline">
                Zum Verbindungstest
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projekte</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Hier können Sie Ihre Projekte verwalten.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Benutzer</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Hier können Sie Ihre Benutzer verwalten.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Berichte</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Hier können Sie verschiedene Berichte generieren und einsehen.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Kiosk-Modus Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="kiosk-mode" checked={config.kioskModeEnabled} onCheckedChange={toggleKioskMode} />
                <Label htmlFor="kiosk-mode">Kiosk-Modus aktivieren</Label>
              </div>
              {config.kioskModeEnabled && (
                <Link href="/kiosk" className="text-blue-500 hover:underline">
                  Zum Kiosk-Modus
                </Link>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

