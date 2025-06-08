import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Save, Shield, Globe, Mail, Bell, Lock, Database, FileText } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();

  const handleSave = (section: string) => {
    toast({
      title: "Settings saved",
      description: `Your ${section} settings have been saved successfully.`,
    });
  };

  return (
    <AdminLayout 
      title="Settings" 
      subtitle="Configure system settings and preferences"
    >
      <SEO 
        title="Admin Settings"
        description="Manage system settings for the Burundi eVisa Portal administration panel."
        keywords="admin settings, visa management, system configuration"
      />
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="backup">Backup & Logs</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Globe className="mr-2 h-5 w-5 text-primary" />
                General Settings
              </CardTitle>
              <CardDescription>Configure general system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">System Name</Label>
                  <Input id="site-name" defaultValue="Burundi eVisa Portal" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" defaultValue="immigration@gov.bi" type="email" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Support Phone Number</Label>
                  <Input id="support-phone" defaultValue="+257 22 22 34 54" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="africa-bujumbura">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa-bujumbura">Africa/Bujumbura (GMT+2)</SelectItem>
                      <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT+1)</SelectItem>
                      <SelectItem value="america-new_york">America/New York (GMT-4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="rn">Kirundi</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, the public site will show a maintenance message
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
              </div>
              
              <Button onClick={() => handleSave("general")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch id="two-factor" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="password-expiry">Password Expiry</Label>
                    <p className="text-sm text-muted-foreground">
                      Force password reset every 90 days
                    </p>
                  </div>
                  <Switch id="password-expiry" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
                
                <div className="space-y-2">
                  <Label>Failed Login Attempts</Label>
                  <RadioGroup defaultValue="3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="attempts-3" />
                      <Label htmlFor="attempts-3">Lock after 3 attempts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="attempts-5" />
                      <Label htmlFor="attempts-5">Lock after 5 attempts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10" id="attempts-10" />
                      <Label htmlFor="attempts-10">Lock after 10 attempts</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <Button onClick={() => handleSave("security")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-application">New Applications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new visa applications are submitted
                    </p>
                  </div>
                  <Switch id="new-application" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="payment-received">Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when payments are received
                    </p>
                  </div>
                  <Switch id="payment-received" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="document-upload">Document Uploads</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when applicants upload new documents
                    </p>
                  </div>
                  <Switch id="document-upload" />
                </div>
                
                <h3 className="font-medium pt-4">System Notifications</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-updates">System Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about system updates and maintenance
                    </p>
                  </div>
                  <Switch id="system-updates" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security-alerts">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about security-related events
                    </p>
                  </div>
                  <Switch id="security-alerts" defaultChecked />
                </div>
              </div>
              
              <Button onClick={() => handleSave("notification")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Database className="mr-2 h-5 w-5 text-primary" />
                System Settings
              </CardTitle>
              <CardDescription>Configure system operations and parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visa-processing">Default Visa Processing Time (days)</Label>
                  <Input id="visa-processing" type="number" defaultValue="5" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="auto-approval">Auto-Approval Criteria</Label>
                  <Select defaultValue="none">
                    <SelectTrigger id="auto-approval">
                      <SelectValue placeholder="Select criteria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Manual approval only)</SelectItem>
                      <SelectItem value="returning">Returning visitors only</SelectItem>
                      <SelectItem value="specific-countries">Specific countries only</SelectItem>
                      <SelectItem value="low-risk">Low-risk applications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period (months)</Label>
                  <Input id="data-retention" type="number" defaultValue="24" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Enable Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Collect usage data for system improvement
                    </p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="api-access">API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable external API access
                    </p>
                  </div>
                  <Switch id="api-access" />
                </div>
              </div>
              
              <Button onClick={() => handleSave("system")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Backup & Logs */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Backup & Logs
              </CardTitle>
              <CardDescription>Configure system backups and access logs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="log-retention">Log Retention (days)</Label>
                  <Input id="log-retention" type="number" defaultValue="30" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="detailed-logging">Detailed Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed system logging
                    </p>
                  </div>
                  <Switch id="detailed-logging" defaultChecked />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Button variant="outline" className="w-full">
                    Download Latest Backup
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download System Logs
                  </Button>
                </div>
                
                <div className="pt-4">
                  <Button variant="default" className="w-full">
                    Create Manual Backup
                  </Button>
                </div>
              </div>
              
              <Button onClick={() => handleSave("backup")}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
