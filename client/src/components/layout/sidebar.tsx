import { User } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
  user: User | null;
  currentRole: string;
}

export default function Sidebar({ open, toggleSidebar, user, currentRole }: SidebarProps) {
  const [location] = useLocation();
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "?";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "md:flex md:w-64 flex-shrink-0 flex-col bg-white border-r border-neutral-100 z-30",
          open ? "fixed inset-y-0 left-0 w-64 flex flex-col" : "hidden"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-neutral-100">
          <div className="flex items-center">
            <svg 
              className="w-7 h-7 text-primary-500 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 4L3 9L12 14L21 9L12 4Z" 
                fill="currentColor" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M3 14L12 19L21 14" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-semibold text-neutral-700">EdConnect</span>
          </div>
        </div>
        
        {/* User Profile Section */}
        <div className="px-4 py-4 border-b border-neutral-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-medium">
              {getUserInitials()}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-neutral-700">
                {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
              </div>
              <div className="text-xs text-neutral-500">
                {user && user.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "Guest"}
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center bg-primary-50 text-primary-700 rounded-md py-1 px-2 text-xs">
            <svg
              className="w-3 h-3 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Verified Account</span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="overflow-y-auto flex-grow">
          <nav className="py-2 px-2 space-y-1">
            <Link href="/" className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              location === "/" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-50"
            )}>
              <svg
                className="mr-3 text-lg w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Dashboard</span>
            </Link>
            
            <div className="pt-2 pb-1">
              <p className="px-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Data Management</p>
            </div>
            
            {currentRole === "admin" && (
              <Link href="#educators" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-neutral-50">
                <svg
                  className="mr-3 text-lg w-5 h-5 text-neutral-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Educators</span>
              </Link>
            )}
            
            <Link href="#students" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-neutral-50">
              <svg
                className="mr-3 text-lg w-5 h-5 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Students</span>
            </Link>
            
            <Link href="#grades" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-neutral-50">
              <svg
                className="mr-3 text-lg w-5 h-5 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Grades</span>
            </Link>
            
            <Link href="#attendance" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-neutral-50">
              <svg
                className="mr-3 text-lg w-5 h-5 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Attendance</span>
            </Link>
            
            <div className="pt-2 pb-1">
              <p className="px-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Tools</p>
            </div>
            
            <Link href="/educational-tools" className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              location === "/educational-tools" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-50"
            )}>
              <svg
                className="mr-3 text-lg w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Educational Tools</span>
            </Link>
            
            <Link href="/learning-path" className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              location === "/learning-path" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-50"
            )}>
              <svg
                className="mr-3 text-lg w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l4 4L5 19l-4-4z"></path>
                <path d="M14 4l6 6"></path>
                <path d="M15 15l-2 2"></path>
                <path d="M19 19l-2 2"></path>
              </svg>
              <span>Learning Paths</span>
            </Link>
            
            <Link href="/study-tools" className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              location === "/study-tools" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-50"
            )}>
              <svg
                className="mr-3 text-lg w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Study Tools</span>
            </Link>
            
            <div className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-neutral-50 relative group">
              <svg
                className="mr-3 text-lg w-5 h-5 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Lesson Planner</span>
              <div className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Soon</div>
              <div className="absolute left-12 top-full mt-1 w-48 p-2 bg-white shadow-lg rounded-md border text-xs z-50 hidden group-hover:block">
                <p>This feature is coming soon! We're building a comprehensive lesson planning tool for educators.</p>
              </div>
            </div>
            
            <div className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-neutral-50 relative group">
              <svg
                className="mr-3 text-lg w-5 h-5 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
                <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
                <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
                <line x1="14.83" y1="9.17" x2="18.36" y2="5.64" />
                <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
              </svg>
              <span>AI Analytics</span>
              <div className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Soon</div>
              <div className="absolute left-12 top-full mt-1 w-48 p-2 bg-white shadow-lg rounded-md border text-xs z-50 hidden group-hover:block">
                <p>Our AI analytics feature is under development. It will provide deep insights into learning patterns.</p>
              </div>
            </div>
            
            <div className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-neutral-50 relative group">
              <svg
                className="mr-3 text-lg w-5 h-5 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Integrations</span>
              <div className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Soon</div>
              <div className="absolute left-12 top-full mt-1 w-48 p-2 bg-white shadow-lg rounded-md border text-xs z-50 hidden group-hover:block">
                <p>Connect with third-party educational platforms and tools. This feature is coming soon.</p>
              </div>
            </div>
            
            <div className="pt-2 pb-1">
              <p className="px-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">System</p>
            </div>
            
            <div className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-neutral-50 relative group">
              <svg
                className="mr-3 text-lg w-5 h-5 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
              <div className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Soon</div>
              <div className="absolute left-12 top-full mt-1 w-48 p-2 bg-white shadow-lg rounded-md border text-xs z-50 hidden group-hover:block">
                <p>Platform configuration settings and personalization options.</p>
              </div>
            </div>
            
            <div className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-neutral-50 relative group">
              <svg
                className="mr-3 text-lg w-5 h-5 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Security</span>
              <div className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Soon</div>
              <div className="absolute left-12 top-full mt-1 w-48 p-2 bg-white shadow-lg rounded-md border text-xs z-50 hidden group-hover:block">
                <p>Advanced security settings and privacy controls.</p>
              </div>
            </div>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-neutral-50">
              <svg
                className="mr-3 text-lg w-5 h-5 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Help & Support</span>
            </a>
          </nav>
        </div>
        
        {/* FERPA Compliance Badge */}
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center p-2 bg-neutral-50 rounded-md">
            <svg
              className="text-green-500 mr-2 text-lg w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9.1 12a2.1 2.1 0 0 1 0 2.1" />
              <path d="M14.9 9.9a9 9 0 0 1 0 4.2" />
              <path d="M12 12h.01" />
            </svg>
            <div>
              <div className="text-xs font-medium text-neutral-700">FERPA Compliant</div>
              <div className="text-xs text-neutral-500">Data protected</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
