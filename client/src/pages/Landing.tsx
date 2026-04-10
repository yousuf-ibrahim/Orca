import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/stores/authStore";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Authenticated users go straight to dashboard
  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">Orca</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/login")}>
              Log in
            </Button>
            <Button size="sm" onClick={() => setLocation("/audit")} data-testid="button-nav-audit">
              Run Free Audit
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-36">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary mb-6 tracking-wide uppercase">
              Infrastructure consulting for hedge funds
            </p>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Infrastructure clarity for funds that can't afford ambiguity.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              Most funds between $50M and $500M are running on institutional risk with retail-grade infrastructure. Orca maps your operational stack, identifies what's broken, and fixes it — before it becomes a NAV error or a missed redemption.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="h-12 px-8"
                onClick={() => setLocation("/audit")}
                data-testid="button-hero-audit"
              >
                Run Your Infrastructure Audit — Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8"
                onClick={() => setLocation("/audit/demo")}
                data-testid="button-hero-demo"
              >
                See a Sample Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            You already know something is wrong.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most funds in this range are managing the same three problems. They just haven't quantified them yet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-border/50">
            <CardContent className="p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10 mb-5">
                <Clock className="h-5 w-5 text-error" />
              </div>
              <h3 className="text-lg font-semibold mb-3">The recon break at 11pm</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Geneva and IB use different identifiers. Every corporate action — spin-off, rights issue, ticker change — is a potential silent position mismatch. You find out when your fund admin calls.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 mb-5">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <h3 className="text-lg font-semibold mb-3">The manual month-end</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Two ops associates, 1.5 days, a shared spreadsheet. Shadow NAV and fund admin NAV diverge for 36 hours every month-end. Any redemption in that window is a liability.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-5">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">The key person risk</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                One person knows how the reconciliation actually works. When they leave, that knowledge leaves with them. No runbook. No audit trail. No continuity.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card/20">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              From intake to action plan in under an hour.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "10-minute intake",
                description:
                  "Answer questions about your systems, pain points, and operational workflows. No preparation needed.",
              },
              {
                step: "02",
                title: "AI-powered analysis",
                description:
                  "Orca maps your stack, identifies integration gaps, and quantifies the cost of each problem — in ops hours and tail risk.",
              },
              {
                step: "03",
                title: "Actionable report",
                description:
                  "Specific, prioritized actions: what to do this week, this month, this quarter. Named systems. Named failure modes. No generic recommendations.",
              },
            ].map((item) => (
              <div key={item.step} className="space-y-4">
                <div className="text-4xl font-bold text-primary/30">{item.step}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg leading-relaxed text-muted-foreground">
            "Built by operators who have run fund technology at multi-billion dollar platforms. We know what a Geneva–IB recon break looks like at 11pm because we've fixed it."
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-card/20">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Find out what's actually broken.
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            The audit is free. It takes 10 minutes. You'll have a specific, prioritized report by the time your coffee is done.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="h-12 px-10"
              onClick={() => setLocation("/audit")}
              data-testid="button-cta-audit"
            >
              Run Your Infrastructure Audit — Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-10"
              onClick={() => setLocation("/audit/demo")}
              data-testid="button-cta-demo"
            >
              See a Sample Report
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-semibold">Orca</span>
          <p className="text-sm text-muted-foreground">Infrastructure consulting for funds between $50M and $500M AUM.</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => setLocation("/login")} className="hover:text-foreground transition-colors">Log in</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
