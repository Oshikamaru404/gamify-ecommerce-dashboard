
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, Star } from 'lucide-react';
import { useSubscriptionCreditOptions } from '@/hooks/useSubscriptionCreditOptions';

type PlanSelectorProps = {
  packageId: string;
  packageName: string;
  onPlanSelect: (plan: any) => void;
};

const PlanSelector: React.FC<PlanSelectorProps> = ({
  packageId,
  packageName,
  onPlanSelect
}) => {
  const { data: creditOptions, isLoading } = useSubscriptionCreditOptions(packageId);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value);
    const selectedOption = creditOptions?.find(option => option.id === value);
    if (selectedOption) {
      onPlanSelect({
        id: selectedOption.id,
        name: packageName,
        price: selectedOption.price,
        months: selectedOption.months,
        credits: selectedOption.credits,
        packageId: packageId
      });
    }
  };

  const handleOrderNow = () => {
    const selectedOption = creditOptions?.find(option => option.id === selectedPlan);
    if (selectedOption) {
      onPlanSelect({
        id: selectedOption.id,
        name: packageName,
        price: selectedOption.price,
        months: selectedOption.months,
        credits: selectedOption.credits,
        packageId: packageId
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creditOptions || creditOptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No plans available for this package.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort options by months (ascending)
  const sortedOptions = [...creditOptions].sort((a, b) => a.months - b.months);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Choose Your Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedPlan} onValueChange={handlePlanChange}>
          {sortedOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label
                htmlFor={option.id}
                className="flex-1 cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">
                      {option.months} Month{option.months > 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.credits} Credits
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      €{option.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      €{(option.price / option.months).toFixed(2)}/month
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {selectedPlan && (
          <div className="pt-4">
            <Button 
              onClick={handleOrderNow}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6"
            >
              <Check className="mr-2 h-5 w-5" />
              Order Now
            </Button>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">30-Day Money Back Guarantee</span>
          </div>
          <p className="text-sm text-gray-600">
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanSelector;
