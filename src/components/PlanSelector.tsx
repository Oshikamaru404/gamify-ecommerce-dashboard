
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, Star, Crown } from 'lucide-react';
import { useSubscriptionCreditOptions } from '@/hooks/useSubscriptionCreditOptions';

type PlanSelectorProps = {
  packageId: string;
  packageName: string;
  packageData: any; // The full package data from IPTV packages
  onPlanSelect: (plan: any) => void;
};

const PlanSelector: React.FC<PlanSelectorProps> = ({
  packageId,
  packageName,
  packageData,
  onPlanSelect
}) => {
  const { data: creditOptions, isLoading } = useSubscriptionCreditOptions(packageId);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  // For activation packages, use the direct pricing from packageData
  const isActivationPackage = packageData?.category === 'activation-player';
  
  // Create plans from the packageData pricing fields
  const createPlansFromPackageData = () => {
    const plans = [];
    
    if (packageData.price_1_month) {
      plans.push({
        id: 'plan-1-month',
        credits: 1,
        months: 1,
        price: packageData.price_1_month,
        sort_order: 1
      });
    }
    
    if (packageData.price_3_months) {
      plans.push({
        id: 'plan-3-months',
        credits: 3,
        months: 3,
        price: packageData.price_3_months,
        sort_order: 2
      });
    }
    
    if (packageData.price_6_months) {
      plans.push({
        id: 'plan-6-months',
        credits: 6,
        months: 6,
        price: packageData.price_6_months,
        sort_order: 3
      });
    }
    
    if (packageData.price_12_months) {
      plans.push({
        id: 'plan-12-months',
        credits: 12,
        months: 12,
        price: packageData.price_12_months,
        sort_order: 4
      });
    }
    
    return plans;
  };

  const createPlanData = (selectedOption: any) => {
    return {
      id: selectedOption.id,
      name: packageName,
      category: packageData.category, // Include category from packageData
      price: selectedOption.price,
      duration: selectedOption.months,
      months: selectedOption.months,
      credits: selectedOption.credits,
      packageId: packageId
    };
  };

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value);
    let selectedOption;
    
    if (creditOptions && creditOptions.length > 0) {
      selectedOption = creditOptions.find(option => option.id === value);
    } else {
      // Use direct package pricing
      const directPlans = createPlansFromPackageData();
      selectedOption = directPlans.find(option => option.id === value);
    }
    
    if (selectedOption) {
      onPlanSelect(createPlanData(selectedOption));
    }
  };

  const handleOrderNow = () => {
    let selectedOption;
    
    if (creditOptions && creditOptions.length > 0) {
      selectedOption = creditOptions.find(option => option.id === selectedPlan);
    } else {
      const directPlans = createPlansFromPackageData();
      selectedOption = directPlans.find(option => option.id === selectedPlan);
    }
    
    if (selectedOption) {
      onPlanSelect(createPlanData(selectedOption));
    }
  };

  // For activation packages, create a single plan option
  const handleActivationPurchase = () => {
    const directPlans = createPlansFromPackageData();
    const selectedOption = directPlans[0]; // Use the first available plan
    
    if (selectedOption) {
      onPlanSelect(createPlanData(selectedOption));
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

  // Use credit options if available, otherwise use direct package pricing
  const availableOptions = creditOptions && creditOptions.length > 0 
    ? creditOptions 
    : createPlansFromPackageData();

  if (!availableOptions || availableOptions.length === 0) {
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
  const sortedOptions = [...availableOptions].sort((a, b) => a.months - b.months);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          {isActivationPackage ? 'Activation Package' : 'Choose Your Plan'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isActivationPackage ? (
          // For activation packages, show single option
          <div className="space-y-4">
            <Card className="p-4 border-2 border-red-100 hover:border-red-600/30 transition-all duration-300">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Crown className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${sortedOptions[0]?.price || 199.99}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {sortedOptions[0]?.months || 12} Month{(sortedOptions[0]?.months || 12) > 1 ? 's' : ''} Activation
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  onClick={handleActivationPurchase}
                >
                  Purchase Activation Package
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          // For regular packages, show radio group
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
                        ${option.price}
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {selectedPlan && !isActivationPackage && (
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
