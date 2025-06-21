import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Search, MessageSquare, Filter, ArrowUp, ArrowDown, User, Send, AlertTriangle, Paperclip, ChevronDown } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import { messagesService } from "@/lib/api/services/messages.service";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  id: string;
  applicationId: string;
  applicant: string;
  status: string;
  unread: boolean;
  lastMessage: string;
  timestamp: string;
  senderId: string;
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    isRead: boolean;
    sender: { name: string };
    application: { id: string; applicationNumber: string; status: string };
  }>;
  lastMessageTime?: string;
}

const AdminMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch all messages where admin is recipient
  const { data: myMessagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["myMessages", page, activeTab],
    queryFn: () => messagesService.getMyMessages(page, 20),
  });

  // Fetch unread count
  const { data: unreadCountData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: () => messagesService.getUnreadCount(),
  });

  // Fetch messages for selected conversation
  const { data: conversationMessagesData, refetch: refetchConversationMessages } = useQuery({
    queryKey: ["conversationMessages", selectedConversation],
    queryFn: () => selectedConversation ? messagesService.getMessagesByApplication(selectedConversation, 1, 100) : null,
    enabled: !!selectedConversation,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ recipientId, applicationId, content }: {
      recipientId: string;
      applicationId: string;
      content: string;
    }) => {
      return messagesService.sendQuickMessage(recipientId, applicationId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myMessages"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
      refetchConversationMessages();
      setMessageText("");
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
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

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => messagesService.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myMessages"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  // Group messages by application to create conversations
  const conversations = React.useMemo(() => {
    if (!myMessagesData?.data.messages) return [];

    const grouped = myMessagesData.data.messages.reduce((acc, message) => {
      const key = message.application.id;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          applicationId: message.application.applicationNumber,
          applicant: message.sender.name,
          status: message.application.status === "APPROVED" || message.application.status === "REJECTED" ? "closed" : "active",
          unread: !message.isRead,
          lastMessage: message.content,
          timestamp: formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }),
          senderId: message.sender.id,
          messages: [message],
        };
      } else {
        acc[key].messages.push(message);
        if (new Date(message.createdAt) > new Date(acc[key].lastMessageTime || 0)) {
          acc[key].lastMessage = message.content;
          acc[key].timestamp = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });
          acc[key].lastMessageTime = message.createdAt;
        }
        if (!message.isRead) {
          acc[key].unread = true;
        }
      }
      return acc;
    }, {} as Record<string, Conversation>);

    return Object.values(grouped).sort((a, b) => {
      if (a.unread && !b.unread) return -1;
      if (!a.unread && b.unread) return 1;
      return new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime();
    });
  }, [myMessagesData?.data.messages]);

  // Get selected conversation details
  const selectedConversationData = selectedConversation 
    ? conversations.find(conv => conv.id === selectedConversation)
    : null;

  // Filter conversations based on active tab
  const filteredConversations = React.useMemo(() => {
    switch (activeTab) {
      case "unread":
        return conversations.filter(conv => conv.unread);
      case "closed":
        return conversations.filter(conv => conv.status === "closed");
      default:
        return conversations;
    }
  }, [conversations, activeTab]);

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversationData) return;

    sendMessageMutation.mutate({
      recipientId: selectedConversationData.senderId,
      applicationId: selectedConversationData.id,
      content: messageText,
    });
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // Mark messages as read when conversation is selected
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      conversation.messages.forEach(message => {
        if (!message.isRead) {
          markAsReadMutation.mutate(message.id);
        }
      });
    }
  };

  // Get messages for the selected conversation, ordered by date (oldest first)
  const conversationMessages = React.useMemo(() => {
    if (!conversationMessagesData?.data.messages) return [];
    
    return conversationMessagesData.data.messages
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [conversationMessagesData?.data.messages]);

  // Helper function to determine if message is from current user
  const isOwnMessage = (message: { sender: { role: string } }) => {
    // Check if the message sender role is ADMIN or OFFICER (indicating it's from admin/officer)
    return message.sender.role === 'ADMIN' || message.sender.role === 'OFFICER';
  };

  if (isLoadingMessages) {
    return (
      <AdminLayout title="Messages" subtitle="Manage communications with visa applicants">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading messages...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Messages" subtitle="Manage communications with visa applicants">
      <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-lg border">
        {/* Conversations List */}
        <div className="w-full max-w-xs border-r bg-white">
          <div className="p-4 border-b">
            <SearchInput />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">
                All
                {unreadCountData?.data.count && unreadCountData.data.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {unreadCountData.data.count}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCountData?.data.count && unreadCountData.data.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {unreadCountData.data.count}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="overflow-auto h-[calc(100%-7rem)]">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                  }`}
                  onClick={() => handleConversationSelect(conversation.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {conversation.applicant.split(" ").map(name => name[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-sm flex items-center">
                          {conversation.applicant}
                          {conversation.unread && (
                            <span className="h-2 w-2 rounded-full bg-primary ml-2"></span>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground">{conversation.applicationId}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                    {conversation.lastMessage}
                  </p>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        conversation.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {conversation.status === "active" ? "Active" : "Closed"}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No messages found</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Conversation Detail */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversationData ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {selectedConversationData.applicant.split(" ").map(name => name[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversationData.applicant}</h3>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary font-medium">{selectedConversationData.applicationId}</span> • Visa Application
                    </p>
                  </div>
                </div>
                
                <div>
                  <Button variant="outline" size="sm">
                    View Application
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-auto p-4 bg-gray-50">
                {conversationMessages.length > 0 ? (
                  <div className="space-y-4">
                    {conversationMessages.map((message) => {
                      const isOwnMessage = message.sender.role === 'ADMIN' || message.sender.role === 'OFFICER';
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex max-w-[70%] ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                            <Avatar className={`h-8 w-8 ${isOwnMessage ? "ml-3" : "mr-3"}`}>
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
                                isOwnMessage
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-white border"
                              }`}>
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <p className={`text-xs mt-1 ${
                                isOwnMessage
                                  ? "text-black text-right"
                                  : "text-muted-foreground"
                              }`}>
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="mt-2 font-medium">No messages in this conversation</p>
                      <p className="text-sm text-muted-foreground">
                        Send a message to start the conversation
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      className="min-h-[80px]"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      disabled={sendMessageMutation.isPending}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" disabled={sendMessageMutation.isPending}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={sendMessage}
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                    >
                      {sendMessageMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" /> Send
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <Button variant="link" size="sm" className="text-xs">
                    Use Template <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                  <Button variant="link" size="sm" className="text-xs">
                    Save as Template
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto" />
                <p className="mt-2 font-medium">No conversation selected</p>
                <p className="text-sm text-muted-foreground">
                  Choose a conversation from the list
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
