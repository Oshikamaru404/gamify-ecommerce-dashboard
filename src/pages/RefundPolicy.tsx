
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, CheckCircle } from 'lucide-react';
import StoreLayout from '@/components/store/StoreLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const RefundPolicy = () => {
  const { t } = useLanguage();

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
              {t.backToHome}
            </Link>
          </div>

          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                {t.refundPolicy}
              </h1>
              <p className="text-xl text-gray-600">
                {t.refundSubtitle}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
                <div className="flex items-center gap-4">
                  <Clock className="h-12 w-12" />
                  <div>
                    <h2 className="text-3xl font-bold">{t.moneyBackGuarantee}</h2>
                    <p className="text-red-100">{t.standBehindServices}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Policy Overview */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.policyOverview}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t.policyOverviewText}
                  </p>
                </div>

                {/* Eligibility */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.refundEligibility}</h3>
                  <div className="grid gap-4">
                    {[
                      t.requestWithin30Days,
                      t.serviceIssuesNotResolved,
                      t.compatibilityIssues,
                      t.serviceNotMeeting
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.howToRequest}</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>{t.step1Contact}</li>
                    <li>{t.step2Provide}</li>
                    <li>{t.step3Allow}</li>
                    <li>{t.step4Process}</li>
                  </ol>
                </div>

                {/* Processing Time */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">{t.processingTime}</h4>
                  <p className="text-blue-800">
                    {t.processingTimeText}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.needHelpRefund}</h3>
                  <p className="text-gray-700 mb-6">
                    {t.needHelpRefundText}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to="/support" 
                      className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t.contactSupport}
                    </Link>
                    <a 
                      href="https://wa.me/1234567890" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {t.whatsappSupportLink}
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
