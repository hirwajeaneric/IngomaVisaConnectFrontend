
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Message type definition
interface Message {
  id: string;
  from: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  replies?: {
    id: string;
    from: string;
    message: string;
    date: string;
  }[];
}

const MessageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call to get message details
    const fetchMessage = () => {
      setLoading(true);
      try {
        // This is mocked data - in a real app, you would fetch this from an API
        const messages: Message[] = [
          {
            id: "msg-1",
            from: "Immigration Officer",
            subject: "Additional document required",
            message: "Dear applicant,\n\nUpon reviewing your visa application, we noticed that you haven't uploaded a hotel reservation confirmation for your upcoming visit to Burundi. This is a required document for tourist visa applications.\n\nPlease upload this document to your application at your earliest convenience so that we can continue processing your visa.\n\nThank you for your cooperation.\n\nRegards,\nImmigration Officer",
            date: "2025-05-11T13:20:00Z",
            read: false,
            replies: []
          },
          {
            id: "msg-2",
            from: "System",
            subject: "Application Update",
            message: "Your visa application has moved to the review phase. The processing time is typically 3-5 business days. You will receive further updates as your application progresses.",
            date: "2025-05-09T10:15:00Z",
            read: true,
            replies: []
          }
        ];
        
        const msg = messages.find(m => m.id === id);
        
        if (msg) {
          setMessage(msg);
          // Mark as read
          msg.read = true;
        }
      } catch (e) {
        console.error("Error fetching message:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessage();
  }, [id]);
  
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  
  const handleReply = () => {
    if (!reply.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }
    
    if (message) {
      // In a real app, this would be an API call to send a reply
      const newReply = {
        id: `reply-${Date.now()}`,
        from: "You",
        message: reply,
        date: new Date().toISOString(),
      };
      
      // Add reply to message
      const updatedMessage = {
        ...message,
        replies: [...(message.replies || []), newReply],
      };
      
      setMessage(updatedMessage);
      setReply("");
      
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Loading message...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Message Not Found</h1>
            <p className="text-gray-600 mb-6">The message you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/account')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle className="text-xl">{message.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    From: {message.from}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(message.date)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="whitespace-pre-line">
                {message.message}
              </div>
            </CardContent>
          </Card>
          
          {/* Message Replies */}
          {message.replies && message.replies.length > 0 && (
            <div className="mb-6 space-y-4">
              <h2 className="text-lg font-medium">Previous Replies</h2>
              {message.replies.map((reply) => (
                <Card key={reply.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {reply.from === "You" ? "YOU" : "IO"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{reply.from}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(reply.date)}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 whitespace-pre-line">{reply.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Reply Form */}
          <Card>
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-lg">Reply</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Textarea 
                placeholder="Type your reply here..." 
                className="min-h-[150px]"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleReply}
                  className="bg-secondary hover:bg-secondary/90 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" /> Send Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MessageDetails;
