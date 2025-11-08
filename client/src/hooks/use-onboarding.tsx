import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useAuth } from "./use-auth";
import { UserRole } from "@shared/schema";

type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'right' | 'bottom' | 'left' | 'center';
  role?: string[]; // Optional: specific to user roles
};

// Separate step definitions for each role
const studentSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "👋 Hey! I'm Tutor Bot!",
    description: "I'm your personal AI learning buddy! I'm here to help you ace every subject. Let me show you around - this will be fun, I promise! 🎉",
    target: "body",
    position: "center",
    role: ["student"],
  },
  {
    id: "ai-tutor-intro",
    title: "🤖 Your 24/7 Study Buddy",
    description: "The AI Tutor is like having a super-smart friend who never gets tired! Ask questions about ANY subject - math, science, history, Spanish - anything! I'll explain stuff in ways that actually make sense.",
    target: "body",
    position: "center",
    role: ["student"],
  },
  {
    id: "how-it-works",
    title: "💬 Let's Chat About Learning!",
    description: "Just type your question like you're texting a friend! Say things like 'Help me understand photosynthesis' or 'Why does algebra even matter?' I'll give you awesome explanations with visuals and examples!",
    target: "body",
    position: "center",
    role: ["student"],
  },
  {
    id: "smart-use",
    title: "🎯 Use AI Smart, Not for Cheating!",
    description: "Here's the deal: I help you LEARN, not just get answers. Ask me to EXPLAIN things, work through problems TOGETHER, and understand WHY concepts work. That's how you actually get smarter! 💪",
    target: "body",
    position: "center",
    role: ["student"],
  },
  {
    id: "subjects",
    title: "📚 All Your Subjects, One Place",
    description: "Switch between subjects super easily! Whether you need help with Geometry proofs or writing an English essay, just pick your subject and start asking questions!",
    target: "body",
    position: "center",
    role: ["student"],
  },
  {
    id: "exam-prep",
    title: "🎓 Ace Your Tests!",
    description: "Got a Regents exam coming up? SAT prep? No sweat! I can help you practice, review tough concepts, and build confidence before test day!",
    target: "body",
    position: "center",
    role: ["student"],
  },
  {
    id: "study-tools",
    title: "⏰ Bonus: Cool Study Tools!",
    description: "Check out the Study Tools section for focus timers, ambient sounds, and more ways to level up your study game!",
    target: "body",
    position: "center",
    role: ["student"],
  },
  {
    id: "ready",
    title: "🚀 You're All Set!",
    description: "That's it! You're ready to start learning smarter. Remember: I'm here 24/7 whenever you need help. Let's crush it together! Click 'Finish' to jump in!",
    target: "body",
    position: "center",
    role: ["student"],
  },
];

const educatorSteps: OnboardingStep[] = [
  {
    id: "dashboard",
    title: "Welcome to EdConnect!",
    description: "This is your instructor dashboard. Monitor your classes, manage assignments, and track student progress.",
    target: "body",
    position: "center",
    role: ["educator"],
  },
  {
    id: "status-cards",
    title: "Class Overview",
    description: "These cards show attendance stats, grading progress, and upcoming class events.",
    target: "#onboard-status-cards",
    position: "bottom",
    role: ["educator"],
  },
  {
    id: "performance-chart",
    title: "Class Performance",
    description: "Track how your students are performing across different assessments and subjects.",
    target: "#onboard-performance",
    position: "left",
    role: ["educator"],
  },
  {
    id: "ai-insights",
    title: "AI Insights",
    description: "Get personalized recommendations and insights about your teaching effectiveness.",
    target: "#onboard-ai-insights",
    position: "top",
    role: ["educator"],
  },
  {
    id: "help-button",
    title: "Need Help?",
    description: "Click this button anytime to restart the tutorial or get help with the platform.",
    target: ".help-button-container", 
    position: "left",
    role: ["educator"],
  },
  {
    id: "educational-tools",
    title: "Teaching Tools",
    description: "Create interactive lessons, quizzes, and share your screen during remote sessions.",
    target: "#onboard-tools-tabs",
    position: "top",
    role: ["educator"],
  },
];

const adminSteps: OnboardingStep[] = [
  {
    id: "dashboard",
    title: "Welcome to EdConnect Admin!",
    description: "This is your administration dashboard. Manage users, monitor system usage, and ensure compliance.",
    target: "body",
    position: "center",
    role: ["admin"],
  },
  {
    id: "status-cards",
    title: "System Overview",
    description: "Monitor active users, system performance, and potential security alerts.",
    target: "#onboard-status-cards",
    position: "bottom",
    role: ["admin"],
  },
  {
    id: "educator-profiles",
    title: "Educator Performance Profiles",
    description: "Review educator performance metrics and identify teachers who may need additional support.",
    target: "#onboard-educator-profiles",
    position: "top",
    role: ["admin"],
  },
  {
    id: "performance-chart",
    title: "Performance Analytics",
    description: "View school-wide performance data across all departments and subjects.",
    target: "#onboard-performance",
    position: "left",
    role: ["admin"],
  },
  {
    id: "security-compliance",
    title: "Security & Compliance",
    description: "Review security settings and ensure FERPA compliance across the platform.",
    target: "#onboard-security",
    position: "left",
    role: ["admin"],
  },
  {
    id: "integrations",
    title: "System Integrations",
    description: "Manage external integrations with other educational systems and tools.",
    target: "#onboard-integrations",
    position: "right",
    role: ["admin"],
  },
  {
    id: "help-button",
    title: "Need Help?",
    description: "Click this button anytime to restart the tutorial or get help with the platform.",
    target: ".help-button-container",
    position: "left",
    role: ["admin"],
  },
];

// Role-specific step mapping
const roleSpecificStepsMap = {
  [UserRole.STUDENT]: studentSteps,
  [UserRole.EDUCATOR]: educatorSteps,
  [UserRole.ADMIN]: adminSteps,
};

type OnboardingContextType = {
  isOnboarding: boolean;
  currentStep: number;
  steps: OnboardingStep[];
  startOnboarding: () => void;
  endOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

const ONBOARDING_STORAGE_KEY = "edconnect-onboarding-completed";

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);

  // Initialize steps based on user role
  useEffect(() => {
    if (user) {
      const userRole = user.role as UserRole;
      
      // Get steps specific to the user's role
      const roleSpecificSteps = roleSpecificStepsMap[userRole] || [];
      
      setSteps(roleSpecificSteps);
      
      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem(
        `${ONBOARDING_STORAGE_KEY}-${user.id}`
      );
      
      if (!hasCompletedOnboarding && roleSpecificSteps.length > 0) {
        // Start onboarding automatically for new users
        // With a slight delay to ensure UI is loaded
        const timer = setTimeout(() => {
          setIsOnboarding(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const startOnboarding = () => {
    setCurrentStep(0);
    setIsOnboarding(true);
  };

  const endOnboarding = () => {
    if (user) {
      localStorage.setItem(`${ONBOARDING_STORAGE_KEY}-${user.id}`, "true");
    }
    setIsOnboarding(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    endOnboarding();
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        steps,
        startOnboarding,
        endOnboarding,
        nextStep,
        prevStep,
        skipOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}