import Link from "next/link"
import { ArrowRight, Shield, Globe, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Your Identity, <span className="text-purple-300">Your Control</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                UniID is a decentralized identity and credential wallet that works across both physical and virtual
                worlds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                  <Link href="/dashboard">Access Your Wallet</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-purple-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 bg-purple-500 rounded-full opacity-40"></div>
                <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
                  <Fingerprint className="w-24 h-24 text-purple-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose UniID?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-10 h-10 text-purple-600" />}
              title="Self-Sovereign Identity"
              description="You control your data. No central authority owns or stores your personal information."
            />
            <FeatureCard
              icon={<Globe className="w-10 h-10 text-purple-600" />}
              title="Works Everywhere"
              description="Use your credentials in both physical and virtual environments, online and offline."
            />
            <FeatureCard
              icon={<Fingerprint className="w-10 h-10 text-purple-600" />}
              title="Privacy-Preserving"
              description="Prove facts about yourself without revealing unnecessary personal data."
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Bridging Real & Virtual Worlds</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            UniID enables secure identity verification across physical services and metaverse platforms.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <UseCaseCard
              title="Real-World Applications"
              items={[
                "Access government & public services",
                "Verify education credentials",
                "Secure healthcare information",
                "Enable financial inclusion",
              ]}
            />
            <UseCaseCard
              title="Metaverse Applications"
              items={[
                "Secure virtual learning environments",
                "Verified digital recruitment",
                "Digital governance & civic participation",
                "Age verification for restricted spaces",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your digital identity?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-purple-100">
            Join UniID today and experience the future of secure, portable digital credentials.
          </p>
          <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
            <Link href="/dashboard">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
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
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
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

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function UseCaseCard({ title, items }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-purple-900">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-2 mt-1 bg-purple-100 text-purple-800 rounded-full p-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
