
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, CheckCircle } from 'lucide-react';
import StoreLayout from '@/components/store/StoreLayout';

const RefundPolicy = () => {
  return (
    <StoreLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="container py-16">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200 group"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Link>
          </div>

          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                Refund <span className="text-red-600">Policy</span>
              </h1>
              <p className="text-xl text-gray-600">
                Your satisfaction is our priority. Learn about our 30-day money-back guarantee.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
                <div className="flex items-center gap-4">
                  <Clock className="h-12 w-12" />
                  <div>
                    <h2 className="text-3xl font-bold">30-Day Money Back Guarantee</h2>
                    <p className="text-red-100">We stand behind our services</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Policy Overview */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Policy Overview</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We offer a 30-day money-back guarantee on all our IPTV services. If you're not completely 
                    satisfied with your purchase, you can request a full refund within 30 days of your initial purchase date.
                  </p>
                </div>

                {/* Eligibility */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Refund Eligibility</h3>
                  <div className="grid gap-4">
                    {[
                      "Request made within 30 days of purchase",
                      "Service issues not resolved by our support team",
                      "Compatibility issues with your device",
                      "Service not meeting advertised specifications"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to Request */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Request a Refund</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>Contact our support team via WhatsApp or Telegram</li>
                    <li>Provide your order details and reason for refund</li>
                    <li>Allow our team to attempt resolving any technical issues</li>
                    <li>If unresolved, we'll process your refund within 5-7 business days</li>
                  </ol>
                </div>

                {/* Processing Time */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Processing Time</h4>
                  <p className="text-blue-800">
                    Refunds are typically processed within 5-7 business days after approval. 
                    The time for funds to appear in your account depends on your payment method and bank.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
                  <p className="text-gray-700 mb-6">
                    Our customer support team is here to help with any questions about our refund policy.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to="/support" 
                      className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Contact Support
                    </Link>
                    <a 
                      href="https://wa.me/1234567890" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      WhatsApp Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </StoreLayout>
  );
};

export default RefundPolicy;
