
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText } from "lucide-react";

const Requirements = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">Visa Requirements</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Learn about the documentation and requirements needed for successful visa applications to Burundi. 
              Proper preparation ensures a smooth application process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="passport">
                    <AccordionTrigger>Valid Passport</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Must be valid for at least 6 months beyond your planned stay</li>
                        <li>Contains at least two blank visa pages</li>
                        <li>Copy of bio-data page required</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="photo">
                    <AccordionTrigger>Passport-sized Photographs</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Two recent (taken within the last 6 months) color photographs</li>
                        <li>Size: 45mm x 35mm with white background</li>
                        <li>Full face view with neutral expression</li>
                        <li>No glasses, hats, or head coverings (except for religious purposes)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="application">
                    <AccordionTrigger>Completed Application Form</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Fill out all sections of the application form correctly</li>
                        <li>Sign and date the form as required</li>
                        <li>Ensure all information matches your supporting documents</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="travel">
                    <AccordionTrigger>Travel Itinerary</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Round-trip flight reservation/confirmation</li>
                        <li>Detailed travel plans within Burundi</li>
                        <li>Accommodation bookings for the entire stay</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="financial">
                    <AccordionTrigger>Financial Documents</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Bank statements from the last 3 months</li>
                        <li>Proof of employment or business ownership</li>
                        <li>Sponsorship letter (if applicable)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="purpose">
                    <AccordionTrigger>Purpose of Visit Documentation</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Tourist:</strong> Hotel reservations, tour bookings</li>
                        <li><strong>Business:</strong> Invitation from Burundian company, business activities details</li>
                        <li><strong>Work:</strong> Employment contract, work permit</li>
                        <li><strong>Student:</strong> Acceptance letter from educational institution</li>
                        <li><strong>Transit:</strong> Visa for destination country, onward travel tickets</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <div className="col-span-1">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>General Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Valid passport with minimum 6 months validity",
                      "Completed visa application form",
                      "Passport-sized photographs",
                      "Proof of sufficient funds",
                      "Return/onward ticket",
                      "Accommodation details",
                      "Visa fee payment receipt"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Health Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Yellow fever vaccination certificate",
                      "COVID-19 negative test result (taken within 72 hours before arrival)",
                      "Medical insurance covering your stay in Burundi",
                      "Medical declaration form"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Requirements;
