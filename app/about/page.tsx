import Link from "next/link"
import { ArrowRight, Shield, Lock, Database, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              UniID
            </Link>
            <div className="flex gap-4">
              <Link href="/dashboard" className="text-white/80 hover:text-white">
                Dashboard
              </Link>
              <Link href="/about" className="text-white font-medium">
                About
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-purple-900 to-purple-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About UniID</h1>
            <p className="text-xl text-purple-100 mb-8">
              A decentralized identity and credential wallet that bridges the gap between physical and virtual worlds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                <Link href="/dashboard">Try the Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <a href="#problem">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">The Problem</h2>
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-red-700 mb-2">Identity Crisis</h3>
                <p>
                  Over 850 million people globally lack official identification, and approximately 1.4 billion adults
                  remain unbanked, hindering their access to essential services.
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-orange-700 mb-2">Metaverse Challenges</h3>
                <p>
                  The rapid expansion of the metaverse introduces new challenges in establishing trustworthy digital
                  identities, leading to increased instances of fraud and impersonation.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-yellow-700 mb-2">Credential Verification</h3>
                <p>
                  Without reliable identity verification mechanisms in virtual environments, there's no way to prove
                  qualifications, age, or rights across digital platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Solution</h2>
            <p className="text-lg text-center text-gray-600 mb-12">
              UniID proposes a decentralized, self-sovereign Identity and Credential Wallet designed to bridge the gap
              between the physical and the metaverse.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Self-Sovereign Identity</h3>
                </div>
                <p className="text-gray-600">
                  Users create and control their own digital identity. No central authority owns or stores the user's
                  data.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Verifiable Credentials</h3>
                </div>
                <p className="text-gray-600">
                  Credentials such as diplomas, work permits, or proof of age are issued by trusted institutions and
                  cryptographically signed.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Lock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Privacy-Preserving</h3>
                </div>
                <p className="text-gray-600">
                  Users can prove things like "I am over 18" without revealing their full name, address, or ID number
                  using Zero-Knowledge Proofs.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Zap className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Works Online & Offline</h3>
                </div>
                <p className="text-gray-600">
                  UniID supports both connected and offline use cases through NFC or QR-code scanning, ideal for rural
                  regions or emergency zones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Technical Architecture</h2>
            <p className="text-lg text-center text-gray-600 mb-12">
              UniID is built on open standards and decentralized technologies to ensure security, privacy, and
              interoperability.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
              <h3 className="font-semibold text-lg mb-4">Core Components</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-purple-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-700 font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">User Wallet (Mobile App)</h4>
                    <p className="text-gray-600 text-sm">
                      A self-sovereign wallet stored locally on the user's device that allows them to register, store
                      identity credentials, and present them when needed.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="bg-purple-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-700 font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Issuer Dashboard</h4>
                    <p className="text-gray-600 text-sm">
                      A web-based interface for organizations like universities and hospitals to issue cryptographically
                      signed credentials to users.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="bg-purple-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-700 font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Verifier SDK / API</h4>
                    <p className="text-gray-600 text-sm">
                      Lightweight toolkit for any platform or institution to verify credentials, working on metaverse
                      platforms, public kiosks, mobile apps, and websites.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="bg-purple-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-700 font-medium">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Blockchain Registry</h4>
                    <p className="text-gray-600 text-sm">
                      Used to anchor decentralized identifiers and issuer public keys, with no personal data stored on
                      the blockchain.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/dashboard">
                  Try the Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Alignment with UN Sustainable Development Goals</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-700 font-bold text-xl">16.9</span>
                </div>
                <h3 className="font-semibold mb-2">Legal Identity for All</h3>
                <p className="text-sm text-gray-600">Providing legal identity for all, including birth registration.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-700 font-bold text-xl">10</span>
                </div>
                <h3 className="font-semibold mb-2">Reduced Inequalities</h3>
                <p className="text-sm text-gray-600">Facilitating access to services for marginalized groups.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-700 font-bold text-xl">9</span>
                </div>
                <h3 className="font-semibold mb-2">Innovation & Infrastructure</h3>
                <p className="text-sm text-gray-600">
                  Building resilient infrastructure through secure digital identity systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to experience UniID?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-purple-100">
            Try our demo to see how UniID can revolutionize identity and credential management.
          </p>
          <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
            <Link href="/dashboard">
              Launch Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white">UniID</h3>
              <p className="mt-2">Your Identity, Your Control</p>
            </div>
            <div className="flex gap-8">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Demo
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} UniID. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
