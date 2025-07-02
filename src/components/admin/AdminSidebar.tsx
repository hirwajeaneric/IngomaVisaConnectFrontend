import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  LogOut, 
  Home,
  Download,
  List,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/api/services/auth.service";
import { useToast } from "@/components/ui/use-toast";
import { User as UserType } from "@/types";

export const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserType | null>(null);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    try {
      authService.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/dashboard/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const navItems = [
    { 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      href: "/dashboard/overview",
      requireAdmin: true,
      requireOfficer: false,
    },
    { 
      label: "Applications", 
      icon: <FileText className="h-5 w-5" />, 
      href: "/dashboard/applications",
      requireAdmin: true,
      requireOfficer: true,
    },
    { 
      label: "Services", 
      icon: <List className="h-5 w-5" />, 
      href: "/dashboard/services",
      requireAdmin: true,
      requireOfficer: false,
    },
    { 
      label: "Messages", 
      icon: <MessageSquare className="h-5 w-5" />, 
      href: "/dashboard/messages",
      requireAdmin: true,
      requireOfficer: true,
    },
    { 
      label: "Interviews", 
      icon: <Calendar className="h-5 w-5" />, 
      href: "/dashboard/interviews",
      requireAdmin: false,
      requireOfficer: true,
    },
    { 
      label: "Payments", 
      icon: <CreditCard className="h-5 w-5" />, 
      href: "/dashboard/payments",
      requireAdmin: true,
      requireOfficer: false,
    },
    { 
      label: "Users", 
      icon: <Users className="h-5 w-5" />, 
      href: "/dashboard/users",
      requireAdmin: true,
      requireOfficer: false,
    },
    { 
      label: "Reports", 
      icon: <Download className="h-5 w-5" />, 
      href: "/dashboard/reports",
      requireAdmin: true,
      requireOfficer: false,
    },
    { 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" />, 
      href: "/dashboard/settings",
      requireAdmin: false,
      requireOfficer: false,
    },
    { 
      label: "Profile", 
      icon: <User className="h-5 w-5" />, 
      href: "/dashboard/profile",
      requireAdmin: true,
      requireOfficer: true,
    },
  ];

  return (
    <aside 
      className={cn(
        "bg-[#CE1126] text-white transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-primary-foreground/10",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center">
            <span className="font-bold text-xl">INGOMA ADMIN</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-white hover:bg-primary-foreground/10"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          )}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            user?.role === 'ADMIN' && item.requireAdmin && !item.requireOfficer ? (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center py-2 px-3 rounded-md transition-colors",
                  isActive 
                  ? "bg-[#1EB53A] text-white font-medium" 
                  : "text-white/80 hover:bg-primary-foreground/10",
                  collapsed ? "justify-center" : ""
                )}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            ) : user?.role === 'OFFICER' && item.requireOfficer && ! item.requireAdmin ? (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center py-2 px-3 rounded-md transition-colors",
                  isActive 
                  ? "bg-[#1EB53A] text-white font-medium"   
                  : "text-white/80 hover:bg-primary-foreground/10",
                  collapsed ? "justify-center" : ""
                )}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            ) : user?.role === 'ADMIN' && item.requireAdmin && item.requireOfficer ? (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center py-2 px-3 rounded-md transition-colors",
                isActive 
                  ? "bg-[#1EB53A] text-white font-medium" 
                  : "text-white/80 hover:bg-primary-foreground/10",
                collapsed ? "justify-center" : ""
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </NavLink>
            ) : user?.role === 'OFFICER' && item.requireOfficer && item.requireAdmin ? (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center py-2 px-3 rounded-md transition-colors",
                  isActive 
                  ? "bg-[#1EB53A] text-white font-medium" 
                  : "text-white/80 hover:bg-primary-foreground/10",
                  collapsed ? "justify-center" : ""
                )}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            ) : null
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-primary-foreground/10">
        <NavLink
          to="/"
          className="flex items-center py-2 px-3 rounded-md text-white/80 hover:bg-primary-foreground/10 transition-colors"
        >
          <Home className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Public Site</span>}
        </NavLink>
        <Button
          variant="ghost"
          className={cn(
            "w-full mt-2 text-white/80 hover:bg-primary-foreground/10 hover:text-white flex items-center",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};
