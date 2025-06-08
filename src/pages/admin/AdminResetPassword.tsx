import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Lock, ArrowLeft, Check, X } from "lucide-react";
import { authService } from "@/lib/api/services/auth.service";

// Define the password requirements
const passwordRequirements = {
  length: { label: 'At least 8 characters', regex: /.{8,}/ },
  capital: { label: 'At least 1 uppercase letter', regex: /[A-Z]/ },
  lowercase: { label: 'At least 1 lowercase letter', regex: /[a-z]/ },
  number: { label: 'At least 1 number', regex: /[0-9]/ },
  special: { label: 'At least 1 special character', regex: /[^A-Za-z0-9]/ }
};

// Define the reset password form schema using Zod
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const AdminResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  // Check password requirements
  const requirements = Object.entries(passwordRequirements).map(([id, { label, regex }]) => ({
    id,
    label,
    met: regex.test(password),
  }));

  // Setup password reset mutation using TanStack Query
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) => 
      authService.confirmPasswordReset(token!, data.password),
    onSuccess: () => {
      toast({
        title: "Password Reset Successfully",
        description: "You can now log in with your new password.",
      });
      navigate("/dashboard/login");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-primary">INGOMA DASHBOARD</h1>
        <p className="text-center text-gray-600 mt-2">Burundi eVisa Portal Administration</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set New Password</CardTitle>
          <CardDescription>
            Create a strong password for your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  {...register("confirmPassword")}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-full"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Password Requirements</Label>
              <div className="space-y-2 mt-2">
                {requirements.map((req) => (
                  <div key={req.id} className="flex items-center">
                    {req.met ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className={req.met ? "text-green-700" : "text-gray-600"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting || resetPasswordMutation.isPending}
            >
              <Lock className="mr-2 h-4 w-4" />
              {isSubmitting || resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/dashboard/login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          &copy; {new Date().getFullYear()} Republic of Burundi Immigration Department
        </p>
        <div className="mt-2">
          <Link to="/" className="text-primary hover:underline">
            Return to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
