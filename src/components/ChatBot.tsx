import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Tizii Assistant. How can I help you find the perfect studio today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "user" }]);

    setTimeout(() => {
      const responses = [
        "I can help you find studios in your area. What location are you looking for?",
        "Our studios range from KES 700 to KES 950 per hour. Would you like to see available options?",
        "You can book a studio by selecting a date and time slot. Would you like me to guide you?",
        "All our studios come with professional equipment. Which amenities are important to you?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { text: randomResponse, sender: "bot" }]);
    }, 1000);

    setInput("");
  };

  return (
    <>
      {/* Floating container positioned responsively */}
      <div
        className="
          fixed 
          bottom-[5.5rem] md:bottom-6  /* pushes above navbar on mobile */
          right-4 md:right-6 
          z-[1000]
          flex flex-col items-end space-y-2
        "
      >
        {/* Chat modal */}
        {isOpen && (
          <Card
            className="w-80 md:w-96 h-96 mb-3 glass-card border-0 shadow-2xl flex flex-col animate-scale-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="font-semibold">Tizii Assistant</h3>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "glass-card"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="glass-card border-0"
                />
                <Button
                  size="icon"
                  className="neu-btn bg-primary hover:bg-primary/90 shrink-0"
                  onClick={handleSend}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Floating chat button */}
        <Button
          size="icon"
          className="h-14 w-14 rounded-full neu-btn bg-primary hover:bg-primary/90 shadow-lg animate-pulse"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
    </>
  );
};

export default ChatBot;
