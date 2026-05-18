import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShoppingCart, MessageCircle, CreditCard, X, Loader2, Package, CheckCircle, Home, Bitcoin,
  ArrowRight, ArrowLeft, RefreshCw, Sparkles, ShieldCheck, Zap, Tv, Lock, User,
  Check, AlertCircle, Clock, Award, Pencil
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useLocalizedText } from '@/lib/multilingualUtils';
import DirectCryptoPayment, { CryptoWallet } from '@/components/DirectCryptoPayment';
import { triggerOrderEmails } from '@/lib/orderEmails';
import { cn } from '@/lib/utils';
import QuickCheckoutAuth from '@/components/auth/QuickCheckoutAuth';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useUserOrders } from '@/hooks/useUserOrders';
import { useCheckoutAutofill, SavedProfile } from '@/hooks/useCheckoutAutofill';
import { useCheckoutDraftAutosave, loadCheckoutDraft, clearCheckoutDraft } from '@/hooks/useCheckoutDraft';
import { formatMacInput, isValidEmail, isValidMac, suggestEmailFix } from '@/lib/checkoutValidation';
import SavedProfilesPicker from '@/components/auth/SavedProfilesPicker';

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

type AccountType = 'renewal' | 'new';
type ConnectionType = 'm3u_xtream' | 'mag_stb' | null;
type OfferKind = 'iptv_subscription' | 'iptv_panel' | 'player_activation' | 'player_panel';

