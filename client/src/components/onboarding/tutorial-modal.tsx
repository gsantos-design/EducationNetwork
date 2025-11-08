import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X, Bot, Sparkles } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";

export default function TutorialModal() {
  const {
    isOnboarding,
    currentStep,
    steps,
    nextStep,
    prevStep,
    skipOnboarding,
  } = useOnboarding();
  
  const { user } = useAuth();
  const isStudent = user?.role === UserRole.STUDENT;
  
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  
  const currentStepData = steps[currentStep];
  
  // Calculate position for the tooltip based on the target element
  useEffect(() => {
    if (!isOnboarding || !currentStepData) return;
    
    const targetElement = document.querySelector(currentStepData.target);
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      let newPosition = { top: 0, left: 0, width: rect.width, height: rect.height };
      
      // Set position based on the target's position relative to the viewport
      switch (currentStepData.position) {
        case "top":
          newPosition.top = rect.top - 10;
          newPosition.left = rect.left + rect.width / 2;
          break;
        case "right":
          newPosition.top = rect.top + rect.height / 2;
          newPosition.left = rect.right + 10;
          break;
        case "bottom":
          newPosition.top = rect.bottom + 10;
          newPosition.left = rect.left + rect.width / 2;
          break;
        case "left":
          newPosition.top = rect.top + rect.height / 2;
          newPosition.left = rect.left - 10;
          break;
        case "center":
          newPosition.top = window.innerHeight / 2;
          newPosition.left = window.innerWidth / 2;
          break;
      }
      
      setPosition(newPosition);
      
      // Add highlight effect to the target element
      targetElement.classList.add("onboarding-target");
      return () => {
        targetElement.classList.remove("onboarding-target");
      };
    }
  }, [currentStep, isOnboarding, currentStepData]);
  
  if (!isOnboarding) return null;
  
  // Handle positioning classes based on the target's position
  const getPositionClasses = () => {
    if (!currentStepData) return "";
    
    switch (currentStepData.position) {
      case "top":
        return "translate-x-[-50%] translate-y-[-100%] mb-3";
      case "right":
        return "translate-y-[-50%] ml-3";
      case "bottom":
        return "translate-x-[-50%] mt-3";
      case "left":
        return "translate-y-[-50%] translate-x-[-100%] mr-3";
      case "center":
        return "translate-x-[-50%] translate-y-[-50%]";
    }
  };
  
  // Add arrow indicators based on position
  const getArrowClasses = () => {
    if (!currentStepData) return "";
    
    switch (currentStepData.position) {
      case "top":
        return "bottom-[-8px] left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white";
      case "right":
        return "left-[-8px] top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white";
      case "bottom":
        return "top-[-8px] left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white";
      case "left":
        return "right-[-8px] top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white";
      case "center":
        return "";
    }
  };
  
  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/40 z-[999] pointer-events-none" />
      
      {/* Target highlight indicator */}
      {currentStepData.position !== "center" && (
        <motion.div
          className="absolute rounded-md z-[998] pointer-events-none border-4 border-primary/50 shadow-lg"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
            transform: 
              currentStepData.position === "top" ? "translate(-50%, 0)" :
              currentStepData.position === "bottom" ? "translate(-50%, -100%)" :
              currentStepData.position === "left" ? "translate(0, -50%)" :
              currentStepData.position === "right" ? "translate(-100%, -50%)" : "",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Tutorial modal */}
      <AnimatePresence mode="wait">
        <motion.div
          ref={modalRef}
          className={`fixed z-[1000] bg-white rounded-lg shadow-xl p-6 max-w-md ${getPositionClasses()}`}
          style={{
            top: position.top,
            left: position.left,
          }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
          key={currentStep}
        >
          {/* Arrow indicator */}
          <div className={`absolute w-0 h-0 ${getArrowClasses()}`} />
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={skipOnboarding}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Content */}
          <div className="mb-6">
            {/* Robot Mascot for Students */}
            {isStudent && (
              <motion.div
                className="flex items-center justify-center mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1
                }}
              >
                <div className="relative">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ 
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Bot className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            <h3 className="text-lg font-bold mb-2 text-primary flex items-center gap-2 justify-center">
              {currentStepData.title}
            </h3>
            <p className="text-muted-foreground text-center">{currentStepData.description}</p>
          </div>
          
          {/* Progress indicators */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            
            <div className="flex-1 text-center mx-2 text-sm text-muted-foreground">
              {currentStep + 1} of {steps.length}
            </div>
            
            <Button onClick={nextStep} className="gap-1">
              {currentStep < steps.length - 1 ? (
                <>Next <ArrowRight className="h-4 w-4" /></>
              ) : (
                "Finish"
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}