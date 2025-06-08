
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Privacy Policy"
        description="Learn how the Burundi eVisa Portal protects your personal data. Our privacy policy explains what information we collect and how it is used."
        keywords="privacy policy, data protection, personal information, Burundi visa privacy"
      />
      <Navbar />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-primary mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              The Burundi eVisa Portal is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal identification information (name, date of birth, nationality, passport details)</li>
              <li>Contact information (email address, phone number, residential address)</li>
              <li>Travel information (travel dates, accommodation details, purpose of visit)</li>
              <li>Supporting documents (passport copies, photos, itineraries, invitation letters)</li>
              <li>Payment information (transaction records, not credit card details)</li>
              <li>Communication records between you and our customer service</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Processing your visa application</li>
              <li>Verifying your identity and eligibility</li>
              <li>Communicating with you about your application status</li>
              <li>Complying with legal and security requirements</li>
              <li>Improving our services and user experience</li>
              <li>Maintaining accurate records of travel to Burundi</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
            <p className="mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Relevant government departments and immigration authorities</li>
              <li>Law enforcement agencies when required by law</li>
              <li>Third-party service providers who assist in operating the eVisa Portal</li>
              <li>Border control and immigration officials at points of entry</li>
            </ul>
            <p className="mb-4">
              We do not sell, trade, or rent your personal information to third parties for marketing purposes.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="mb-4">
              Our security measures include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption of data transmission</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication procedures</li>
              <li>Staff training on data protection</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The duration of your visa validity plus 5 years for successful applications</li>
              <li>2 years for rejected applications</li>
              <li>Longer periods may apply for security, legal, or historical record purposes</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data (subject to legal restrictions)</li>
              <li>Object to certain processing of your data</li>
              <li>Request a copy of your data</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please contact us at privacy@immigration.gov.bi.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Cookies and Tracking</h2>
            <p className="mb-4">
              Our website uses cookies and similar technologies to enhance your experience and collect information about how you use our site. You can control cookies through your browser settings.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
            <p className="mb-4">
              Our services are not directed to children under 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe we have collected information from your child, please contact us.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">9. International Data Transfers</h2>
            <p className="mb-4">
              Your data may be transferred to and processed in countries outside Burundi. We ensure appropriate safeguards are in place for such transfers.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of significant changes through the website or via email.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">11. Contact Information</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact:
              <br /><br />
              Data Protection Officer<br />
              Burundi Immigration Department<br />
              Email: privacy@immigration.gov.bi<br />
              Phone: +257 22 22 34 55
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

export default Privacy;
