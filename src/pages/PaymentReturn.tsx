
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type PaymentReturnOrder = {
  payment_status: string;
  package_name: string | null;
  duration_months: number | null;
  amount: number;
};

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [orderDetails, setOrderDetails] = useState<PaymentReturnOrder | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const orderId = searchParams.get('order_id');
      const uuid = searchParams.get('uuid');

      if (!orderId && !uuid) {
        setPaymentStatus('failed');
        return;
      }

      try {
        // Order status is exposed through a limited server response, not the full order row.
        if (orderId) {
          const { data, error: orderError } = await supabase.functions.invoke(
            'get-order-payment-status',
            { body: { orderId } }
          );

          if (orderError || !data?.order) {
            console.error('Error fetching order:', orderError);
            setPaymentStatus('failed');
            return;
          }

          const order = data.order as PaymentReturnOrder;
          setOrderDetails(order);

          if (order.payment_status === 'paid') {
            setPaymentStatus('success');
          } else if (order.payment_status === 'failed') {
            setPaymentStatus('failed');
          } else {
            setPaymentStatus('pending');
          }
          return;
        }

        // Legacy Cryptomus flow
        if (uuid) {
          const { data: paymentData, error } = await supabase.functions.invoke(
            'check-cryptomus-payment',
            { body: { uuid, orderId } }
          );

          if (error) {
            console.error('Error checking payment:', error);
            setPaymentStatus('failed');
            return;
          }

          const { data: orderData, error: orderError } = await supabase.functions.invoke(
            'get-order-payment-status',
            { body: { providerUuid: uuid } }
          );

          if (orderError || !orderData?.order) {
            console.error('Error fetching order:', orderError);
            setPaymentStatus('failed');
            return;
          }

          const orders = orderData.order as PaymentReturnOrder;
          setOrderDetails(orders);

          if (paymentData?.result?.payment_status === 'paid' && orders.payment_status === 'paid') {
            setPaymentStatus('success');
          } else if (
            orders.payment_status === 'failed' ||
            paymentData?.result?.payment_status === 'cancel' ||
            paymentData?.result?.payment_status === 'fail'
          ) {
            setPaymentStatus('failed');
          } else {
            setPaymentStatus('pending');
          }
        }
      } catch (error) {
        console.error('Error processing payment return:', error);
        setPaymentStatus('failed');
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const renderContent = () => {
    switch (paymentStatus) {
      case 'loading':
        return (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Checking Payment Status</h2>
              <p className="text-gray-600">Please wait while we verify your payment...</p>
            </CardContent>
          </Card>
        );

      case 'success':
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-green-800">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Thank you for your payment. Your order has been received and is being processed.
              </p>
              
              {orderDetails && (
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <h3 className="font-semibold mb-2">Order Details:</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Package:</span>
                      <span>{orderDetails.package_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{orderDetails.duration_months} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>€{orderDetails.amount}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                You will receive an email confirmation shortly with your subscription details.
              </p>
              
              <Button asChild className="w-full">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        );

      case 'pending':
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-yellow-800">Payment Pending</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Your payment is being processed. This may take a few minutes for cryptocurrency transactions.
              </p>
              
              <p className="text-sm text-gray-500">
                You will receive an email confirmation once the payment is completed.
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="w-full"
                >
                  Check Status Again
                </Button>
                
                <Button asChild className="w-full">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'failed':
      default:
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-red-800">Payment Failed</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Unfortunately, your payment could not be processed. Please try again or contact support for assistance.
              </p>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/subscription">
                    Try Again
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <StoreLayout>
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Status</h1>
            <p className="text-gray-600">Check the status of your recent payment</p>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </StoreLayout>
  );
};

export default PaymentReturn;
