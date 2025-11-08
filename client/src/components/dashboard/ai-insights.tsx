import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface AIInsightsProps {
  currentRole: string;
}

export default function AIInsights({ currentRole }: AIInsightsProps) {
  // Fetch student performance data (which includes insights)
  const { data: studentData, isLoading: isStudentLoading, error: studentError } = useQuery({
    queryKey: ["/api/analytics/performance"],
  });
  
  // Fetch educator performance insights (only for admins)
  const { data: educatorData, isLoading: isEducatorLoading, error: educatorError } = useQuery({
    queryKey: ["/api/analytics/educator-performance"],
    enabled: currentRole === UserRole.ADMIN,
  });
  
  // Determine the loading state based on role
  const isLoading = currentRole === UserRole.ADMIN 
    ? (isStudentLoading || isEducatorLoading) 
    : isStudentLoading;
  
  // Determine error state based on role
  const hasError = currentRole === UserRole.ADMIN 
    ? (studentError || educatorError || !studentData || !educatorData) 
    : (studentError || !studentData);
  
  if (isLoading || hasError) {
    // Using the insights from the raw data for skeleton
    const skeletonInsights = [
      {
        type: "improvement",
        title: "Loading...",
        description: "Fetching AI-powered insights about performance data..."
      },
      {
        type: "success",
        title: "Loading...",
        description: "Analyzing educational data patterns..."
      }
    ];
    
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>
            {currentRole === UserRole.STUDENT 
              ? "Learning Insights" 
              : currentRole === UserRole.EDUCATOR
                ? "Teaching Insights"
                : "Administrative Insights"}
          </CardTitle>
          <Button variant="link" className="text-primary text-sm p-0" disabled>
            <span>View All</span>
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skeletonInsights.map((insight, index) => (
              <InsightCard key={index} insight={insight} loading={true} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get student-related insights
  const studentInsights = studentData?.insights || [];
  
  // Get educator-related insights for admins
  const educatorInsights = currentRole === UserRole.ADMIN && educatorData?.insights 
    ? educatorData.insights 
    : [];
  
  // Combine insights based on user role
  const combinedInsights = currentRole === UserRole.ADMIN
    ? [
        // Add educator insights first for admins
        ...educatorInsights.map((insight: any) => ({
          ...insight,
          source: 'educator'
        })),
        // Then student insights
        ...studentInsights.map((insight: any) => ({
          ...insight,
          source: 'student'
        }))
      ]
    : studentInsights;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          {currentRole === UserRole.STUDENT 
            ? "Learning Insights" 
            : currentRole === UserRole.EDUCATOR
              ? "Teaching Insights"
              : "Administrative Insights"}
        </CardTitle>
        <Button variant="link" className="text-primary text-sm p-0">
          <span>View All</span>
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </CardHeader>
      <CardContent>
        {currentRole === UserRole.ADMIN && (
          <div className="mb-4 flex items-center">
            <div className="mr-3 flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></div>
              <span className="text-xs">Educator Insights</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs">Student Insights</span>
            </div>
          </div>
        )}
        <div className="space-y-4">
          {combinedInsights.length > 0 ? (
            combinedInsights.map((insight: any, index: number) => (
              <InsightCard 
                key={index} 
                insight={insight} 
                loading={false} 
                isEducatorInsight={insight.source === 'educator'}
              />
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No insights available at this time
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface InsightCardProps {
  insight: {
    type: string;
    title: string;
    description: string;
    source?: string;
  };
  loading: boolean;
  isEducatorInsight?: boolean;
}

function InsightCard({ insight, loading, isEducatorInsight = false }: InsightCardProps) {
  const getInsightStyles = () => {
    switch (insight.type) {
      case 'improvement':
        return {
          border: 'border-l-4 border-blue-500',
          bg: 'bg-blue-50 bg-opacity-50',
          icon: (
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          ),
          iconColor: 'text-blue-500',
          buttonColor: 'text-blue-500',
          buttonText: 'View Details'
        };
      case 'success':
        return {
          border: 'border-l-4 border-green-500',
          bg: 'bg-green-50 bg-opacity-50',
          icon: (
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          iconColor: 'text-green-500',
          buttonColor: 'text-green-500',
          buttonText: 'Explore Strategy'
        };
      case 'warning':
        return {
          border: 'border-l-4 border-yellow-500',
          bg: 'bg-yellow-50 bg-opacity-50',
          icon: (
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          iconColor: 'text-yellow-500',
          buttonColor: 'text-yellow-500',
          buttonText: 'Schedule Follow-Up'
        };
      default:
        return {
          border: 'border-l-4 border-neutral-500',
          bg: 'bg-neutral-50',
          icon: (
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          iconColor: 'text-neutral-500',
          buttonColor: 'text-neutral-500',
          buttonText: 'View Details'
        };
    }
  };
  
  // Get base styles
  const styles = getInsightStyles();
  
  // Override styles for educator insights if needed
  const borderColor = isEducatorInsight ? 'border-l-4 border-indigo-500' : styles.border;
  const bgColor = isEducatorInsight ? 'bg-indigo-50 bg-opacity-50' : styles.bg;
  const iconColor = isEducatorInsight ? 'text-indigo-500' : styles.iconColor;
  const buttonColor = isEducatorInsight ? 'text-indigo-500' : styles.buttonColor;
  
  return (
    <div className={`${borderColor} p-3 ${bgColor} rounded-r-md`}>
      <div className="flex items-start">
        <div className={`${iconColor} mt-0.5 mr-2`}>
          {isEducatorInsight ? (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          ) : (
            styles.icon
          )}
        </div>
        <div className="flex-1">
          {isEducatorInsight && (
            <div className="mb-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
              Educator Insight
            </div>
          )}
          <h3 className={`text-sm font-medium text-neutral-700 ${loading ? 'animate-pulse' : ''}`}>
            {insight.title}
          </h3>
          <p className={`text-sm text-neutral-600 mt-1 ${loading ? 'animate-pulse' : ''}`}>
            {insight.description}
          </p>
          <div className="mt-2 flex">
            <Button 
              variant="link" 
              className={`${buttonColor} text-xs p-0 h-auto font-medium`}
            >
              <span>{isEducatorInsight ? 'View Educator Details' : styles.buttonText}</span>
              <svg
                className="ml-1 w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
