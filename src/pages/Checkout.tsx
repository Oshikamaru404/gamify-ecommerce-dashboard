
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Package, Truck, CreditCard, Bitcoin } from 'lucide-react';
import { toast } from 'sonner';
import CryptomusCheckout from '@/components/CryptomusCheckout';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, clearCart } = useStore();
  const { cart, subtotal, tax, shipping, total } = state;
  
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    paymentMethod: 'cod',
    notes: '',
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCryptoCheckout, setShowCryptoCheckout] = useState(false);
  
  // Determine theme based on current route or referrer
  const [theme, setTheme] = useState<'purple' | 'red'>('red');
  
  useEffect(() => {
    // Check the current path or referrer to determine theme
    const currentPath = location.pathname;
    const referrer = location.state?.from || document.referrer;
    
    // Panel sections use purple theme
    if (currentPath.includes('panel') || 
        referrer.includes('panel') || 
        referrer.includes('reseller') ||
        location.state?.section === 'panel') {
      setTheme('purple');
    } else {
      // Default to red for subscription, activation, home
      setTheme('red');
    }
  }, [location]);
  
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  
  const validateStep1 = () => {
    const { firstName, lastName, email, phone } = formState;
    if (!firstName || !lastName || !email || !phone) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };
  
  const validateStep2 = () => {
    const { address, city, state, postalCode, country } = formState;
    if (!address || !city || !state || !postalCode || !country) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };
  
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const prevStep = () => {
    setStep(Math.max(1, step - 1));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep1() || !validateStep2()) {
      return;
    }
    
    if (formState.paymentMethod === 'crypto') {
      // Show crypto checkout
      setShowCryptoCheckout(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
      setIsSubmitting(false);
    }, 1500);
  };

  const handleCryptoSuccess = () => {
    setShowCryptoCheckout(false);
    clearCart();
    navigate('/');
  };
  
  // Theme-based styling
  const themeColors = {
    purple: {
      primary: 'bg-purple-600 hover:bg-purple-700',
      primaryText: 'text-purple-600',
      primaryBg: 'bg-purple-50',
      gradient: 'from-purple-600 to-purple-700',
      border: 'border-purple-200',
      focus: 'focus:border-purple-500 focus:ring-purple-500'
    },
    red: {
      primary: 'bg-red-600 hover:bg-red-700',
      primaryText: 'text-red-600',
      primaryBg: 'bg-red-50',
      gradient: 'from-red-600 to-red-700',
      border: 'border-red-200',
      focus: 'focus:border-red-500 focus:ring-red-500'
    }
  };

  const currentTheme = themeColors[theme];
  
  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contact Information</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
            required
            className={currentTheme.focus}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
            required
            className={currentTheme.focus}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          required
          className={currentTheme.focus}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formState.phone}
          onChange={handleChange}
          required
          className={currentTheme.focus}
        />
      </div>
    </div>
  );
  
  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Address</h2>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formState.address}
          onChange={handleChange}
          required
          className={currentTheme.focus}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formState.city}
            onChange={handleChange}
            required
            className={currentTheme.focus}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            name="state"
            value={formState.state}
            onChange={handleChange}
            required
            className={currentTheme.focus}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formState.postalCode}
            onChange={handleChange}
            required
            className={currentTheme.focus}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select 
            value={formState.country}
            onValueChange={(value) => handleSelectChange('country', value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
  
  const renderStep3 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      <RadioGroup
        value={formState.paymentMethod}
        onValueChange={(value) => handleSelectChange('paymentMethod', value)}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 rounded-lg border p-4">
          <RadioGroupItem value="cod" id="cod" />
          <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery</Label>
          <CreditCard size={20} className="text-muted-foreground" />
        </div>
        <div className="flex items-center space-x-2 rounded-lg border p-4">
          <RadioGroupItem value="crypto" id="crypto" />
          <Label htmlFor="crypto" className="flex-1 cursor-pointer">Cryptocurrency Payment</Label>
          <Bitcoin size={20} className={currentTheme.primaryText} />
        </div>
      </RadioGroup>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Order Notes (Optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formState.notes}
          onChange={handleChange}
          placeholder="Special instructions for your order"
          className="h-32"
        />
      </div>
    </div>
  );
  
  const renderStepIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? `bg-gradient-to-r ${currentTheme.gradient} text-white` : 'bg-muted text-muted-foreground'}`}>
            1
          </div>
          <div className={`mx-2 h-1 w-10 ${step >= 2 ? `bg-gradient-to-r ${currentTheme.gradient}` : 'bg-muted'}`}></div>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? `bg-gradient-to-r ${currentTheme.gradient} text-white` : 'bg-muted text-muted-foreground'}`}>
            2
          </div>
          <div className={`mx-2 h-1 w-10 ${step >= 3 ? `bg-gradient-to-r ${currentTheme.gradient}` : 'bg-muted'}`}></div>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? `bg-gradient-to-r ${currentTheme.gradient} text-white` : 'bg-muted text-muted-foreground'}`}>
            3
          </div>
        </div>
        <div className="text-xs font-medium">
          {step === 1 && 'Contact Information'}
          {step === 2 && 'Shipping Address'}
          {step === 3 && 'Payment Method'}
        </div>
      </div>
    </div>
  );

  // Create package data for crypto checkout
  const packageData = cart.length > 0 ? {
    id: 'checkout_order',
    name: `Order of ${cart.length} item(s)`,
    category: 'mixed',
    price: total,
    duration: 1
  } : null;

  return (
    <StoreLayout>
      <div className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {renderStepIndicator()}
                  
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  
                  <div className="mt-6 flex justify-between">
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    
                    {step < 3 ? (
                      <Button type="button" onClick={nextStep} className={currentTheme.primary}>
                        Continue
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting} className={currentTheme.primary}>
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <div className="flex items-start gap-2">
                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-soft-blue p-4">
                    <div className="flex gap-2 text-sm">
                      <div className="flex-shrink-0 text-primary">
                        <Package size={20} />
                      </div>
                      <p>
                        <span className="font-medium">Free shipping</span> on orders over $100
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-soft-green p-4">
                    <div className="flex gap-2 text-sm">
                      <div className="flex-shrink-0 text-green-600">
                        <CheckCircle2 size={20} />
                      </div>
                      <p>
                        <span className="font-medium">Secure checkout</span> with instant delivery
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Crypto Checkout Modal */}
        {showCryptoCheckout && packageData && (
          <CryptomusCheckout
            packageData={packageData}
            onClose={() => setShowCryptoCheckout(false)}
            onSuccess={handleCryptoSuccess}
          />
        )}
      </div>
    </StoreLayout>
  );
};

export default Checkout;
