import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Footer } from '@/components/Footer';

type InvestorType = 'professional' | 'accredited' | 'retail';

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [investorType, setInvestorTypeLocal] = useState<InvestorType>('professional');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setInvestorType = useAuthStore((state) => state.setInvestorType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await setInvestorType(investorType);
      setLocation('/portfolios');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save investor type. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl" data-testid="card-onboarding">
          <CardHeader>
            <CardTitle className="text-2xl" data-testid="text-onboarding-title">
              Select your investor type
            </CardTitle>
            <CardDescription>
              This helps us customize your experience and ensure compliance with regulatory requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" data-testid="alert-onboarding-error">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <RadioGroup
                value={investorType}
                onValueChange={(value) => setInvestorTypeLocal(value as InvestorType)}
                className="space-y-4"
                data-testid="radio-group-investor-type"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-md hover-elevate">
                  <RadioGroupItem
                    value="professional"
                    id="professional"
                    data-testid="radio-professional"
                  />
                  <div className="flex-1">
                    <Label htmlFor="professional" className="font-medium cursor-pointer">
                      Professional / Institutional Investor
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Asset managers, hedge funds, family offices, pension funds, and other institutional entities.
                      Full access to all platform features.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-md hover-elevate">
                  <RadioGroupItem
                    value="accredited"
                    id="accredited"
                    data-testid="radio-accredited"
                  />
                  <div className="flex-1">
                    <Label htmlFor="accredited" className="font-medium cursor-pointer">
                      Accredited Individual Investor
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      High net-worth individuals meeting accredited investor criteria. 
                      Access to most platform features with some regulatory restrictions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-md hover-elevate">
                  <RadioGroupItem
                    value="retail"
                    id="retail"
                    data-testid="radio-retail"
                  />
                  <div className="flex-1">
                    <Label htmlFor="retail" className="font-medium cursor-pointer">
                      Retail / Demo User
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Individual investors and demo users. Some advanced features may be limited 
                      for regulatory reasons.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {investorType === 'retail' && (
                <Alert data-testid="alert-retail-notice">
                  <AlertDescription>
                    <strong>Note:</strong> Some features may be limited for regulatory reasons. 
                    You'll have access to portfolio monitoring, market data, and basic analytics.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                  data-testid="button-continue"
                >
                  {isLoading ? 'Saving...' : 'Continue to Platform'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
