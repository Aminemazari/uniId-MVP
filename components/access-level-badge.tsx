import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Lock, ShieldAlert, ShieldCheck } from "lucide-react"
import type { User } from "@/lib/types"

interface AccessLevelBadgeProps {
  user?: User
  showTooltip?: boolean
}

export function AccessLevelBadge({ user, showTooltip = true }: AccessLevelBadgeProps) {
  // If user is undefined, return a default badge
  if (!user || !user.accessLevel) {
    const defaultBadge = (
      <Badge variant="outline" className="flex items-center gap-1">
        <Lock className="h-3 w-3" />
        Loading...
      </Badge>
    )

    return defaultBadge
  }

  const { level } = user.accessLevel

  const getBadgeContent = () => {
    switch (level) {
      case "limited":
        return {
          icon: <Lock className="h-3 w-3" />,
          text: "Limited Access",
          variant: "destructive" as const,
          tooltip: "Basic access only. Complete face ID verification to unlock more features.",
        }
      case "partial":
        return {
          icon: <ShieldAlert className="h-3 w-3" />,
          text: "Partial Access",
          variant: "secondary" as const,
          tooltip: "Complete document verification to unlock all features.",
        }
      case "full":
        return {
          icon: <ShieldCheck className="h-3 w-3" />,
          text: "Full Access",
          variant: "default" as const,
          tooltip: "You have full access to all features.",
        }
      default:
        return {
          icon: <Lock className="h-3 w-3" />,
          text: "Unknown Access",
          variant: "outline" as const,
          tooltip: "Access level unknown",
        }
    }
  }

  const badgeContent = getBadgeContent()

  const badge = (
    <Badge variant={badgeContent.variant} className="flex items-center gap-1">
      {badgeContent.icon}
      {badgeContent.text}
    </Badge>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{badgeContent.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
