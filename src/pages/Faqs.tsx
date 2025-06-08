import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// FAQ categories and items
const faqData = [
  {
    category: "Visa Application Process",
    items: [
      {
        question: "How do I apply for a visa to Burundi?",
        answer: "You can apply for a Burundi visa through our online platform. Create an account, fill out the application form, upload the required documents, pay the fee, and submit your application. You can track the status of your application through your dashboard."
      },
      {
        question: "What documents do I need to apply for a visa?",
        answer: "The basic documents required include a valid passport with at least 6 months validity, recent passport-sized photographs, proof of accommodation in Burundi, proof of travel arrangements, and proof of sufficient funds. Additional documents may be required depending on the visa type."
      },
      {
        question: "How long does the visa application process take?",
        answer: "Processing times vary by visa type: Tourist visa (3-5 business days), Business visa (5-7 business days), Work visa (10-15 business days), Student visa (7-10 business days), and Transit visa (2-3 business days). Expedited processing is available for an additional fee."
      },
      {
        question: "Can I check the status of my visa application?",
        answer: "Yes, you can track your visa application status through your user dashboard. After logging in, navigate to 'My Applications' to see real-time updates on your application status."
      },
      {
        question: "Can I apply for a visa on behalf of someone else?",
        answer: "Yes, you can apply on behalf of family members or colleagues. You'll need to create separate applications for each person and provide their individual documentation. Group applications for tour groups are also available."
      }
    ]
  },
  {
    category: "Visa Types and Requirements",
    items: [
      {
        question: "What types of visas are available for Burundi?",
        answer: "Burundi offers several visa types including Tourist, Business, Work, Student, and Transit visas. Each visa type has specific requirements and is designed for different purposes of travel."
      },
      {
        question: "How much does a visa cost?",
        answer: "Visa fees vary by type: Tourist ($50), Business ($100), Work ($200), Student ($75), and Transit ($30). Additional fees may apply for expedited processing, multiple entries, or longer validity periods."
      },
      {
        question: "How long can I stay in Burundi with a visa?",
        answer: "Stay duration varies by visa type: Tourist and Business visas allow stays of 30-90 days, Work and Student visas are valid for up to one year (renewable), and Transit visas allow stays of up to 7 days."
      },
      {
        question: "Can I extend my visa while in Burundi?",
        answer: "Yes, most visas can be extended while in Burundi. You'll need to apply at the Immigration Office at least 7 days before your visa expires. Extensions typically cost 50% of the original visa fee."
      },
      {
        question: "Do I need a visa if I'm just transiting through Burundi?",
        answer: "Yes, if you will be passing through Burundi en route to another destination, you need to apply for a Transit visa, valid for up to 7 days. The fee for a Transit visa is $30."
      }
    ]
  },
  {
    category: "Payment and Fees",
    items: [
      {
        question: "What payment methods are accepted for visa fees?",
        answer: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, bank transfers, and mobile payment options like M-Pesa for countries where it's available."
      },
      {
        question: "Is the visa fee refundable if my application is rejected?",
        answer: "Visa fees are non-refundable regardless of the application outcome. However, if your application is rejected, you may reapply with corrected documentation without paying an additional fee within 30 days."
      },
      {
        question: "Are there additional fees I should be aware of?",
        answer: "Additional fees may apply for expedited processing ($30), multiple-entry visas (additional 50% of the base fee), visa extensions (50% of the original fee), and special handling requests."
      },
      {
        question: "When do I pay the visa fee?",
        answer: "The visa fee is paid during the application process, after completing the application form and before submitting your application. Your application will only be processed after successful payment."
      },
      {
        question: "Do I need to pay a separate fee for each person when applying as a family?",
        answer: "Yes, each applicant requires a separate visa fee payment, even when applying as a family or group. There are no discounts for group applications."
      }
    ]
  },
  {
    category: "Technical Support",
    items: [
      {
        question: "What should I do if I encounter technical issues during the application process?",
        answer: "If you experience technical difficulties, try refreshing the page or clearing your browser cache. If issues persist, contact our technical support team via email at support@ingomavisaconnect.bi or use the live chat feature on our website during business hours."
      },
      {
        question: "How do I reset my password if I forget it?",
        answer: "Click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you instructions to reset your password. For security reasons, password reset links are valid for 24 hours."
      },
      {
        question: "Can I update my information after submitting my application?",
        answer: "Minor corrections can be made by contacting our support team with your application reference number. However, significant changes may require you to submit a new application."
      },
      {
        question: "What file formats are accepted for document uploads?",
        answer: "We accept documents in PDF, JPG, and PNG formats. Each file should not exceed 2MB in size. Documents must be clear, legible, and complete."
      },
      {
        question: "Is my personal information secure on your platform?",
        answer: "Yes, we utilize industry-standard encryption and security protocols to protect your personal information. Our platform complies with international data protection regulations to ensure your data remains confidential and secure."
      }
    ]
  }
];

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredFAQs(faqData);
    } else {
      const filtered = faqData
        .map(category => ({
          ...category,
          items: category.items.filter(
            item => 
              item.question.toLowerCase().includes(query) || 
              item.answer.toLowerCase().includes(query)
          )
        }))
        .filter(category => category.items.length > 0);
      
      setFilteredFAQs(filtered);
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredFAQs(faqData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about visa applications, requirements, and procedures for traveling to Burundi.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-4 pr-12 py-3 rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {searchQuery && filteredFAQs.length === 0 && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">
                    No FAQs found matching "{searchQuery}". Try a different search term or browse the categories below.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* FAQ Categories */}
          {filteredFAQs.map((category, index) => (
            <div key={index} className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">{category.category}</h2>
              
              <Accordion type="single" collapsible className="border rounded-md overflow-hidden">
                {category.items.map((item, itemIndex) => (
                  <AccordionItem 
                    key={itemIndex} 
                    value={`${category.category}-${itemIndex}`}
                    className="border-b last:border-b-0"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 bg-white text-gray-700">
                      <p>{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
          
          {/* Contact Section */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-8 mt-10 text-center">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              If you couldn't find the answer to your question, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild variant="outline">
                <a href="mailto:support@ingomavisaconnect.bi">Email Support</a>
              </Button>
              <Button asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQs;
