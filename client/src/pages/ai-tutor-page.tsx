import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap,
  Send,
  Loader2,
  BookOpen,
  Lightbulb,
  Award,
  Clock,
  BarChart3,
  Brain,
  Mic,
  TrendingUp,
  Shield,
  Lock
} from "lucide-react";
import type { TutoringSession, TutoringMessage } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import robotTutor from "@/assets/images/robot-tutor.png";

const subjects = [
  { value: "Algebra", label: "Algebra", icon: "📐", category: "Mathematics" },
  { value: "Geometry", label: "Geometry", icon: "🔺", category: "Mathematics" },
  { value: "Chemistry", label: "Chemistry", icon: "🧪", category: "Science" },
  { value: "Biology", label: "Biology", icon: "🧬", category: "Science" },
  { value: "Physics", label: "Physics", icon: "⚛️", category: "Science" },
  { value: "Global Studies", label: "Global Studies", icon: "🌍", category: "Humanities" },
  { value: "English", label: "English", icon: "📚", category: "Humanities" },
  { value: "U.S. History", label: "U.S. History", icon: "🗽", category: "Humanities" },
  { value: "Spanish", label: "Spanish", icon: "🇪🇸", category: "Languages" },
  { value: "French", label: "French", icon: "🇫🇷", category: "Languages" },
  { value: "Mandarin", label: "Mandarin", icon: "🇨🇳", category: "Languages" },
  { value: "Latin", label: "Latin", icon: "🏛️", category: "Languages" },
  { value: "Computer Science", label: "Computer Science", icon: "💻", category: "Other" },
  { value: "Health", label: "Health", icon: "🏃", category: "Other" },
  { value: "Art", label: "Art", icon: "🎨", category: "Other" },
  { value: "Music", label: "Music", icon: "🎵", category: "Other" }
];

const ambientSounds = [
  { id: "rain", name: "Rain", emoji: "🌧️", url: "https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3" },
  { id: "ocean", name: "Ocean Waves", emoji: "🌊", url: "https://assets.mixkit.co/active_storage/sfx/2392/2392-preview.mp3" },
  { id: "forest", name: "Forest Birds", emoji: "🌲", url: "https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3" },
  { id: "cafe", name: "Cafe Ambiance", emoji: "☕", url: "https://assets.mixkit.co/active_storage/sfx/2395/2395-preview.mp3" },
];

