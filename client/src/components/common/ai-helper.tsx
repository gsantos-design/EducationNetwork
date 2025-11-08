import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, Minimize, Maximize, MessageSquare, ChevronRight, AlertCircle, Lightbulb, Award, GraduationCap, Users, Settings2, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";

// Different types of helper messages
type MessageType = "tip" | "response" | "alert" | "welcome" | "system";

// Message structure
type HelperMessage = {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
};

// Component size states
type HelperSize = "minimized" | "compact" | "expanded";

// Available contexts for the helper
type HelperContext = "general" | "learning-path" | "grades" | "dashboard" | "study-tools" | "educational-tools" | "knowledge-sharing";

// User interaction history
type InteractionPattern = {
  topics: Record<string, number>; // Topic frequency
  responseLength: number[];       // Length of responses the user engages with
  frequentKeywords: Set<string>;  // Keywords from user messages
  lastCalibrationDate: Date;      // When preferences were last updated
};

// AI response calibration preferences
type CalibrationPreferences = {
  technicalLevel: number;         // 1-5 scale (1: simplified, 5: advanced)
  verbosity: number;              // 1-5 scale (1: concise, 5: detailed)
  interactivity: number;          // 1-5 scale (1: direct answers, 5: socratic method)
  focusArea: string[];            // Topics user focuses on most
  isCalibrationEnabled: boolean;  // Whether calibration is active
};

