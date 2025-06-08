import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { authService } from "@/lib/api/services/auth.service";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface RequestPasswordResetForm {
  email: string;
}

const RequestPasswordReset = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RequestPasswordResetForm>();

  const requestResetMutation = useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
    onSuccess: () => {
      toast.success("Password reset instructions have been sent to your email");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to request password reset");
    },
  });

  const onSubmit = (data: RequestPasswordResetForm) => {
    requestResetMutation.mutate(data.email);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Reset Your Password
                </h2>
                <p className="text-gray-600 mt-2">
                  Enter your email address and we'll send you instructions to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={requestResetMutation.isPending}
                >
                  {requestResetMutation.isPending ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RequestPasswordReset; 