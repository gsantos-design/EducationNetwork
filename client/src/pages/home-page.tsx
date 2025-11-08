import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatusCards from "@/components/dashboard/status-cards";
import PerformanceChart from "@/components/dashboard/performance-chart";
import AIInsights from "@/components/dashboard/ai-insights";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";
import Integrations from "@/components/dashboard/integrations";
import SecurityCompliance from "@/components/dashboard/security-compliance";
import EducatorProfiles from "@/components/dashboard/educator-profiles";
import { UserRole } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Use the actual user role
  const currentRole = user?.role || UserRole.STUDENT;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get title based on role
  const getDashboardTitle = () => {
    switch (currentRole) {
      case UserRole.EDUCATOR:
        return "Educator Dashboard";
      case UserRole.STUDENT:
        return "Student Dashboard";
      case UserRole.ADMIN:
        return "Administrator Dashboard";
      default:
        return "Dashboard";
    }
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
            title={getDashboardTitle()} 
            user={user} 
            currentRole={currentRole}
          />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-6">
          {/* Status Cards */}
          <div id="onboard-status-cards">
            <StatusCards currentRole={currentRole} />
          </div>
          
          {/* Admin-specific Educator Profiles Section */}
          {currentRole === UserRole.ADMIN && (
            <div className="mt-6" id="onboard-educator-profiles">
              <EducatorProfiles />
            </div>
          )}
          
          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - Student Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <div id="onboard-performance">
                <PerformanceChart currentRole={currentRole} />
              </div>
              <div id="onboard-ai-insights">
                <AIInsights currentRole={currentRole} />
              </div>
              <div id="onboard-recent-activity">
                <RecentActivity currentRole={currentRole} />
              </div>
            </div>
            
            {/* Right Column - Tools and Resources */}
            <div className="space-y-6">
              <div id="onboard-quick-actions">
                <QuickActions currentRole={currentRole} />
              </div>
              <div id="onboard-integrations">
                <Integrations />
              </div>
              <div id="onboard-security">
                <SecurityCompliance />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
