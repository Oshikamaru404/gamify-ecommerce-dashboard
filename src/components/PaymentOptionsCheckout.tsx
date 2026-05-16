import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShoppingCart, MessageCircle, CreditCard, X, Loader2, Package, CheckCircle, Home, Bitcoin,
  ArrowRight, ArrowLeft, RefreshCw, Sparkles, ShieldCheck, Zap, Smartphone, Tv, Lock, User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useLocalizedText } from '@/lib/multilingualUtils';
import DirectCryptoPayment, { CryptoWallet } from '@/components/DirectCryptoPayment';
import { triggerOrderEmails } from '@/lib/orderEmails';
import { cn } from '@/lib/utils';

interface PaymentOptionsCheckoutProps {
  packageData: {
    id: string;
    name: string;
    category: string;
    description?: string;
    icon_url?: string;
    price: number;
    duration: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

type AccountType = 'renewal' | 'new' | null;
type ConnectionType = 'm3u_xtream' | 'mag_stb' | null;
type OfferKind = 'iptv_subscription' | 'iptv_panel' | 'player_activation' | 'player_panel';

const PaymentOptionsCheckout: React.FC<PaymentOptionsCheckoutProps> = ({
  packageData,
  onClose,
  onSuccess,
}) => {
  // ---- Step state ----
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [accountType, setAccountType] = useState<AccountType>(null);

  // ---- Form state ----
  const [renewal, setRenewal] = useState({
    accountUsername: '',
    accountEmail: '',
    accountId: '',
  });
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerWhatsapp: '',
    macAddress: '',
    iptvUsername: '',
    iptvPassword: '',
  });
  const [connectionType, setConnectionType] = useState<ConnectionType>(null);

  // ---- Process state ----
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const { data: siteSettings } = useSiteSettings();
  const [imageError, setImageError] = useState(false);

  const displayName = useLocalizedText(packageData.name);
  const displayDescription = useLocalizedText(packageData.description);

  const whatsappNumber = siteSettings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value || '1234567890';

  const isCreditsPackage = () =>
    packageData.category?.includes('panel') || packageData.category === 'player';

  const getDisplayDuration = () =>
    isCreditsPackage()
      ? `${packageData.duration} Credits`
      : `${packageData.duration} ${packageData.duration === 1 ? 'Month' : 'Months'}`;

  const getDurationLabel = () => (isCreditsPackage() ? 'Credits:' : 'Duration:');

  const getCategoryBorderStyle = () => {
    const category = packageData.category?.toLowerCase() || '';
    if (category.includes('panel') || category.includes('reseller') || category === 'player') {
      return { borderColor: '#8f35e5', boxShadow: '0 0 0 3px rgba(143, 53, 229, 0.2)' };
    }
    return { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)' };
  };

  const getFallbackIconClass = () => {
    const category = packageData.category?.toLowerCase() || '';
    if (category.includes('panel') || category.includes('reseller') || category === 'player') {
      return 'text-[#8f35e5]';
    }
    return 'text-red-500';
  };

  const requiresMac = useMemo(
    () => MAC_REQUIRED_APPS.has(formData.appUsed) || MAC_REQUIRED_DEVICES.has(formData.deviceType),
    [formData.appUsed, formData.deviceType]
  );

