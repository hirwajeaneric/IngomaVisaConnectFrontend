import { Badge } from "./ui/badge";

export const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case "UNDER_REVIEW":
        return <Badge className="bg-amber-100 text-amber-800">Under Review</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="bg-gray-100">Pending</Badge>;
      case "VERIFIED":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "REQUESTED":
        return <Badge className="bg-purple-100 text-purple-800">Requested</Badge>;
      case "SCHEDULED":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };