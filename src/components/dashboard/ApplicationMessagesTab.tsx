import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { messagesService } from "@/lib/api/services/messages.service";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
}

interface ApplicationMessagesTabProps {
  applicationId: string;
  applicantName: string;
  applicantId: string;
  officerId?: string; // Optional officer ID if assigned
}

export const ApplicationMessagesTab: React.FC<ApplicationMessagesTabProps> = ({
  applicationId,
  applicantName,
  applicantId,
  officerId
}) => {
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();

  // Fetch messages for this application
  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["applicationMessages", applicationId],
    queryFn: () => messagesService.getMessagesByApplication(applicationId, 1, 50),
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      // If there's an assigned officer, send to them, otherwise send to admin
      const recipientId = officerId || "admin-id"; // In real implementation, get default admin ID
      return messagesService.sendQuickMessage(recipientId, applicationId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicationMessages", applicationId] });
      setNewMessage("");
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the visa officer.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send Message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate(newMessage);
  };

  // Get messages ordered by date (oldest first)
  const messages = React.useMemo(() => {
    if (!messagesData?.data.messages) return [];
    
    return messagesData.data.messages
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messagesData?.data.messages]);

  // Helper function to determine if message is from current user (applicant)
  const isOwnMessage = (message: { sender: { role: string } }) => {
    return message.sender.role === 'APPLICANT';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Loading messages...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {messages.length > 0 ? (
            messages.map((message) => {
              const isOwn = isOwnMessage(message);
              return (
                <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[75%] ${isOwn ? "flex-row-reverse" : ""}`}>
                    <Avatar className={`h-8 w-8 ${isOwn ? "ml-3" : "mr-3"}`}>
                      <AvatarImage 
                        src="/placeholder.svg" 
                        alt={message.sender.name}
                      />
                      <AvatarFallback>
                        {message.sender.name.split(" ").map(name => name[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className={`p-3 rounded-lg ${
                        isOwn 
                        ? "bg-primary text-white" 
                        : "bg-muted"
                      }`}>
                        <p>{message.content}</p>
                      </div>
                      <p className={`text-xs mt-1 ${
                        isOwn 
                        ? "text-gray-700 text-right font-medium" 
                        : "text-muted-foreground"
                      }`}>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })} • {message.sender.name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation by sending a message</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex items-center space-x-2">
          <Textarea 
            placeholder="Type your message..." 
            className="min-h-[80px]"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            className="ml-2 shrink-0"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