  // ---- Step navigation ----
  const validateStep1 = () => {
    if (!accountType) {
      toast.error('Please select an option to continue');
      return false;
    }
    if (accountType === 'renewal') {
      if (!renewal.accountUsername && !renewal.accountEmail && !renewal.accountId) {
        toast.error('Please provide at least one identifier (username, email or account ID)');
        return false;
      }
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerWhatsapp) {
      toast.error('Please fill in your name, email and WhatsApp number');
      return false;
    }
    if (!formData.deviceType || !formData.appUsed) {
      toast.error('Please select your device and app');
      return false;
    }
    if (requiresMac && !formData.macAddress && !formData.deviceId) {
      toast.error('MAC address or Device ID required for this device');
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2) : s));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleRenewalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRenewal((p) => ({ ...p, [name]: value }));
  };

  // ---- Build credentials_notes payload (extra info for admin / activation) ----
  const buildNotesPayload = () => {
    const payload: Record<string, any> = {
      account_type: accountType,
      device_type: formData.deviceType || null,
      app_used: formData.appUsed || null,
    };
    if (accountType === 'renewal') {
      payload.renewal = {
        username: renewal.accountUsername || null,
        email: renewal.accountEmail || null,
        account_id: renewal.accountId || null,
      };
    }
    if (requiresMac) {
      payload.mac_address = formData.macAddress || null;
      payload.device_id = formData.deviceId || null;
    }
    return JSON.stringify(payload);
  };

  // ---- Order creation ----
  const createOrder = async (extra?: Partial<Record<string, string>>) => {
    const { data: orderData, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_whatsapp: formData.customerWhatsapp || null,
        package_id: packageData.id,
        package_name: displayName,
        package_category: packageData.category,
        duration_months: packageData.duration,
        amount: packageData.price,
        order_type: accountType === 'renewal' ? 'renewal' : 'activation',
        status: 'pending',
        payment_status: 'pending',
        credentials_notes: buildNotesPayload(),
        ...extra,
      }])
      .select()
      .single();
    if (error) throw error;
    return orderData;
  };

  const handleWhatsAppOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsProcessing(true);
    try {
      const orderData = await createOrder();
      setPlacedOrderId(orderData.id);
      triggerOrderEmails({ ...orderData, package_image_url: packageData.icon_url, paymentMethodLabel: 'WhatsApp' });

      const renewalLine = accountType === 'renewal'
        ? `\n🔁 Renewal — ${renewal.accountUsername || renewal.accountEmail || renewal.accountId}`
        : '\n🆕 New customer';
      const macLine = requiresMac
        ? `\n🔧 MAC/Device: ${formData.macAddress || formData.deviceId}`
        : '';

      const message = `🛒 New Order Request${renewalLine}

📦 Package: ${displayName}
💰 Price: $${packageData.price}
⏱️ Duration: ${getDisplayDuration()}

👤 ${formData.customerName}
✉️ ${formData.customerEmail}
📱 ${formData.customerWhatsapp}
📺 ${formData.deviceType} — ${formData.appUsed}${macLine}

Order ID: ${orderData.id}`;

      const url = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
      setWhatsappUrl(url);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to create order. Please try again.');
      setIsSubmitting(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayGatePayment = async (paymentType: 'credit_card' | 'crypto') => {
    setIsProcessing(true);
    try {
      const orderData = await createOrder();
      triggerOrderEmails({
        ...orderData,
        package_image_url: packageData.icon_url,
        paymentMethodLabel: paymentType === 'credit_card' ? 'Credit Card (PayBwivox)' : 'Crypto (PayBwivox)',
      });

      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'paygate-create-payment',
        {
          body: {
            packageData: { ...packageData, name: displayName },
            customerInfo: formData,
            orderId: orderData.id,
            paymentType,
          },
        }
      );
      if (paymentError) throw paymentError;
      if (paymentData?.checkoutUrl) {
        toast.success('Redirecting to secure payment...');
        setTimeout(() => { window.location.href = paymentData.checkoutUrl; }, 1000);
      } else {
        throw new Error('Failed to create payment link');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to create payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectCryptoCreateOrder = async ({ ticker }: { wallet: CryptoWallet; ticker: string }): Promise<string | null> => {
    try {
      const note = `paybwivox_direct:${ticker}`;
      const orderData = await createOrder({
        customer_whatsapp: `${formData.customerWhatsapp}|${note}`,
      });
      setPlacedOrderId(orderData.id);
      triggerOrderEmails({ ...orderData, package_image_url: packageData.icon_url, paymentMethodLabel: `Crypto Direct (${ticker})` });
      return orderData.id as string;
    } catch (e) {
      console.error(e);
      toast.error('Failed to create order. Please try again.');
      return null;
    }
  };

  const handleBackToStore = () => { onSuccess(); onClose(); };

  useEffect(() => {
    if (orderPlaced && whatsappUrl && countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    } else if (orderPlaced && whatsappUrl && countdown === 0) {
      window.open(whatsappUrl, '_blank');
    }
  }, [orderPlaced, whatsappUrl, countdown]);

  // ---- Success screen ----
  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-sm animate-in zoom-in-95 fade-in duration-300">
          <CardContent className="pt-6 pb-5 px-5 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500">
              <CheckCircle className="h-9 w-9 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-700">Subscription activated successfully</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Order #{placedOrderId?.slice(0, 8)} · Welcome aboard 👋
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{displayName}</span>
                <span className="font-bold">${packageData.price}</span>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              {whatsappUrl ? (
                <p className="text-sm text-green-800">
                  📱 Redirecting to WhatsApp in <span className="font-bold">{countdown}s</span>
                </p>
              ) : (
                <p className="text-sm text-green-800">
                  ✅ Credentials will be sent to your email shortly.
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={handleBackToStore} className="flex-1">
                <Home className="h-4 w-4 mr-1" /> Store
              </Button>
              {whatsappUrl && (
                <Button size="sm" onClick={() => window.open(whatsappUrl!, '_blank')} className="flex-1 bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---- Progress bar ----
  const progressPct = (step / 3) * 100;
  const stepLabel =
    step === 1 ? 'Step 1 of 3 · Account' :
    step === 2 ? 'Step 2 of 3 · Your details' :
    'Final step · Payment';
  const microMessage =
    step === 1 ? 'Quick setup — takes less than 1 minute.' :
    step === 2 ? 'Almost done — just a few details left.' :
    'You’re seconds away from activation.';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl border-0">
        {/* Header with progress */}
        <CardHeader className="space-y-3 pb-4 sticky top-0 bg-card z-10 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stepLabel}</p>
              <CardTitle className="text-lg sm:text-xl">{microMessage}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span className={cn(step >= 1 && 'text-primary')}>Account</span>
              <span className={cn(step >= 2 && 'text-primary')}>Details</span>
              <span className={cn(step >= 3 && 'text-primary')}>Payment</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          {/* ============ STEP 1 ============ */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold">Do you already have an account?</h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Fast and secure checkout
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('renewal')}
                  className={cn(
                    'group relative p-5 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
                    accountType === 'renewal'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      'p-2 rounded-lg transition-colors',
                      accountType === 'renewal' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}>
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold">Renew subscription</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">For existing customers — apply renewal to your account.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('new')}
                  className={cn(
                    'group relative p-5 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
                    accountType === 'new'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      'p-2 rounded-lg transition-colors',
                      accountType === 'new' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}>
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold">New customer</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">A client space will be created automatically for future renewals.</p>
                </button>
              </div>

              {accountType === 'renewal' && (
                <div className="space-y-3 p-4 rounded-xl bg-muted/40 border animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-xs text-muted-foreground">
                    Provide at least one of the following so we can find your account:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="accountUsername" className="text-xs">Username</Label>
                      <Input id="accountUsername" name="accountUsername" value={renewal.accountUsername} onChange={handleRenewalChange} placeholder="your_username" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="accountEmail" className="text-xs">Account email</Label>
                      <Input id="accountEmail" name="accountEmail" type="email" value={renewal.accountEmail} onChange={handleRenewalChange} placeholder="you@email.com" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="accountId" className="text-xs">Or account / line ID</Label>
                    <Input id="accountId" name="accountId" value={renewal.accountId} onChange={handleRenewalChange} placeholder="e.g. 12345" />
                  </div>
                </div>
              )}

              {accountType === 'new' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-900 flex items-start gap-2 animate-in fade-in duration-300">
                  <ShieldCheck className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>You’re almost ready to access your subscription. We’ll automatically create your client space after payment.</p>
                </div>
              )}
            </div>
          )}

          {/* ============ STEP 2 ============ */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold">Your details</h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Zap className="h-3.5 w-3.5" /> We’re preparing your access
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="customerName">Full name *</Label>
                  <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input id="customerEmail" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleInputChange} placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="customerWhatsapp">WhatsApp / Phone *</Label>
                <Input id="customerWhatsapp" name="customerWhatsapp" value={formData.customerWhatsapp} onChange={handleInputChange} placeholder="+1234567890" />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5"><Tv className="h-3.5 w-3.5" /> Device *</Label>
                  <Select value={formData.deviceType} onValueChange={(v) => setFormData(p => ({ ...p, deviceType: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select device" /></SelectTrigger>
                    <SelectContent>
                      {DEVICE_OPTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5" /> App *</Label>
                  <Select value={formData.appUsed} onValueChange={(v) => setFormData(p => ({ ...p, appUsed: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select app" /></SelectTrigger>
                    <SelectContent>
                      {APP_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {requiresMac && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-2 text-sm text-amber-900">
                    <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Device activation info</p>
                      <p className="text-xs">Required only for special device activation — this helps us instantly activate your device.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="macAddress" className="text-xs">MAC Address</Label>
                      <Input id="macAddress" name="macAddress" value={formData.macAddress} onChange={handleInputChange} placeholder="00:1A:79:XX:XX:XX" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="deviceId" className="text-xs">Or Device ID</Label>
                      <Input id="deviceId" name="deviceId" value={formData.deviceId} onChange={handleInputChange} placeholder="Device identifier" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============ STEP 3 ============ */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Order recap */}
              <Card className="bg-muted/40 border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingCart className="h-4 w-4" /> Order summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white flex items-center justify-center flex-shrink-0 p-1"
                         style={{ border: '4px solid', ...getCategoryBorderStyle() }}>
                      {packageData.icon_url && !imageError ? (
                        <img src={packageData.icon_url} alt={displayName} className="w-10 h-10 object-contain" onError={() => setImageError(true)} />
                      ) : (
                        <Package className={`w-9 h-9 ${getFallbackIconClass()}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{displayName}</h3>
                      {displayDescription && <p className="text-xs text-muted-foreground truncate">{displayDescription}</p>}
                    </div>
                  </div>
                  <div className="text-sm space-y-1.5 pt-2 border-t">
                    <div className="flex justify-between"><span className="text-muted-foreground">{getDurationLabel()}</span><span>{getDisplayDuration()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{accountType === 'renewal' ? 'Renewal' : 'New customer'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground"><User className="h-3 w-3 inline mr-1" />{formData.customerName}</span><span className="truncate ml-2 max-w-[140px]">{formData.customerEmail}</span></div>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">${packageData.price}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment methods */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Secure payment processing · Instant delivery after payment
                </div>

                <Tabs defaultValue="credit_card" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/60 gap-1">
                    <TabsTrigger value="credit_card"
                      className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold py-2.5 rounded-md border-2 border-transparent transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-md data-[state=inactive]:bg-blue-50 data-[state=inactive]:text-blue-700 data-[state=inactive]:hover:bg-blue-100">
                      <CreditCard className="h-4 w-4" /><span>Card</span>
                    </TabsTrigger>
                    <TabsTrigger value="crypto"
                      className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold py-2.5 rounded-md border-2 border-transparent transition-all data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-600 data-[state=active]:shadow-md data-[state=inactive]:bg-orange-50 data-[state=inactive]:text-orange-700 data-[state=inactive]:hover:bg-orange-100">
                      <Bitcoin className="h-4 w-4" /><span>Crypto</span>
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp"
                      className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold py-2.5 rounded-md border-2 border-transparent transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:border-green-600 data-[state=active]:shadow-md data-[state=inactive]:bg-green-50 data-[state=inactive]:text-green-700 data-[state=inactive]:hover:bg-green-100">
                      <MessageCircle className="h-4 w-4" /><span>WhatsApp</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="credit_card" className="mt-4">
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-1">Pay with credit card</h4>
                            <p className="text-sm text-blue-700">Visa, Mastercard, Apple Pay, Google Pay or bank transfer. Your access will be generated automatically.</p>
                          </div>
                        </div>
                        <Button onClick={() => handlePayGatePayment('credit_card')} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                          {isProcessing ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <CreditCard className="h-5 w-5 mr-2" />}
                          Pay ${packageData.price}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="crypto" className="mt-4">
                    <DirectCryptoPayment amountUsd={packageData.price} onCreateOrder={handleDirectCryptoCreateOrder} />
                  </TabsContent>

                  <TabsContent value="whatsapp" className="mt-4">
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                          <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-900 mb-1">Order via WhatsApp</h4>
                            <p className="text-sm text-green-700">Our team will guide you through the payment process.</p>
                          </div>
                        </div>
                        <Button onClick={handleWhatsAppOrder} disabled={isProcessing} className="w-full h-12 bg-green-600 hover:bg-green-700">
                          {isProcessing ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <MessageCircle className="h-5 w-5 mr-2" />}
                          Continue to WhatsApp
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* ============ Navigation ============ */}
          {step < 3 && (
            <div className="flex items-center justify-between gap-3 pt-2">
              {step > 1 ? (
                <Button variant="outline" onClick={goBack} className="h-12 px-5">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              ) : <div />}
              <Button onClick={goNext} className="h-12 px-6 ml-auto">
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={goBack} className="h-11">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <p className="text-xs text-muted-foreground text-right max-w-[60%]">
                By proceeding you agree to our terms and privacy policy.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentOptionsCheckout;
