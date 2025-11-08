import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Loader2, SendHorizontal, BookOpen, LineChart, Brain, History, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mood types
type Mood = {
  emoji: string;
  label: string;
  value: string;
  color: string;
};

// Message types
type MessageRole = "user" | "assistant" | "system";

type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  mood?: string;
};

// AI companion states type
type CompanionState = "idle" | "thinking" | "responding" | "error";

// Learning context type
type LearningContext = {
  subject: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  goal: string;
};

// Mock moods for emoji-based mood tracking
const moods: Mood[] = [
  { emoji: "😊", label: "Happy", value: "happy", color: "bg-green-100 text-green-800" },
  { emoji: "🤔", label: "Confused", value: "confused", color: "bg-amber-100 text-amber-800" },
  { emoji: "😥", label: "Frustrated", value: "frustrated", color: "bg-red-100 text-red-800" },
  { emoji: "🤩", label: "Excited", value: "excited", color: "bg-purple-100 text-purple-800" },
  { emoji: "😴", label: "Tired", value: "tired", color: "bg-blue-100 text-blue-800" },
  { emoji: "😌", label: "Calm", value: "calm", color: "bg-sky-100 text-sky-800" },
  { emoji: "🧠", label: "Focused", value: "focused", color: "bg-indigo-100 text-indigo-800" },
  { emoji: "😰", label: "Anxious", value: "anxious", color: "bg-orange-100 text-orange-800" },
];

