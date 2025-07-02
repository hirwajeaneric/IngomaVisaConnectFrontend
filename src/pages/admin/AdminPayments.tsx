import React, { useState, useCallback, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Eye,
  DollarSign,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { paymentService, Payment, PaymentStats, MonthlyRevenueData } from "@/lib/api/services/payment.service";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

const AdminPayments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueData[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const fetchPayments = useCallback(async (status?: string, search?: string) => {
    try {
      setLoading(true);
      const response = await paymentService.getAllPayments({
        page: 1,
        limit: 100, // Get more payments for client-side pagination
        status,
        search,
      });
      setPayments(response.data.payments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await paymentService.getPaymentStats();
      setStats(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payment statistics",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchMonthlyRevenue = useCallback(async (year?: number) => {
    try {
      const response = await paymentService.getMonthlyRevenue(year || selectedYear);
      setMonthlyRevenue(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch monthly revenue data",
        variant: "destructive",
      });
    }
  }, [selectedYear, toast]);

  useEffect(() => {
    fetchPayments();
    fetchStats();
    fetchMonthlyRevenue();
  }, [fetchPayments, fetchStats, fetchMonthlyRevenue]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
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

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "applicationId",
      header: "Application",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.applicationId}</div>
      ),
    },
    {
      accessorKey: "applicant",
      header: "Applicant",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.applicant}</div>
          <div className="text-sm text-muted-foreground">{row.original.applicantEmail}</div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          ${row.original.amount.toFixed(2)} {row.original.currency}
        </div>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.method}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="font-medium">{formatDate(row.original.date)}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return value === row.original.status;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/dashboard/payment/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Use real monthly revenue data from API
  const revenueData = monthlyRevenue.length > 0 ? monthlyRevenue : [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
    { month: "Jul", revenue: 0 },
    { month: "Aug", revenue: 0 },
    { month: "Sep", revenue: 0 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ];

  if (loading && !stats) {
    return (
      <AdminLayout title="Loading..." subtitle="Please wait while we fetch the payments">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!loading && payments.length === 0) {
    return (
      <AdminLayout title="Payment Management" subtitle="No payments found">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payments Found</h3>
                <p className="text-muted-foreground mb-4">
                  There are no payments in the system yet. Payments will appear here once users complete visa applications and make payments.
                </p>
                <Button onClick={() => fetchPayments()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Payment Management" subtitle="Track and manage visa application payments">
      <div className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    ${stats?.monthlyRevenue?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                {stats?.revenueChange !== undefined && (
                  <>
                    {stats.revenueChange >= 0 ? (
                      <ArrowUpCircle className="h-4 w-4 text-secondary mr-1" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-primary mr-1" />
                    )}
                    <span className={stats.revenueChange >= 0 ? "text-secondary" : "text-primary"}>
                      {stats.revenueChange >= 0 ? "+" : ""}{stats.revenueChange.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold mt-2">{stats?.totalPayments || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                {stats?.transactionChange !== undefined && (
                  <>
                    {stats.transactionChange >= 0 ? (
                      <ArrowUpCircle className="h-4 w-4 text-secondary mr-1" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-primary mr-1" />
                    )}
                    <span className={stats.transactionChange >= 0 ? "text-secondary" : "text-primary"}>
                      {stats.transactionChange >= 0 ? "+" : ""}{stats.transactionChange.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {stats?.totalPayments ? Math.round((stats.completedPayments / stats.totalPayments) * 100) : 0}%
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ArrowUpCircle className="h-6 w-6 text-amber-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-muted-foreground">
                  {stats?.completedPayments || 0} of {stats?.totalPayments || 0} successful
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Monthly Revenue</CardTitle>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => {
                    const year = parseInt(value);
                    setSelectedYear(year);
                    fetchMonthlyRevenue(year);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            <DataTable
              columns={columns}
              data={payments}
              searchKey="applicant"
              searchPlaceholder="Search payments..."
              filterableColumns={[
                {
                  id: "status",
                  title: "Status",
                  options: [
                    { label: "All", value: "all" },
                    { label: "Paid", value: "completed" },
                    { label: "Pending", value: "pending" },
                    { label: "Failed", value: "failed" },
                    { label: "Refunded", value: "refunded" },
                  ],
                },
              ]}
              onRowClick={(row) => navigate(`/dashboard/payment/${row.id}`)}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
