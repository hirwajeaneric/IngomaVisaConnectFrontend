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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { authService } from "@/lib/api/services/auth.service";

// Define the login form schema using Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Setup login mutation using TanStack Query
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => {
      const { email, password } = data;
      return authService.login({ email, password });
    },
    onSuccess: (response) => {
      // Store tokens and user data in localStorage
      if (response.data.token) {
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      toast({
        title: "Login Successful",
        description: "Welcome to the Admin Dashboard",
      });

      // Check user role and redirect accordingly
      const userRole = response.data.user.role;
      if (userRole === 'ADMIN') {
        navigate("/dashboard/overview");
      } else if (userRole === 'OFFICER') {
        navigate("/dashboard/applications");
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive",
        });
        // Clear stored data
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-primary">INGOMA DASHBOARD</h1>
        <p className="text-center text-gray-600 mt-2">Burundi eVisa Portal Administration</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Sign in to dashboard
          </CardDescription>
        </CardHeader>
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...register("rememberMe")}
                />
                <Label htmlFor="rememberMe" className="text-sm">Remember me</Label>
              </div>
              <Link to="/dashboard/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting || loginMutation.isPending}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {isSubmitting || loginMutation.isPending ? "Signing in..." : "Sign In"}
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

export default AdminLogin;
