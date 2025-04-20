"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Award,
  Briefcase,
  ChevronRight,
  Download,
  GraduationCap,
  Heart,
  QrCode,
  Search,
  Share2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for the MVP
const mockCredentials = [
  {
    id: "cred-1",
    type: "education",
    title: "Bachelor of Computer Science",
    issuer: "University of Technology",
    issueDate: "2022-05-15",
    expiryDate: "2032-05-15",
    icon: <GraduationCap className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700",
    description:
      "Bachelor's degree in Computer Science with a focus on software engineering and artificial intelligence.",
    metadata: {
      "Degree Type": "Bachelor of Science",
      Major: "Computer Science",
      GPA: "3.8/4.0",
      "Graduation Date": "May 15, 2022",
      "Student ID": "ST12345678",
    },
  },
  {
    id: "cred-2",
    type: "identity",
    title: "National ID",
    issuer: "Government of Example",
    issueDate: "2021-03-10",
    expiryDate: "2031-03-10",
    icon: <User className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-700",
    description: "Official national identification document issued by the government.",
    metadata: {
      "ID Type": "National ID Card",
      "ID Number": "ID98765432",
      Nationality: "Example Nation",
      "Date of Birth": "January 15, 1990",
      "Place of Issue": "Capital City",
    },
  },
  {
    id: "cred-3",
    type: "professional",
    title: "Web Development Certification",
    issuer: "Tech Academy",
    issueDate: "2023-01-22",
    expiryDate: "2026-01-22",
    icon: <Award className="h-5 w-5" />,
    color: "bg-green-100 text-green-700",
    description: "Professional certification in modern web development technologies and practices.",
    metadata: {
      "Certification Level": "Advanced",
      Skills: "JavaScript, React, Node.js, GraphQL",
      "Examination Score": "92%",
      "Certificate Number": "WD-2023-78901",
    },
  },
  {
    id: "cred-4",
    type: "health",
    title: "COVID-19 Vaccination",
    issuer: "National Health Service",
    issueDate: "2022-08-05",
    expiryDate: "2024-08-05",
    icon: <Heart className="h-5 w-5" />,
    color: "bg-red-100 text-red-700",
    description: "Official record of COVID-19 vaccination including vaccine type and dates.",
    metadata: {
      "Vaccine Type": "mRNA-1273",
      Doses: "2",
      "Last Dose Date": "August 5, 2022",
      "Administered By": "Central Hospital",
      "Batch Number": "LOT-123456",
    },
  },
  {
    id: "cred-5",
    type: "professional",
    title: "Project Management Professional",
    issuer: "PM Institute",
    issueDate: "2023-04-18",
    expiryDate: "2026-04-18",
    icon: <Briefcase className="h-5 w-5" />,
    color: "bg-amber-100 text-amber-700",
    description: "Globally recognized certification for project management professionals.",
    metadata: {
      "Certification Type": "PMP",
      "License Number": "PMP-2023-45678",
      "PDUs Earned": "60",
      Specialization: "Agile Methodologies",
    },
  },
]

export default function CredentialsPage() {
  const [selectedCredential, setSelectedCredential] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCredentials = mockCredentials.filter(
    (cred) =>
      cred.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.issuer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">My Credentials</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 hidden md:flex">
              <QrCode className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search credentials..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="identity">Identity</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="health">Health</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Credentials List */}
        <div className="space-y-4">
          {filteredCredentials.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No credentials found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          ) : (
            filteredCredentials.map((credential) => (
              <Dialog key={credential.id}>
                <DialogTrigger asChild>
                  <button className="w-full text-left" onClick={() => setSelectedCredential(credential)}>
                    <CredentialCard credential={credential} />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Credential Details</DialogTitle>
                    <DialogDescription>View and manage this credential</DialogDescription>
                  </DialogHeader>
                  {selectedCredential && (
                    <div className="py-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-full ${selectedCredential.color}`}>{selectedCredential.icon}</div>
                        <div>
                          <h3 className="font-medium">{selectedCredential.title}</h3>
                          <p className="text-sm text-gray-500">Issued by {selectedCredential.issuer}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{selectedCredential.description}</p>

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Credential Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Type:</span>
                            <span className="text-sm capitalize">{selectedCredential.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Issue Date:</span>
                            <span className="text-sm">
                              {new Date(selectedCredential.issueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Expiry Date:</span>
                            <span className="text-sm">
                              {new Date(selectedCredential.expiryDate).toLocaleDateString()}
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

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Credential Metadata</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedCredential.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm text-gray-500">{key}:</span>
                              <span className="text-sm">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-center mb-4">
                        <div className="bg-white p-2 border rounded-lg">
                          <QrCode className="h-32 w-32 text-gray-800" />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function CredentialCard({ credential }) {
  return (
    <Card className="hover:border-purple-300 hover:shadow-sm transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${credential.color}`}>{credential.icon}</div>
            <div>
              <h3 className="font-medium">{credential.title}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">Issued by {credential.issuer}</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Valid</span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  )
}
