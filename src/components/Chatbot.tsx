
import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Paperclip, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "welcome-1",
    content: "Hello! I'm the Ingoma Visa Connect assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
];

const suggestedQuestions = [
  "What visa types are available?",
  "How long does visa processing take?",
  "What documents do I need for a tourist visa?",
  "How much does a business visa cost?",
  "Can I extend my visa while in Burundi?",
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (content: string = inputValue) => {
    if (!content.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response with typing delay
    setTimeout(() => {
      // Generate bot response based on user message
      const botResponse = getBotResponse(content.trim().toLowerCase());
      
      const newBotMessage: Message = {
        id: `bot-${Date.now()}`,
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Generate bot response based on user input
  const getBotResponse = (userMessage: string): string => {
    // Simple pattern matching for common questions
    if (userMessage.includes("visa type") || userMessage.includes("types of visa")) {
      return "We offer several visa types for Burundi: Tourist Visa ($50), Business Visa ($100), Work Visa ($200), Student Visa ($75), and Transit Visa ($30). You can find more details on our Visa Types page.";
    }
    
    if (userMessage.includes("processing") || userMessage.includes("how long") || userMessage.includes("time")) {
      return "Processing times vary by visa type: Tourist (3-5 days), Business (5-7 days), Work (10-15 days), Student (7-10 days), and Transit (2-3 days). Expedited processing is available for an additional fee.";
    }
    
    if (userMessage.includes("document") || userMessage.includes("need for") || userMessage.includes("require")) {
      return "Common documents required include a valid passport, recent passport-sized photos, completed application form, and proof of purpose of visit. Specific requirements vary by visa type. Please check our Requirements page for full details.";
    }
    
    if (userMessage.includes("cost") || userMessage.includes("fee") || userMessage.includes("price")) {
      return "Visa fees: Tourist ($50), Business ($100), Work ($200), Student ($75), and Transit ($30). Additional fees may apply for expedited processing or multiple entries.";
    }
    
    if (userMessage.includes("extend") || userMessage.includes("extension")) {
      return "Yes, most visas can be extended while in Burundi. You'll need to apply at the Immigration Office at least 7 days before your visa expires. Extensions typically cost 50% of the original visa fee.";
    }
    
    if (userMessage.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    // Default response if no pattern matches
    return "I'm not sure I understand that question. Could you rephrase it? Or you can ask about visa types, processing times, required documents, costs, or visa extensions.";
  };

  // Handle file upload (simulated)
  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "File uploads are not supported in the chatbot at this time.",
      variant: "default",
    });
  };

  // Toggle chatbot open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Chatbot Button */}
      <Button
        onClick={toggleChat}
        className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        aria-label="Chat with us"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white" />
        )}
      </Button>
      
      {/* Chatbot Window */}
      <div
        className={cn(
          "flex flex-col w-[90vw] sm:w-[400px] h-[500px] bg-white rounded-lg shadow-xl mt-4 border border-gray-200 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0 h-0"
        )}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Visa Connect Assistant</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:text-white/80 hover:bg-primary/90">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "mb-4 max-w-[80%] rounded-lg p-3",
                message.sender === "user"
                  ? "ml-auto bg-primary text-white"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {format(message.timestamp, "HH:mm")}
              </p>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex space-x-1 mb-4 max-w-[80%] rounded-lg p-3 bg-gray-100">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75" />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150" />
            </div>
          )}
          
          {messages.length === 1 && (
            <div className="my-4">
              <p className="text-sm text-gray-500 mb-2">Suggested questions:</p>
              <div className="flex flex-col space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="text-left text-sm bg-gray-50 hover:bg-gray-100 p-2 rounded-md transition-colors flex items-center"
                    onClick={() => handleSendMessage(question)}
                  >
                    <ChevronRight className="h-4 w-4 text-primary mr-1" />
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="p-3 border-t border-gray-200">
          <form
            className="flex items-center space-x-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleFileUpload}
            >
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
