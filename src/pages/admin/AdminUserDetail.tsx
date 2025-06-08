/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, userService } from "@/lib/api/services/user.service";
import { UserRound, Shield, Calendar, Clock, Key, Lock, LogIn, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  // Mock activity logs (since they're not in the API yet)
  const activityLogs = [
    { id: "log-1", action: "Logged in", date: "2025-05-15 09:15:22", ipAddress: "192.168.1.1" },
    { id: "log-2", action: "Approved visa application APP-1254", date: "2025-05-14 16:42:10", ipAddress: "192.168.1.1" },
    { id: "log-3", action: "Modified system settings", date: "2025-05-14 14:30:05", ipAddress: "192.168.1.1" },
    { id: "log-4", action: "Sent message to applicant", date: "2025-05-13 11:20:33", ipAddress: "192.168.1.1" },
    { id: "log-5", action: "Logged in", date: "2025-05-13 09:05:17", ipAddress: "192.168.1.1" }
  ];
  
  // All available permissions
  const availablePermissions = {
    applications: [
      { id: "APPLICATIONS_VIEW_APPLICATIONS", label: "View Applications" },
      { id: "APPLICATIONS_MANAGE_APPLICATIONS", label: "Manage Applications" },
      { id: "APPLICATIONS_APPROVE_VISAS", label: "Approve Visas" },
      { id: "APPLICATIONS_REJECT_VISAS", label: "Reject Visas" }
    ],
    users: [
      { id: "USERS_VIEW_USERS", label: "View Users" },
      { id: "USERS_MANAGE_USERS", label: "Manage Users" },
      { id: "USERS_CREATE_ADMIN", label: "Create Administrators" }
    ],
    system: [
      { id: "SYSTEM_VIEW_REPORTS", label: "View Reports" },
      { id: "SYSTEM_MANAGE_SYSTEM", label: "Manage System Settings" },
      { id: "SYSTEM_VIEW_LOGS", label: "View Audit Logs" }
    ],
    interviews: [
      { id: "INTERVIEWS_SCHEDULE_INTERVIEWS", label: "Schedule Interviews" },
      { id: "INTERVIEWS_CONDUCT_INTERVIEWS", label: "Conduct Interviews" }
    ],
    payments: [
      { id: "PAYMENTS_VIEW_PAYMENTS", label: "View Payments" },
      { id: "PAYMENTS_PROCESS_REFUNDS", label: "Process Refunds" }
    ]
  };

  const fetchUser = useCallback(async () => {
    if (!id) return;
    try {
      const response = await userService.getUserById(id);
      setUser(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive",
      });
      navigate("/dashboard/users");
    } finally {
      setLoading(false);
    }
  }, [id, toast, navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  // Toggle user activation status
  const toggleActivation = async () => {
    if (!user) return;
    try {
      await userService.updateUser(user.id, {
        name: user.name,
        email: user.email,
        department: user.department,
        title: user.title,
        phone: user.phone,
        isActive: !user.isActive
      });
      
      setUser({
        ...user,
        isActive: !user.isActive
      });
      
      toast({
        title: user.isActive ? "User Deactivated" : "User Activated",
        description: `${user.name} has been ${user.isActive ? "deactivated" : "activated"}.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };
  
  // Toggle a permission
  const togglePermission = async (permissionId: string) => {
    if (!user) return;
    
    const newPermissions = user.permissions.includes(permissionId)
      ? user.permissions.filter(p => p !== permissionId)
      : [...user.permissions, permissionId];
    
    try {
      if (user.role === 'OFFICER') {
        await userService.updateOfficerPermissions(user.id, newPermissions);
      } else {
        await userService.updateUser(user.id, { permissions: newPermissions });
      }
      
      setUser({
        ...user,
        permissions: newPermissions
      });
      
      toast({
        title: "Permissions Updated",
        description: "User permissions have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    }
  };
  
  // Reset password (this would typically send a reset link)
  const resetPassword = () => {
    toast({
      title: "Password Reset Link Sent",
      description: `A password reset link has been sent to ${user?.email}.`
    });
  };
  
  // Save user changes
  const saveChanges = async (formData: FormData) => {
    if (!user) return;
    
    try {
      await userService.updateUser(user.id, {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        department: formData.get('department') as string,
        title: formData.get('title') as string,
        phone: formData.get('phone') as string,
      });
      
      toast({
        title: "Changes Saved",
        description: `User profile for ${user.name} has been updated.`
      });
      
      fetchUser();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user profile",
        variant: "destructive",
      });
    }
  };

  // Delete user
  const deleteUser = async () => {
    if (!user) return;
    
    try {
      await userService.deleteUser(user.id);
      toast({
        title: "User Deleted",
        description: `${user.name}'s account has been deleted.`,
        variant: "destructive"
      });
      navigate("/dashboard/users");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  if (loading || !user) {
    return (
      <AdminLayout title="Loading..." subtitle="Please wait while we fetch the user details">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="User Details" 
      subtitle="Manage user information and permissions"
    >
      <div className="flex justify-between items-center mb-6">
        <div></div> {/* Spacer */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard/users")}>
            Back to Users
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete User</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user account and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteUser}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription className="flex flex-col items-center">
              <span>{user.email}</span>
              <Badge 
                className={user.role === 'ADMIN' ? 'bg-primary' : user.role === 'APPLICANT' ? 'bg-blue-500' : 'bg-secondary'}
              >
                {user.role === 'ADMIN' ? 'Administrator' : user.role === 'APPLICANT' ? 'Applicant' : 'Immigration Officer'}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-muted-foreground text-sm">Department</p>
                <p className="font-medium">{user.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Title</p>
                <p className="font-medium">{user.title}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-muted-foreground text-sm">Status</p>
                <div className="flex justify-center mt-1">
                  <Badge variant={user.isActive ? "default" : "outline"} className={
                    user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Member Since</p>
                <p className="font-medium">{user.createdAt}</p>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col gap-2">
              <Button onClick={toggleActivation} variant="outline" className="w-full">
                {user.isActive ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Deactivate Account
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Activate Account
                  </>
                )}
              </Button>
              
              <Button onClick={resetPassword} variant="outline" className="w-full">
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
              
              <Button variant="outline" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Login as User
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <UserRound className="mr-2 h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update user's profile details</CardDescription>
                </CardHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  saveChanges(formData);
                }}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" defaultValue={user.name} required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" defaultValue={user.email} required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" defaultValue={user.phone || ''} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" name="department" defaultValue={user.department || ''} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input id="title" name="title" defaultValue={user.title || ''} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate("/dashboard/users")}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            {/* Permissions Tab */}
            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-primary" />
                    User Permissions
                  </CardTitle>
                  <CardDescription>Manage user's access rights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Application Management</h3>
                    <Separator className="mb-4" />
                    {availablePermissions.applications.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2 mb-2">
                        <Checkbox 
                          id={permission.id} 
                          checked={user.permissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label htmlFor={permission.id}>{permission.label}</Label>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">User Management</h3>
                    <Separator className="mb-4" />
                    {availablePermissions.users.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2 mb-2">
                        <Checkbox 
                          id={permission.id} 
                          checked={user.permissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label htmlFor={permission.id}>{permission.label}</Label>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">System Management</h3>
                    <Separator className="mb-4" />
                    {availablePermissions.system.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2 mb-2">
                        <Checkbox 
                          id={permission.id} 
                          checked={user.permissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label htmlFor={permission.id}>{permission.label}</Label>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Interview Management</h3>
                    <Separator className="mb-4" />
                    {availablePermissions.interviews.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2 mb-2">
                        <Checkbox 
                          id={permission.id} 
                          checked={user.permissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label htmlFor={permission.id}>{permission.label}</Label>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Payment Management</h3>
                    <Separator className="mb-4" />
                    {availablePermissions.payments.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2 mb-2">
                        <Checkbox 
                          id={permission.id} 
                          checked={user.permissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label htmlFor={permission.id}>{permission.label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    Activity Log
                  </CardTitle>
                  <CardDescription>Recent user activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.date}</TableCell>
                          <TableCell>{log.ipAddress}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Full Activity Log
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetail;
