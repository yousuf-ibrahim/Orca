import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Shield, Clock, FileCheck, Users, TrendingUp, ArrowRight, Zap, Target } from "lucide-react";
import { useLocation } from "wouter";
import { LogoCarousel } from "@/components/LogoCarousel";

const custodians = [
  "Bank of Singapore",
  "Banque Pictet & Cie SA",
  "Barclays Geneva",
  "BNY Mellon",
  "CA Indosuez (Switzerland) SA",
  "Credit Suisse Singapore",
  "Credit Suisse Switzerland",
  "Deutsche Bank DIFC & Singapore",
  "Deutsche Bank Switzerland",
  "EFG",
  "Emirates Investment Bank",
  "Emirates NBD",
  "FAB Swiss",
  "J. Safra Sarasin",
  "Kaiser Partner",
  "LGT",
  "Mashreq Bank",
  "Mirabaud",
  "Nomura Singapore",
  "QNB (Qatar National Bank)",
  "Reyl DIFC & Switzerland",
  "SocGen Monaco",
  "SocGen Switzerland",
  "Société Générale Luxembourg",
  "Standard Chartered Bank",
  "UBS Zurich",
];

const tradingPartners = [
  "ADCB (Abu Dhabi Commercial Bank)",
  "Al Khair",
  "Arqaam Capital",
  "Atlantic",
  "Bank ABC",
  "BOFA Securities (Bank of America)",
  "Bridport",
  "Citi",
  "Emirates Investment Bank",
  "GIB Capital (Gulf International Bank)",
  "Goldman Sachs",
  "JP Morgan",
  "Leonteq",
  "Market Securities",
  "Mashreq Bank",
  "Mitsubishi",
  "Morgan Stanley",
  "Nomura",
  "Noor Bank",
  "Pershing",
  "Picard and Angst MEA Ltd",
  "Privatam",
  "SCB Singapore (Standard Chartered Bank Singapore)",
  "Seaport",
  "SHUAA Capital",
  "Sunglobal",
  "TFS",
  "UBS",
];

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Orca</h1>
          </div>
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              The Addepar for
              <span className="text-primary block mt-2">Small Hedge Funds</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
              Enterprise-grade operations infrastructure built exclusively for boutique asset managers and emerging hedge funds.
              <span className="block mt-3 text-foreground font-medium">
                The killer whale amongst financial whales—small, efficient, and deadly effective.
              </span>
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We give tomorrow's Citadel the same institutional-grade tools as today's top funds. Automated KYC workflows, 
              multi-custodian integration, real-time compliance monitoring, and comprehensive audit trails—without the 
              enterprise price tag or bloat.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setLocation("/login")} data-testid="button-get-started">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" data-testid="button-learn-more">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Custodian Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">29+</div>
              <div className="text-sm text-muted-foreground">Trading Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">90%</div>
              <div className="text-sm text-muted-foreground">Faster Onboarding</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Compliance Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built for Boutique Excellence</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Large fund administrators are slow, expensive, and inflexible. You're not them. 
            You're agile, focused, and building something exceptional. Your infrastructure should match.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Speed & Efficiency</h3>
              </div>
              <p className="text-muted-foreground">
                What takes weeks with traditional administrators takes hours with Orca. Automated workflows, 
                instant compliance checks, and intelligent document processing.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Precision Tools</h3>
              </div>
              <p className="text-muted-foreground">
                Every feature designed specifically for emerging managers. No enterprise bloat, 
                no unused modules—just the exact toolkit you need to compete with established players.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Institutional Grade</h3>
              </div>
              <p className="text-muted-foreground">
                Same security, compliance, and audit capabilities as billion-dollar funds. 
                SOC 2 compliant, multi-tenant architecture, complete audit trails.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Screenshot Placeholder Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need in One Platform</h2>
            <p className="text-lg text-muted-foreground">
              From client onboarding to ongoing compliance monitoring
            </p>
          </div>
          
          {/* Main Screenshot Placeholder */}
          <div className="rounded-lg border-2 border-border bg-card/50 aspect-video flex items-center justify-center mb-6 hover-elevate">
            <div className="text-center">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Dashboard Screenshot</p>
            </div>
          </div>

          {/* Secondary Screenshots Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-border bg-card/50 aspect-video flex items-center justify-center hover-elevate">
              <div className="text-center">
                <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">KYC Workflow</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card/50 aspect-video flex items-center justify-center hover-elevate">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Client Management</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card/50 aspect-video flex items-center justify-center hover-elevate">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Section - Custodians & Trading Partners */}
      <div className="border-y border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Battle-Tested Infrastructure</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our team has deep operational experience with the world's leading custodians and trading partners. 
              We built Orca to solve the real problems we encountered managing institutional capital.
            </p>
          </div>

          <div className="space-y-16">
            <LogoCarousel 
              items={custodians} 
              title="Custodians & Prime Brokers We've Worked With"
            />
            
            <LogoCarousel 
              items={tradingPartners} 
              title="Trading Partners & Executing Brokers"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Complete Operations Platform</h2>
          <p className="text-xl text-muted-foreground">
            Everything an emerging hedge fund needs to operate like an established player
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Automated KYC/AML</h3>
              </div>
              <p className="text-muted-foreground">
                AI-powered document verification, automated risk scoring, and instant compliance checks. 
                Onboard accredited investors in hours, not weeks.
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
                Continuous compliance monitoring across all client accounts. Instant alerts for 
                regulatory changes, unusual activity, or documentation expiration.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Complete Audit Trail</h3>
              </div>
              <p className="text-muted-foreground">
                Immutable audit logs with granular tracking of every action, approval, and change. 
                Pass regulatory audits with confidence.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Role-Based Access</h3>
              </div>
              <p className="text-muted-foreground">
                Granular permissions and multi-tenant architecture. Perfect for firms managing 
                multiple funds or working with external compliance teams.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Analytics & Insights</h3>
              </div>
              <p className="text-muted-foreground">
                Track onboarding velocity, approval rates, processing times, and bottlenecks. 
                Data-driven insights to optimize your operations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Multi-Custodian Ready</h3>
              </div>
              <p className="text-muted-foreground">
                Seamlessly manage clients across multiple custodians and prime brokers. 
                Built by operators who understand complex fund structures.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Ready to Build Tomorrow's Citadel?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the emerging managers who refuse to be held back by outdated infrastructure. 
              Start with institutional-grade tools from day one.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => setLocation("/login")} data-testid="button-cta-start">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" data-testid="button-cta-demo">
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Full access for 14 days
            </p>
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
              © 2025 Orca. Built for boutique hedge funds.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
