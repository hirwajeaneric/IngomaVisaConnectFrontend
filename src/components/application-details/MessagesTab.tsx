import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  date: string;
  from: string;
  content: string;
  read: boolean;
}

interface MessagesTabProps {
  messages: Message[];
  applicantName: string;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  messages,
  applicantName
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the applicant.",
    });
    
    setNewMessage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.from === applicantName ? "justify-end" : ""}`}>
              <div className={`flex max-w-[75%] ${message.from === applicantName ? "flex-row-reverse" : ""}`}>
                <Avatar className={`h-8 w-8 ${message.from === applicantName ? "ml-3" : "mr-3"}`}>
                  <AvatarImage 
                    src="/placeholder.svg" 
                    alt={message.from}
                  />
                  <AvatarFallback>
                    {message.from === applicantName ? 
                      `${applicantName.split(' ')[0][0]}${applicantName.split(' ')[1]?.[0] || ''}` : "SN"}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className={`p-3 rounded-lg ${
                    message.from === applicantName 
                    ? "bg-primary text-white" 
                    : "bg-muted"
                  }`}>
                    <p>{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.date} • {message.from}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex items-center space-x-2">
          <Textarea 
            placeholder="Type your message..." 
            className="min-h-[80px]"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button 
            className="ml-2 shrink-0"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button variant="outline">
            Reply Templates
          </Button>
          <Button>
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 