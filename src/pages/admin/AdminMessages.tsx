
import React, { useState } from "react";
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

const AdminMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState("conv-1");
  const [messageText, setMessageText] = useState("");

  // Mock data for conversations
  const conversations = [
    {
      id: "conv-1",
      applicant: "John Smith",
      applicationId: "APP-2354",
      status: "active",
      unread: true,
      lastMessage: "I've attached the additional documents you requested.",
      timestamp: "10:45 AM",
      messages: [
        {
          id: "msg-1",
          from: "officer",
          text: "Hello Mr. Smith, I'm reviewing your tourist visa application. We need additional documentation regarding your travel itinerary. Could you please provide a detailed day-by-day plan?",
          time: "May 14, 9:30 AM",
        },
        {
          id: "msg-2",
          from: "applicant",
          text: "Hello Officer, thank you for your message. I'll prepare the detailed itinerary right away. When do you need it by?",
          time: "May 14, 10:15 AM",
        },
        {
          id: "msg-3",
          from: "officer",
          text: "Please provide it within 48 hours to avoid delays in processing your application.",
          time: "May 14, 10:30 AM",
        },
        {
          id: "msg-4",
          from: "applicant",
          text: "I've attached the additional documents you requested. Please let me know if you need anything else.",
          time: "Today, 10:45 AM",
        },
      ],
    },
    {
      id: "conv-2",
      applicant: "Maria Garcia",
      applicationId: "APP-2353",
      status: "active",
      unread: true,
      lastMessage: "When will my work visa interview be scheduled?",
      timestamp: "Yesterday",
      messages: [
        {
          id: "msg-1",
          from: "applicant",
          text: "Hello, I submitted my work visa application last week and I'm wondering about the next steps in the process.",
          time: "May 13, 2:20 PM",
        },
        {
          id: "msg-2",
          from: "officer",
          text: "Hello Ms. Garcia, we've received your application and it's currently under initial review. We'll likely need to schedule an interview in the coming weeks.",
          time: "May 13, 3:45 PM",
        },
        {
          id: "msg-3",
          from: "applicant",
          text: "When will my work visa interview be scheduled? I need to make travel arrangements.",
          time: "Yesterday, 5:15 PM",
        },
      ],
    },
    {
      id: "conv-3",
      applicant: "Ahmed Hassan",
      applicationId: "APP-2352",
      status: "active",
      unread: false,
      lastMessage: "Thank you for the clarification about my student visa.",
      timestamp: "May 12",
      messages: [],
    },
    {
      id: "conv-4",
      applicant: "Tanaka Ito",
      applicationId: "APP-2350",
      status: "closed",
      unread: false,
      lastMessage: "I've received my approved business visa. Thank you!",
      timestamp: "May 10",
      messages: [],
    },
    {
      id: "conv-5",
      applicant: "Sarah Johnson",
      applicationId: "APP-2349",
      status: "closed",
      unread: false,
      lastMessage: "I understand the reasons for the rejection. Thank you.",
      timestamp: "May 9",
      messages: [],
    },
  ];

  const activeConversation = conversations.find(
    (conv) => conv.id === selectedConversation
  );

  const sendMessage = () => {
    if (messageText.trim()) {
      console.log(`Sending message to ${activeConversation?.applicant}: ${messageText}`);
      // In a real app, this would send the message via an API
      setMessageText("");
    }
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case "unread":
        return <Badge variant="default" className="bg-blue-500">Unread</Badge>;
      case "read":
        return <Badge variant="outline">Read</Badge>;
      case "replied":
        return <Badge variant="default" className="bg-green-500">Replied</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AdminLayout title="Messages" subtitle="Manage communications with visa applicants">
      <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-lg border">
        {/* Conversations List */}
        <div className="w-full max-w-xs border-r bg-white">
          <div className="p-4 border-b">
            <SearchInput />
          </div>
          
          <Tabs defaultValue="all" className="p-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="overflow-auto h-[calc(100%-7rem)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
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
            ))}
          </div>
        </div>
        
        {/* Conversation Detail */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {activeConversation.applicant.split(" ").map(name => name[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{activeConversation.applicant}</h3>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary font-medium">{activeConversation.applicationId}</span> • Tourist Visa
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
                {activeConversation.messages.length > 0 ? (
                  <div className="space-y-4">
                    {activeConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.from === "applicant" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.from === "applicant"
                              ? "bg-white border"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.from === "applicant"
                                ? "text-muted-foreground"
                                : "text-primary-foreground/80"
                            }`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
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
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button onClick={sendMessage}>
                      <Send className="h-4 w-4 mr-2" /> Send
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
