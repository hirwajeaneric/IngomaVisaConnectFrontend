import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  LineChart,
  Line,
  Legend,
} from "recharts";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle,
  Loader2,
} from "lucide-react";
import { dashboardService, DashboardStats, MonthlyApplication, VisaTypeDistribution, StatusTrend } from "@/lib/api/services/dashboard.service";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyApplications, setMonthlyApplications] = useState<MonthlyApplication[]>([]);
  const [visaTypeData, setVisaTypeData] = useState<VisaTypeDistribution[]>([]);
  const [statusData, setStatusData] = useState<StatusTrend[]>([]);
  const { toast } = useToast();

  const COLORS = ["#CE1126", "#1EB53A", "#0052A5", "#FFC107", "#6C757D"];

  // Generate year options (current year and 4 years back)
  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const fetchDashboardData = async (year: number) => {
    try {
      setLoading(true);
      console.log(`Fetching dashboard data for year: ${year}`);

      const [statsData, monthlyData, visaTypeData, statusData] = await Promise.all([
        dashboardService.getDashboardStats(year),
        dashboardService.getMonthlyApplications(year),
        dashboardService.getVisaTypeDistribution(year),
        dashboardService.getApplicationStatusTrends(year)
      ]);

      setStats(statsData);
      setMonthlyApplications(monthlyData);
      setVisaTypeData(visaTypeData);
      setStatusData(statusData);

      console.log('Dashboard data loaded successfully:', {
        stats: statsData,
        monthly: monthlyData,
        visaTypes: visaTypeData,
        status: statusData
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
  };

  const summaryStats = stats ? [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      change: `${stats.applicationChange >= 0 ? '+' : ''}${stats.applicationChange}%`,
      status: stats.applicationChange >= 0 ? "increase" : "decrease",
      icon: <FileText className="h-6 w-6 text-primary" />,
    },
    {
      title: "Pending Applications",
      value: `${stats.pendingPercentage}%`,
      change: `${stats.pendingApplications} applications`,
      status: "neutral",
      icon: <CheckCircle className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Average Processing Time",
      value: `${stats.avgProcessingDays} days`,
      change: "Based on completed applications",
      status: "neutral",
      icon: <Clock className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "Active Users",
      value: stats.totalUsers,
      change: `${stats.userChange >= 0 ? '+' : ''}${stats.userChange}%`,
      status: stats.userChange >= 0 ? "increase" : "decrease",
      icon: <Users className="h-6 w-6 text-blue-500" />,
    },
  ] : [];

  if (loading) {
    return (
      <AdminLayout 
        title="Dashboard" 
        subtitle="Overview of visa applications and system performance"
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard data...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle="Overview of visa applications and system performance"
    >
      <div className="space-y-6">
        {/* Year Selector */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Year:</span>
            <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

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
                  ) : stat.status === "decrease" ? (
                    <ArrowDownCircle className="h-4 w-4 text-primary mr-1" />
                  ) : null}
                  <span
                    className={
                      stat.status === "increase" ? "text-secondary" : 
                      stat.status === "decrease" ? "text-primary" : 
                      "text-muted-foreground"
                    }
                  >
                    {stat.change}
                  </span>
                  {stat.status !== "neutral" && (
                    <span className="text-muted-foreground ml-1">from last month</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Applications Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyApplications}
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
                    <Tooltip />
                    <Bar
                      dataKey="applications"
                      fill="#CE1126" // Burundi red
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Visa Type Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visa Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visaTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {visaTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Status Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Status Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={statusData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#0052A5" // Blue
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke="#1EB53A" // Green
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="rejected"
                    stroke="#CE1126" // Red
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>        
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
