"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Clock,
  LayoutDashboard,
  FolderOpen,
  Users,
  Monitor,
  ChevronLeft,
  ChevronRight,
  NetworkIcon as NetworkCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppConfig } from "@/lib/app-config"
import { Button } from "@/components/ui/button"

const Navigation = () => {
  const pathname = usePathname()
  const { config } = useAppConfig()
  const [currentTime, setCurrentTime] = useState("")
  const [isExpanded, setIsExpanded] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }))
    }

    updateTime() // Set initial time
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  const navItems = [
    { href: "/taetigkeitserfassung", icon: Clock, label: "Tätigkeitserfassung" },
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/projects", icon: FolderOpen, label: "Projekte" },
    { href: "/admin/users", icon: Users, label: "Benutzer" },
    { href: "/kiosk", icon: Monitor, label: "Kiosk-Modus" },
    { href: "/admin/connection-test", icon: NetworkCheck, label: "Verbindungstest" },
  ]

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev)
    document.body.classList.toggle("menu-expanded", !isExpanded)
    document.body.classList.toggle("menu-collapsed", isExpanded)
  }

  const closeMenu = () => {
    setIsExpanded(false)
    document.body.classList.remove("menu-expanded")
    document.body.classList.add("menu-collapsed")
  }

  return (
    <>
      <nav
        className={cn(
          "fixed left-0 top-0 h-full bg-gray-100 transition-all duration-300 ease-in-out z-10",
          isExpanded ? "w-64" : "w-16",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 flex items-center justify-between">
          {isExpanded && <h1 className="text-xl font-bold">Tätigkeitserfassung</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            className={cn("ml-auto", !isExpanded && "mx-auto")}
          >
            {isExpanded ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        {config.showCurrentTime && (
          <div className={cn("text-sm text-gray-600 px-4 py-2", !isExpanded && "text-center")}>{currentTime}</div>
        )}
        <div className="py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                !isExpanded && "justify-center",
              )}
            >
              <item.icon className={cn("h-6 w-6", isExpanded && "mr-3")} />
              {isExpanded && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out",
          isExpanded || isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={closeMenu}
      />
    </>
  )
}

export default Navigation

