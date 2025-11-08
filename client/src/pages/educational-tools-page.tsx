import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InteractiveWhiteboard from "@/components/educational-tools/interactive-whiteboard";
import QuizGenerator from "@/components/educational-tools/quiz-generator";
import ProgressTracker from "@/components/educational-tools/progress-tracker";
import ScreenSharing from "@/components/educational-tools/screen-sharing";
import { UserRole } from "@shared/schema";

export default function EducationalToolsPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Use the actual user role for proper authorization
  const currentRole = user?.role || UserRole.STUDENT;
  const [activeTab, setActiveTab] = useState("whiteboard");
  
  // Check URL for tab and session parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const sessionParam = urlParams.get('session');
    
    // Set the active tab if specified in URL
    if (tabParam && ['whiteboard', 'quiz', 'progress', 'screen-sharing'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    // If there's a session ID and we're on the screen-sharing tab, 
    // we could auto-join the session here
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <div id="onboard-sidebar">
        <Sidebar 
          open={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          user={user} 
          currentRole={currentRole}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div id="onboard-header">
          <Header 
            toggleSidebar={toggleSidebar} 
            title="Educational Tools" 
            user={user} 
            currentRole={currentRole}
          />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-6">
          {/* Educational Tools Introduction */}
          <div className="mb-6" id="onboard-tools-intro">
            <h1 className="text-2xl font-bold mb-2">Interactive Educational Tools</h1>
            <p className="text-gray-600">
              Enhance teaching and learning with our suite of specialized educational tools designed for 
              {currentRole === UserRole.EDUCATOR ? " educators" : currentRole === UserRole.STUDENT ? " students" : " administrators"}.
            </p>
          </div>
          
          {/* Tool Selection */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            <div className="flex justify-between items-center">
              <TabsList className="grid w-full max-w-md grid-cols-4" id="onboard-tools-tabs">
                <TabsTrigger value="whiteboard" className="flex items-center justify-center py-3" id="onboard-whiteboard-tab">
                  <svg 
                    className="w-4 h-4 mr-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  </svg>
                  <span className="hidden sm:inline">Whiteboard</span>
                  <span className="sm:hidden">Board</span>
                </TabsTrigger>
                
                {/* Quiz Creator - Available to educators only */}
                {currentRole === UserRole.EDUCATOR || currentRole === UserRole.ADMIN ? (
                  <TabsTrigger value="quiz" className="flex items-center justify-center py-3" id="onboard-quiz-tab">
                    <svg 
                      className="w-4 h-4 mr-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    </svg>
                    <span className="hidden sm:inline">Quiz Creator</span>
                    <span className="sm:hidden">Quiz</span>
                  </TabsTrigger>
                ) : (
                  <TabsTrigger disabled value="quiz" className="flex items-center justify-center py-3 opacity-50">
                    <svg 
                      className="w-4 h-4 mr-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    </svg>
                    <span className="hidden sm:inline">Quiz Creator</span>
                    <span className="sm:hidden">Quiz</span>
                  </TabsTrigger>
                )}
                
                <TabsTrigger value="progress" className="flex items-center justify-center py-3" id="onboard-progress-tab">
                  <svg 
                    className="w-4 h-4 mr-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M12 20V10M18 20V4M6 20v-4" />
                  </svg>
                  <span className="hidden sm:inline">Progress Tracker</span>
                  <span className="sm:hidden">Progress</span>
                </TabsTrigger>
                
                <TabsTrigger value="screen-sharing" className="flex items-center justify-center py-3" id="onboard-screen-sharing-tab">
                  <svg 
                    className="w-4 h-4 mr-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span className="hidden sm:inline">Screen Sharing</span>
                  <span className="sm:hidden">Share</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Creator buttons only appear for educators and admins */}
              {(currentRole === UserRole.EDUCATOR || currentRole === UserRole.ADMIN) && (
                <div className="hidden md:block">
                  <Button variant="outline" className="mr-2">
                    <svg 
                      className="w-4 h-4 mr-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M8 6h12a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2zM2 20h12a2 2 0 002-2V10a2 2 0 00-2-2H2" />
                    </svg>
                    Templates
                  </Button>
                  <Button>
                    <svg 
                      className="w-4 h-4 mr-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M12 5v14M19 12H5" />
                    </svg>
                    Create New
                  </Button>
                </div>
              )}
            </div>
            
            <TabsContent value="whiteboard" className="mt-6">
              <InteractiveWhiteboard />
            </TabsContent>
            
            <TabsContent value="quiz" className="mt-6">
              {currentRole === UserRole.EDUCATOR || currentRole === UserRole.ADMIN ? (
                <QuizGenerator />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <svg 
                    className="w-16 h-16 text-gray-400 mb-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1"
                  >
                    <path d="M12 15v2m0-6v.01M7 3h14a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-1">Restricted Access</h3>
                  <p className="text-gray-500 max-w-md">
                    The Quiz Creator tool is only available to educators. Students can take quizzes but cannot create them.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="progress" className="mt-6">
              <ProgressTracker />
            </TabsContent>
            
            <TabsContent value="screen-sharing" className="mt-6">
              <ScreenSharing />
            </TabsContent>
          </Tabs>
          
          {/* Additional Tools Section */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Lesson Planner - Only visible to educators and admins */}
              {(currentRole === UserRole.EDUCATOR || currentRole === UserRole.ADMIN) && (
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Lesson Planner</CardTitle>
                    <CardDescription>Create and manage lesson plans</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Organize curriculum content, align with standards, and share lesson materials with students.
                    </p>
                    <Button variant="outline" className="w-full">
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {/* AI Study Assistant - Visible to all roles */}
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI Study Assistant</CardTitle>
                  <CardDescription>Personalized learning support</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    {currentRole === UserRole.STUDENT 
                      ? "Get homework help, generate practice questions, and receive instant explanations on any topic."
                      : "Create personalized learning materials, generate questions, and help students with difficult concepts."}
                  </p>
                  <Button variant="outline" className="w-full">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
              
              {/* Virtual Labs - Visible to all roles */}
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Virtual Labs</CardTitle>
                  <CardDescription>Interactive science simulations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Conduct virtual experiments and explore scientific concepts through interactive simulations.
                  </p>
                  <Button variant="outline" className="w-full">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
              
              {/* Grade Analytics - Only visible to educators and admins */}
              {(currentRole === UserRole.EDUCATOR || currentRole === UserRole.ADMIN) && (
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Grade Analytics</CardTitle>
                    <CardDescription>Advanced performance tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Review detailed performance metrics, identify learning gaps, and create targeted interventions.
                    </p>
                    <Button variant="outline" className="w-full">
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {/* Study Guides - Only visible to students */}
              {currentRole === UserRole.STUDENT && (
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Study Guides</CardTitle>
                    <CardDescription>Organized learning resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Access subject-specific study guides with key concepts, practice problems, and links to additional resources.
                    </p>
                    <Button variant="outline" className="w-full">
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}