const PaymentOptionsCheckout: React.FC<PaymentOptionsCheckoutProps> = ({
  packageData,
  onClose,
  onSuccess,
}) => {
  // ---- 2-step flow ----
  const [step, setStep] = useState<1 | 2>(1);
  const { user: authUser, profile, loading: authLoading } = useUserAuth();
  const { orders: pastOrders } = useUserOrders();

  // Auto-detect: authed users default to renewal, guests to new. User can flip.
  const [accountType, setAccountType] = useState<AccountType>('new');
  const [editIdentity, setEditIdentity] = useState(false);
  const [selectedRenewalOrderId, setSelectedRenewalOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerWhatsapp: '',
    macAddress: '',
    iptvUsername: '',
    iptvPassword: '',
  });
  const [connectionType, setConnectionType] = useState<ConnectionType>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const { data: siteSettings } = useSiteSettings();
  const [imageError, setImageError] = useState(false);

  const autofill = useCheckoutAutofill(packageData.category);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const autofilledRef = useRef(false);
  const draftRestoredRef = useRef(false);

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
    const c = packageData.category?.toLowerCase() || '';
    if (c.includes('panel') || c.includes('reseller') || c === 'player')
      return { borderColor: '#8f35e5', boxShadow: '0 0 0 3px rgba(143, 53, 229, 0.2)' };
    return { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)' };
  };
  const getFallbackIconClass = () => {
    const c = packageData.category?.toLowerCase() || '';
    if (c.includes('panel') || c.includes('reseller') || c === 'player') return 'text-[#8f35e5]';
    return 'text-red-500';
  };

  const offerKind: OfferKind = useMemo(() => {
    const c = (packageData.category || '').toLowerCase();
    if (c.includes('player') && c.includes('panel')) return 'player_panel';
    if (c.includes('panel') || c.includes('reseller')) return 'iptv_panel';
    if (c === 'player' || c.includes('player')) return 'player_activation';
    return 'iptv_subscription';
  }, [packageData.category]);

  const isRenewal = accountType === 'renewal';
  const isNew = accountType === 'new';

  const showConnectionToggle = offerKind === 'iptv_subscription';
  const showMac =
    (offerKind === 'iptv_subscription' && connectionType === 'mag_stb') ||
    offerKind === 'player_activation';
  const isIptvM3U = offerKind === 'iptv_subscription' && connectionType === 'm3u_xtream';
  const showUsername =
    (isIptvM3U && isRenewal) ||
    offerKind === 'iptv_panel' ||
    offerKind === 'player_panel';
  const showPassword =
    (isIptvM3U && isRenewal) ||
    ((offerKind === 'iptv_panel' || offerKind === 'player_panel') && isNew);
  const showIptvM3UNewNotice = isIptvM3U && isNew;
  const showPanelEmail = offerKind === 'player_panel';

  // Past renewable subs for the dropdown (same offer family, completed/paid)
  const renewableOrders = useMemo(() => {
    if (offerKind !== 'iptv_subscription') return [];
    return pastOrders.filter(o =>
      (o.package_category || '').toLowerCase().includes('iptv') &&
      !(o.package_category || '').toLowerCase().includes('panel')
    );
  }, [pastOrders, offerKind]);

  // Auto-default to renewal when an authed user has past orders
  useEffect(() => {
    if (authUser && renewableOrders.length > 0 && accountType === 'new' && !draftRestoredRef.current) {
      setAccountType('renewal');
    }
  }, [authUser, renewableOrders.length]); // eslint-disable-line

  // ---- Validation (no toasts; just gate the button) ----
  const step1Valid = useMemo(() => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerWhatsapp) return false;
    if (!isValidEmail(formData.customerEmail)) return false;
    if (showConnectionToggle && !connectionType) return false;
    if (showMac && !isValidMac(formData.macAddress)) return false;
    if (showUsername && !formData.iptvUsername) return false;
    if (showPassword && !formData.iptvPassword) return false;
    return true;
  }, [formData, connectionType, showConnectionToggle, showMac, showUsername, showPassword]);

  const goNext = () => { if (step === 1 && step1Valid) setStep(2); };
  const goBack = () => setStep(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'macAddress') {
      setFormData((p) => ({ ...p, macAddress: formatMacInput(value) }));
      return;
    }
    setFormData((p) => ({ ...p, [name]: value }));
    if (name === 'customerEmail') setEmailSuggestion(suggestEmailFix(value));
  };

  const applySavedProfile = (profile: SavedProfile | null) => {
    setSelectedSavedId(profile?.id ?? null);
    if (!profile) return;
    setFormData((p) => ({
      ...p,
      macAddress: profile.mac_address ?? p.macAddress,
      iptvUsername: profile.iptv_username ?? p.iptvUsername,
    }));
    if (profile.connection_type) setConnectionType(profile.connection_type);
    toast.success('Saved profile applied');
  };

  // ---- Restore draft AFTER auth resolves (so we don't overwrite pre-filled data) ----
  useEffect(() => {
    if (draftRestoredRef.current || !packageData.id || authLoading) return;
    const draft = loadCheckoutDraft<{
      accountType: AccountType;
      connectionType: ConnectionType;
      formData: typeof formData;
    }>(packageData.id);
    if (draft) {
      draftRestoredRef.current = true;
      if (draft.accountType) setAccountType(draft.accountType);
      if (draft.connectionType) setConnectionType(draft.connectionType);
      if (draft.formData) {
        setFormData((p) => ({
          ...p,
          // Don't overwrite values already filled from auth/profile
          customerName: p.customerName || draft.formData.customerName || '',
          customerEmail: p.customerEmail || draft.formData.customerEmail || '',
          customerWhatsapp: p.customerWhatsapp || draft.formData.customerWhatsapp || '',
          macAddress: draft.formData.macAddress || p.macAddress,
          iptvUsername: draft.formData.iptvUsername || p.iptvUsername,
          iptvPassword: draft.formData.iptvPassword || p.iptvPassword,
        }));
      }
      toast('Draft restored', { description: 'We brought back your previous entries.' });
    } else {
      draftRestoredRef.current = true;
    }
  }, [packageData.id, authLoading]);

  useCheckoutDraftAutosave(
    packageData.id,
    { accountType, connectionType, formData },
    !orderPlaced,
  );

  // ---- Autofill from signed-in profile ----
  useEffect(() => {
    if (autofilledRef.current) return;
    if (!autofill.email && !autofill.displayName && !autofill.phone) return;
    autofilledRef.current = true;
    setFormData((p) => ({
      ...p,
      customerName: p.customerName || autofill.displayName || '',
      customerEmail: p.customerEmail || autofill.email || '',
      customerWhatsapp: p.customerWhatsapp || autofill.phone || '',
    }));
  }, [autofill.email, autofill.displayName, autofill.phone]);

  const buildNotesPayload = () => {
    const payload: Record<string, any> = {
      account_type: accountType,
      offer_kind: offerKind,
      connection_type: connectionType,
    };
    if (accountType === 'renewal' && selectedRenewalOrderId) {
      const o = renewableOrders.find(x => x.id === selectedRenewalOrderId);
      payload.renewal = {
        previous_order_id: selectedRenewalOrderId,
        previous_package: o?.package_name || null,
      };
    }
    if (showMac) payload.mac_address = formData.macAddress || null;
    if (showUsername) payload.iptv_username = formData.iptvUsername || null;
    if (showPassword) payload.iptv_password = formData.iptvPassword || null;
    return JSON.stringify(payload);
  };

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
        ? `\n🔁 Renewal${selectedRenewalOrderId ? ` — Order #${selectedRenewalOrderId.slice(0,8)}` : ''}`
        : '\n🆕 New customer';
      const detailLines: string[] = [];
      if (showMac) detailLines.push(`🔧 MAC: ${formData.macAddress}`);
      if (showUsername) detailLines.push(`👤 Username: ${formData.iptvUsername}`);
      if (showPassword) detailLines.push(`🔑 Password: ${formData.iptvPassword}`);
      if (showConnectionToggle) detailLines.push(`🔌 Connection: ${connectionType === 'm3u_xtream' ? 'M3U / Xtream' : 'MAG / STB'}`);
      const detailsBlock = detailLines.length ? `\n${detailLines.join('\n')}` : '';

      const message = `🛒 New Order Request${renewalLine}

📦 Package: ${displayName}
💰 Price: $${packageData.price}
⏱️ Duration: ${getDisplayDuration()}

👤 ${formData.customerName}
✉️ ${formData.customerEmail}
📱 ${formData.customerWhatsapp}${detailsBlock}

Order ID: ${orderData.id}`;

      const url = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
      setWhatsappUrl(url);
      setOrderPlaced(true);
      clearCheckoutDraft(packageData.id);
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
        { body: { packageData: { ...packageData, name: displayName }, customerInfo: formData, orderId: orderData.id, paymentType } }
      );
      if (paymentError) throw paymentError;
      if (paymentData?.checkoutUrl) {
        toast.success('Redirecting to secure payment...');
        setTimeout(() => { clearCheckoutDraft(packageData.id); window.location.href = paymentData.checkoutUrl; }, 1000);
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
      const orderData = await createOrder({ customer_whatsapp: `${formData.customerWhatsapp}|${note}` });
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
              <p className="text-sm text-muted-foreground mt-1">Order #{placedOrderId?.slice(0, 8)} · Welcome aboard 👋</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{displayName}</span>
                <span className="font-bold">${packageData.price}</span>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              {whatsappUrl ? (
                <p className="text-sm text-green-800">📱 Redirecting to WhatsApp in <span className="font-bold">{countdown}s</span></p>
              ) : (
                <p className="text-sm text-green-800">✅ Credentials will be sent to your email shortly.</p>
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

  // ---- Header copy ----
  const stepLabel = step === 1 ? 'Step 1 of 2 · Your details' : 'Step 2 of 2 · Payment';
  const microMessage = step === 1 ? 'Quick setup — under a minute.' : 'You’re seconds away from activation.';
  const progressPct = (step / 2) * 100;

  const identityKnown = !!authUser && !editIdentity;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl border-0">
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
          {/* Compact 1—2 stepper */}
          <div className="space-y-2">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="flex items-center justify-center gap-3 text-[11px] font-medium">
              <span className={cn('flex items-center gap-1.5', step >= 1 ? 'text-primary' : 'text-muted-foreground')}>
                <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[10px]', step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted')}>1</span>
                Details
              </span>
              <span className="h-px w-8 bg-muted" />
              <span className={cn('flex items-center gap-1.5', step >= 2 ? 'text-primary' : 'text-muted-foreground')}>
                <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[10px]', step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted')}>2</span>
                Payment
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          {/* ============ STEP 1: Details ============ */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* GUEST GATE: until logged in, only show auth widget + perks. */}
              {!authUser && (
                <>
                  <QuickCheckoutAuth
                    onAuthed={(p) => {
                      setFormData(prev => ({
                        ...prev,
                        customerName: prev.customerName || p?.display_name || "",
                        customerEmail: prev.customerEmail || p?.email || "",
                        customerWhatsapp: prev.customerWhatsapp || (p as any)?.phone || "",
                      }));
                    }}
                  />
                  <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Why an account is required
                      </p>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground/80">
                      <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Auto-detect existing subscriptions to renew</li>
                      <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Keep your M3U / Xtream credentials safe</li>
                      <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Track orders &amp; payment history</li>
                      <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Faster checkout on future purchases</li>
                    </ul>
                    <p className="text-[11px] text-muted-foreground pt-1">
                      Log in with a provider above, or tap the email icon to create an account in seconds.
                    </p>
                  </div>
                </>
              )}

              {/* AUTHED ONLY: everything below requires a logged-in user. */}
              {authUser && (<>
              {/* Account type segmented control */}
              <div
                role="tablist"
                aria-label="Account type"
                className="grid grid-cols-2 gap-1.5 p-1.5 rounded-xl border-2 border-border bg-muted/40 shadow-sm"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={isNew}
                  onClick={() => setAccountType('new')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isNew
                      ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30'
                      : 'bg-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>New customer</span>
                  {isNew && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-foreground/20 text-primary-foreground uppercase tracking-wide">
                      Active
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isRenewal}
                  onClick={() => setAccountType('renewal')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isRenewal
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30 dark:bg-emerald-500'
                      : 'bg-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground'
                  }`}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>I’m renewing</span>
                  {isRenewal && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/25 text-white uppercase tracking-wide">
                      Active
                    </span>
                  )}
                </button>
              </div>

              {/* Account perks — shown to guests in BOTH modes to encourage account creation */}
              {!authUser && (
                <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-3.5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {isRenewal ? 'Why log in to renew' : 'Why create an account'}
                    </p>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground/80">
                    {isRenewal ? (
                      <>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Keep your existing M3U / Xtream credentials</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Auto-detect your active subscription</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> One-click renewal at checkout</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Full order &amp; payment history</li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Auto-fill name &amp; email — no typing</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Track your order &amp; credentials anytime</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Faster checkout on your next purchase</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" /> Manage all your subscriptions in one place</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
              {isRenewal && authUser && renewableOrders.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Which subscription are you renewing?</Label>
                  <Select value={selectedRenewalOrderId ?? ''} onValueChange={(v) => setSelectedRenewalOrderId(v)}>
                    <SelectTrigger><SelectValue placeholder="Select a previous subscription" /></SelectTrigger>
                    <SelectContent>
                      {renewableOrders.map(o => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.package_name} · #{o.id.slice(0,6)} · {new Date(o.created_at).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Identity: shown only when user is authenticated.
                  Guests collect name/email/phone via QuickCheckoutAuth (single entry point). */}
              {authUser && (
                <>
                  {identityKnown ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            Signed in as {profile?.display_name || authUser?.email}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{formData.customerEmail || authUser?.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setEditIdentity(true)} className="text-xs">
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                    </div>
                  ) : (
                    <>
                      {autofill.savedProfiles.length > 0 && (
                        <SavedProfilesPicker
                          profiles={autofill.savedProfiles}
                          selectedId={selectedSavedId}
                          onSelect={applySavedProfile}
                        />
                      )}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="customerName">Full name *</Label>
                          <div className="relative">
                            <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} placeholder="John Doe" className="pr-9" />
                            {formData.customerName.trim().length >= 2 && (
                              <Check className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="customerEmail">Email *</Label>
                          <div className="relative">
                            <Input id="customerEmail" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleInputChange} placeholder="john@example.com" className="pr-9" />
                            {isValidEmail(formData.customerEmail) && (
                              <Check className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                            )}
                          </div>
                          {emailSuggestion && (
                            <button
                              type="button"
                              onClick={() => { setFormData(p => ({ ...p, customerEmail: emailSuggestion! })); setEmailSuggestion(null); }}
                              className="flex items-center gap-1 text-[11px] text-amber-700 hover:underline"
                            >
                              <AlertCircle className="h-3 w-3" />
                              Did you mean <span className="font-semibold">{emailSuggestion}</span>?
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* WhatsApp — required after OAuth (providers don't return phone) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="customerWhatsapp">WhatsApp / Phone *</Label>
                    <div className="relative">
                      <Input id="customerWhatsapp" name="customerWhatsapp" value={formData.customerWhatsapp} onChange={handleInputChange} placeholder="+1234567890" className="pr-9" />
                      {formData.customerWhatsapp.replace(/\D/g, '').length >= 7 && (
                        <Check className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ===== Dynamic activation fields ===== */}
              {showConnectionToggle && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Tv className="h-3.5 w-3.5" /> Connection type *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConnectionType('m3u_xtream')}
                      className={cn(
                        'p-3 rounded-lg border-2 text-left text-sm transition-all',
                        connectionType === 'm3u_xtream' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                      )}
                    >
                      <div className="font-semibold">M3U Playlist & Xtream Codes</div>
                      <p className="text-xs text-muted-foreground">Smarters, Tivimate, IBO, XCIPTV…</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConnectionType('mag_stb')}
                      className={cn(
                        'p-3 rounded-lg border-2 text-left text-sm transition-all',
                        connectionType === 'mag_stb' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                      )}
                    >
                      <div className="font-semibold">MAG Portal / STB Emu / Smart STB</div>
                      <p className="text-xs text-muted-foreground">Device activation via MAC address</p>
                    </button>
                  </div>
                </div>
              )}

              {showIptvM3UNewNotice && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2 text-sm text-blue-900 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">No credentials required</p>
                    <p className="text-xs mt-1">
                      Your IPTV username & password will be generated and sent to you by email / WhatsApp once your payment is confirmed.
                    </p>
                  </div>
                </div>
              )}

              {(showMac || showUsername || showPassword || showPanelEmail) && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-2 text-sm text-amber-900">
                    <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{isRenewal ? 'Renewal details' : 'Account creation details'}</p>
                      <p className="text-xs">
                        {isRenewal
                          ? 'Enter the existing account info we’ll apply your renewal to.'
                          : 'These details will be used to create and activate your access.'}
                      </p>
                    </div>
                  </div>
                  {showPanelEmail && (
                    <div className="space-y-1.5">
                      <Label htmlFor="panelEmail" className="text-xs">Account email *</Label>
                      <Input id="panelEmail" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleInputChange} placeholder="account@email.com" />
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {showMac && (
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="macAddress" className="text-xs flex items-center gap-1.5">
                          MAC Address *
                          {isValidMac(formData.macAddress) && <Check className="h-3 w-3 text-green-600" />}
                        </Label>
                        <Input id="macAddress" name="macAddress" value={formData.macAddress} onChange={handleInputChange} placeholder="00:1A:79:XX:XX:XX" maxLength={17} className="font-mono tracking-wider" />
                      </div>
                    )}
                    {showUsername && (
                      <div className={cn('space-y-1.5', !showPassword && 'sm:col-span-2')}>
                        <Label htmlFor="iptvUsername" className="text-xs">Username *</Label>
                        <Input id="iptvUsername" name="iptvUsername" value={formData.iptvUsername} onChange={handleInputChange} placeholder="username" />
                      </div>
                    )}
                    {showPassword && (
                      <div className="space-y-1.5">
                        <Label htmlFor="iptvPassword" className="text-xs">Password *</Label>
                        <Input id="iptvPassword" name="iptvPassword" type="text" value={formData.iptvPassword} onChange={handleInputChange} placeholder="password" />
                      </div>
                    )}
                  </div>
                  {isRenewal && showUsername && !showPassword && (
                    <p className="text-xs text-amber-800/80">
                      🔒 No password needed for renewal — we apply it to the existing account.
                    </p>
                  )}
                </div>
              )}
              </>)}
            </div>
          )}

          {/* ============ STEP 2: Payment ============ */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{isRenewal ? 'Renewal' : 'New customer'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground"><User className="h-3 w-3 inline mr-1" />{formData.customerName}</span><span className="truncate ml-2 max-w-[140px]">{formData.customerEmail}</span></div>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">${packageData.price}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-green-50 border border-green-200 text-center">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span className="text-[10px] font-semibold text-green-800 leading-tight">Secure checkout</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-[10px] font-semibold text-blue-800 leading-tight">Activation 5–15 min</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span className="text-[10px] font-semibold text-amber-800 leading-tight">30-day guarantee</span>
                </div>
              </div>

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
          {step === 1 && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button onClick={goNext} disabled={!step1Valid} className="h-12 px-6">
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
          {step === 2 && (
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
