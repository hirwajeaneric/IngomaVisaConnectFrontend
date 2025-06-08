
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Terms of Service"
        description="Read the terms of service for using the Burundi eVisa Portal. Learn about your rights and responsibilities when using our visa application service."
        keywords="terms of service, legal terms, visa application terms, Burundi visa rules"
      />
      <Navbar />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-primary mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to the Burundi eVisa Portal. These Terms of Service govern your use of our website and services. By using our platform, you agree to these Terms. Please read them carefully.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Definitions</h2>
            <p className="mb-4">
              <strong>"eVisa Portal"</strong> refers to the official online platform for Burundi visa applications.
              <br />
              <strong>"Services"</strong> refers to the visa application processing and related services offered through this platform.
              <br />
              <strong>"User"</strong> refers to any individual who accesses or uses the eVisa Portal.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Use of Services</h2>
            <p className="mb-4">
              3.1. The eVisa Portal is intended for legitimate visa application purposes only.
            </p>
            <p className="mb-4">
              3.2. Users must provide accurate and truthful information in their applications.
            </p>
            <p className="mb-4">
              3.3. Submission of false information may result in visa denial and possible legal consequences.
            </p>
            <p className="mb-4">
              3.4. The eVisa Portal reserves the right to reject applications that do not comply with Burundi's immigration policies.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Account Responsibilities</h2>
            <p className="mb-4">
              4.1. Users are responsible for maintaining the confidentiality of their account credentials.
            </p>
            <p className="mb-4">
              4.2. Users are responsible for all activities that occur under their account.
            </p>
            <p className="mb-4">
              4.3. Users must notify the eVisa Portal immediately upon becoming aware of any breach of security or unauthorized use of their account.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Payment and Refund Policy</h2>
            <p className="mb-4">
              5.1. All fees are payable in advance and are non-refundable once the application has been submitted for processing.
            </p>
            <p className="mb-4">
              5.2. A refund may be considered in cases where an application has not yet been processed and the request is made within 24 hours of payment.
            </p>
            <p className="mb-4">
              5.3. Visa rejection does not qualify for a refund as the fee covers processing costs.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. User Content</h2>
            <p className="mb-4">
              6.1. By submitting information, documents, or other content to the eVisa Portal, users grant the Republic of Burundi the right to use, store, and process this information for visa application purposes.
            </p>
            <p className="mb-4">
              6.2. Users represent and warrant that their content does not infringe upon any third-party rights.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitations of Liability</h2>
            <p className="mb-4">
              7.1. The eVisa Portal is provided on an "as is" and "as available" basis, without warranties of any kind.
            </p>
            <p className="mb-4">
              7.2. The Republic of Burundi is not liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from the use of the eVisa Portal.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
            <p className="mb-4">
              8.1. The Republic of Burundi reserves the right to modify these Terms at any time.
            </p>
            <p className="mb-4">
              8.2. Users will be notified of significant changes to these Terms.
            </p>
            <p className="mb-4">
              8.3. Continued use of the eVisa Portal after changes constitutes acceptance of the new Terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">9. Governing Law</h2>
            <p className="mb-4">
              9.1. These Terms are governed by the laws of the Republic of Burundi.
            </p>
            <p className="mb-4">
              9.2. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Burundi.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms, please contact the Burundi Immigration Department at:
              <br />
              Email: immigration@gov.bi
              <br />
              Phone: +257 22 22 34 54
            </p>
            
            <p className="mt-8 italic text-gray-600">
              Last updated: May 15, 2025
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
