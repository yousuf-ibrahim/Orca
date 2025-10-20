import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Shield, Clock, FileCheck, Users, TrendingUp, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Orca</h1>
          </div>
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Enterprise KYC & Compliance
              <span className="text-primary block mt-2">Built for Investment Firms</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Streamline client onboarding with automated KYC verification, real-time compliance monitoring, 
              and comprehensive audit trails. Built for the next generation of investment operations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setLocation("/dashboard")} data-testid="button-get-started">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.8%</div>
              <div className="text-sm text-muted-foreground">Verification Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">3min</div>
              <div className="text-sm text-muted-foreground">Avg. Processing Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Active Firms</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Compliance Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive compliance tools designed for modern investment firms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Automated KYC</h3>
              </div>
              <p className="text-muted-foreground">
                AI-powered document verification and risk assessment with real-time compliance checks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Real-Time Monitoring</h3>
              </div>
              <p className="text-muted-foreground">
                Continuous compliance monitoring with instant alerts for regulatory changes and risks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Audit Trail</h3>
              </div>
              <p className="text-muted-foreground">
                Complete audit logs with granular tracking of all compliance activities and approvals.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Multi-Tenant</h3>
              </div>
              <p className="text-muted-foreground">
                Secure workspace isolation with role-based access control for firms of all sizes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
              </div>
              <p className="text-muted-foreground">
                Comprehensive reporting with insights into approval rates, processing times, and trends.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Enterprise Ready</h3>
              </div>
              <p className="text-muted-foreground">
                SOC 2 compliant infrastructure with enterprise-grade security and 99.9% uptime SLA.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of investment firms that trust Orca for their compliance needs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => setLocation("/dashboard")} data-testid="button-cta-start">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" data-testid="button-cta-demo">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">Orca</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Orca. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
