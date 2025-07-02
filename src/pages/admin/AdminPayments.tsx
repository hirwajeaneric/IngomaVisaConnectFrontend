
import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  Download,
  Filter,
  Search,
  Eye,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminPayments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for payments
  const payments = [
    {
      id: "PAY-5678",
      applicationId: "APP-2354",
      applicant: "John Smith",
      amount: 90.00,
      currency: "USD",
      date: "2025-05-14",
      method: "Credit Card",
      status: "paid",
    },
    {
      id: "PAY-5677",
      applicationId: "APP-2353",
      applicant: "Maria Garcia",
      amount: 120.00,
      currency: "USD",
      date: "2025-05-13",
      method: "Bank Transfer",
      status: "paid",
    },
    {
      id: "PAY-5676",
      applicationId: "APP-2352",
      applicant: "Liu Wei",
      amount: 90.00,
      currency: "USD",
      date: "2025-05-12",
      method: "Credit Card",
      status: "paid",
    },
    {
      id: "PAY-5675",
      applicationId: "APP-2351",
      applicant: "Ahmed Hassan",
      amount: 50.00,
      currency: "USD",
      date: "2025-05-11",
      method: "Mobile Money",
      status: "paid",
    },
    {
      id: "PAY-5674",
      applicationId: "APP-2350",
      applicant: "Tanaka Ito",
      amount: 120.00,
      currency: "USD",
      date: "2025-05-10",
      method: "Credit Card",
      status: "paid",
    },
    {
      id: "PAY-5673",
      applicationId: "APP-2349",
      applicant: "Sarah Johnson",
      amount: 90.00,
      currency: "USD",
      date: "2025-05-09",
      method: "PayPal",
      status: "refunded",
    },
    {
      id: "PAY-5672",
      applicationId: "APP-2348",
      applicant: "David Kim",
      amount: 120.00,
      currency: "USD",
      date: "2025-05-08",
      method: "Bank Transfer",
      status: "paid",
    },
    {
      id: "PAY-5671",
      applicationId: "APP-2347",
      applicant: "Elena Petrova",
      amount: 40.00,
      currency: "USD",
      date: "2025-05-07",
      method: "Credit Card",
      status: "failed",
    },
  ];

  // Mock data for revenue chart
  const revenueData = [
    { month: "Jan", revenue: 12540 },
    { month: "Feb", revenue: 10250 },
    { month: "Mar", revenue: 15900 },
    { month: "Apr", revenue: 17800 },
    { month: "May", revenue: 14600 },
    { month: "Jun", revenue: 11900 },
  ];

  // Mock summary stats
  const summaryStats = [
    {
      title: "Monthly Revenue",
      value: "$14,600",
      change: "+8.5%",
      status: "increase",
      icon: <DollarSign className="h-6 w-6 text-primary" />,
    },
    {
      title: "Transactions",
      value: "348",
      change: "+12.3%",
      status: "increase",
      icon: <CreditCard className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Average Fee",
      value: "$94.20",
      change: "+5.1%",
      status: "increase",
      icon: <ArrowUpCircle className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "Refund Rate",
      value: "2.3%",
      change: "-0.8%",
      status: "decrease",
      icon: <ArrowDownCircle className="h-6 w-6 text-blue-500" />,
    },
  ];

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDateFilter = dateFilter === "all" || true; // Placeholder for date filter logic
    const matchesStatusFilter = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesDateFilter && matchesStatusFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "paid":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>;
      case "refunded":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Payment Management" subtitle="Track and manage visa application payments">
      <div className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {stat.status === "increase" ? (
                    <ArrowUpCircle className="h-4 w-4 text-secondary mr-1" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 text-primary mr-1" />
                  )}
                  <span
                    className={
                      stat.status === "increase" ? "text-secondary" : "text-primary"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, "Revenue"]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#CE1126" // Burundi red
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search payments..."
                    className="pl-9 w-full sm:w-auto min-w-[240px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2 w-full sm:w-auto">
                <Input
                  type="date"
                  className="w-full sm:w-auto"
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Payments</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="refunded">Refunded</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Application</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.applicationId}</TableCell>
                        <TableCell>{payment.applicant}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)} {payment.currency}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => navigate(`/dashboard/payment/${payment.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="paid">
                <div className="text-center py-10">
                  <p>Filter applied for paid payments</p>
                </div>
              </TabsContent>
              
              <TabsContent value="pending">
                <div className="text-center py-10">
                  <p>Filter applied for pending payments</p>
                </div>
              </TabsContent>
              
              <TabsContent value="refunded">
                <div className="text-center py-10">
                  <p>Filter applied for refunded payments</p>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing <strong>8</strong> of <strong>120</strong> payments
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary/5">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
