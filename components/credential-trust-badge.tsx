import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, AlertCircle, HelpCircle, Globe } from "lucide-react"
import type { TrustLevel } from "@/lib/types"

interface CredentialTrustBadgeProps {
  trustLevel: TrustLevel
  crossBorder?: boolean
}

export function CredentialTrustBadge({ trustLevel, crossBorder }: CredentialTrustBadgeProps) {
  const getBadgeContent = () => {
    switch (trustLevel) {
      case "verified":
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: "Verified",
          variant: "default" as const,
          tooltip: "This credential is from a verified issuer",
        }
      case "high":
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: "High Trust",
          variant: "secondary" as const,
          tooltip: "This credential is from a highly trusted issuer",
        }
      case "medium":
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: "Medium Trust",
          variant: "outline" as const,
          tooltip: "This credential is from a moderately trusted issuer",
        }
      case "low":
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: "Low Trust",
          variant: "destructive" as const,
          tooltip: "This credential is from a low-trust issuer",
        }
      default:
        return {
          icon: <HelpCircle className="h-3 w-3" />,
          text: "Unknown",
          variant: "outline" as const,
          tooltip: "The trust level of this credential is unknown",
        }
    }
  }

  const badgeContent = getBadgeContent()

  return (
    <div className="flex gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={badgeContent.variant} className="flex items-center gap-1">
              {badgeContent.icon}
              {badgeContent.text}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{badgeContent.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {crossBorder && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Cross-Border
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>This credential is recognized across international borders</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
