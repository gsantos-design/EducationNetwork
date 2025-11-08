import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { UserRole } from "@shared/schema";
import LearningPathVisualization from "@/components/learning-path/learning-path-visualization";

export default function LearningPathPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentRole = user?.role || UserRole.STUDENT;

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
            title="Learning Paths" 
            user={user} 
            currentRole={currentRole}
          />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Learning Path Visualization</h1>
            <p className="text-gray-600">
              {currentRole === UserRole.STUDENT
                ? "View your personalized learning journey and track your progress through various subjects and skills."
                : currentRole === UserRole.EDUCATOR
                ? "Monitor student learning paths and customize curriculum progression for optimal learning outcomes."
                : "Analyze learning path effectiveness and monitor curriculum implementation across the institution."}
            </p>
          </div>
          
          {/* Learning Path Visualization Component */}
          <LearningPathVisualization />
          
          {/* Additional Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-lg mb-2">How It Works</h3>
              <p className="text-sm text-gray-600">
                Learning paths visualize your educational journey through interconnected concepts, skills, and assessments. 
                Each node represents a specific learning objective, with connections showing prerequisites and advancement opportunities.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-lg mb-2">Benefits</h3>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Visualize your learning progress at a glance</li>
                <li>Understand connections between different topics</li>
                <li>Identify knowledge gaps and strengths</li>
                <li>Plan your study time more effectively</li>
              </ul>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-lg mb-2">Get Support</h3>
              <p className="text-sm text-gray-600 mb-3">
                Need help understanding your learning path or want to discuss customization options?
              </p>
              <button className="text-primary text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 12h8M12 8v8M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                </svg>
                Contact Your {currentRole === UserRole.STUDENT ? "Teacher" : "Support Team"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}