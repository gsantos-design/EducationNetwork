import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserRole } from "@shared/schema";
import FocusTimer from "@/components/study-tools/focus-timer";
import AICompanion from "@/components/study-tools/ai-companion";
import { 
  Clock, 
  FileText, 
  Book, 
  Headphones, 
  Users, 
  Lightbulb,
  Bot,
  Gamepad2,
  GraduationCap
} from "lucide-react";

export default function StudyToolsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("focus");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  if (!user) return null;
  
  const currentRole = user.role;
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Tools</h1>
          <p className="text-muted-foreground">
            Tools to enhance your learning and study experience
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="focus" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto gap-2">
          <TabsTrigger value="focus" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">Focus Timer</span>
          </TabsTrigger>
          
          <TabsTrigger value="companion" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bot className="h-4 w-4 mr-2" />
            <span className="text-sm">AI Companion</span>
          </TabsTrigger>
          
          <TabsTrigger value="notes" disabled className="py-2 relative group">
            <FileText className="h-4 w-4 mr-2" />
            <span className="text-sm">Note Taking</span>
            <div className="absolute -top-1 -right-1 px-1 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Soon</div>
            <div className="absolute left-0 top-full mt-1 w-48 p-2 bg-white shadow-lg rounded-md border text-xs z-50 hidden group-hover:block">
              <p>Take and organize your study notes with advanced formatting tools. Coming soon!</p>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="lessons" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <GraduationCap className="h-4 w-4 mr-2" />
            <span className="text-sm">Lesson Plans</span>
          </TabsTrigger>
          
          <TabsTrigger value="games" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Gamepad2 className="h-4 w-4 mr-2" />
            <span className="text-sm">Learning Games</span>
          </TabsTrigger>
          
          <TabsTrigger value="ai" disabled className="py-2 relative group">
            <Lightbulb className="h-4 w-4 mr-2" />
            <span className="text-sm">AI Tutor</span>
            <div className="absolute -top-1 -right-1 px-1 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Soon</div>
            <div className="absolute left-0 top-full mt-1 w-48 p-2 bg-white shadow-lg rounded-md border text-xs z-50 hidden group-hover:block">
              <p>Get personalized AI tutoring for specific subjects. Coming soon!</p>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="focus" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="col-span-1 md:col-span-1 xl:col-span-2">
              <FocusTimer currentRole={currentRole} />
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Focus Technique</CardTitle>
                  <CardDescription>
                    Pomodoro and other focus techniques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Pomodoro Technique</h3>
                      <p className="text-sm text-muted-foreground">
                        Work in focused 25-minute intervals, followed by 5-minute breaks. 
                        After 4 pomodoros, take a longer 15-30 minute break.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Whisper Mode Benefits</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Reduces visual distractions</li>
                        <li>• Creates a calm study environment</li>
                        <li>• Combines with ambient sounds for deeper focus</li>
                        <li>• Helps maintain longer concentration</li>
                      </ul>
                    </div>
                    
                    <Button variant="outline" className="w-full" disabled>
                      View More Techniques
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Focus Stats</CardTitle>
                  <CardDescription>
                    Your focus session statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Today</div>
                      <div className="text-2xl font-bold">0 min</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">This Week</div>
                      <div className="text-2xl font-bold">0 min</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Sessions</div>
                      <div className="text-2xl font-bold">0</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Streak</div>
                      <div className="text-2xl font-bold">0 days</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="companion" className="space-y-4">
          <div className="h-[calc(100vh-275px)]">
            <AICompanion />
          </div>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Note Taking</CardTitle>
              <CardDescription>
                This feature is coming soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Note taking tools will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lessons" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Algebra Lesson Plans */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-3xl mb-2">📐</div>
                <CardTitle>Algebra I</CardTitle>
                <CardDescription>Master equations, functions, and graphing</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Linear Equations</span>
                    <span className="text-green-600 font-medium">8 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Quadratic Functions</span>
                    <span className="text-green-600 font-medium">6 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Systems of Equations</span>
                    <span className="text-green-600 font-medium">5 lessons</span>
                  </div>
                  <Button className="w-full mt-2" size="sm" data-testid="button-start-algebra">Start Learning</Button>
                </div>
              </CardContent>
            </Card>

            {/* Geometry Lesson Plans */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-3xl mb-2">📏</div>
                <CardTitle>Geometry</CardTitle>
                <CardDescription>Shapes, proofs, and spatial reasoning</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Triangle Congruence</span>
                    <span className="text-green-600 font-medium">7 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Circle Theorems</span>
                    <span className="text-green-600 font-medium">6 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Geometric Proofs</span>
                    <span className="text-green-600 font-medium">8 lessons</span>
                  </div>
                  <Button className="w-full mt-2" size="sm" data-testid="button-start-geometry">Start Learning</Button>
                </div>
              </CardContent>
            </Card>

            {/* Chemistry Lesson Plans */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="text-3xl mb-2">🧪</div>
                <CardTitle>Chemistry</CardTitle>
                <CardDescription>Elements, reactions, and molecular structure</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Atomic Structure</span>
                    <span className="text-green-600 font-medium">6 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Chemical Bonding</span>
                    <span className="text-green-600 font-medium">7 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Stoichiometry</span>
                    <span className="text-green-600 font-medium">5 lessons</span>
                  </div>
                  <Button className="w-full mt-2" size="sm" data-testid="button-start-chemistry">Start Learning</Button>
                </div>
              </CardContent>
            </Card>

            {/* Biology Lesson Plans */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-teal-50 to-cyan-50">
                <div className="text-3xl mb-2">🧬</div>
                <CardTitle>Biology</CardTitle>
                <CardDescription>Life sciences, cells, and genetics</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Cell Biology</span>
                    <span className="text-green-600 font-medium">8 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>DNA & Genetics</span>
                    <span className="text-green-600 font-medium">7 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Ecosystems</span>
                    <span className="text-green-600 font-medium">6 lessons</span>
                  </div>
                  <Button className="w-full mt-2" size="sm" data-testid="button-start-biology">Start Learning</Button>
                </div>
              </CardContent>
            </Card>

            {/* Spanish Lesson Plans */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="text-3xl mb-2">🇪🇸</div>
                <CardTitle>Spanish</CardTitle>
                <CardDescription>Vocabulary, grammar, and conversation</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Present Tense Verbs</span>
                    <span className="text-green-600 font-medium">10 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Essential Vocabulary</span>
                    <span className="text-green-600 font-medium">12 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Conversation Practice</span>
                    <span className="text-green-600 font-medium">8 lessons</span>
                  </div>
                  <Button className="w-full mt-2" size="sm" data-testid="button-start-spanish">Start Learning</Button>
                </div>
              </CardContent>
            </Card>

            {/* Global Studies Lesson Plans */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="text-3xl mb-2">🌍</div>
                <CardTitle>Global Studies</CardTitle>
                <CardDescription>World history, geography, and cultures</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Ancient Civilizations</span>
                    <span className="text-green-600 font-medium">9 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>World Wars</span>
                    <span className="text-green-600 font-medium">7 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Modern Politics</span>
                    <span className="text-green-600 font-medium">6 lessons</span>
                  </div>
                  <Button className="w-full mt-2" size="sm" data-testid="button-start-global">Start Learning</Button>
                </div>
              </CardContent>
            </Card>

            {/* Build Your First App with AI - NEW! */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="bg-gradient-to-br from-purple-100 to-pink-100">
                <div className="flex items-center justify-between">
                  <div className="text-3xl mb-2">🚀</div>
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-semibold">FUN!</span>
                </div>
                <CardTitle>Build Your First App with AI</CardTitle>
                <CardDescription>Create real apps while learning to code!</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>🎮 Build a Game with AI Help</span>
                    <span className="text-purple-600 font-medium">5 projects</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>📱 Create a Social Media Clone</span>
                    <span className="text-purple-600 font-medium">6 projects</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>🤖 Make Your Own AI Chatbot</span>
                    <span className="text-purple-600 font-medium">4 projects</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>🎨 Design Your Portfolio Site</span>
                    <span className="text-purple-600 font-medium">3 projects</span>
                  </div>
                  <Button className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white" size="sm" data-testid="button-start-build-apps">Start Building!</Button>
                </div>
              </CardContent>
            </Card>

            {/* Math Meets Code - NEW! */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-yellow-300">
              <CardHeader className="bg-gradient-to-br from-yellow-100 to-orange-100">
                <div className="flex items-center justify-between">
                  <div className="text-3xl mb-2">🎯</div>
                  <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full font-semibold">FUN!</span>
                </div>
                <CardTitle>Math Meets Code</CardTitle>
                <CardDescription>See how algebra & geometry power your apps!</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>🎲 Use Algebra to Build Games</span>
                    <span className="text-yellow-600 font-medium">7 projects</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>📊 Code a Data Analyzer</span>
                    <span className="text-yellow-600 font-medium">5 projects</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>🎨 Geometry in Graphics</span>
                    <span className="text-yellow-600 font-medium">6 projects</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>🤖 AI Math: Predictions & ML</span>
                    <span className="text-yellow-600 font-medium">4 projects</span>
                  </div>
                  <Button className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700 text-white" size="sm" data-testid="button-start-math-code">Start Coding!</Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Literacy & Ethics - NEW! */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-indigo-300">
              <CardHeader className="bg-gradient-to-br from-indigo-100 to-purple-100">
                <div className="flex items-center justify-between">
                  <div className="text-3xl mb-2">🤖</div>
                  <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full font-semibold">ESSENTIAL</span>
                </div>
                <CardTitle>Smart AI Use</CardTitle>
                <CardDescription>Master AI as your learning superpower!</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>💡 Think Critically with AI</span>
                    <span className="text-green-600 font-medium">5 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>✅ Use AI Right (Not Cheat!)</span>
                    <span className="text-green-600 font-medium">4 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>🚀 AI as Your Study Partner</span>
                    <span className="text-green-600 font-medium">6 lessons</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>🎓 Ask Better AI Questions</span>
                    <span className="text-green-600 font-medium">5 lessons</span>
                  </div>
                  <Button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700" size="sm" data-testid="button-start-ai-literacy">Start Learning</Button>
                </div>
              </CardContent>
            </Card>

            {/* Exam Prep & Assessment - NEW! */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50">
              <CardHeader className="bg-gradient-to-br from-red-100 to-orange-100">
                <div className="flex items-center justify-between">
                  <div className="text-3xl mb-2">📊</div>
                  <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-semibold">ESSENTIAL</span>
                </div>
                <CardTitle>Exam Prep & Assessment</CardTitle>
                <CardDescription>Ace your Regents, SAT, and AP exams!</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>📝 Diagnostic Assessment</span>
                    <span className="text-red-600 font-medium">Find Your Level</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>🎓 NY Regents Exam Prep</span>
                    <span className="text-red-600 font-medium">12 practice tests</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>📚 SAT/ACT Prep</span>
                    <span className="text-red-600 font-medium">8 full tests</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>🏆 AP Exam Practice</span>
                    <span className="text-red-600 font-medium">10 subjects</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>📈 Track Your Progress</span>
                    <span className="text-red-600 font-medium">Live dashboard</span>
                  </div>
                  <Button className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white" size="sm" data-testid="button-start-exam-prep">Start Assessment</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="games" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Math Challenge */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="bg-gradient-to-br from-blue-100 to-indigo-100">
                <div className="text-4xl mb-2">🎯</div>
                <CardTitle>Math Speed Challenge</CardTitle>
                <CardDescription>Solve equations as fast as you can</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Practice mental math with timed challenges. Beat your high score!
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Algebra</span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Timed</span>
                  </div>
                  <Button className="w-full" variant="default" data-testid="button-play-math-challenge">Play Game</Button>
                </div>
              </CardContent>
            </Card>

            {/* Vocabulary Match */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="bg-gradient-to-br from-orange-100 to-amber-100">
                <div className="text-4xl mb-2">🃏</div>
                <CardTitle>Vocabulary Match</CardTitle>
                <CardDescription>Match words with their definitions</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Memory matching game for language vocabulary. Fun and educational!
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">Spanish</span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Memory</span>
                  </div>
                  <Button className="w-full" variant="default" data-testid="button-play-vocab-match">Play Game</Button>
                </div>
              </CardContent>
            </Card>

            {/* Element Quiz */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="bg-gradient-to-br from-green-100 to-emerald-100">
                <div className="text-4xl mb-2">⚗️</div>
                <CardTitle>Element Hunter</CardTitle>
                <CardDescription>Find elements on the periodic table</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Race against the clock to identify chemical elements by their symbols!
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Chemistry</span>
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">Quiz</span>
                  </div>
                  <Button className="w-full" variant="default" data-testid="button-play-element-hunter">Play Game</Button>
                </div>
              </CardContent>
            </Card>

            {/* Geography Challenge */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="bg-gradient-to-br from-teal-100 to-cyan-100">
                <div className="text-4xl mb-2">🌎</div>
                <CardTitle>Geography Master</CardTitle>
                <CardDescription>Test your world geography knowledge</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Identify countries, capitals, and landmarks from around the world!
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded">Global</span>
                    <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded">Map</span>
                  </div>
                  <Button className="w-full" variant="default" data-testid="button-play-geography">Play Game</Button>
                </div>
              </CardContent>
            </Card>

            {/* Biology Matching */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="bg-gradient-to-br from-pink-100 to-rose-100">
                <div className="text-4xl mb-2">🧬</div>
                <CardTitle>Cell Parts Challenge</CardTitle>
                <CardDescription>Label parts of the cell correctly</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Drag and drop cell organelles to their correct locations!
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded">Biology</span>
                    <span className="px-2 py-1 bg-rose-50 text-rose-700 text-xs rounded">Visual</span>
                  </div>
                  <Button className="w-full" variant="default" data-testid="button-play-cell-parts">Play Game</Button>
                </div>
              </CardContent>
            </Card>

            {/* History Timeline */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="bg-gradient-to-br from-purple-100 to-violet-100">
                <div className="text-4xl mb-2">⏳</div>
                <CardTitle>Timeline Challenge</CardTitle>
                <CardDescription>Put historical events in order</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Arrange major historical events in chronological order!
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">History</span>
                    <span className="px-2 py-1 bg-violet-50 text-violet-700 text-xs rounded">Puzzle</span>
                  </div>
                  <Button className="w-full" variant="default" data-testid="button-play-timeline">Play Game</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Study Groups</CardTitle>
              <CardDescription>
                This feature is coming soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Study group tools will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Tutor</CardTitle>
              <CardDescription>
                This feature is coming soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">AI tutor will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}