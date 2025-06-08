import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { authService } from "@/lib/api/services/auth.service";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface ConfirmPasswordResetForm {
  newPassword: string;
  confirmPassword: string;
}

const ConfirmPasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ConfirmPasswordResetForm>();
  const newPassword = watch("newPassword");

  const confirmResetMutation = useMutation({
    mutationFn: (data: ConfirmPasswordResetForm) =>
      authService.confirmPasswordReset(token!, data.newPassword),
    onSuccess: () => {
      toast.success("Password has been reset successfully");
      navigate("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });

  const onSubmit = (data: ConfirmPasswordResetForm) => {
    confirmResetMutation.mutate(data);
  };

  if (!token) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Invalid Reset Link</h2>
          <p className="text-gray-600 mt-2">
            This password reset link is invalid or has expired.
          </p>
          <Button
            onClick={() => navigate("/forgot-password")}
            className="mt-4"
          >
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Set New Password
                </h2>
                <p className="text-gray-600 mt-2">
                  Please enter your new password
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                      },
                    })}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: value =>
                        value === newPassword || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={confirmResetMutation.isPending}
                >
                  {confirmResetMutation.isPending ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConfirmPasswordReset; 