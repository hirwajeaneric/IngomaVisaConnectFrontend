
import { CheckCircle, Clock, Globe, ShieldCheck } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Apply From Anywhere",
      description: "Submit your application from anywhere in the world, 24/7, with our user-friendly online platform."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Fast Processing",
      description: "Most visa applications are processed within 48 hours, ensuring quick turnaround for your travel plans."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Easy Tracking",
      description: "Track the status of your visa application in real-time through your personal dashboard."
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Secure & Confidential",
      description: "Your personal information and documents are encrypted and protected with industry-standard security."
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose INGOMA VISA CONNECT?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform is designed to simplify the visa application process, providing a seamless experience from application to approval.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg card-shadow flex flex-col items-center text-center">
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop" 
                  alt="Burundi Wildlife" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-4">Discover Burundi's Natural Beauty</h3>
                <p className="text-white/90 mb-6">
                  From the stunning shores of Lake Tanganyika to the vibrant culture and warm hospitality, Burundi offers unique experiences for tourists, business travelers, and more.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 px-4 py-2 rounded-full text-white text-sm">Tourism</div>
                  <div className="bg-white/10 px-4 py-2 rounded-full text-white text-sm">Business</div>
                  <div className="bg-white/10 px-4 py-2 rounded-full text-white text-sm">Cultural Exchange</div>
                  <div className="bg-white/10 px-4 py-2 rounded-full text-white text-sm">Research</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
