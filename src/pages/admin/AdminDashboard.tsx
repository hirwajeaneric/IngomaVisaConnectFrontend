
import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

const AdminDashboard = () => {
  // Mock data for charts
  const visaApplicationsData = [
    { month: "Jan", applications: 65 },
    { month: "Feb", applications: 59 },
    { month: "Mar", applications: 80 },
    { month: "Apr", applications: 81 },
    { month: "May", applications: 56 },
    { month: "Jun", applications: 55 },
  ];

  const visaTypeData = [
    { name: "Tourist", value: 45 },
    { name: "Business", value: 28 },
    { name: "Work", value: 17 },
    { name: "Student", value: 8 },
    { name: "Transit", value: 2 },
  ];

  const COLORS = ["#CE1126", "#1EB53A", "#0052A5", "#FFC107", "#6C757D"];

  const statusData = [
    { name: "Jan", pending: 30, approved: 40, rejected: 5 },
    { name: "Feb", pending: 25, approved: 30, rejected: 4 },
    { name: "Mar", pending: 35, approved: 35, rejected: 10 },
    { name: "Apr", pending: 40, approved: 38, rejected: 3 },
    { name: "May", pending: 22, approved: 30, rejected: 4 },
    { name: "Jun", pending: 28, approved: 25, rejected: 2 },
  ];

  // Mock summary stats
  const summaryStats = [
    {
      title: "Total Applications",
      value: 432,
      change: "+12.5%",
      status: "increase",
      icon: <FileText className="h-6 w-6 text-primary" />,
    },
    {
      title: "Approval Rate",
      value: "87.2%",
      change: "+2.3%",
      status: "increase",
      icon: <CheckCircle className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Processing Time",
      value: "4.2 days",
      change: "-0.8 days",
      status: "decrease",
      icon: <Clock className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "Active Users",
      value: 521,
      change: "+5.1%",
      status: "increase",
      icon: <Users className="h-6 w-6 text-blue-500" />,
    },
  ];

  const recentApplications = [
    {
      id: "APP-1254",
      name: "John Smith",
      nationality: "United States",
      visaType: "Tourist",
      submissionDate: "2025-05-12",
      status: "Pending Review",
    },
    {
      id: "APP-1253",
      name: "Maria Garcia",
      nationality: "Spain",
      visaType: "Work",
      submissionDate: "2025-05-11",
      status: "Under Review",
    },
    {
      id: "APP-1252",
      name: "Ahmed Hassan",
      nationality: "Egypt",
      visaType: "Student",
      submissionDate: "2025-05-10",
      status: "Additional Docs Requested",
    },
    {
      id: "APP-1251",
      name: "Tanaka Ito",
      nationality: "Japan",
      visaType: "Business",
      submissionDate: "2025-05-09",
      status: "Approved",
    },
    {
      id: "APP-1250",
      name: "Sarah Johnson",
      nationality: "Canada",
      visaType: "Tourist",
      submissionDate: "2025-05-09",
      status: "Rejected",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending review':
        return 'bg-blue-100 text-blue-800';
      case 'under review':
        return 'bg-amber-100 text-amber-800';
      case 'additional docs requested':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle="Overview of visa applications and system performance"
    >
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
                    data={visaApplicationsData}
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

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nationality
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visa Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        {application.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.nationality}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.visaType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.submissionDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
