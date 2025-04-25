import { Badge } from "@/components/ui/badge"
import { FileCheck, Globe, ShieldAlert, Share2, Clock, Shield, Save, RefreshCw } from "lucide-react"
import type { ActivityLogEntry } from "@/lib/types"

interface ActivityLogItemProps {
  activity: ActivityLogEntry
}

export function ActivityLogItem({ activity }: ActivityLogItemProps) {
  const getIcon = () => {
    switch (activity.type) {
      case "credential_issued":
        return <FileCheck className="h-5 w-5 text-green-500" />
      case "credential_shared":
        return <Share2 className="h-5 w-5 text-blue-500" />
      case "verification_request":
        return <ShieldAlert className="h-5 w-5 text-amber-500" />
      case "metaverse_connection":
        return <Globe className="h-5 w-5 text-purple-500" />
      case "verification_status_change":
        return <Shield className="h-5 w-5 text-primary" />
      case "access_change":
        return <Clock className="h-5 w-5 text-primary" />
      case "backup_created":
        return <Save className="h-5 w-5 text-green-500" />
      case "recovery_completed":
        return <RefreshCw className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getTitle = () => {
    switch (activity.type) {
      case "credential_issued":
        return `Received ${activity.credential}`
      case "credential_shared":
        return `Shared ${activity.credential}`
      case "verification_request":
        return `Verification request from ${activity.requester}`
      case "metaverse_connection":
        return `Connected to ${activity.platform}`
      case "verification_status_change":
        return `Verification status: ${activity.status}`
      case "access_change":
        return activity.details || "Access level changed"
      case "backup_created":
        return "Backup created"
      case "recovery_completed":
        return "Recovery completed"
      default:
        return "Activity"
    }
  }

  const getDescription = () => {
    switch (activity.type) {
      case "credential_issued":
        return `Issued by ${activity.issuer}`
      case "credential_shared":
        return `Shared with ${activity.verifier}${activity.attributes ? ` (${activity.attributes.length} attributes)` : ""}`
      case "verification_request":
        return activity.credentials ? `Requested ${activity.credentials.join(", ")}` : "Requested credentials"
      case "metaverse_connection":
        return activity.attributes ? `Shared ${activity.attributes.length} attributes` : "Connected avatar"
      case "verification_status_change":
        return activity.details || ""
      case "backup_created":
        return activity.details || "Your data is securely backed up"
      case "recovery_completed":
        return activity.details || "Your identity was successfully restored"
      default:
        return activity.details || ""
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "just now"
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays}d ago`
    }

    return activityTime.toLocaleDateString()
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border p-3 transition-all hover:bg-muted/50">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{getIcon()}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{getTitle()}</h4>
          <Badge variant="outline" className="text-xs">
            {getTimeAgo(activity.timestamp)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{getDescription()}</p>
      </div>
    </div>
  )
}
