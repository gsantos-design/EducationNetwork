import { useState } from "react";
import { User, UserRole } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import HelpButton from "@/components/onboarding/help-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
  user: User | null;
  currentRole: string;
}

export default function Header({ toggleSidebar, title, user, currentRole }: HeaderProps) {
  const { logoutMutation } = useAuth();
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "?";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-between px-4">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-neutral-700 hidden md:block">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <Input 
                type="text" 
                className="pl-10 pr-3 py-2 text-sm bg-neutral-50 border-transparent" 
                placeholder="Search..." 
              />
            </div>
            
            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
            >
              <span className="relative">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">3</span>
              </span>
            </Button>
            
            {/* Help Button */}
            <div className="help-button-container">
              <HelpButton 
                variant="ghost" 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                tooltipText="Start Interactive Tutorial" 
              />
            </div>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-500 font-medium hover:bg-primary-200"
                >
                  {getUserInitials()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5">
                  <div className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : "Guest"}</div>
                  <div className="text-xs text-muted-foreground">{user?.email || "No email"}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Role Indicator */}
      <div className="border-b border-neutral-100 py-2">
        <div className="px-4 text-center text-sm font-medium text-primary-700">
          {currentRole === UserRole.EDUCATOR && "Educator Dashboard"}
          {currentRole === UserRole.STUDENT && "Student Dashboard"}
          {currentRole === UserRole.ADMIN && "Administrator Dashboard"}
        </div>
      </div>
    </header>
  );
}
