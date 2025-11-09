import { motion } from "framer-motion";
import { useLocation } from "wouter";
import ProgressDashboard from "@/components/study-tools/progress-dashboard";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProgressPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutoring
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-600 rounded-xl shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Progress
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your learning journey and celebrate your growth
              </p>
            </div>
          </div>
        </motion.div>

        <ProgressDashboard />
      </div>
    </div>
  );
}
