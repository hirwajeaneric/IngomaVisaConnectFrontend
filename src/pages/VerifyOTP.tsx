import { useSearchParams } from "react-router-dom";
import OTPVerification from "@/components/OTPVerification";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center">
            <OTPVerification />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyOTP; 