export default function AICompanion() {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [companionState, setCompanionState] = useState<CompanionState>("idle");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI learning companion. How can I help with your studies today? Feel free to share your current mood using the emoji selector below.",
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [learningContext, setLearningContext] = useState<LearningContext>({
    subject: "",
    topic: "",
    difficulty: "intermediate",
    goal: "",
  });
  const [showLearningContext, setShowLearningContext] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track mood history
  const [moodHistory, setMoodHistory] = useState<Array<{ mood: string, timestamp: Date }>>([]);

  // Fetch user's current classes for context
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ["/api/classes"],
    enabled: true,
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
      mood: selectedMood?.value,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    
    // Track mood if selected
    if (selectedMood) {
      setMoodHistory(prev => [...prev, { mood: selectedMood.value, timestamp: new Date() }]);
    }
    
    // Set companion to thinking state
    setCompanionState("thinking");

    try {
      // In a real implementation, we would call an API here
      // For now, we'll simulate a response with a timeout
      setTimeout(() => {
        const aiResponse = generateContextualResponse(userMessage.content, selectedMood?.value);
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCompanionState("idle");
      }, 1500);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setCompanionState("error");
      toast({
        title: "Communication Error",
        description: "Unable to connect to the AI companion. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Generate a contextual response (placeholder for actual AI integration)
  const generateContextualResponse = (message: string, mood?: string) => {
    // This is a mock function that would be replaced with actual API calls
    // to a language model in production
    
    let response = "";
    
    if (message.toLowerCase().includes("help") || message.toLowerCase().includes("stuck")) {
      response = "I see you're having some difficulties. Let's break this down step by step. What specific part are you struggling with?";
    } else if (message.toLowerCase().includes("explain") || message.toLowerCase().includes("understand")) {
      response = "Let me explain this concept in a different way. Sometimes looking at it from a new perspective can help. Would you like me to provide an analogy or a visual explanation?";
    } else if (message.toLowerCase().includes("quiz") || message.toLowerCase().includes("test")) {
      response = "Preparing for an assessment? Let's create a study plan. We can focus on key concepts and practice with some example questions. What topics will be covered?";
    } else if (mood === "confused") {
      response = "I notice you seem confused. That's completely normal when learning something new. Let's take a step back and go through the fundamentals again. What specifically is unclear?";
    } else if (mood === "frustrated") {
      response = "Learning can be frustrating sometimes. Let's take a short break and then approach this from a different angle. Would you like to try a different learning method or example?";
    } else if (mood === "tired") {
      response = "It sounds like you might need a short break. Research shows that brief breaks improve learning efficiency. Maybe try the focus timer for a 5-minute rest, then we can continue?";
    } else if (mood === "happy" || mood === "excited") {
      response = "Your positive energy is great for learning! This is the perfect time to tackle challenging concepts or review something you've been working on. What would you like to focus on?";
    } else {
      response = "I'm here to help with your studies. Would you like me to explain a concept, help with practice questions, or suggest learning resources? You can also set your learning context for more personalized guidance.";
    }
    
    return response;
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Update learning context
  const handleContextUpdate = () => {
    toast({
      title: "Learning Context Updated",
      description: `Now focusing on ${learningContext.subject}: ${learningContext.topic}`,
    });
    
    // Add system message about context change
    const contextMessage: Message = {
      id: Date.now().toString(),
      role: "system",
      content: `Learning context updated to: ${learningContext.subject} - ${learningContext.topic} (${learningContext.difficulty} level)`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, contextMessage]);
    setShowLearningContext(false);
  };

  // Determine message style based on role
  const getMessageStyle = (role: MessageRole) => {
    switch (role) {
      case "user":
        return "bg-primary-50 border-primary-200 ml-4";
      case "assistant":
        return "bg-secondary-50 border-secondary-200 mr-4";
      case "system":
        return "bg-muted border-muted-foreground text-center text-sm italic mx-8";
      default:
        return "";
    }
  };

  // Find mood object by value
  const getMoodByValue = (value?: string) => {
    if (!value) return null;
    return moods.find(mood => mood.value === value) || null;
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">AI Learning Companion</h3>
            <p className="text-sm text-muted-foreground">
              Your personalized study assistant
            </p>
          </div>
          
          {selectedMood && (
            <Badge variant="outline" className={`${selectedMood.color} flex gap-1 items-center px-3 py-1`}>
              <span className="text-lg">{selectedMood.emoji}</span>
              <span>{selectedMood.label}</span>
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b px-4">
            <TabsList className="bg-transparent border-b-0">
              <TabsTrigger value="chat" className="data-[state=active]:bg-background">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Chat
                </span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-background">
                <span className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Learning Insights
                </span>
              </TabsTrigger>
              <TabsTrigger value="mood" className="data-[state=active]:bg-background">
                <span className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Mood Trends
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg border ${getMessageStyle(message.role)}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">
                        {message.role === "user" ? "You" : message.role === "assistant" ? "AI Companion" : "System"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.mood && (
                      <div className="mt-1 flex justify-end">
                        <Badge variant="outline" className={`${getMoodByValue(message.mood)?.color || ''} text-xs`}>
                          {getMoodByValue(message.mood)?.emoji} {getMoodByValue(message.mood)?.label}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="mb-2 flex flex-wrap gap-1">
                {moods.map((mood) => (
                  <TooltipProvider key={mood.value}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedMood?.value === mood.value ? "default" : "ghost"}
                          size="sm"
                          className={`text-lg p-1 h-8 w-8 ${selectedMood?.value === mood.value ? 'bg-primary' : ''}`}
                          onClick={() => setSelectedMood(mood)}
                        >
                          {mood.emoji}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{mood.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-1 h-8 w-8 ml-1"
                        onClick={() => setShowLearningContext(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Set Learning Context</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your studies..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={companionState === "thinking"}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!currentMessage.trim() || companionState === "thinking"}
                >
                  {companionState === "thinking" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="p-4 m-0">
            <div className="space-y-4">
              <Card className="p-4 border">
                <h3 className="font-semibold mb-2">Learning Patterns</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your interactions, you appear to learn best through visual examples and practical applications.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="border rounded p-2 text-center">
                    <div className="font-medium text-lg">75%</div>
                    <div className="text-xs text-muted-foreground">Visual Learning</div>
                  </div>
                  <div className="border rounded p-2 text-center">
                    <div className="font-medium text-lg">60%</div>
                    <div className="text-xs text-muted-foreground">Practical Application</div>
                  </div>
                  <div className="border rounded p-2 text-center">
                    <div className="font-medium text-lg">45%</div>
                    <div className="text-xs text-muted-foreground">Reading Comprehension</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border">
                <h3 className="font-semibold mb-2">Current Focus Areas</h3>
                <ul className="text-sm space-y-1">
                  {!classesLoading && classes && classes.length > 0 ? (
                    classes.map((cls: any, index: number) => (
                      <li key={index} className="flex justify-between items-center border-b py-1 last:border-0">
                        <span>{cls.name}</span>
                        <Badge variant="outline">In Progress</Badge>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground italic">No active courses found</li>
                  )}
                </ul>
              </Card>

              <Card className="p-4 border">
                <h3 className="font-semibold mb-2">Recommended Resources</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-muted/20 rounded">
                    <div className="font-medium">Interactive Math Practice</div>
                    <div className="text-sm text-muted-foreground">Based on your recent questions about algebra</div>
                  </div>
                  <div className="p-2 bg-muted/20 rounded">
                    <div className="font-medium">Science Video Tutorials</div>
                    <div className="text-sm text-muted-foreground">Aligns with your preference for visual learning</div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mood" className="p-4 m-0">
            <div className="space-y-4">
              <Card className="p-4 border">
                <h3 className="font-semibold mb-2">Mood Tracking</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your emotional states during study sessions help us personalize your learning experience.
                </p>
                
                <div className="h-48 border rounded-lg p-3 flex items-end">
                  {/* Simple visualization of mood history */}
                  {moodHistory.length > 0 ? (
                    <div className="w-full flex items-end justify-around h-full">
                      {moods.map(mood => {
                        const count = moodHistory.filter(m => m.mood === mood.value).length;
                        const percentage = (count / moodHistory.length) * 100;
                        return (
                          <div key={mood.value} className="flex flex-col items-center">
                            <div 
                              className="w-8 rounded-t transition-all duration-500 ease-in-out"
                              style={{ 
                                height: `${Math.max(percentage, 5)}%`,
                                backgroundColor: mood.color.includes('bg-') ? 
                                  mood.color.replace('bg-', '').replace('-100', '-400') : 'bg-primary-200'
                              }}
                            />
                            <div className="text-lg mt-2">{mood.emoji}</div>
                            <div className="text-xs text-muted-foreground">{count || 0}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-muted-foreground italic">Use mood emojis during chat to build your mood history</p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4 border">
                <h3 className="font-semibold mb-2">Mood Insights</h3>
                <div className="space-y-2">
                  {moodHistory.length > 0 ? (
                    <>
                      <div className="p-2 border rounded">
                        <div className="flex justify-between">
                          <span className="font-medium">Most frequent mood</span>
                          <span className="text-primary">
                            {(() => {
                              const moodCounts = moods.map(mood => ({
                                mood,
                                count: moodHistory.filter(m => m.mood === mood.value).length
                              }));
                              const mostFrequent = moodCounts.reduce((prev, current) => 
                                (prev.count > current.count) ? prev : current, { mood: moods[0], count: 0 }
                              );
                              return mostFrequent.count > 0 ? 
                                <span>{mostFrequent.mood.emoji} {mostFrequent.mood.label}</span> : 
                                'None yet';
                            })()}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 border rounded">
                        <div className="font-medium mb-1">Personalized Tips</div>
                        <ul className="text-sm space-y-1 list-disc pl-4">
                          {(() => {
                            const moodCounts = moods.map(mood => ({
                              mood,
                              count: moodHistory.filter(m => m.mood === mood.value).length
                            }));
                            const mostFrequent = moodCounts.reduce((prev, current) => 
                              (prev.count > current.count) ? prev : current, { mood: moods[0], count: 0 }
                            );
                            
                            if (mostFrequent.mood.value === 'confused' || mostFrequent.mood.value === 'frustrated') {
                              return (
                                <>
                                  <li>Try breaking concepts into smaller parts</li>
                                  <li>Schedule more frequent breaks</li>
                                  <li>Consider switching learning methods</li>
                                </>
                              );
                            } else if (mostFrequent.mood.value === 'tired') {
                              return (
                                <>
                                  <li>Study during your peak energy hours</li>
                                  <li>Try the Pomodoro technique (25 min work, 5 min break)</li>
                                  <li>Consider light physical activity before studying</li>
                                </>
                              );
                            } else if (mostFrequent.mood.value === 'happy' || mostFrequent.mood.value === 'excited' || mostFrequent.mood.value === 'focused') {
                              return (
                                <>
                                  <li>Tackle challenging material during these moods</li>
                                  <li>Schedule important study sessions during your typical "happy hours"</li>
                                  <li>Journal what works well to reproduce these states</li>
                                </>
                              );
                            } else {
                              return <li>Continue tracking your moods for personalized insights</li>;
                            }
                          })()}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">No mood data available yet. Start using the emoji mood selector in your conversations.</p>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Learning Context Dialog */}
      <Dialog open={showLearningContext} onOpenChange={setShowLearningContext}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Learning Context</DialogTitle>
            <DialogDescription>
              This helps the AI companion provide more relevant assistance for your current study session.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-3">
            <div className="grid grid-cols-4 items-center gap-2">
              <label htmlFor="subject" className="text-sm font-medium col-span-1">
                Subject
              </label>
              <Input
                id="subject"
                value={learningContext.subject}
                onChange={(e) => setLearningContext({...learningContext, subject: e.target.value})}
                placeholder="e.g. Mathematics"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <label htmlFor="topic" className="text-sm font-medium col-span-1">
                Topic
              </label>
              <Input
                id="topic"
                value={learningContext.topic}
                onChange={(e) => setLearningContext({...learningContext, topic: e.target.value})}
                placeholder="e.g. Algebra"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <label className="text-sm font-medium col-span-1">
                Level
              </label>
              <div className="flex gap-2 col-span-3">
                {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                  <Button
                    key={level}
                    variant={learningContext.difficulty === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLearningContext({...learningContext, difficulty: level})}
                    className="capitalize"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-2">
              <label htmlFor="goal" className="text-sm font-medium col-span-1 pt-2">
                Goal
              </label>
              <Textarea
                id="goal"
                value={learningContext.goal}
                onChange={(e) => setLearningContext({...learningContext, goal: e.target.value})}
                placeholder="What do you want to achieve in this session?"
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleContextUpdate}>Update Context</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}