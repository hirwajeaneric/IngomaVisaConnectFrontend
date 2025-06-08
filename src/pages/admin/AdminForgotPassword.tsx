import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail, ArrowLeft } from "lucide-react";
import { authService } from "@/lib/api/services/auth.service";

// Define the forgot password form schema using Zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  // Setup password reset request mutation using TanStack Query
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) => authService.requestPasswordReset(data.email),
    onSuccess: () => {
      toast({
        title: "Reset Link Sent",
        description: "If your email is in our system, you will receive a password reset link shortly.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
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
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {resetPasswordMutation.isSuccess 
              ? "We've sent you an email with instructions" 
              : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>
        
        {!resetPasswordMutation.isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@gov.bi" 
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting || resetPasswordMutation.isPending}
              >
                <Mail className="mr-2 h-4 w-4" />
                {isSubmitting || resetPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
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
        ) : (
          <CardContent className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-green-800">
                We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => resetPasswordMutation.reset()}
              >
                Try with different email
              </Button>
              
              <Button
                className="w-full"
                onClick={() => navigate("/dashboard/login")}
              >
                Return to Login
              </Button>
            </div>
          </CardContent>
        )}
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

export default AdminForgotPassword;
