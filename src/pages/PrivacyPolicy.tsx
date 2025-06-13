
import React from 'react';
import StoreLayout from '@/components/store/StoreLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <StoreLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-red-600" size={24} />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                BWIVOX IPTV ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our website 
                and use our IPTV services. Please read this privacy policy carefully. If you do not agree with 
                the terms of this privacy policy, please do not access the site or use our services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="text-blue-600" size={24} />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-700 mb-2">We may collect personal information that you provide to us, including:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Payment information and billing details</li>
                  <li>Account credentials and preferences</li>
                  <li>Customer support communications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                <p className="text-gray-700 mb-2">We automatically collect certain information, including:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Device information and IP addresses</li>
                  <li>Viewing patterns and service usage statistics</li>
                  <li>Website navigation and interaction data</li>
                  <li>Technical logs and performance metrics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="text-green-600" size={24} />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">We use the information we collect for various purposes, including:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Providing and maintaining our IPTV services</li>
                <li>Processing payments and managing subscriptions</li>
                <li>Improving service quality and user experience</li>
                <li>Providing customer support and technical assistance</li>
                <li>Sending service-related communications</li>
                <li>Preventing fraud and ensuring service security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-purple-600" size={24} />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">We do not sell, trade, or rent your personal information. We may share information in the following circumstances:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Third-party companies that help us operate our services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                <li><strong>Consent:</strong> With your explicit permission</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="text-orange-600" size={24} />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, no method 
                of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee 
                absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-indigo-600" size={24} />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">You have certain rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Access:</strong> Request information about the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
                <li><strong>Objection:</strong> Object to certain processing of your data</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our website. 
                Cookies help us understand how you use our services and improve functionality. You can control 
                cookie settings through your browser, but disabling cookies may affect service functionality.
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Our website may contain links to third-party websites or services. We are not responsible for 
                the privacy practices of these third parties. We encourage you to review their privacy policies 
                before providing any personal information.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected information from 
                a child under 13, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="text-red-600" size={24} />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>BWIVOX IPTV</strong></p>
                <p className="text-gray-700">Email: privacy@bwivoxiptv.com</p>
                <p className="text-gray-700">Website: Contact form on our support page</p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date. Your 
                continued use of our services after any changes indicates your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </StoreLayout>
  );
};

export default PrivacyPolicy;
