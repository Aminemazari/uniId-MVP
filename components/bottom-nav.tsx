"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, Share2, Shield, Globe, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
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
      name: "Share",
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
    <div className="bottom-nav-wrapper">
      <div className="grid h-full grid-cols-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-1",
              item.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className={cn("h-6 w-6 mb-1", item.active ? "text-primary" : "text-muted-foreground")} />
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
