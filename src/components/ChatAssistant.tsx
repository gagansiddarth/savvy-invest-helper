
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User, ArrowDown, Loader2 } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const predefinedResponses: Record<string, string> = {
  'hello': "Hello! I'm your AI financial assistant. How can I help with your investment questions today?",
  'hi': "Hi there! I'm here to help with your financial questions. What would you like to know about investing?",
  'help': "I can help you with various financial topics like investment basics, risk assessment, portfolio diversification, and more. What would you like to learn about?",
  'what is investing': "Investing is the process of allocating resources, usually money, with the expectation of generating income or profit over time. Unlike saving, which is setting money aside for future use, investing involves putting your money to work with the goal of growing it.",
  'what is risk': "In investing, risk refers to the possibility that an investment's actual return may be different than expected, particularly the chance of losing some or all of the original investment. Generally, higher risk investments have the potential for higher returns, while lower risk investments typically offer lower potential returns.",
  'how to start investing': "Starting to invest involves a few key steps: 1) Set clear financial goals, 2) Build an emergency fund first, 3) Understand your risk tolerance, 4) Research investment options (stocks, bonds, funds), 5) Start small and consistent, 6) Consider using tax-advantaged accounts like 401(k)s or IRAs, and 7) Regularly review and adjust your investments."
};

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your AI financial assistant. How can I help with your investment questions today?",
            timestamp: new Date()
          }
        ]);
      }, 500);
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Generate AI response
      let responseContent = "I'm sorry, I don't have enough information to answer that question accurately. Could you provide more details?";
      
      // Check for predefined responses or patterns
      const lowercaseInput = input.toLowerCase();
      
      for (const [key, value] of Object.entries(predefinedResponses)) {
        if (lowercaseInput.includes(key)) {
          responseContent = value;
          break;
        }
      }
      
      // Special case for "thank you"
      if (lowercaseInput.includes('thank') || lowercaseInput.includes('thanks')) {
        responseContent = "You're welcome! If you have any more questions about your investments or financial planning, feel free to ask.";
      }
      
      // Special case for questions about specific investments
      if (lowercaseInput.includes('etf') || lowercaseInput.includes('mutual fund')) {
        responseContent = "ETFs (Exchange Traded Funds) and mutual funds are both investment vehicles that pool money from multiple investors to buy a diversified portfolio of assets. ETFs trade like stocks throughout the day, while mutual funds trade once at the end of the trading day. Both can be excellent options for diversification, but they differ in terms of cost, tax efficiency, and trading flexibility.";
      }
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAutoScroll = () => {
    scrollToBottom();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="px-4 py-3 flex justify-between items-center">
        <CardTitle className="text-lg flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          Financial Assistant
        </CardTitle>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.role === 'user' 
                    ? 'flex-row-reverse items-end' 
                    : 'items-start'
                }`}
              >
                <Avatar className={`h-8 w-8 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                  {message.role === 'user' ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </Avatar>
                
                <div>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start">
                <Avatar className="h-8 w-8 mr-2">
                  <Bot className="h-5 w-5" />
                </Avatar>
                <div className="rounded-lg px-3 py-2 bg-muted animate-pulse">
                  <p className="text-sm">Typing...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <div className="px-4 pb-1 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground mb-2 hover:bg-transparent"
          onClick={handleAutoScroll}
        >
          <ArrowDown className="h-3 w-3 mr-1" />
          Scroll to bottom
        </Button>
      </div>
      
      <Separator />
      
      <CardFooter className="p-3">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask a question about investing..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={isTyping || !input.trim()}>
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatAssistant;
