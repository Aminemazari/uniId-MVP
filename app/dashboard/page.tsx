"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Award,
  Briefcase,
  ChevronRight,
  FileText,
  GraduationCap,
  Heart,
  Home,
  LogOut,
  QrCode,
  Settings,
  User,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for the MVP
const mockCredentials = [
  {
    id: "cred-1",
    type: "education",
    title: "Bachelor of Computer Science",
    issuer: "University of Technology",
    issueDate: "2022-05-15",
    icon: <GraduationCap className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "cred-2",
    type: "identity",
    title: "National ID",
    issuer: "Government of Example",
    issueDate: "2021-03-10",
    icon: <User className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "cred-3",
    type: "professional",
    title: "Web Development Certification",
    issuer: "Tech Academy",
    issueDate: "2023-01-22",
    icon: <Award className="h-5 w-5" />,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "cred-4",
    type: "health",
    title: "COVID-19 Vaccination",
    issuer: "National Health Service",
    issueDate: "2022-08-05",
    icon: <Heart className="h-5 w-5" />,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "cred-5",
    type: "professional",
    title: "Project Management Professional",
    issuer: "PM Institute",
    issueDate: "2023-04-18",
    icon: <Briefcase className="h-5 w-5" />,
    color: "bg-amber-100 text-amber-700",
  },
]

export default function Dashboard() {
  const [selectedCredential, setSelectedCredential] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            U
          </div>
          <h1 className="text-xl font-bold">UniID</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem href="/dashboard" icon={<Home />} active>
            Dashboard
          </NavItem>
          <NavItem href="/dashboard/credentials" icon={<FileText />}>
            My Credentials
          </NavItem>
          <NavItem href="/dashboard/verify" icon={<QrCode />}>
            Verify
          </NavItem>
          <NavItem href="/dashboard/settings" icon={<Settings />}>
            Settings
          </NavItem>
          <NavItem href="/dashboard/issuer" icon={<Award />}>
            Issuer Portal
          </NavItem>
        </nav>

        <div className="pt-4 border-t border-gray-200">
          <NavItem href="/" icon={<LogOut />}>
            Sign Out
          </NavItem>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome, Alex</h1>
              <p className="text-gray-600">Manage your digital identity and credentials</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link href="/dashboard/verify">
                  <QrCode className="h-4 w-4" />
                  Share ID
                </Link>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Identity Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Digital Identity</span>
                      <Badge variant="outline" className="font-normal">
                        Active
                      </Badge>
                    </CardTitle>
                    <CardDescription>Your verified digital identity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" />
                        <AvatarFallback className="text-lg">AL</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">Alex Lee</h3>
                        <p className="text-sm text-gray-500">ID: did:uniid:1234...5678</p>
                        <p className="text-sm text-gray-500">Verified: Yes</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Show QR Code
                    </Button>
                  </CardFooter>
                </Card>

                {/* Add Credential Card */}
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Add New Credential</CardTitle>
                    <CardDescription>Connect with issuers to add credentials</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                      <Plus className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-center text-gray-500 mb-4">
                      Scan a QR code or connect with an issuer to add a new credential to your wallet
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Add Credential</Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Credentials List */}
              <h2 className="text-xl font-semibold mt-8 mb-4">Your Credentials</h2>
              <div className="space-y-3">
                {mockCredentials.map((credential) => (
                  <Dialog key={credential.id}>
                    <DialogTrigger asChild>
                      <button className="w-full text-left" onClick={() => setSelectedCredential(credential)}>
                        <CredentialItem credential={credential} />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Credential Details</DialogTitle>
                        <DialogDescription>View and share this credential</DialogDescription>
                      </DialogHeader>
                      {selectedCredential && (
                        <div className="py-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-full ${selectedCredential.color}`}>
                              {selectedCredential.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{selectedCredential.title}</h3>
                              <p className="text-sm text-gray-500">Issued by {selectedCredential.issuer}</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Credential Details</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Type:</span>
                                <span className="text-sm">{selectedCredential.type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Issue Date:</span>
                                <span className="text-sm">
                                  {new Date(selectedCredential.issueDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Status:</span>
                                <span className="text-sm text-green-600">Valid</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Credential ID:</span>
                                <span className="text-sm">vc:uniid:{selectedCredential.id}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center mb-4">
                            <div className="bg-white p-2 border rounded-lg">
                              <QrCode className="h-32 w-32 text-gray-800" />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              Download
                            </Button>
                            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Share</Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </TabsContent>

            {/* Other tab contents would be similar but filtered by type */}
            <TabsContent value="education" className="mt-6">
              <div className="space-y-3">
                {mockCredentials
                  .filter((cred) => cred.type === "education")
                  .map((credential) => (
                    <CredentialItem key={credential.id} credential={credential} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="identity" className="mt-6">
              <div className="space-y-3">
                {mockCredentials
                  .filter((cred) => cred.type === "identity")
                  .map((credential) => (
                    <CredentialItem key={credential.id} credential={credential} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="professional" className="mt-6">
              <div className="space-y-3">
                {mockCredentials
                  .filter((cred) => cred.type === "professional")
                  .map((credential) => (
                    <CredentialItem key={credential.id} credential={credential} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-6">
              <div className="space-y-3">
                {mockCredentials
                  .filter((cred) => cred.type === "health")
                  .map((credential) => (
                    <CredentialItem key={credential.id} credential={credential} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function NavItem({ href, icon, children, active = false }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
        active ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

function CredentialItem({ credential }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${credential.color}`}>{credential.icon}</div>
        <div>
          <h3 className="font-medium">{credential.title}</h3>
          <p className="text-sm text-gray-500">Issued by {credential.issuer}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </div>
  )
}