export default function AITutorPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("Algebra");
  const [isRecording, setIsRecording] = useState(false);
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const [soundVolume, setSoundVolume] = useState(0.3);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get or create active session
  const { data: sessionData, isLoading: sessionLoading } = useQuery<{
    session: TutoringSession;
    messages: TutoringMessage[];
  }>({
    queryKey: [`/api/tutor/session?subject=${encodeURIComponent(selectedSubject)}`],
    refetchInterval: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest("POST", "/api/tutor/message", {
        message,
        sessionId: sessionData?.session.id
      });
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tutor/session?subject=${encodeURIComponent(selectedSubject)}`] });
      setCurrentMessage("");
      setIsTyping(false);
    },
    onError: (error: Error) => {
      setIsTyping(false);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    }
  });

  // End session mutation
  const endSessionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/tutor/session/end", {
        sessionId: sessionData?.session.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tutor/session"] });
      toast({
        title: "Session Ended",
        description: "Your tutoring session has been saved and analyzed."
      });
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessionData?.messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim() || isTyping) return;
    sendMessageMutation.mutate(currentMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Voice recording functionality
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser. Try Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    // Start recording
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedSubject === "Spanish" ? "es-ES" : 
                       selectedSubject === "French" ? "fr-FR" :
                       selectedSubject === "Mandarin" ? "zh-CN" :
                       selectedSubject === "Latin" ? "la" : "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCurrentMessage(prev => prev + (prev ? " " : "") + transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      if (event.error !== 'no-speech') {
        toast({
          title: "Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive"
        });
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Ambient sound controls
  const toggleAmbientSound = (soundId: string) => {
    if (ambientSound === soundId) {
      // Stop current sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setAmbientSound(null);
    } else {
      // Start new sound
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const sound = ambientSounds.find(s => s.id === soundId);
      if (sound) {
        const audio = new Audio(sound.url);
        audio.loop = true;
        audio.volume = soundVolume;
        audio.play().catch(err => {
          console.error("Could not play audio:", err);
          toast({
            title: "Audio Error",
            description: "Could not play ambient sound. Try clicking again.",
            variant: "destructive"
          });
        });
        audioRef.current = audio;
        setAmbientSound(soundId);
      }
    }
  };

  const updateVolume = (volume: number) => {
    setSoundVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const messages = sessionData?.messages || [];
  const session = sessionData?.session;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
              <img src={robotTutor} alt="AI Tutor" className="h-12 w-12 rounded-full border-2 border-blue-400" />
              AI Tutor
            </h1>
            <p className="text-slate-600">
              Your personal tutor for advanced 9th grade studies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setLocation("/progress")}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              My Progress
            </Button>
            {session && !session.endedAt && (
              <Button
                variant="outline"
                onClick={() => endSessionMutation.mutate()}
                disabled={endSessionMutation.isPending}
                data-testid="button-end-session"
              >
                <Clock className="h-4 w-4 mr-2" />
                End Session
              </Button>
            )}
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-green-600 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-green-900 dark:text-green-100">
                      Your Private Learning Space
                    </h3>
                    <Lock className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                    <strong>This is YOUR safe space to learn.</strong> All your tutoring conversations stay completely private -
                    they're never shared with teachers, parents, or classmates. Ask any question, make mistakes, and explore freely.
                    That's how you learn best! 🌟
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Select Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {subjects.map((subject) => (
                <Button
                  key={subject.value}
                  variant={selectedSubject === subject.value ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => setSelectedSubject(subject.value)}
                  data-testid={`button-subject-${subject.value.toLowerCase()}`}
                >
                  <span className="text-2xl">{subject.icon}</span>
                  <span className="text-sm">{subject.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <img src={robotTutor} alt="AI Tutor" className="h-8 w-8 rounded-full" />
                AI Tutor Chat
              </CardTitle>
              <CardDescription>
                Ask questions and get detailed explanations for {selectedSubject}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages */}
              <ScrollArea className="h-[500px] pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                      <Lightbulb className="h-16 w-16 text-blue-300" />
                      <div>
                        <h3 className="font-semibold text-lg text-slate-700">
                          Ready to Learn!
                        </h3>
                        <p className="text-slate-500 text-sm mt-2">
                          Ask me anything about {selectedSubject}. I'm here to help you master the material.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl mt-6">
                        <Button
                          variant="outline"
                          className="h-auto p-4 text-left justify-start"
                          onClick={() => {
                            const questions: Record<string, string> = {
                              "Algebra": "Can you explain how to solve systems of equations using substitution?",
                              "Geometry": "How do I write a two-column proof for triangle congruence?",
                              "Chemistry": "Can you help me understand balancing chemical equations?",
                              "Biology": "How does photosynthesis work and what are the main stages?",
                              "Physics": "Can you explain Newton's three laws of motion with examples?",
                              "Global Studies": "What were the main causes of World War I?",
                              "English": "How do I analyze themes and symbolism in literature?",
                              "U.S. History": "What were the causes and effects of the American Revolution?",
                              "Spanish": "Can you help me understand the difference between preterite and imperfect tense?",
                              "French": "How do I conjugate regular -er, -ir, and -re verbs?",
                              "Mandarin": "Can you explain the four tones and how they change meaning?",
                              "Latin": "How do I decline first and second declension nouns?",
                              "Computer Science": "Can you explain how loops and conditionals work in programming?",
                              "Health": "What are the main components of a balanced, healthy diet?",
                              "Art": "What are the principles of color theory and how do I use them?",
                              "Music": "Can you explain the circle of fifths and key signatures?"
                            };
                            setCurrentMessage(questions[selectedSubject] || "Can you help me understand this topic?");
                          }}
                          data-testid="button-sample-question-1"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-sm">
                              {selectedSubject === "Algebra" && "Systems of Equations"}
                              {selectedSubject === "Geometry" && "Geometric Proofs"}
                              {selectedSubject === "Chemistry" && "Balancing Equations"}
                              {selectedSubject === "Biology" && "Photosynthesis"}
                              {selectedSubject === "Physics" && "Newton's Laws"}
                              {selectedSubject === "Global Studies" && "World War I"}
                              {selectedSubject === "English" && "Literary Analysis"}
                              {selectedSubject === "U.S. History" && "American Revolution"}
                              {selectedSubject === "Spanish" && "Preterite vs Imperfect"}
                              {selectedSubject === "French" && "Verb Conjugation"}
                              {selectedSubject === "Mandarin" && "Chinese Tones"}
                              {selectedSubject === "Latin" && "Noun Declensions"}
                              {selectedSubject === "Computer Science" && "Loops & Conditionals"}
                              {selectedSubject === "Health" && "Balanced Diet"}
                              {selectedSubject === "Art" && "Color Theory"}
                              {selectedSubject === "Music" && "Circle of Fifths"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Try this example question
                            </div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto p-4 text-left justify-start"
                          onClick={() => {
                            const questions: Record<string, string> = {
                              "Algebra": "I'm struggling with quadratic equations. Can you walk me through an example?",
                              "Geometry": "What's the relationship between inscribed angles and central angles in circles?",
                              "Chemistry": "How do I calculate molar mass and use it in stoichiometry?",
                              "Biology": "Can you explain cellular respiration and how it differs from photosynthesis?",
                              "Physics": "How do I solve projectile motion problems with angles?",
                              "Global Studies": "Can you explain the Cold War and its global impact?",
                              "English": "How do I write a strong thesis statement for my essay?",
                              "U.S. History": "What were the major events and outcomes of the Civil Rights Movement?",
                              "Spanish": "How do I use the subjunctive mood correctly in sentences?",
                              "French": "Can you explain French pronunciation rules for silent letters?",
                              "Mandarin": "How do I write Chinese characters with proper stroke order?",
                              "Latin": "Can you help me translate Latin sentences using case endings?",
                              "Computer Science": "How do functions and parameters work in programming?",
                              "Health": "What are the benefits of regular exercise for mental health?",
                              "Art": "How do I create perspective and depth in my drawings?",
                              "Music": "Can you explain rhythm, time signatures, and how to count beats?"
                            };
                            setCurrentMessage(questions[selectedSubject] || "Can you explain this concept in more detail?");
                          }}
                          data-testid="button-sample-question-2"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-sm">
                              {selectedSubject === "Algebra" && "Quadratic Equations"}
                              {selectedSubject === "Geometry" && "Circle Angles"}
                              {selectedSubject === "Chemistry" && "Stoichiometry"}
                              {selectedSubject === "Biology" && "Cellular Respiration"}
                              {selectedSubject === "Physics" && "Projectile Motion"}
                              {selectedSubject === "Global Studies" && "Cold War"}
                              {selectedSubject === "English" && "Thesis Statements"}
                              {selectedSubject === "U.S. History" && "Civil Rights Movement"}
                              {selectedSubject === "Spanish" && "Subjunctive Mood"}
                              {selectedSubject === "French" && "Pronunciation Rules"}
                              {selectedSubject === "Mandarin" && "Character Writing"}
                              {selectedSubject === "Latin" && "Translation & Cases"}
                              {selectedSubject === "Computer Science" && "Functions & Parameters"}
                              {selectedSubject === "Health" && "Exercise & Mental Health"}
                              {selectedSubject === "Art" && "Perspective Drawing"}
                              {selectedSubject === "Music" && "Rhythm & Time Signatures"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Or try this one
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {messages.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2"}`}
                          data-testid={`message-${msg.role}-${idx}`}
                        >
                          {msg.role === "assistant" && (
                            <img 
                              src={robotTutor} 
                              alt="AI Tutor" 
                              className="w-10 h-10 rounded-full border-2 border-blue-200 flex-shrink-0"
                            />
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              msg.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-slate-200 text-slate-900"
                            }`}
                          >
                            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                            {msg.conceptsDiscussed && msg.conceptsDiscussed.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {msg.conceptsDiscussed.map((concept, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {concept}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start gap-2"
                    >
                      <img 
                        src={robotTutor} 
                        alt="AI Tutor" 
                        className="w-10 h-10 rounded-full border-2 border-blue-200 flex-shrink-0"
                      />
                      <div className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Tutor is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="flex gap-2">
                <Textarea
                  placeholder={`Ask me anything about ${selectedSubject}...`}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping || sessionLoading}
                  className="min-h-[80px]"
                  data-testid="input-message"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleVoiceInput}
                    disabled={isTyping || sessionLoading}
                    size="lg"
                    variant={isRecording ? "destructive" : "outline"}
                    className={isRecording ? "animate-pulse" : ""}
                    data-testid="button-voice-input"
                  >
                    <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isTyping || sessionLoading}
                    size="lg"
                    data-testid="button-send-message"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {isRecording && (
                <div className="flex items-center gap-2 text-red-600 text-sm animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-1 bg-red-600 rounded-full animate-pulse" style={{height: '12px', animationDelay: '0ms'}}></div>
                    <div className="w-1 bg-red-600 rounded-full animate-pulse" style={{height: '16px', animationDelay: '150ms'}}></div>
                    <div className="w-1 bg-red-600 rounded-full animate-pulse" style={{height: '20px', animationDelay: '300ms'}}></div>
                    <div className="w-1 bg-red-600 rounded-full animate-pulse" style={{height: '16px', animationDelay: '450ms'}}></div>
                    <div className="w-1 bg-red-600 rounded-full animate-pulse" style={{height: '12px', animationDelay: '600ms'}}></div>
                  </div>
                  <span>Listening... Speak in {selectedSubject === "Spanish" ? "Spanish" : selectedSubject === "French" ? "French" : selectedSubject === "Mandarin" ? "Mandarin" : "English"}</span>
                </div>
              )}

              {/* Interactive Learning Tools */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  🎯 Interactive Learning Tools
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage(`Please create a quick 5-question quiz on ${selectedSubject} to test my understanding. Include the answers at the end.`);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    disabled={isTyping || sessionLoading}
                    className="h-auto p-3 flex-col gap-1"
                    data-testid="button-request-quiz"
                  >
                    <span className="text-2xl">📝</span>
                    <span className="text-xs">Quiz Me</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage(`Please create a set of flashcards (10 cards) for key concepts in ${selectedSubject}. Show the question on one side and the answer on the other.`);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    disabled={isTyping || sessionLoading}
                    className="h-auto p-3 flex-col gap-1"
                    data-testid="button-request-flashcards"
                  >
                    <span className="text-2xl">🃏</span>
                    <span className="text-xs">Flashcards</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage(`Please give me a practice problem for ${selectedSubject} with step-by-step solution. I want to try solving it myself first.`);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    disabled={isTyping || sessionLoading}
                    className="h-auto p-3 flex-col gap-1"
                    data-testid="button-request-practice"
                  >
                    <span className="text-2xl">✏️</span>
                    <span className="text-xs">Practice</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage(`Can you explain this ${selectedSubject} concept using a real-world story or example that makes it easy to remember?`);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    disabled={isTyping || sessionLoading}
                    className="h-auto p-3 flex-col gap-1"
                    data-testid="button-request-story"
                  >
                    <span className="text-2xl">📖</span>
                    <span className="text-xs">Story</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage(`Please create a visual diagram or detailed description that helps me understand this ${selectedSubject} topic better.`);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    disabled={isTyping || sessionLoading}
                    className="h-auto p-3 flex-col gap-1"
                    data-testid="button-request-visual"
                  >
                    <span className="text-2xl">🎨</span>
                    <span className="text-xs">Visual Aid</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage(`Please create a fun memory trick, mnemonic, or rhyme to help me remember key facts about ${selectedSubject}.`);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    disabled={isTyping || sessionLoading}
                    className="h-auto p-3 flex-col gap-1"
                    data-testid="button-request-mnemonic"
                  >
                    <span className="text-2xl">🧠</span>
                    <span className="text-xs">Memory Trick</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ambient Sound Controller */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
                🎵 Focus & Calm
              </CardTitle>
              <CardDescription className="text-xs">
                Reduce stress with ambient sounds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {ambientSounds.map((sound) => (
                  <Button
                    key={sound.id}
                    onClick={() => toggleAmbientSound(sound.id)}
                    variant={ambientSound === sound.id ? "default" : "outline"}
                    size="sm"
                    className={`text-xs ${ambientSound === sound.id ? 'animate-pulse' : ''}`}
                    data-testid={`button-ambient-${sound.id}`}
                  >
                    <span className="mr-1">{sound.emoji}</span>
                    {sound.name}
                  </Button>
                ))}
              </div>
              {ambientSound && (
                <div className="space-y-2 pt-2 border-t">
                  <label className="text-xs text-muted-foreground">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={soundVolume}
                    onChange={(e) => updateVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Info Sidebar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Session Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {session ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium">{session.subject || selectedSubject}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Messages:</span>
                      <span className="font-medium">{session.totalMessages || messages.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{session.studentQuestions || Math.floor(messages.length / 2)}</span>
                    </div>
                  </div>

                  {session.conceptsCovered && session.conceptsCovered.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Concepts Covered
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {session.conceptsCovered.slice(0, 10).map((concept, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      Session started {new Date(session.startedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Start chatting to see session stats
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Your AI Learning Partner - Redesigned */}
        <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-purple-200 border-2">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">✨</div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900">Your AI Learning Partner</h4>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-semibold">You've got this!</span>
                </div>
                
                <p className="text-sm text-slate-700 leading-relaxed">
                  Think of AI as your patient study buddy who's always here to help you <strong>understand</strong> and <strong>grow</strong>. 
                  You're building skills that will last a lifetime! 💪
                </p>

                <div className="space-y-2.5">
                  <div className="bg-white p-3 rounded-lg border-2 border-blue-200 shadow-sm" data-testid="tip-ai-explore">
                    <div className="flex items-start gap-2">
                      <div className="text-lg">🎯</div>
                      <div>
                        <div className="font-medium text-sm text-blue-700 mb-1">Ask Questions Freely</div>
                        <p className="text-xs text-slate-600">No question is too small or "dumb"! Ask AI to explain things in different ways until it clicks. That's how learning works!</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border-2 border-purple-200 shadow-sm" data-testid="tip-ai-partner">
                    <div className="flex items-start gap-2">
                      <div className="text-lg">🤝</div>
                      <div>
                        <div className="font-medium text-sm text-purple-700 mb-1">Work Together with AI</div>
                        <p className="text-xs text-slate-600">Try problems yourself first, then ask AI to check your thinking and show you where you can improve. It's like having a personal coach!</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border-2 border-pink-200 shadow-sm" data-testid="tip-ai-understand">
                    <div className="flex items-start gap-2">
                      <div className="text-lg">🌟</div>
                      <div>
                        <div className="font-medium text-sm text-pink-700 mb-1">Build Real Understanding</div>
                        <p className="text-xs text-slate-600">Ask AI "why" and "how" questions. Request examples and visuals. The goal is to truly GET IT, not just get the answer!</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border-2 border-green-200">
                    <div className="flex items-start gap-2">
                      <div className="text-lg">💡</div>
                      <div>
                        <div className="font-medium text-sm text-green-700 mb-1">Remember: You're Training Your Brain!</div>
                        <p className="text-xs text-slate-600">Every time you work through a problem with AI's help, you're getting stronger. The struggle is where the learning happens! 🧠</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 hover:bg-purple-100"
                  onClick={() => {
                    setCurrentMessage("Can you show me how to become an amazing AI learning partner? I want to learn how to ask great questions!");
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  data-testid="button-learn-ai-literacy"
                >
                  ✨ Discover How to Be an AI Learning Pro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grow Your Skills */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🌱</div>
              <div className="space-y-2 flex-1">
                <h4 className="font-semibold text-slate-900">Ways to Grow Your Skills</h4>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">💙</span>
                    <span>Ask questions about anything you're curious about - curiosity is your superpower!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">💜</span>
                    <span>Request visual examples and different explanations until it makes sense to YOU</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">💗</span>
                    <span>Try solving on your own first - mistakes are how your brain learns best!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">💚</span>
                    <span>Celebrate every small win - you're building something amazing!</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
