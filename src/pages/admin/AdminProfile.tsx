import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lock, User, Bell, Mail, Edit, Key, Calendar, Clock, KeyRound, Settings, Shield, LogOut, Upload, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { userService, UserProfile, UpdateProfileData } from "@/lib/api/services/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { storage } from "@/configs/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// Define the profile update schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  department: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: userService.getProfile,
  });

  // Initialize form with React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.data.name || "",
      email: profile?.data.email || "",
      phone: profile?.data.phone || "",
      department: profile?.data.department || "",
    },
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile?.data) {
      reset({
        name: profile.data.name,
        email: profile.data.email,
        phone: profile.data.phone,
        department: profile.data.department,
      });
    }
  }, [profile, reset]);

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: (response) => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      localStorage.setItem("user", JSON.stringify(response.data));
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Avatar update mutation
  const updateAvatarMutation = useMutation({
    mutationFn: (data: { avatarUrl: string }) => userService.updateAvatar(data),
    onSuccess: (response) => {
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });
      localStorage.setItem("user",JSON.stringify(response.data));
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileUpdate = async (data: ProfileFormData) => {
    const updateData: UpdateProfileData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department,
    };
    updateProfileMutation.mutate(updateData);
  };

  const uploadToFirebase = async (file: File): Promise<string> => {
    if (!file) throw new Error("No file selected");

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    // Reset the file input
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleAvatarChange = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const avatarUrl = await uploadToFirebase(selectedImage);
      updateAvatarMutation.mutate({ avatarUrl });
      clearSelectedImage();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    applicationUpdates: true,
    systemAlerts: true,
    messageNotifications: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="My Profile" subtitle="Loading profile information...">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="My Profile" subtitle="Manage your account settings and preferences">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side - Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={previewUrl || profile?.data.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {profile?.data.name
                        ?.split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase() || 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 flex space-x-2">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="bg-primary text-white p-2 rounded-full">
                        <Upload className="h-4 w-4" />
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                        disabled={isUploading}
                        aria-label="Upload profile picture"
                      />
                    </label>
                    {selectedImage && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAvatarChange}
                          disabled={isUploading}
                          className="rounded-full p-2"
                        >
                          {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearSelectedImage}
                          disabled={isUploading}
                          className="rounded-full p-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {selectedImage && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {selectedImage.name}
                  </p>
                )}
                
                {isUploading && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Uploading: {uploadProgress}%
                    </p>
                  </div>
                )}

                <h2 className="text-xl font-bold">{profile?.data.name}</h2>
                <p className="text-muted-foreground text-sm">{profile?.data.title}</p>
                
                <Badge className="mt-2 bg-secondary" variant="secondary">
                  {profile?.data.role}
                </Badge>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{profile?.data.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    {profile?.data.phone ? <p className="text-sm">{profile?.data.phone}</p> : <p className="text-sm">Undefined</p>}
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    {profile?.data.department ? <p className="text-sm">{profile?.data.department}</p>: <p className="text-sm">Undefined</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Side - Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          {...register("name")}
                          aria-invalid={errors.name ? "true" : "false"}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          {...register("email")}
                          aria-invalid={errors.email ? "true" : "false"}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          {...register("phone")}
                          placeholder="Provide phone number"
                          aria-invalid={errors.phone ? "true" : "false"}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input 
                          id="department" 
                          {...register("department")}
                          placeholder="Provide your department"
                          aria-invalid={errors.department ? "true" : "false"}
                        />
                        {errors.department && (
                          <p className="text-sm text-red-500">{errors.department.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => reset()}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSubmitting || updateProfileMutation.isPending}
                      >
                        {isSubmitting || updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Update your password and security preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Receive a security code via email
                          </p>
                        </div>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Receive a security code via SMS
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Update Security Settings</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Login Sessions</CardTitle>
                  <CardDescription>Manage your active sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md flex flex-col sm:flex-row justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Key className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">
                            Bujumbura, Burundi • Chrome on Windows
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Started 2 hours ago
                          </p>
                        </div>
                      </div>
                      <Badge className="mt-3 sm:mt-0">Current</Badge>
                    </div>
                    
                    <div className="p-4 border rounded-md flex flex-col sm:flex-row justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                          <Key className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Mobile Session</p>
                          <p className="text-sm text-muted-foreground">
                            Bujumbura, Burundi • Safari on iPhone
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last active 1 day ago
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-3 sm:mt-0">
                        Log Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.emailNotifications}
                          onCheckedChange={() => handleNotificationChange('emailNotifications')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Application Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Notifications for visa application updates
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.applicationUpdates}
                          onCheckedChange={() => handleNotificationChange('applicationUpdates')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">System Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Important system notifications and alerts
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.systemAlerts}
                          onCheckedChange={() => handleNotificationChange('systemAlerts')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Message Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Notifications for new messages from applicants
                          </p>
                        </div>
                        <Switch 
                          checked={notifications.messageNotifications}
                          onCheckedChange={() => handleNotificationChange('messageNotifications')}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Communication Channels</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="email-channel" defaultChecked title="Email" />
                          <Label htmlFor="email-channel">Email</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="sms-channel" defaultChecked title="SMS" />
                          <Label htmlFor="sms-channel">SMS</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="webapp-channel" defaultChecked title="Web App" />
                          <Label htmlFor="webapp-channel">Web App</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Permissions Tab */}
            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle>User Permissions</CardTitle>
                  <CardDescription>Your role and access permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Role: {profile?.data.role}</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile?.data.permissions.map((permission, index) => (
                          <Badge key={index} variant="secondary">
                            {permission.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
