
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const commonFaqs = [
  {
    question: "What types of visas are available for Burundi?",
    answer: "Burundi offers several visa types including Tourist, Business, Work, Student, and Transit visas. Each visa type has specific requirements and is designed for different purposes of travel."
  },
  {
    question: "How long does the visa application process take?",
    answer: "Processing times vary by visa type: Tourist visa (3-5 business days), Business visa (5-7 business days), Work visa (10-15 business days), Student visa (7-10 business days), and Transit visa (2-3 business days)."
  },
  {
    question: "What documents are required for a visa application?",
    answer: "The basic documents required include a valid passport with at least 6 months validity, recent passport-sized photographs, proof of accommodation in Burundi, proof of travel arrangements, and proof of sufficient funds."
  },
  {
    question: "How much does a visa cost?",
    answer: "Visa fees vary by type: Tourist ($50), Business ($100), Work ($200), Student ($75), and Transit ($30). Additional fees may apply for expedited processing or multiple entries."
  },
  {
    question: "Can I extend my visa while in Burundi?",
    answer: "Yes, most visas can be extended while in Burundi. You'll need to apply at the Immigration Office at least 7 days before your visa expires. Extensions typically cost 50% of the original visa fee."
  }
];

const FaqSection = () => {
  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions about visa applications for Burundi.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="border rounded-md overflow-hidden">
            {commonFaqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className="border-b last:border-b-0"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white text-gray-700">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-10">
            <Link to="/faqs">
              <Button variant="outline" className="border-[#CE1126] text-[#CE1126] hover:bg-[#CE1126] hover:text-white">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
