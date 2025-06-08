import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { visaTypeService, VisaType } from "@/lib/api/services/visatype.service";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);

  useEffect(() => {
    const fetchVisaTypes = async () => {
      try {
        const response = await visaTypeService.getAllVisaTypes();
        // Only show active visa types and limit to 3 for the homepage
        const activeVisas = response.data
          .filter(visa => visa.isActive)
          .slice(0, 3);
        setVisaTypes(activeVisas);
      } catch (error) {
        console.error('Failed to fetch visa types:', error);
        toast({
          title: "Error",
          description: "Failed to load visa types. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVisaTypes();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Official Burundi eVisa Portal"
        description="Apply online for your Burundi visa. Fast, secure and easy application process with 24/7 support."
        keywords="Burundi visa, eVisa, online visa application, Africa travel, Burundi immigration"
      />
      <Navbar />
      <Hero />
      <Features />
      
      {/* How It Works Section */}
      <section className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes applying for a Burundi visa simple and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#CE1126] rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Register & Apply</h3>
              <p className="text-gray-600">Create an account, fill out the application form, and upload your documents.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#CE1126] rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Pay & Submit</h3>
              <p className="text-gray-600">Pay the visa fee securely online and submit your application for processing.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#CE1126] rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Track & Receive</h3>
              <p className="text-gray-600">Track your application status and receive your e-visa or approval letter.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/apply-visa">
              <Button className="bg-[#CE1126] hover:bg-[#CE1126]/90">Start Your Application</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Visa Types Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Popular Visa Types</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the right visa that suits your travel purpose to Burundi.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {visaTypes.map((visa) => (
                  <div key={visa.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden card-shadow">
                    <div className="w-full">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={visa.coverImage || 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?auto=format&fit=crop&w=600&q=80'} 
                          alt={visa.name}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#CE1126] mb-2">{visa.name}</h3>
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-medium">{visa.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Processing</p>
                          <p className="font-medium">{visa.processingTime}</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 my-4 pt-4">
                        <p className="text-2xl font-bold mb-4">${visa.price}</p>
                        <ul className="space-y-2 mb-6">
                          {visa.requirements.slice(0, 3).map((requirement, i) => (
                            <li key={i} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-[#1EB53A] mr-2" />
                              <span className="text-gray-600 text-sm">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                        <Link to={`/apply-visa?type=${visa.slug}&typeId=${visa.id}`}>
                          <Button variant="outline" className="w-full border-[#CE1126] text-[#CE1126] hover:bg-[#CE1126] hover:text-white">Apply Now</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Link to="/visa-types" className="text-[#CE1126] hover:underline font-medium">
                  View All Visa Types →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Thousands of travelers have successfully obtained their visas through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg card-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">Tourist from USA</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The process was incredibly smooth. I got my tourist visa within 24 hours, and the tracking system kept me updated throughout the process."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg card-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="font-medium">MS</span>
                </div>
                <div>
                  <p className="font-medium">Maria Silva</p>
                  <p className="text-sm text-gray-500">Business Traveler from Brazil</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As a frequent business traveler to Burundi, the multiple-entry visa option has made my trips much more convenient. Excellent service!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg card-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="font-medium">AK</span>
                </div>
                <div>
                  <p className="font-medium">Ahmed Khan</p>
                  <p className="text-sm text-gray-500">Student from Malaysia</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The customer support team was extremely helpful when I had questions about my student visa. Clear instructions and fast approval."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#CE1126] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Visit Burundi?</h2>
          <p className="max-w-2xl mx-auto mb-8 opacity-90">
            Apply for your visa today and start planning your journey to the heart of Africa.
          </p>
          <Link to="/apply-visa">
            <Button className="bg-white text-[#CE1126] hover:bg-gray-100 px-8 py-6 text-base font-semibold">
              Start Your Application
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
