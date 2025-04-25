"use client"

import { useState } from "react"
import { Shield, Eye, EyeOff, Lock, Unlock, AlertTriangle, Settings, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AccessLevel } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface PrivacyDashboardProps {
  dataSharing: {
    [key: string]: boolean
  }
  privacyScore: number
  accessLevels: {
    [key: string]: AccessLevel
  }
  onUpdateDataSharing: (key: string, value: boolean) => void
  onUpdateAccessLevel: (key: string, level: AccessLevel) => void
  onRunPrivacyScan: () => void
}

export function PrivacyDashboard({
  dataSharing,
  privacyScore,
  accessLevels,
  onUpdateDataSharing,
  onUpdateAccessLevel,
  onRunPrivacyScan,
}: PrivacyDashboardProps) {
  const [lastScan, setLastScan] = useState<Date>(new Date())

  const handlePrivacyScan = () => {
    onRunPrivacyScan()
    setLastScan(new Date())
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Privacy Dashboard</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={handlePrivacyScan}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Scan
          </Button>
        </div>
        <CardDescription>Manage your privacy settings and data sharing preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sharing">Data Sharing</TabsTrigger>
            <TabsTrigger value="access">Access Levels</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="relative h-32 w-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(privacyScore)}`}>{privacyScore}</span>
                </div>
                <svg className="h-32 w-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={privacyScore >= 80 ? "#10b981" : privacyScore >= 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={`${privacyScore * 2.83} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Privacy Score</p>
                <p className={`text-sm ${getScoreColor(privacyScore)}`}>{getScoreLabel(privacyScore)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Last scan: {lastScan.toLocaleString()}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data sharing</span>
                  <Badge variant={Object.values(dataSharing).some((v) => v) ? "outline" : "secondary"}>
                    {Object.values(dataSharing).some((v) => v)
                      ? `${Object.values(dataSharing).filter((v) => v).length} active`
                      : "None active"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Access levels</span>
                  <Badge variant="outline">{Object.keys(accessLevels).length} configured</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Privacy recommendations</span>
                  {privacyScore < 80 ? (
                    <Badge variant="destructive">{Math.ceil((80 - privacyScore) / 10)} issues</Badge>
                  ) : (
                    <Badge variant="secondary">All good</Badge>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sharing" className="space-y-4 pt-4">
            <div className="space-y-4">
              {Object.entries(dataSharing).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      {value ? (
                        <Eye className="mr-2 h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">{key}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {value ? "Currently shared with third parties" : "Not shared with third parties"}
                    </p>
                  </div>
                  <Switch checked={value} onCheckedChange={(checked) => onUpdateDataSharing(key, checked)} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="access" className="space-y-4 pt-4">
            <div className="space-y-4">
              {Object.entries(accessLevels).map(([key, level]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {level === "full" ? (
                        <Unlock className="mr-2 h-4 w-4 text-yellow-500" />
                      ) : level === "limited" ? (
                        <Lock className="mr-2 h-4 w-4 text-blue-500" />
                      ) : (
                        <Lock className="mr-2 h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium">{key}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={level === "minimal" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onUpdateAccessLevel(key, "minimal")}
                      >
                        Minimal
                      </Button>
                      <Button
                        variant={level === "limited" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onUpdateAccessLevel(key, "limited")}
                      >
                        Limited
                      </Button>
                      <Button
                        variant={level === "full" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onUpdateAccessLevel(key, "full")}
                      >
                        Full
                      </Button>
                    </div>
                  </div>
                  <Progress
                    value={level === "minimal" ? 33 : level === "limited" ? 66 : 100}
                    className={
                      level === "minimal" ? "bg-green-100" : level === "limited" ? "bg-blue-100" : "bg-yellow-100"
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {level === "minimal"
                      ? "Only essential data is shared"
                      : level === "limited"
                        ? "Some personal data is shared"
                        : "Full profile data is shared"}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <AlertTriangle className="mr-1 h-4 w-4" />
          {privacyScore < 60
            ? "Your privacy settings need attention"
            : privacyScore < 80
              ? "Your privacy settings are good but could be improved"
              : "Your privacy settings are excellent"}
        </div>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Advanced
        </Button>
      </CardFooter>
    </Card>
  )
}
