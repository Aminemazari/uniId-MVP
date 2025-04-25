"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Home,
  Menu,
  Settings,
  Shield,
  User,
  LogOut,
  Fingerprint,
  Share2,
  Wallet,
  Globe,
  ChevronDown,
} from "lucide-react"
import { TrustScoreIndicator } from "@/components/trust-score-indicator"
import { AccessLevelBadge } from "@/components/access-level-badge"
import type { User as UserType } from "@/lib/types"

interface UnifiedNavProps {
  user: UserType
  notificationCount?: number
}

export function UnifiedNav({ user, notificationCount = 0 }: UnifiedNavProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      name: "Credentials",
      href: "/dashboard/credentials",
      icon: Wallet,
      active: pathname?.includes("/dashboard/credentials"),
    },
    {
      name: "Share ID",
      href: "/dashboard/verify",
      icon: Share2,
      active: pathname?.includes("/dashboard/verify"),
    },
    {
      name: "Privacy",
      href: "/dashboard/privacy",
      icon: Shield,
      active: pathname?.includes("/dashboard/privacy"),
    },
    {
      name: "Metaverse",
      href: "/dashboard/metaverse",
      icon: Globe,
      active: pathname?.includes("/dashboard/metaverse"),
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
      active: pathname?.includes("/dashboard/profile"),
    },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Fingerprint className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold">UniID</span>
                </div>
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                        item.active ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage || "/placeholder.svg"}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-full w-full p-1.5" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Trust Score</span>
                    <TrustScoreIndicator score={user.trustScore} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Access Level</span>
                    <AccessLevelBadge level={user.accessLevel.level} />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Fingerprint className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold hidden md:inline-block">UniID</span>
          </Link>
          <nav className="hidden md:flex md:gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex h-9 items-center gap-1 rounded-md px-2 text-sm transition-colors lg:px-3 ${
                  item.active ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden lg:inline-block">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/dashboard/notifications">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                >
                  {notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden gap-1 md:flex">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 overflow-hidden rounded-full bg-muted">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage || "/placeholder.svg"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-full w-full p-1" />
                    )}
                  </div>
                  <span className="hidden text-sm font-medium md:inline-block">{user.name}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex w-full cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex w-full cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth/logout" className="flex w-full cursor-pointer items-center text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/dashboard/profile">
              <div className="h-6 w-6 overflow-hidden rounded-full bg-muted">
                {user.profileImage ? (
                  <img
                    src={user.profileImage || "/placeholder.svg"}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-full w-full p-1" />
                )}
              </div>
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
