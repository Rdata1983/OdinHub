"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface AppConfig {
  kioskModeEnabled: boolean
  showCurrentTime: boolean
}

interface AppConfigContextType {
  config: AppConfig
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined)

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>({
    kioskModeEnabled: true,
    showCurrentTime: true,
  })

  return <AppConfigContext.Provider value={{ config, setConfig }}>{children}</AppConfigContext.Provider>
}

export function useAppConfig() {
  const context = useContext(AppConfigContext)
  if (context === undefined) {
    throw new Error("useAppConfig must be used within an AppConfigProvider")
  }
  return context
}

