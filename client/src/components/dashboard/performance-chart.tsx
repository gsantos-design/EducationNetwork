import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface PerformanceChartProps {
  currentRole: string;
}

export default function PerformanceChart({ currentRole }: PerformanceChartProps) {
  // Fetch student analytics data
  const { data: studentData, isLoading: isStudentLoading, error: studentError } = useQuery({
    queryKey: ["/api/analytics/performance"],
  });
  
  // Fetch educator evaluation data (only for admins)
  const { data: educatorData, isLoading: isEducatorLoading, error: educatorError } = useQuery({
    queryKey: ["/api/analytics/educator-performance"],
    enabled: currentRole === UserRole.ADMIN,
  });
  
  // Determine if we're currently viewing the overall loading state
  const isLoading = currentRole === UserRole.ADMIN 
    ? (isStudentLoading || isEducatorLoading) 
    : isStudentLoading;
  
  // Combined error state
  const hasError = currentRole === UserRole.ADMIN 
    ? (studentError || educatorError) 
    : studentError;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {currentRole === UserRole.STUDENT 
              ? "My Performance Analytics" 
              : currentRole === UserRole.EDUCATOR
                ? "Class Performance Analytics"
                : "Performance Analytics"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {currentRole === UserRole.STUDENT 
              ? "My Performance Analytics" 
              : currentRole === UserRole.EDUCATOR
                ? "Class Performance Analytics"
                : "Performance Analytics"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            Failed to load performance data
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Transform student metrics for chart
  const studentChartData = studentData && studentData.metrics 
    ? studentData.metrics.map((metric: any) => ({
        subject: metric.subject,
        percentage: metric.percentage
      })) 
    : [];
  
  // Transform educator metrics for chart (for admin view)
  const educatorChartData = currentRole === UserRole.ADMIN && educatorData && educatorData.metrics
    ? educatorData.metrics.map((metric: any) => ({
        name: metric.name,
        evaluationScore: metric.evaluationScore,
        studentOutcomes: metric.studentOutcomes,
        classEngagement: metric.classEngagement,
      }))
    : [];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
        <CardTitle>
          {currentRole === UserRole.STUDENT 
            ? "My Performance Analytics" 
            : currentRole === UserRole.EDUCATOR
              ? "Class Performance Analytics"
              : "Performance Analytics"}
        </CardTitle>
        
        {/* Show data type tabs for admin users */}
        {currentRole === UserRole.ADMIN ? (
          <Tabs defaultValue="educator" className="w-auto mt-2 sm:mt-0">
            <TabsList>
              <TabsTrigger value="educator" className="text-xs">Educator Evaluation</TabsTrigger>
              <TabsTrigger value="student" className="text-xs">Student Data</TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <Tabs defaultValue="weekly" className="w-auto mt-2 sm:mt-0">
            <TabsList>
              <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="text-xs">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent>
        {currentRole === UserRole.ADMIN ? (
          <Tabs defaultValue="educator" className="w-full">
            <TabsContent value="educator" className="mt-0 border-0 p-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={educatorChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Bar 
                      dataKey="evaluationScore" 
                      name="Overall Rating" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="studentOutcomes" 
                      name="Student Outcomes" 
                      fill="#22c55e" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="classEngagement" 
                      name="Class Engagement" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {educatorChartData.map((educator: any, index: number) => (
                  <div key={index} className="rounded-md border p-3 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{educator.name}</div>
                      <div className={`text-sm px-2 py-1 rounded ${getEvaluationBadgeColor(educator.evaluationScore)}`}>
                        {getEvaluationLabel(educator.evaluationScore)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Overall Evaluation</div>
                        <div className="flex items-center">
                          <div className="h-2 rounded-full bg-secondary flex-1 overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${educator.evaluationScore}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{educator.evaluationScore}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground">Student Outcomes</div>
                        <div className="flex items-center">
                          <div className="h-2 rounded-full bg-secondary flex-1 overflow-hidden">
                            <div 
                              className="h-full bg-green-500" 
                              style={{ width: `${educator.studentOutcomes}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{educator.studentOutcomes}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground">Class Engagement</div>
                        <div className="flex items-center">
                          <div className="h-2 rounded-full bg-secondary flex-1 overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${educator.classEngagement}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{educator.classEngagement}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="student" className="mt-0 border-0 p-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={studentChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                    <Legend />
                    <Bar 
                      dataKey="percentage" 
                      name="Score" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {studentData && studentData.metrics ? studentData.metrics.map((metric: any, index: number) => (
                  <div key={index} className={`rounded-md ${getSubjectColor(metric.subject)} p-2`}>
                    <div className="text-xs text-neutral-500">{metric.subject}</div>
                    <div className={`font-medium ${getSubjectTextColor(metric.subject)}`}>
                      {metric.percentage}%
                    </div>
                  </div>
                )) : (
                  <div className="col-span-4 py-8 text-center text-muted-foreground">
                    No performance data available
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                  <Legend />
                  <Bar 
                    dataKey="percentage" 
                    name="Score" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {studentData && studentData.metrics ? studentData.metrics.map((metric: any, index: number) => (
                <div key={index} className={`rounded-md ${getSubjectColor(metric.subject)} p-2`}>
                  <div className="text-xs text-neutral-500">{metric.subject}</div>
                  <div className={`font-medium ${getSubjectTextColor(metric.subject)}`}>
                    {metric.percentage}%
                  </div>
                </div>
              )) : (
                <div className="col-span-4 py-8 text-center text-muted-foreground">
                  No performance data available
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to get color based on subject
function getSubjectColor(subject: string): string {
  switch (subject) {
    case "Mathematics":
      return "bg-primary-50";
    case "Science":
      return "bg-secondary-50";
    case "English":
      return "bg-orange-50";
    case "History":
      return "bg-blue-50";
    default:
      return "bg-neutral-50";
  }
}

// Helper function to get text color based on subject
function getSubjectTextColor(subject: string): string {
  switch (subject) {
    case "Mathematics":
      return "text-primary-700";
    case "Science":
      return "text-secondary-700";
    case "English":
      return "text-orange-700";
    case "History":
      return "text-blue-700";
    default:
      return "text-neutral-700";
  }
}

// Helper function to get badge color based on educator evaluation score
function getEvaluationBadgeColor(score: number): string {
  if (score >= 90) {
    return "bg-indigo-100 text-indigo-700";
  } else if (score >= 75) {
    return "bg-green-100 text-green-700";
  } else if (score >= 60) {
    return "bg-yellow-100 text-yellow-700";
  } else {
    return "bg-red-100 text-red-700";
  }
}

// Helper function to get evaluation label based on score
function getEvaluationLabel(score: number): string {
  if (score >= 90) {
    return "Excellent";
  } else if (score >= 75) {
    return "Good";
  } else if (score >= 60) {
    return "Average";
  } else {
    return "Needs Improvement";
  }
}
