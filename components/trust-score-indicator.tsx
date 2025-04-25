import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react"

interface TrustScoreIndicatorProps {
  score: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export function TrustScoreIndicator({
  score,
  showLabel = true,
  size = "md",
  showIcon = false,
}: TrustScoreIndicatorProps) {
  // Determine color based on score
  const getColor = () => {
    if (score >= 80) return "bg-success"
    if (score >= 60) return "bg-primary"
    if (score >= 40) return "bg-amber-500"
    if (score >= 20) return "bg-orange-500"
    return "bg-destructive"
  }

  // Determine trust level text
  const getTrustLevel = () => {
    if (score >= 80) return "Very High"
    if (score >= 60) return "High"
    if (score >= 40) return "Medium"
    if (score >= 20) return "Low"
    return "Very Low"
  }

  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-1.5"
      case "lg":
        return "h-3"
      default:
        return "h-2"
    }
  }

  // Get trust icon
  const getTrustIcon = () => {
    if (score >= 80) return <ShieldCheck className="h-4 w-4 text-success" />
    if (score >= 60) return <Shield className="h-4 w-4 text-primary" />
    if (score >= 40) return <ShieldAlert className="h-4 w-4 text-amber-500" />
    return <ShieldX className="h-4 w-4 text-destructive" />
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            {showLabel && (
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">Trust Score</span>
                  {showIcon && getTrustIcon()}
                </div>
                <span className="text-xs font-medium">{score}%</span>
              </div>
            )}
            <Progress value={score} className={getSizeClasses()}>
              <div
                className={`h-full transition-all ${getColor()}`}
                style={{ width: `${score}%` }}
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </Progress>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Trust Level: {getTrustLevel()} ({score}%)
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
