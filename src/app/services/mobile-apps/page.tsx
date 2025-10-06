import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile App Development Services - Devs & Creatives",
  description: "Professional mobile app development for African startups and brands. iOS and Android apps that engage users and drive growth.",
};

export default function MobileApps() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Mobile App Development</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Native and cross-platform mobile applications that help African startups and brands reach users on their preferred devices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">App Development Services</h2>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Native iOS Apps</h3>
                <p className="text-muted-foreground">
                  High-performance iOS applications built with Swift and SwiftUI for optimal user experience.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Native Android Apps</h3>
                <p className="text-muted-foreground">
                  Android applications developed with Kotlin and Jetpack Compose for modern Android devices.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Cross-Platform Apps</h3>
                <p className="text-muted-foreground">
                  React Native and Flutter apps that work seamlessly across iOS and Android platforms.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">App Prototypes</h3>
                <p className="text-muted-foreground">
                  Rapid prototyping to validate ideas and test user interactions before full development.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Development Process</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Strategy & Planning</h3>
                  <p className="text-muted-foreground">Defining app requirements, target audience, and technical architecture.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Design & Prototyping</h3>
                  <p className="text-muted-foreground">Creating user interfaces and interactive prototypes for testing.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Development</h3>
                  <p className="text-muted-foreground">Building the app with clean code and best practices.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Testing & Launch</h3>
                  <p className="text-muted-foreground">Comprehensive testing and app store submission.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Technologies We Use</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg text-center">
              <h4 className="font-semibold text-foreground">Swift</h4>
              <p className="text-sm text-muted-foreground">iOS Development</p>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <h4 className="font-semibold text-foreground">Kotlin</h4>
              <p className="text-sm text-muted-foreground">Android Development</p>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <h4 className="font-semibold text-foreground">React Native</h4>
              <p className="text-sm text-muted-foreground">Cross-Platform</p>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <h4 className="font-semibold text-foreground">Flutter</h4>
              <p className="text-sm text-muted-foreground">Cross-Platform</p>
            </div>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Build Your Mobile App?</h2>
          <p className="mb-6">Let&apos;s create a mobile experience that engages your users and drives your business growth.</p>
          <button className="bg-white text-primary px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
            Start Your App
          </button>
        </div>
      </div>
    </div>
  );
}
