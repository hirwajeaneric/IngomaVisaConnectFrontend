import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { authService } from "@/lib/api/services/auth.service";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // Countdown effect for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.verifyOTP(email!, otp);
      toast.success("Email verified successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email || resendDisabled) return;

    try {
      setResendLoading(true);
      await authService.resendOTP(email);
      toast.success("New OTP has been sent to your email");
      
      // Start countdown (60 seconds)
      setCountdown(60);
      setResendDisabled(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Verify Your Email
        </h2>
        <p className="text-gray-600 mt-2">
          Please enter the OTP sent to your email address
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">OTP Code</Label>
          <Input
            id="otp"
            name="otp"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            pattern="[0-9]{6}"
            title="Please enter a 6-digit code"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90" 
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Didn't receive the code?{" "}
          <button 
            onClick={handleResendOTP}
            className={`text-primary hover:underline font-medium ${resendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={resendDisabled || resendLoading}
          >
            {resendLoading 
              ? "Sending..." 
              : resendDisabled 
                ? `Resend OTP (${countdown}s)` 
                : "Resend OTP"
            }
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerification; 