export default function AIHelper() {
  const { user } = useAuth();
  const userRole = user?.role || "student";
  
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState<HelperSize>("compact");
  const [messages, setMessages] = useState<HelperMessage[]>([]);
  const [currentContext, setCurrentContext] = useState<HelperContext>("general");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Dynamic calibration states
  const [interactionHistory, setInteractionHistory] = useState<InteractionPattern>({
    topics: {},
    responseLength: [],
    frequentKeywords: new Set<string>(),
    lastCalibrationDate: new Date()
  });
  
  // Default calibration preferences based on user role
  const getDefaultPreferences = useCallback((): CalibrationPreferences => {
    // Default preferences by role
    const defaults: Record<string, CalibrationPreferences> = {
      student: {
        technicalLevel: 2,    // More simplified for students
        verbosity: 3,         // Moderate detail
        interactivity: 4,     // More socratic to foster learning
        focusArea: ["learning", "study", "assignments"],
        isCalibrationEnabled: true
      },
      educator: {
        technicalLevel: 4,    // More technical for educators
        verbosity: 4,         // More detailed information
        interactivity: 3,     // Balance between direct and socratic
        focusArea: ["assessment", "teaching", "management"],
        isCalibrationEnabled: true
      },
      admin: {
        technicalLevel: 5,    // Most technical for admins
        verbosity: 5,         // Most detailed information
        interactivity: 2,     // More direct answers
        focusArea: ["performance", "security", "analytics"],
        isCalibrationEnabled: true
      }
    };
    
    return defaults[userRole] || defaults.student;
  }, [userRole]);
  
  const [calibrationPrefs, setCalibrationPrefs] = useState<CalibrationPreferences>(getDefaultPreferences());
  
  // Reset calibration to defaults based on role
  const resetCalibration = useCallback(() => {
    setCalibrationPrefs(getDefaultPreferences());
    
    const systemMessage: HelperMessage = {
      id: Date.now().toString(),
      type: "system",
      content: "AI response calibration has been reset to your role-based defaults.",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, systemMessage]);
  }, [getDefaultPreferences]);
  
  // Auto-calibrate based on user interactions
  const autoCalibrateFromInteractions = useCallback(() => {
    if (!calibrationPrefs.isCalibrationEnabled) return;
    
    // Clone current preferences
    const newPrefs = {...calibrationPrefs};
    const { topics, responseLength, frequentKeywords } = interactionHistory;
    
    // Analyze frequent topics to determine focus areas
    if (Object.keys(topics).length > 0) {
      const sortedTopics = Object.entries(topics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([topic]) => topic);
      
      if (sortedTopics.length > 0) {
        newPrefs.focusArea = sortedTopics;
      }
    }
    
    // Analyze response length preference
    if (responseLength.length > 5) {
      const avgLength = responseLength.reduce((sum, len) => sum + len, 0) / responseLength.length;
      // Scale between 1-5 based on average preferred length
      // Shorter responses (< 100 chars) → lower verbosity
      // Longer responses (> 500 chars) → higher verbosity
      newPrefs.verbosity = Math.max(1, Math.min(5, Math.ceil(avgLength / 100)));
    }
    
    // Analyze technical keywords to adjust technical level
    const technicalTerms = new Set(['analytics', 'algorithm', 'metrics', 'implementation', 'configuration', 'interface']);
    const technicalTermCount = Array.from(frequentKeywords).filter(kw => technicalTerms.has(kw)).length;
    
    if (technicalTermCount > 0) {
      // Increment technical level based on technical terms used
      newPrefs.technicalLevel = Math.min(5, calibrationPrefs.technicalLevel + Math.min(2, technicalTermCount));
    }
    
    setCalibrationPrefs(newPrefs);
  }, [calibrationPrefs, interactionHistory]);
  
  // Update interaction history with new message
  const updateInteractionHistory = useCallback((message: string) => {
    if (!message || message.length < 3) return;
    
    const lowerMsg = message.toLowerCase();
    
    // Update by extracting keywords and topics
    const newHistory = {...interactionHistory};
    
    // Track keywords (simple implementation - words longer than 4 chars)
    const words = lowerMsg.split(/\s+/).filter(word => word.length > 4);
    words.forEach(word => newHistory.frequentKeywords.add(word));
    
    // Identify topics from predefined categories
    const topicKeywords: Record<string, string[]> = {
      'learning-path': ['learning', 'path', 'progress', 'journey', 'curriculum'],
      'grades': ['grade', 'score', 'assessment', 'evaluation', 'performance'],
      'study': ['study', 'focus', 'timer', 'pomodoro', 'concentration'],
      'technical': ['setting', 'configuration', 'system', 'technical', 'setup']
    };
    
    // Update topic frequencies
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(kw => lowerMsg.includes(kw))) {
        newHistory.topics[topic] = (newHistory.topics[topic] || 0) + 1;
      }
    });
    
    setInteractionHistory(newHistory);
    
    // Auto-calibrate after sufficient interactions (every 5 messages)
    if (Object.values(newHistory.topics).reduce((sum, count) => sum + count, 0) % 5 === 0) {
      autoCalibrateFromInteractions();
    }
  }, [interactionHistory, autoCalibrateFromInteractions]);
  
  // Apply calibration to a response
  const calibrateResponse = useCallback((originalResponse: string): string => {
    if (!calibrationPrefs.isCalibrationEnabled) return originalResponse;
    
    let response = originalResponse;
    
    // Adjust technical level
    if (calibrationPrefs.technicalLevel <= 2) {
      // Simplify technical terms
      response = response.replace(/technical terms/g, 'simple words')
                         .replace(/analytics/g, 'insights')
                         .replace(/configuration/g, 'settings');
    } else if (calibrationPrefs.technicalLevel >= 4) {
      // Add more technical context
      response += " This functionality leverages our advanced data processing algorithms to ensure accuracy.";
    }
    
    // Adjust verbosity
    if (calibrationPrefs.verbosity <= 2) {
      // Make more concise
      if (response.length > 100) {
        response = response.split('.').slice(0, 2).join('.') + '.';
      }
    } else if (calibrationPrefs.verbosity >= 4) {
      // Add more detail
      if (!response.includes('Additionally')) {
        response += " Additionally, you can access more detailed information in the dedicated section of the platform.";
      }
    }
    
    // Adjust interactivity
    if (calibrationPrefs.interactivity >= 4) {
      // Add a question to promote further engagement
      if (!response.includes('?')) {
        response += " Is there a specific aspect of this you'd like to explore further?";
      }
    }
    
    return response;
  }, [calibrationPrefs]);

  // Initialize welcome message based on role
  useEffect(() => {
    const welcomeMessages: Record<string, string> = {
      student: "Hi there! I'm your EdConnect AI Helper. I can assist with your learning journey, study tools, and finding resources.",
      educator: "Welcome, Educator! I'm your EdConnect AI Assistant. I can help you manage classes, track student progress, and use educational tools.",
      admin: "Welcome, Administrator! I'm your EdConnect AI Assistant. I can help you with analytics, educator performance, and system management."
    };
    
    const roleSpecificTips: Record<string, string> = {
      student: "Try clicking on achievements in the Learning Path to see detailed information about your progress.",
      educator: "Check the Educational Tools section for resources to help create engaging learning materials.",
      admin: "The dashboard contains performance metrics for all educators under your supervision."
    };
    
    setMessages([
      {
        id: "welcome",
        type: "welcome",
        content: welcomeMessages[userRole] || welcomeMessages.student,
        timestamp: new Date()
      },
      {
        id: "tip-1",
        type: "tip",
        content: roleSpecificTips[userRole] || roleSpecificTips.student,
        timestamp: new Date()
      }
    ]);
  }, [userRole]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detect current context based on URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("learning-path")) {
      setCurrentContext("learning-path");
    } else if (path.includes("grades")) {
      setCurrentContext("grades");
    } else if (path.includes("study-tools")) {
      setCurrentContext("study-tools");
    } else if (path.includes("educational-tools")) {
      setCurrentContext("educational-tools");
    } else if (path.includes("knowledge-sharing")) {
      setCurrentContext("knowledge-sharing");
    } else if (path === "/") {
      setCurrentContext("dashboard");
    } else {
      setCurrentContext("general");
    }
  }, []);

  // Generate context-specific tips based on user role and current context
  const getContextSpecificTip = (): string => {
    // Role-specific tips by context
    const tips: Record<string, Record<HelperContext, string>> = {
      student: {
        "learning-path": "Each node in the learning path shows your progress. Green nodes are completed, yellow are in progress, and gray are not started.",
        "grades": "You can filter grades by class or time period using the dropdown above.",
        "dashboard": "Check out your recent activity section to see what you've been working on lately.",
        "study-tools": "The Focus Timer can help you study with the Pomodoro technique - 25 minutes of focus followed by a 5-minute break.",
        "educational-tools": "Interactive whiteboards allow you to visualize complex concepts. Try using them for difficult subjects.",
        "knowledge-sharing": "Share your achievements with classmates to celebrate your progress together.",
        "general": "Click on any page in the sidebar to navigate through the platform."
      },
      educator: {
        "learning-path": "You can create custom learning paths for your students by accessing the path editor in the administration panel.",
        "grades": "Use the batch grading feature to efficiently evaluate multiple assignments at once.",
        "dashboard": "The performance metrics show how your students are progressing across different subjects.",
        "study-tools": "Recommend the AI Companion to students who need additional explanation on complex topics.",
        "educational-tools": "The Quiz Generator allows you to create assessments with various question types including multiple choice and short answer.",
        "knowledge-sharing": "Create and share educational resources with your students through the content hub.",
        "general": "Your educator dashboard provides an overview of all your classes and students."
      },
      admin: {
        "learning-path": "You can review and approve learning paths created by educators before they're published to students.",
        "grades": "The analytics dashboard provides insights into grade distributions across departments and schools.",
        "dashboard": "Monitor educator performance metrics to identify top performers and those who might need additional support.",
        "study-tools": "You can enable or disable specific study tools for different student groups.",
        "educational-tools": "Review usage statistics for educational tools to allocate resources effectively.",
        "knowledge-sharing": "Moderate shared content and highlight exemplary educational resources.",
        "general": "The administrator panel allows you to manage users, roles, and system configurations."
      }
    };
    
    // Default to student tips if role not found
    return tips[userRole]?.[currentContext] || tips.student[currentContext] || tips.student.general;
  };

  // Add a contextual tip
  const addContextualTip = () => {
    const tip: HelperMessage = {
      id: Date.now().toString(),
      type: "tip",
      content: getContextSpecificTip(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, tip]);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    // Add user message (shown as a response to maintain the conversation flow)
    const userMessage: HelperMessage = {
      id: Date.now().toString(),
      type: "response",
      content: `You: ${currentMessage}`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Update interaction history for calibration
    updateInteractionHistory(currentMessage);
    
    setCurrentMessage("");
    setIsTyping(true);
    
    // Check for calibration commands
    const lowerCaseMessage = currentMessage.toLowerCase();
    if (lowerCaseMessage.includes("calibration") && 
        (lowerCaseMessage.includes("settings") || lowerCaseMessage.includes("preferences"))) {
      
      setIsTyping(false);
      
      // Show calibration settings dialog
      setShowCalibration(true);
      
      // Add system message about calibration
      const systemMessage: HelperMessage = {
        id: Date.now().toString(),
        type: "system",
        content: "AI response calibration settings are now available. You can adjust how I respond to your questions based on your preferences.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
      return;
    }
    
    // Check for calibration reset command
    if (lowerCaseMessage.includes("reset calibration") || 
        (lowerCaseMessage.includes("reset") && lowerCaseMessage.includes("settings"))) {
      
      resetCalibration();
      setIsTyping(false);
      return;
    }
    
    try {
      // In a real implementation, this would call an API
      // Simulate response delay
      setTimeout(() => {
        let responseContent = "I'm still learning about that. Let me help you with something else!";
        
        // Role-specific responses
        const responses: Record<string, Record<string, string>> = {
          student: {
            achievement: "Achievements and badges are awarded for completing learning objectives. Hover over an achievement icon to see details about how it was earned.",
            grade: "Your grades are calculated based on completed assignments and assessments. You can view detailed breakdowns in the Grades section.",
            path: "Learning paths are personalized roadmaps for each subject. They help you visualize your progress and identify what to focus on next.",
            learning: "Learning paths show your educational journey with color-coded nodes that indicate your progress. Green nodes are completed, yellow are in progress, and gray are not started.",
            focus: "The Focus Timer uses the Pomodoro technique to help you study efficiently. Try setting it for 25-minute work periods with 5-minute breaks.",
            companion: "The AI Learning Companion can help explain difficult concepts and provide personalized study tips based on your learning style.",
            help: "I can help you navigate the platform! Try asking about specific features like Learning Paths, Grades, or Study Tools.",
            calibration: "Dynamic AI response calibration allows me to adapt my responses to your preferences. You can adjust how technical, detailed, or interactive my responses are.",
            response: "I can adjust the style of my responses to better suit your needs. Would you like more technical, detailed information or more straightforward explanations?",
            math: "To improve your math performance, use the Focus Timer for concentrated study sessions, the AI Companion to explain difficult concepts, and the Learning Path to identify areas where you need more practice. The Whiteboard tool is also excellent for working through math problems visually.",
            improve: "To improve your academic performance, first identify challenging topics through your Learning Path, then use targeted study sessions with the Focus Timer. The AI Companion can help explain difficult concepts and provide practice problems. Track your progress using the Performance Charts.",
            study: "The Study Tools section offers several resources to enhance your learning: the Focus Timer for concentration, AI Companion for personalized explanations, and a Whiteboard for visual problem-solving. Try using the Focus Timer with the Pomodoro technique for the most effective study sessions.",
            average: "To improve your grade average, start by reviewing your current performance in the Grades section to identify subjects that need improvement. Then use the Learning Path to focus on specific topics, the Focus Timer for effective study sessions, and the AI Companion for personalized assistance with challenging concepts.",
            science: "For science subjects, the Whiteboard tool can help you visualize experiments and diagrams. The AI Companion is excellent for explaining complex scientific concepts, and the Learning Path will guide you through the logical progression of topics. Use the Focus Timer during lab report writing sessions.",
            history: "To excel in history, organize key events chronologically using the Learning Path visualization. The AI Companion can help explain historical contexts and connections between events. Try using the Focus Timer with the 'Time Travel' ambient sound for themed study sessions.",
            language: "For language arts, the Focus Timer can help you maintain concentration during reading and writing sessions. The AI Companion can assist with grammar concepts, literary analysis, and writing feedback. Track your vocabulary development in your Learning Path progress.",
            foreign: "When learning a foreign language, use the AI Companion to practice conversations and receive pronunciation feedback. The Focus Timer with short, frequent sessions is ideal for vocabulary memorization. Your Learning Path will track grammar concept mastery and conversation skills progression.",
            english: "For English literature and writing, the AI Companion can help analyze texts and provide writing feedback. Use the Focus Timer for concentrated writing sessions, and track your progress in different writing styles and analysis skills through your Learning Path.",
            biology: "For biology studies, use the Whiteboard to sketch diagrams of biological processes and structures. The AI Companion can explain complex biological systems, and your Learning Path will help you track your progress from cellular concepts to ecosystem understanding.",
            chemistry: "For chemistry, the Whiteboard tool is perfect for drawing molecular structures and chemical equations. The AI Companion can help explain reaction mechanisms, and the Learning Path will guide you through foundational concepts to more advanced topics.",
            physics: "When studying physics, use the Whiteboard to work through force diagrams and equations. The AI Companion can help explain complex concepts like quantum mechanics, and your Learning Path will show your progression through fundamental laws to applied concepts.",
            
            // Grade level specific responses
            elementary: "For elementary students, the Learning Path shows your progress with simple, colorful visuals. The AI Companion can explain concepts using fun, simple examples, and the Focus Timer has special shorter settings designed for younger learners.",
            middle: "Middle school students can use the Learning Path to track progress across multiple subjects as you transition between classes. The Focus Timer helps develop study habits, and the AI Companion can answer questions about more complex subjects you're now exploring.",
            high: "High school students can use the Learning Path to track progress in specialized subjects and identify strengths for future education planning. The AI Companion can help with advanced topics, and the Focus Timer can help manage longer study sessions for more complex material.",
            college: "College students can leverage EdConnect's Learning Path to manage multiple complex subjects and track progress toward degree requirements. The Analytics tools help identify areas needing improvement, and the advanced Focus Timer settings support longer research and writing sessions.",
            
            // Mental health and student life
            stress: "If you're feeling stressed about schoolwork, try using the Focus Timer's breathing exercises and the 'Forest' ambient sound to create a calming environment. Breaking tasks into smaller segments on your Learning Path can also make work feel more manageable.",
            anxiety: "Test anxiety is common - try using the Focus Timer's meditation feature before exams and review your Learning Path progress to build confidence in how much you've already mastered. The AI Companion can help answer last-minute questions without increasing stress.",
            balance: "To maintain school-life balance, use the Focus Timer to set dedicated study periods and clear breaks. Your Learning Path helps you prioritize which subjects need more attention, allowing you to plan your free time more effectively.",
            motivation: "When lacking motivation, review your achievements to see how far you've come. Set smaller, achievable goals on your Learning Path, and use the Focus Timer's 'reward break' feature to celebrate completing study sessions.",
            wellbeing: "EdConnect supports your wellbeing by helping you manage workload through organized Learning Paths, reduce stress with Focus Timer meditation sessions, and build confidence by tracking your progress and celebrating achievements.",
            
            // Career and future planning
            career: "Your Learning Path progress and achievements can help identify your academic strengths for future career planning. Focus on developing both specialized knowledge in your interest areas and transferable skills like critical thinking and communication that apply to many careers.",
            future: "EdConnect helps you develop not just academic knowledge but also important future-ready skills like self-directed learning, digital literacy, and analytical thinking. These skills are tracked in your Learning Path and will be valuable regardless of your future career path.",
            skills: "Beyond subject knowledge, EdConnect helps you develop important 21st-century skills like critical thinking, digital literacy, and self-directed learning. These transferable skills are tracked in your Learning Path and will be valuable across many future careers.",
            college_prep: "Your academic performance tracking in EdConnect can help with college applications. Your Learning Path progress shows your academic interests and strengths, while your achievements demonstrate your commitment and growth in various subject areas.",
            
            // Technical support
            login: "If you're having trouble logging in, make sure you're using the correct username and password. If you've forgotten your password, use the 'Forgot Password' link on the login page. If problems persist, contact your school's IT administrator.",
            loading: "If pages are loading slowly, try refreshing your browser, clearing your cache, or using a different browser. Make sure your internet connection is stable. If the problem continues, it might be temporary server load - try again later.",
            error: "If you're seeing error messages, take a screenshot to share with support. Try refreshing the page or logging out and back in. Most temporary errors resolve with these steps. For persistent errors, contact your school's technical support team.",
            browser: "EdConnect works best with the latest versions of Chrome, Firefox, Safari, or Edge. Make sure your browser is updated. If you're experiencing issues, try clearing your cache or using a different browser.",
            data: "If you're concerned about missing data, don't worry - all your work is automatically saved to our secure servers. If you can't see recent work, try refreshing the page or logging out and back in to restore your data view.",
            password: "If you need to reset your password, click the 'Forgot Password' link on the login screen or ask your teacher or school administrator to reset it for you. Passwords must be at least 8 characters long and include a mix of letters, numbers, and symbols.",
            access: "If you're having trouble accessing certain features, check with your teacher or administrator about your assigned role and permissions. Different features are available based on your user role and the courses you're enrolled in."
          },
          educator: {
            student: "You can view detailed information about your students including performance metrics, attendance records, and learning progress.",
            grade: "The grading system allows you to provide detailed feedback along with numerical scores. You can also track improvement over time.",
            path: "You can create and customize learning paths for your students. Each path can include different educational objectives, assessments, and resources.",
            learning: "Learning paths help structure your curriculum with sequential nodes that represent concepts, skills, and assessments. Students can visualize their progress through these paths.",
            assessment: "You can create various assessment types including quizzes, exams, and project evaluations using the Educational Tools.",
            class: "Manage your classes through the dashboard where you can take attendance, assign work, and track overall progress.",
            quiz: "The Quiz Generator tool allows you to create assessments with multiple question types and automatic grading.",
            help: "I can help you navigate educator features! Ask me about class management, assessment creation, or student tracking.",
            calibration: "The AI response calibration system is designed to provide you with more relevant information for your role as an educator. You can adjust the technical level and verbosity of responses.",
            response: "As an educator, you likely need both detailed information for yourself and simplified explanations you can share with students. I can adjust my response style based on your needs.",
            math: "To help students improve in math, encourage them to use the Focus Timer for structured study sessions and the AI Companion for personalized explanations. You can create custom math learning paths with increasing difficulty and use the Whiteboard tool for interactive problem-solving during instruction.",
            improve: "To help students improve their performance, analyze their individual metrics on your dashboard to identify patterns of struggle. Create targeted learning paths for different ability levels, and recommend specific Study Tools for areas needing improvement. The Quiz Generator can help you create practice assessments.",
            study: "You can guide students to use Study Tools effectively by demonstrating the Focus Timer's Pomodoro technique and showing how the AI Companion can provide personalized explanations. Create custom study guides and recommend relevant practice activities through the Learning Path system.",
            average: "To help students improve their grade averages, use the analytics dashboard to identify trends in performance. Create tailored learning paths addressing common challenges, use the Quiz Generator for targeted practice, and encourage structured study sessions with the Focus Timer.",
            science: "For science instruction, create learning paths that alternate between theoretical concepts and practical applications. Use the Whiteboard tool for interactive demonstrations of scientific processes, and design quiz questions that test both factual knowledge and application of scientific principles.",
            history: "To enhance history education, develop learning paths that emphasize chronological understanding and causal relationships between events. Create interactive timelines using the Whiteboard tool, and design assessments that evaluate students' ability to analyze primary sources and make historical connections.",
            language: "For language arts instruction, create learning paths that progressively build writing, reading, and analysis skills. Use the Quiz Generator to create varied assessments targeting different literacy competencies, and recommend Focus Timer sessions for sustained reading and writing practice.",
            foreign: "When teaching foreign languages, design learning paths that balance vocabulary acquisition, grammar concepts, and conversation practice. Use the AI Companion as a conversation partner for students, and create assessments that evaluate all four language skills: reading, writing, speaking, and listening.",
            english: "For English instruction, develop learning paths that integrate literature analysis with writing development. Create gradual skill progressions from basic comprehension to critical analysis, and use the Quiz Generator to design assessments that evaluate both technical writing skills and interpretive abilities.",
            biology: "For biology instruction, create learning paths that connect cellular concepts to organism and ecosystem understanding. Use the Whiteboard tool for interactive diagrams of biological processes, and design lab-based assessments to evaluate both theoretical knowledge and practical application of scientific methods.",
            chemistry: "When teaching chemistry, develop learning paths that build from atomic structure to complex reactions. Create interactive molecular modeling sessions using the Whiteboard tool, and design assessments that balance equation balancing, theory understanding, and practical lab skills.",
            physics: "For physics education, create learning paths that connect mathematical principles with real-world applications. Use the Whiteboard tool for interactive problem-solving demonstrations, and design assessments that evaluate both conceptual understanding and mathematical problem-solving abilities.",
            
            // Grade level specific responses
            elementary_ed: "When teaching elementary students, create simple, visually engaging learning paths with clear milestones. Use the Quiz Generator to create picture-based assessments, and design interactive whiteboard activities that incorporate movement and play. The AI Companion can be set to 'Elementary Mode' for age-appropriate explanations.",
            middle_ed: "For middle school instruction, design learning paths that help students transition between different subjects. Use the Quiz Generator for varied assessment types that develop critical thinking, and the Whiteboard for collaborative problem-solving activities that encourage peer interaction and discussion.",
            high_ed: "When teaching high school students, create specialized learning paths that prepare for college readiness. Design advanced quizzes with the Quiz Generator that simulate standardized tests, and use analytics to identify students who might need additional support with higher-level concepts.",
            college_ed: "For college-level instruction, develop comprehensive learning paths with research components and peer review elements. Use the advanced Analytics tools to track engagement with complex materials, and create specialized assessment rubrics that evaluate both content knowledge and critical analysis skills.",
            
            // Student wellbeing responses
            stress_support: "You can help students manage academic stress by teaching them to use the Focus Timer's breathing and meditation features. Design learning paths with manageable chunks of content, and use the analytics dashboard to identify students who might be overwhelmed by workload across multiple classes.",
            motivation_strategies: "To help students maintain motivation, use the achievement system to recognize progress at frequent intervals. Create learning paths with clear, attainable milestones, and use the analytics dashboard to identify and address patterns of disengagement before they affect performance.",
            wellbeing_tools: "EdConnect offers several tools to support student wellbeing, including stress management features in the Focus Timer, adaptive learning paths that prevent overwhelm, and progress visualization that builds confidence. Monitor engagement analytics to identify students who might need additional support.",
            
            // Teaching strategies
            differentiation: "Use analytics data to implement differentiated instruction through custom learning paths for varying ability levels. The Quiz Generator allows you to create tiered assessments, while the AI Companion can provide individualized support for students requiring additional explanation.",
            engagement: "Increase student engagement by incorporating interactive Whiteboard activities, gamified learning elements in your custom paths, and real-time feedback through the grading system. The analytics dashboard helps identify which activities generate the highest engagement levels.",
            assessment_strategies: "Diversify your assessment strategy using the Quiz Generator's multiple formats (multiple choice, short answer, essay). Design formative assessments for learning paths and summative assessments for unit completion. Use analytics to identify which question types best measure understanding.",
            
            // Technical support
            login_issues: "If students are reporting login issues, you can verify their account status in the Class Management section. For password resets, use the Educator Dashboard to generate new credentials. Make sure students are using the correct school access code if your institution requires one.",
            tech_troubleshooting: "For common technical issues, direct students to the Help Center's troubleshooting guides. You can monitor which students are actively using the platform through the Analytics dashboard, which helps identify who might be experiencing access problems.",
            data_management: "Student work and gradebook information are automatically backed up. If you need to recover previous versions of assessments or learning paths, use the Version History feature in the Content Management section. All student performance data is FERPA-compliant and securely stored."
          },
          admin: {
            performance: "Educator performance metrics are calculated based on student outcomes, engagement levels, and feedback. This helps identify areas for professional development.",
            analytics: "The analytics dashboard provides comprehensive insights into system-wide performance across districts, schools, and departments.",
            path: "As an administrator, you can review and approve learning paths created by educators across the system. You can also analyze path effectiveness through completion rates.",
            learning: "The learning path system allows educators to create structured educational journeys for students. You can monitor system-wide learning path metrics to gauge their effectiveness.",
            security: "EdConnect implements role-based access control and FERPA compliance measures to ensure data privacy and security.",
            educator: "You can review detailed profiles and performance metrics for all educators under your supervision.",
            system: "System settings allow you to configure user roles, access permissions, and data sharing policies.",
            help: "I can help you navigate administrator features! Ask me about analytics, educator management, or system configuration.",
            calibration: "The AI calibration system for administrators provides highly technical and detailed information by default. You can adjust these settings based on your specific administrative needs.",
            response: "As an administrator, you can customize my response style to align with your technical expertise and information needs. I can provide succinct overviews or comprehensive details.",
            math: "Based on system-wide analytics, you can identify schools and departments that require additional support in mathematics. Review the effectiveness of current math learning paths and consider providing professional development for educators in areas with lower performance metrics.",
            improve: "To improve educational outcomes system-wide, analyze performance metrics across schools and departments to identify trends. Implement targeted resource allocation based on needs, promote successful teaching strategies from high-performing educators, and establish standardized learning paths for core subjects.",
            study: "From an administrator perspective, you can evaluate the effectiveness of study tools by analyzing usage patterns and correlating them with student outcomes. Implement system-wide best practices based on successful approaches, and ensure equitable access to all learning resources.",
            average: "To improve overall academic performance across your jurisdiction, use the analytics dashboard to identify achievement gaps between schools and departments. Implement strategic interventions based on data, standardize effective learning paths, and provide targeted professional development for educators in underperforming areas.",
            science: "System-wide science education performance can be evaluated through the analytics dashboard. Look for trends in lab-based assessment scores versus theoretical knowledge. Consider implementing standardized learning paths for core scientific concepts while allowing educators flexibility in lab and application activities.",
            history: "For history education administration, analyze district-wide performance metrics to identify achievement gaps in chronological understanding versus source analysis skills. Implement professional development focused on teaching historical thinking skills and standardize core history learning paths across schools.",
            language: "For language arts administration, use analytics to identify trends in reading comprehension versus writing skill development across schools and departments. Implement standardized assessment rubrics for writing evaluation and provide targeted resources to schools showing achievement gaps.",
            foreign: "When overseeing foreign language education, analyze performance metrics for all four language skills: reading, writing, speaking, and listening. Identify achievement gaps between skills, and implement professional development for educators in immersive teaching techniques where needed.",
            english: "For English department administration, review system-wide performance metrics for reading comprehension, writing skills, and literary analysis. Implement standardized assessment rubrics across schools, and provide targeted professional development for educators in departments showing achievement gaps.",
            biology: "For biology education administration, analyze performance metrics to identify achievement gaps between theoretical knowledge and practical application. Ensure equitable access to lab resources across schools, and implement standardized learning paths for core biology concepts while encouraging innovative teaching approaches.",
            chemistry: "When overseeing chemistry education, review performance metrics to identify departments needing additional lab resources or professional development. Implement standardized safety protocols across all schools, and ensure consistent assessment standards for both theoretical and practical chemistry skills.",
            physics: "For physics education administration, analyze performance metrics to identify achievement gaps in mathematical versus conceptual understanding. Provide targeted professional development for educators in struggling departments, and ensure equitable access to demonstration equipment across schools.",
            
            // Educational institution management
            district: "The district-level dashboard provides comprehensive analytics across all schools in your jurisdiction. Track performance trends, resource allocation effectiveness, and identify areas for targeted interventions. The system allows you to establish district-wide learning standards while enabling local adaptations.",
            school: "School-level administration tools allow you to monitor department performance, track educator effectiveness, and analyze student outcome patterns. Compare metrics against district averages to identify areas of excellence and opportunities for improvement. Also monitor resource utilization efficiency.",
            department: "Department-level analytics enable you to compare performance across similar subject areas, identify best practices from high-performing departments, and implement targeted professional development. Track learning path effectiveness and assessment outcomes by subject area.",
            
            // Resource allocation and planning
            resources: "The resource allocation dashboard helps optimize educational investments by correlating expenditures with outcomes. Track technology usage patterns, identify underutilized tools, and ensure equitable access to educational resources across your jurisdiction. Generate cost-effectiveness reports for budget planning.",
            planning: "Strategic planning tools allow you to model different intervention scenarios and project their potential impacts. Set system-wide goals, track progress metrics, and adjust resource allocations based on real-time data. The longitudinal tracking system helps measure year-over-year improvements.",
            compliance: "The compliance dashboard ensures all educational data handling meets FERPA requirements and other relevant regulations. Monitor data access patterns, manage permission levels, and generate detailed audit logs for security reviews. Schedule automated compliance checks to maintain data integrity.",
            
            // Professional development
            training: "Professional development metrics help identify which training programs yield the highest impact on educator performance. Track participation rates, measure pre/post-training effectiveness, and correlate training investments with student outcome improvements. Design targeted programs based on identified skill gaps.",
            mentoring: "The educator mentoring system facilitates matching experienced staff with those needing development in specific areas. Track mentoring relationships, measure effectiveness through performance improvements, and identify high-potential educators for leadership development tracks.",
            evaluation: "Comprehensive educator evaluation tools provide multi-dimensional performance assessments beyond simple student outcome metrics. Incorporate peer reviews, student feedback, professional development completion, and innovative teaching practices into holistic performance evaluations.",
            
            // Technical administration
            system_admin: "System administration tools allow you to manage user accounts, configure role-based access controls, and oversee data security protocols. Monitor system performance, schedule maintenance windows, and manage database optimization to ensure platform reliability.",
            user_management: "The user management dashboard enables bulk account creation, role assignments, and access control configuration. Monitor inactive accounts, manage credential policies, and configure single sign-on integrations with existing district authentication systems.",
            data_security: "Data security tools provide comprehensive protection for sensitive educational information. Configure encryption levels, manage backup schedules, and monitor access patterns for potential security issues. The system maintains detailed audit logs for compliance verification.",
            troubleshooting: "The administrative troubleshooting center provides system status monitoring, error log analysis, and user support tracking. Identify common user issues, deploy targeted help resources, and track resolution times to ensure all educators and students maintain platform access."
          }
        };
        
        // Default to student responses if role not found
        const roleResponses = responses[userRole] || responses.student;
        
        // Check for multiple keywords in message
        for (const [keyword, response] of Object.entries(roleResponses)) {
          if (lowerCaseMessage.includes(keyword)) {
            responseContent = response;
            // Prioritize "learning" and "path" keywords when both are present for learning path questions
            if (lowerCaseMessage.includes("learning") && lowerCaseMessage.includes("path")) {
              responseContent = roleResponses["learning"] || roleResponses["path"] || response;
              break;
            }
          }
        }
        
        // General responses for all roles
        if (lowerCaseMessage.includes("help") || lowerCaseMessage.includes("how to")) {
          if (userRole === "student") {
            responseContent = "I can help you with your studies! Ask me about learning paths, grades, study tools, or any feature you're curious about.";
          } else if (userRole === "educator") {
            responseContent = "I can help you with teaching tools and student management! Ask me about class management, assessment creation, or educational resources.";
          } else if (userRole === "admin") {
            responseContent = "I can help you with administrative tasks! Ask me about analytics, educator management, system configuration, or security compliance.";
          }
        }
        
        // Apply dynamic calibration to the response
        const calibratedResponse = calibrateResponse(responseContent);
        
        // Track response length for future calibration
        const newHistory = {...interactionHistory};
        newHistory.responseLength.push(calibratedResponse.length);
        if (newHistory.responseLength.length > 10) {
          newHistory.responseLength.shift(); // Keep only the last 10 response lengths
        }
        setInteractionHistory(newHistory);
        
        const botResponse: HelperMessage = {
          id: (Date.now() + 1).toString(),
          type: "response",
          content: calibratedResponse,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      setIsTyping(false);
      
      const errorMessage: HelperMessage = {
        id: Date.now().toString(),
        type: "alert",
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach the AI helper service.",
        variant: "destructive",
      });
    }
  };

  // Cycle through size options
  const toggleSize = () => {
    if (size === "compact") setSize("expanded");
    else if (size === "expanded") setSize("compact");
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get appropriate styles for message based on type
  const getMessageStyle = (type: MessageType) => {
    switch (type) {
      case "tip":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "alert":
        return "bg-red-50 border-red-200 text-red-800";
      case "welcome":
        return "bg-purple-50 border-purple-200 text-purple-800";
      case "response":
      default:
        return "bg-white border-gray-200";
    }
  };

  // Get icon for message type
  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case "tip":
        return <Lightbulb className="h-4 w-4 mr-2" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 mr-2" />;
      case "welcome":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "system":
        return <Settings2 className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };
  
  // Calibration settings component
  const CalibrationSettings = () => {
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-sm flex items-center">
            <Settings2 className="h-4 w-4 mr-2 text-primary" />
            AI Response Calibration
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setShowCalibration(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Technical Level</span>
              <span className="text-xs font-medium">{calibrationPrefs.technicalLevel}/5</span>
            </div>
            <Slider 
              value={[calibrationPrefs.technicalLevel]} 
              min={1} 
              max={5} 
              step={1}
              onValueChange={(vals) => 
                setCalibrationPrefs({...calibrationPrefs, technicalLevel: vals[0]})
              }
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Simplified</span>
              <span>Technical</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Verbosity</span>
              <span className="text-xs font-medium">{calibrationPrefs.verbosity}/5</span>
            </div>
            <Slider 
              value={[calibrationPrefs.verbosity]} 
              min={1} 
              max={5} 
              step={1}
              onValueChange={(vals) => 
                setCalibrationPrefs({...calibrationPrefs, verbosity: vals[0]})
              }
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Concise</span>
              <span>Detailed</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Interactivity</span>
              <span className="text-xs font-medium">{calibrationPrefs.interactivity}/5</span>
            </div>
            <Slider 
              value={[calibrationPrefs.interactivity]} 
              min={1} 
              max={5} 
              step={1}
              onValueChange={(vals) => 
                setCalibrationPrefs({...calibrationPrefs, interactivity: vals[0]})
              }
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Direct</span>
              <span>Interactive</span>
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-1/2 text-xs"
              onClick={resetCalibration}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-1/2 text-xs"
              onClick={() => {
                setShowCalibration(false);
                
                const systemMessage: HelperMessage = {
                  id: Date.now().toString(),
                  type: "system",
                  content: "Your AI response calibration settings have been saved. I'll adapt my responses to match your preferences.",
                  timestamp: new Date()
                };
                
                setMessages(prev => [...prev, systemMessage]);
              }}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Role-specific quick actions
  const getRoleSpecificActions = () => {
    if (userRole === "educator") {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="whitespace-nowrap text-xs"
          onClick={() => {
            const helpMessage: HelperMessage = {
              id: Date.now().toString(),
              type: "response",
              content: "You: How do I track student progress?",
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, helpMessage]);
            setIsTyping(true);
            
            setTimeout(() => {
              const botResponse: HelperMessage = {
                id: (Date.now() + 1).toString(),
                type: "response",
                content: "You can track student progress in several ways: through the learning path visualizations, performance metrics on the dashboard, and individual grade records. The analytics section also provides insights on class-wide trends.",
                timestamp: new Date(),
              };
              
              setMessages(prev => [...prev, botResponse]);
              setIsTyping(false);
            }, 1500);
          }}
        >
          <GraduationCap className="h-3 w-3 mr-1" />
          Student Progress
        </Button>
      );
    } else if (userRole === "admin") {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="whitespace-nowrap text-xs"
          onClick={() => {
            const helpMessage: HelperMessage = {
              id: Date.now().toString(),
              type: "response",
              content: "You: Show me educator performance metrics.",
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, helpMessage]);
            setIsTyping(true);
            
            setTimeout(() => {
              const botResponse: HelperMessage = {
                id: (Date.now() + 1).toString(),
                type: "response",
                content: "Educator performance is measured through several metrics: student achievement rates, engagement levels, material quality, and peer reviews. You can access detailed analytics in the Educator Profiles section of your dashboard.",
                timestamp: new Date(),
              };
              
              setMessages(prev => [...prev, botResponse]);
              setIsTyping(false);
            }, 1500);
          }}
        >
          <Users className="h-3 w-3 mr-1" />
          Educator Metrics
        </Button>
      );
    } else {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="whitespace-nowrap text-xs"
          onClick={() => {
            const helpMessage: HelperMessage = {
              id: Date.now().toString(),
              type: "response",
              content: "You: What are achievements?",
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, helpMessage]);
            setIsTyping(true);
            
            setTimeout(() => {
              const botResponse: HelperMessage = {
                id: (Date.now() + 1).toString(),
                type: "response",
                content: "Achievements are awarded when you complete learning objectives or reach milestones. You can view your achievements in your Learning Path or profile. Hover over achievement icons to see details.",
                timestamp: new Date(),
              };
              
              setMessages(prev => [...prev, botResponse]);
              setIsTyping(false);
            }, 1500);
          }}
        >
          <Award className="h-3 w-3 mr-1" />
          Achievements
        </Button>
      );
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="helper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card 
          className={cn(
            "border rounded-lg shadow-lg flex flex-col",
            size === "compact" ? "w-80 h-96" : "w-96 h-[32rem]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-3 bg-gradient-to-r from-primary-100 to-primary-50">
            <div className="flex items-center">
              <Bot className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium">AI Helper</span>
              <Badge variant="outline" className="ml-2 bg-white">Beta</Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => setShowCalibration(!showCalibration)}
                title="AI Response Calibration"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={toggleSize}
              >
                {size === "compact" ? (
                  <Maximize className="h-4 w-4" />
                ) : (
                  <Minimize className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          {showCalibration ? (
            <div className="flex-1 p-3">
              <CalibrationSettings />
            </div>
          ) : (
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg border ${getMessageStyle(message.type)}`}
                  >
                    {message.type !== "response" && (
                      <div className="flex items-center mb-1 text-sm font-medium">
                        {getMessageIcon(message.type)}
                        {message.type === "tip" ? "Tip" : 
                         message.type === "alert" ? "Alert" : 
                         message.type === "welcome" ? "Welcome" : 
                         message.type === "system" ? "System" : "Assistant"}
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="p-3 rounded-lg border bg-white border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {/* Helper Quick Actions */}
          <div className="p-2 border-t flex overflow-x-auto space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap text-xs"
              onClick={addContextualTip}
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              Tip
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap text-xs"
              onClick={() => {
                const helpMessage: HelperMessage = {
                  id: Date.now().toString(),
                  type: "response",
                  content: "You: How do I use this platform?",
                  timestamp: new Date(),
                };
                
                setMessages(prev => [...prev, helpMessage]);
                setIsTyping(true);
                
                setTimeout(() => {
                  // Role-specific platform help
                  let helpContent = "The sidebar menu contains all the main features. Click on Dashboard to see your overview, Learning Paths to see your progress, and Study Tools to access learning aids.";
                  
                  if (userRole === "educator") {
                    helpContent = "As an educator, you can manage classes, create assessments, and track student progress. Use the sidebar to navigate between Dashboard, Educational Tools, and Learning Paths management.";
                  } else if (userRole === "admin") {
                    helpContent = "As an administrator, you have access to all platform features. The dashboard provides analytics and system-wide metrics. You can manage educator profiles, review performance, and configure system settings.";
                  }
                  
                  const botResponse: HelperMessage = {
                    id: (Date.now() + 1).toString(),
                    type: "response",
                    content: helpContent,
                    timestamp: new Date(),
                  };
                  
                  setMessages(prev => [...prev, botResponse]);
                  setIsTyping(false);
                }, 1500);
              }}
            >
              <ChevronRight className="h-3 w-3 mr-1" />
              Platform Help
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap text-xs"
              onClick={() => {
                const helpMessage: HelperMessage = {
                  id: Date.now().toString(),
                  type: "response",
                  content: "You: Tell me about AI calibration",
                  timestamp: new Date(),
                };
                
                setMessages(prev => [...prev, helpMessage]);
                setIsTyping(true);
                
                setTimeout(() => {
                  const botResponse: HelperMessage = {
                    id: (Date.now() + 1).toString(),
                    type: "response",
                    content: "The AI response calibration system allows me to adapt my responses to your preferences. You can adjust three settings: Technical Level (how specialized the information is), Verbosity (how detailed the responses are), and Interactivity (how conversational vs direct the responses are). Access the settings by clicking the gear icon in the header.",
                    timestamp: new Date(),
                  };
                  
                  setMessages(prev => [...prev, botResponse]);
                  setIsTyping(false);
                }, 1500);
              }}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Calibration
            </Button>
            
            {/* Display role-specific action button */}
            {getRoleSpecificActions()}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!currentMessage.trim() || isTyping}
                size="icon"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}