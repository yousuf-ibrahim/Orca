import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Shield, 
  FileCheck, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Zap, 
  Target, 
  Sparkles, 
  Brain, 
  BarChart3, 
  Search,
  Database,
  Lock,
  Layers,
  CheckCircle2
} from "lucide-react";
import { useLocation } from "wouter";
import { LogoCarousel } from "@/components/LogoCarousel";

const custodians = [
  "Bank of Singapore",
  "Banque Pictet & Cie SA",
  "BNY Mellon",
  "Credit Suisse",
  "Deutsche Bank",
  "EFG",
  "Emirates NBD",
  "J. Safra Sarasin",
  "LGT",
  "Mashreq Bank",
  "Mirabaud",
  "Nomura",
  "Standard Chartered",
  "UBS",
];

const tradingPartners = [
  "BOFA Securities",
  "Citi",
  "Goldman Sachs",
  "JP Morgan",
  "Morgan Stanley",
  "Nomura",
  "UBS",
  "Leonteq",
];

const modules = [
  {
    icon: Database,
    name: "Securities Master",
    description: "Multi-identifier repository with custom tagging",
    phase: "Core"
  },
  {
    icon: BarChart3,
    name: "Portfolio Hub",
    description: "Position tracking, P&L, and allocations",
    phase: "Core"
  },
  {
    icon: Search,
    name: "Research Workspace",
    description: "Coverage tracker, notes, and company pages",
    phase: "Intelligence"
  },
  {
    icon: FileCheck,
    name: "Compliance Center",
    description: "KYC workflows and regulatory reports",
    phase: "Core"
  },
  {
    icon: Users,
    name: "Investor Reporting",
    description: "LP letters and performance reports",
    phase: "Intelligence"
  },
  {
    icon: Sparkles,
    name: "AI Intelligence",
    description: "Health scores, alerts, and insights",
    phase: "Intelligence"
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">Orca</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                Product
              </Button>
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                Pricing
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setLocation("/login")}>
                Log in
              </Button>
              <Button size="sm" onClick={() => setLocation("/login")} data-testid="button-get-started">
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 px-3 py-1.5 text-xs font-medium border-primary/30 text-primary">
              The operating system for boutique hedge funds
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Enterprise infrastructure,
              <span className="block text-gradient mt-1">built for emerging managers</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Orca unifies your research, portfolio operations, compliance, and investor reporting 
              in one modern platform. No enterprise bloat. No implementation headaches. 
              Just the tools you need to compete.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" onClick={() => setLocation("/login")} className="h-12 px-6 glow-primary" data-testid="button-hero-start">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6" data-testid="button-learn-more">
                Schedule demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>DFSA Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Multi-tenant Isolation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "25+", label: "Custodian Integrations" },
              { value: "8+", label: "Trading Partners" },
              { value: "90%", label: "Faster Onboarding" },
              { value: "24/7", label: "Compliance Monitoring" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modular Platform Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-xs">Modular by Design</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with what you need today. Add modules as you grow. 
            Each component works standalone or as part of your unified operating layer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, i) => (
            <Card 
              key={i} 
              className="group relative overflow-hidden border-border/50 transition-smooth hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                    <module.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {module.phase}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {module.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Intelligence Section */}
      <section className="border-y border-border bg-card/20">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-xs border-primary/30 text-primary">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Intelligence
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Your team, amplified
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                AI that augments your analysts and ops team—not replaces them. 
                Reduce cognitive load, automate prep work, and surface insights from fragmented data.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Search, title: "Research Copilot", desc: "Natural language search across your IC notes and memos" },
                  { icon: BarChart3, title: "Portfolio Intelligence", desc: "Automated health scores and concentration alerts" },
                  { icon: FileCheck, title: "Compliance Automation", desc: "One-click regulatory reports and LP letters" },
                  { icon: Brain, title: "Risk Insights", desc: "Scenario analysis and correlation warnings" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-0.5">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-border/50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-lg font-medium mb-2">Intelligent by default</p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Every AI insight links back to source documents. No black boxes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Built for boutique excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Large fund administrators are slow, expensive, and inflexible. 
            Your infrastructure should match your ambition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Speed & Efficiency",
              description: "What takes weeks with traditional administrators takes hours with Orca. Automated workflows and instant compliance checks."
            },
            {
              icon: Target,
              title: "Precision Tools",
              description: "Every feature designed for emerging managers. No enterprise bloat—just the exact toolkit you need to compete."
            },
            {
              icon: Shield,
              title: "Institutional Grade",
              description: "Same security and compliance capabilities as billion-dollar funds. SOC 2 compliant with complete audit trails."
            },
          ].map((prop, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-5">
                  <prop.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{prop.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {prop.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="border-y border-border bg-card/20">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Battle-tested infrastructure
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by a team with deep operational experience across the world's leading 
              custodians and trading partners.
            </p>
          </div>

          <div className="space-y-12">
            <LogoCarousel 
              items={custodians} 
              title="Custodians & Prime Brokers"
            />
            <LogoCarousel 
              items={tradingPartners} 
              title="Trading Partners"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-border/50 p-12 lg:p-16 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to streamline your operations?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Join the next generation of hedge funds building on modern infrastructure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => setLocation("/login")} className="h-12 px-8 glow-primary">
                Get started for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Orca</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The operating system for boutique hedge funds
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-smooth">Privacy</a>
              <a href="#" className="hover:text-foreground transition-smooth">Terms</a>
              <a href="#" className="hover:text-foreground transition-smooth">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
