import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Award, Target, Lightbulb, Clock, BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressInsights {
  overallProgress: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  weeklyGoal: string;
  totalSessions: number;
  totalTime: number;
  subjectBreakdown: Record<string, { sessions: number; time: number; avgPerformance: number }>;
}

export default function ProgressDashboard() {
  const { data: insights, isLoading } = useQuery<ProgressInsights>({
    queryKey: ["/api/tutor/progress-insights"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No progress data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Overall Progress Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <CardTitle>Your Learning Journey</CardTitle>
            </div>
            <CardDescription className="text-base mt-2">
              {insights.overallProgress}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{insights.totalSessions}</p>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{insights.totalTime}</p>
                  <p className="text-sm text-muted-foreground">Minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold">{Object.keys(insights.subjectBreakdown).length}</p>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <CardTitle>Your Strengths</CardTitle>
              </div>
              <CardDescription>
                Areas where you're excelling!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insights.strengths.length > 0 ? (
                <ul className="space-y-2">
                  {insights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  Keep learning! Your strengths will show here as you progress.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Goal Card */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <CardTitle>This Week's Goal</CardTitle>
              </div>
              <CardDescription>
                Your personal challenge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  {insights.weeklyGoal}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Subject Breakdown */}
      {Object.keys(insights.subjectBreakdown).length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
              <CardDescription>
                Your activity across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(insights.subjectBreakdown).map(([subject, data]) => (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.sessions} sessions · {Math.round(data.time)} min
                        </p>
                      </div>
                      {data.avgPerformance > 0 && (
                        <Badge variant={data.avgPerformance >= 70 ? "default" : "secondary"}>
                          {Math.round(data.avgPerformance)}% avg
                        </Badge>
                      )}
                    </div>
                    <Progress value={(data.sessions / insights.totalSessions) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Growth Areas */}
      {insights.areasForImprovement.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <CardTitle>Growing Together</CardTitle>
              </div>
              <CardDescription>
                Areas where we're building skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {insights.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">→</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              <CardTitle>Personalized Recommendations</CardTitle>
            </div>
            <CardDescription>
              Suggestions to help you succeed this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
