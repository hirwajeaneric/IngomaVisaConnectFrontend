
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop')" }}
      ></div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Apply for Your Burundi Visa Online
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            A secure, efficient and user-friendly platform to apply for your Burundi visa from anywhere in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/visa-types">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-base md:text-lg font-semibold">
                Apply Now
              </Button>
            </Link>
            <Link to="/visa-types">
              <Button variant="outline" className="border-white text-white bg-white/10 hover:bg-white hover:text-primary px-8 py-6 text-base md:text-lg font-semibold">
                Explore Visa Types
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold mb-1">48 Hours</div>
              <div className="text-sm opacity-80">Average Processing Time</div>
            </div>
            <div className="p-4 border-y md:border-y-0 md:border-x border-white/20">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm opacity-80">Online Application</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-80">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
