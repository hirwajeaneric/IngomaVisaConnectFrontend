import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { visaTypeService, VisaType } from "@/lib/api/services/visatype.service";
import { useToast } from "@/components/ui/use-toast";

const VisaTypes = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);

  useEffect(() => {
    const fetchVisaTypes = async () => {
      try {
        const response = await visaTypeService.getAllVisaTypes();
        // Only show active visa types
        const activeVisas = response.data.filter(visa => visa.isActive);
        setVisaTypes(activeVisas);
        // Delete visa application data from the localstorage
        localStorage.removeItem('current_application_id');
        localStorage.removeItem('selected_visa_type_id');
        localStorage.removeItem('current_payment_id');
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
        title="Visa Types for Burundi"
        description="Explore all types of visas available for travel to Burundi including tourist, business, student and transit visas."
        keywords="Burundi visa types, tourist visa, business visa, student visa, work visa, transit visa"
      />
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">Visa Types</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the different types of visas available for traveling to Burundi. Each visa type has specific requirements and is designed for different purposes of travel.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visaTypes.map((visa) => (
                <Card key={visa.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <AspectRatio ratio={16/9} className="bg-muted">
                    <img 
                      src={visa.coverImage || 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?auto=format&fit=crop&w=800&q=80'} 
                      alt={visa.name} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <CardHeader>
                    <CardTitle>{visa.name}</CardTitle>
                    <CardDescription>Duration: {visa.duration} | Price: ${visa.price}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{visa.description}</p>
                    <p className="text-sm text-gray-500 mb-1">Processing Time: {visa.processingTime}</p>
                    <div className="mt-4">
                      <Link to={`/apply-visa?type=${visa.slug}&typeId=${visa.id}`}>
                        <Button className="w-full">Apply Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VisaTypes;
