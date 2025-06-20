import React, { useState, useCallback, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User, userService } from "@/lib/api/services/user.service";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data as unknown as User[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Add new user
  const addUser = async (formData: FormData) => {
    try {
      await userService.createOfficer({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        department: formData.get('department') as string,
        title: formData.get('title') as string,
      });
      
      toast({
        title: "Success",
        description: "User created successfully",
      });
      
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback>{row.original.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const roleStyles = {
          ADMIN: 'bg-primary',
          OFFICER: 'bg-secondary',
          APPLICANT: 'bg-blue-500'
        };
        
        const roleLabels = {
          ADMIN: 'Administrator',
          OFFICER: 'Officer',
          APPLICANT: 'Applicant'
        };

        return (
          <Badge className={roleStyles[row.original.role as keyof typeof roleStyles]}>
            {roleLabels[row.original.role as keyof typeof roleLabels]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "outline"} className={
          row.original.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return value === (row.original.isActive ? "active" : "inactive");
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
  ];

  if (loading) {
    return (
      <AdminLayout title="Loading..." subtitle="Please wait while we fetch the users">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="User Management" 
      subtitle="Manage system users and permissions"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">System Users</h2>
            <p className="text-gray-500">
              Showing {users.length} users
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90">
                <UserPlus className="mr-1 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account in the system.
                </DialogDescription>
              </DialogHeader>
              
              <form className="space-y-4 py-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                addUser(formData);
                (e.target as HTMLFormElement).reset();
                (document.querySelector('[data-dialog-close]') as HTMLElement)?.click();
              }}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" name="department" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" name="title" required />
                </div>
                
                <DialogFooter className="mt-4">
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>
              Manage and monitor system users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={users}
              searchKey="name"
              searchPlaceholder="Search users..."
              filterableColumns={[
                {
                  id: "active",
                  title: "Status",
                  options: [
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ],
                },
                {
                  id: "role",
                  title: "Role",
                  options: [
                    { label: "Administrator", value: "ADMIN" },
                    { label: "Officer", value: "OFFICER" },
                  ],
                },
              ]}
              onRowClick={(row) => navigate(`/dashboard/users/${row.id}`)}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
