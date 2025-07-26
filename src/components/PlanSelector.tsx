import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown } from 'lucide-react';
import { useSubscriptionCreditOptions } from '@/hooks/useSubscriptionCreditOptions';

type PlanSelectorProps = {
  packageId: string;
  packageName: string;
  packageData: any;
  onPlanSelect: (plan: any) => void;
};

const PlanSelector: React.FC<PlanSelectorProps> = ({
  packageId,
  packageName,
  packageData,
  onPlanSelect
}) => {
  const {
    data: creditOptions,
    isLoading
  } = useSubscriptionCreditOptions(packageId);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  // Enhanced debugging
  console.log('🔍 PlanSelector Debug Info:');
  console.log('📦 Package ID:', packageId);
  console.log('📦 Package Name:', packageName);
  console.log('📦 Package Data:', packageData);
  console.log('💳 Credit Options from DB:', creditOptions);
  console.log('⏳ Is Loading:', isLoading);

  const isActivationPackage = packageData?.category === 'activation-player';

  const createPlansFromPackageData = () => {
    const plans = [];
    
    console.log('🛠️ Creating plans from package data...');
    console.log('📊 Available price fields:', {
      price_3_credits: packageData.price_3_credits,
      price_6_credits: packageData.price_6_credits,
      price_12_credits: packageData.price_12_credits,
      price_1_month: packageData.price_1_month,
      price_3_months: packageData.price_3_months,
      price_6_months: packageData.price_6_months,
      price_12_months: packageData.price_12_months
    });
    
    // For subscription packages, prioritize credit-based pricing
    if (packageData.price_3_credits && packageData.price_3_credits > 0) {
      plans.push({
        id: 'plan-3-credits',
        credits: 3,
        months: 3,
        price: Number(packageData.price_3_credits),
        sort_order: 1
      });
      console.log('✅ Added 3-credit plan:', packageData.price_3_credits);
    }
    if (packageData.price_6_credits && packageData.price_6_credits > 0) {
      plans.push({
        id: 'plan-6-credits',
        credits: 6,
        months: 6,
        price: Number(packageData.price_6_credits),
        sort_order: 2
      });
      console.log('✅ Added 6-credit plan:', packageData.price_6_credits);
    }
    if (packageData.price_12_credits && packageData.price_12_credits > 0) {
      plans.push({
        id: 'plan-12-credits',
        credits: 12,
        months: 12,
        price: Number(packageData.price_12_credits),
        sort_order: 3
      });
      console.log('✅ Added 12-credit plan:', packageData.price_12_credits);
    }
    
    // Fallback to traditional month-based pricing for activation packages or if no credit plans exist
    if (plans.length === 0) {
      console.log('🔄 No credit plans found, trying month-based pricing...');
      
      if (packageData.price_1_month && packageData.price_1_month > 0) {
        plans.push({
          id: 'plan-1-month',
          credits: 1,
          months: 1,
          price: Number(packageData.price_1_month),
          sort_order: 1
        });
        console.log('✅ Added 1-month plan:', packageData.price_1_month);
      }
      if (packageData.price_3_months && packageData.price_3_months > 0) {
        plans.push({
          id: 'plan-3-months',
          credits: 3,
          months: 3,
          price: Number(packageData.price_3_months),
          sort_order: 2
        });
        console.log('✅ Added 3-months plan:', packageData.price_3_months);
      }
      if (packageData.price_6_months && packageData.price_6_months > 0) {
        plans.push({
          id: 'plan-6-months',
          credits: 6,
          months: 6,
          price: Number(packageData.price_6_months),
          sort_order: 3
        });
        console.log('✅ Added 6-months plan:', packageData.price_6_months);
      }
      if (packageData.price_12_months && packageData.price_12_months > 0) {
        plans.push({
          id: 'plan-12-months',
          credits: 12,
          months: 12,
          price: Number(packageData.price_12_months),
          sort_order: 4
        });
        console.log('✅ Added 12-months plan:', packageData.price_12_months);
      }
    }
    
    console.log('🎯 Final plans created:', plans);
    return plans;
  };

  const createPlanData = (selectedOption: any) => {
    const planData = {
      id: selectedOption.id,
      name: packageName,
      category: packageData.category,
      price: selectedOption.price,
      duration: selectedOption.months,
      months: selectedOption.months,
      credits: selectedOption.credits,
      packageId: packageId
    };
    console.log('📋 Created plan data:', planData);
    return planData;
  };

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value);
    let selectedOption;
    if (creditOptions && creditOptions.length > 0) {
      selectedOption = creditOptions.find(option => option.id === value);
    } else {
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

  const handleActivationPurchase = () => {
    const directPlans = createPlansFromPackageData();
    const selectedOption = directPlans[0];

    if (selectedOption) {
      onPlanSelect(createPlanData(selectedOption));
    }
  };

  const formatMonthlyAverage = (price: number, months: number) => {
    const monthlyAverage = (price / months).toFixed(2);
    return `USD ${monthlyAverage}/month`;
  };

  // Calculate savings percentage for plans vs monthly price
  const calculateSavings = (currentPrice: number, currentMonths: number, monthlyPrice: number) => {
    const currentTotal = currentPrice;
    const monthlyTotal = monthlyPrice * currentMonths;
    const savings = ((monthlyTotal - currentTotal) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  if (isLoading) {
    console.log('⏳ Still loading credit options...');
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

  // Determine which options to use - database credit options or fallback package data
  let availableOptions = [];
  
  if (creditOptions && creditOptions.length > 0) {
    console.log('🎯 Using credit options from database:', creditOptions);
    availableOptions = creditOptions;
  } else {
    console.log('🔄 No database credit options, creating from package data...');
    availableOptions = createPlansFromPackageData();
  }
  
  console.log('📊 Final available options:', availableOptions);
  
  if (!availableOptions || availableOptions.length === 0) {
    console.log('❌ No plans available - showing debug info');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No plans available for this package.</p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold">Debug Info:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p><strong>Package ID:</strong> {packageId}</p>
              <p><strong>Package Name:</strong> {packageName}</p>
              <p><strong>Credit options from DB:</strong> {creditOptions?.length || 0}</p>
              <p><strong>Package category:</strong> {packageData?.category}</p>
              <p><strong>Has price_3_credits:</strong> {packageData.price_3_credits ? `Yes (${packageData.price_3_credits})` : 'No'}</p>
              <p><strong>Has price_6_credits:</strong> {packageData.price_6_credits ? `Yes (${packageData.price_6_credits})` : 'No'}</p>
              <p><strong>Has price_12_credits:</strong> {packageData.price_12_credits ? `Yes (${packageData.price_12_credits})` : 'No'}</p>
              <p><strong>Has price_1_month:</strong> {packageData.price_1_month ? `Yes (${packageData.price_1_month})` : 'No'}</p>
              <p><strong>Package Data Keys:</strong> {Object.keys(packageData || {}).join(', ')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedOptions = [...availableOptions].sort((a, b) => a.months - b.months);
  const monthlyOption = sortedOptions.find(option => option.months === 1);

  console.log('✅ Rendering plan selector with options:', sortedOptions);

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
          <div className="space-y-4">
            <Card className="p-4 border-2 border-red-100 hover:border-red-600/30 transition-all duration-300">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Crown className="h-6 w-6 text-red-600" />
                </div>
                <div className="mb-2">
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-2xl px-6 py-3 rounded-full shadow-lg">
                    ${sortedOptions[0]?.price || 199.99}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {sortedOptions[0]?.months || 12} Month{(sortedOptions[0]?.months || 12) > 1 ? 's' : ''} Activation
                </div>
                
                {/* 30-Day Money Back Guarantee - Moved above button */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white border-2 border-red-500 text-red-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center transform hover:scale-105 transition-all duration-300">
                    <Check className="w-4 h-4 mr-2" />
                    30-Day Money Back Guarantee
                  </div>
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
          <RadioGroup value={selectedPlan} onValueChange={handlePlanChange}>
            {sortedOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">
                        {option.credits} Credit{option.credits > 1 ? 's' : ''} ({option.months} Month{option.months > 1 ? 's' : ''})
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatMonthlyAverage(option.price, option.months)}
                      </div>
                      {/* Add savings badges for 6 and 12 credit plans */}
                      {sortedOptions[0] && option.credits > sortedOptions[0].credits && (
                        <div className="mt-1">
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-3 py-1 rounded-full">
                            Save up to {calculateSavings(option.price, option.months, sortedOptions[0].price)}%
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xl px-4 py-2 rounded-full shadow-lg">
                        ${option.price}
                      </Badge>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {selectedPlan && !isActivationPackage && (
          <div className="pt-4">
            <Button onClick={handleOrderNow} className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6">
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
