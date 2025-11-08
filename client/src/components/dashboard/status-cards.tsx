import { UserRole } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface StatusCardsProps {
  currentRole: string;
}

export default function StatusCards({ currentRole }: StatusCardsProps) {
  // Query classes data to get count
  const { data: classesData, isLoading: classesLoading } = useQuery<any[]>({
    queryKey: ["/api/classes"],
  });
  
  const getStatusCards = () => {
    // Default or educator-specific cards
    const cards = [
      {
        title: "Active Students",
        value: "1,248",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
        iconBg: "bg-primary-50",
        iconColor: "text-primary-500",
        change: {
          value: "4.2%",
          type: "increase",
          text: "from last week"
        }
      },
      {
        title: "Active Classes",
        value: classesLoading ? "..." : classesData?.length.toString() || "42",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        ),
        iconBg: "bg-secondary-50",
        iconColor: "text-secondary-500",
        change: {
          value: "",
          type: "neutral",
          text: "Same as last week"
        }
      },
      {
        title: "Pending Assignments",
        value: "18",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        ),
        iconBg: "bg-blue-50",
        iconColor: "text-blue-500",
        change: {
          value: "5",
          type: "warning",
          text: "due today"
        }
      },
      {
        title: "System Health",
        value: "100%",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
        iconBg: "bg-green-50",
        iconColor: "text-green-500",
        change: {
          value: "",
          type: "success",
          text: "All services operational"
        }
      }
    ];
    
    // Student-specific cards
    if (currentRole === UserRole.STUDENT) {
      return [
        {
          title: "My Classes",
          value: classesLoading ? "..." : classesData?.length.toString() || "4",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          ),
          iconBg: "bg-secondary-50",
          iconColor: "text-secondary-500",
          change: {
            value: "",
            type: "neutral",
            text: "All classes in progress"
          }
        },
        {
          title: "Current GPA",
          value: "3.8",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          ),
          iconBg: "bg-primary-50",
          iconColor: "text-primary-500",
          change: {
            value: "0.2",
            type: "increase",
            text: "from last semester"
          }
        },
        {
          title: "Assignments Due",
          value: "5",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          iconBg: "bg-yellow-50",
          iconColor: "text-yellow-500",
          change: {
            value: "2",
            type: "warning",
            text: "due tomorrow"
          }
        },
        {
          title: "Attendance Rate",
          value: "98%",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          ),
          iconBg: "bg-green-50",
          iconColor: "text-green-500",
          change: {
            value: "",
            type: "success",
            text: "Excellent attendance"
          }
        }
      ];
    }
    
    // Admin-specific cards
    if (currentRole === UserRole.ADMIN) {
      return [
        {
          title: "Total Users",
          value: "2,843",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
          iconBg: "bg-primary-50",
          iconColor: "text-primary-500",
          change: {
            value: "12",
            type: "increase",
            text: "new this week"
          }
        },
        {
          title: "Total Classes",
          value: "156",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          ),
          iconBg: "bg-secondary-50",
          iconColor: "text-secondary-500",
          change: {
            value: "4",
            type: "increase",
            text: "from last month"
          }
        },
        {
          title: "System Uptime",
          value: "99.9%",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          ),
          iconBg: "bg-blue-50",
          iconColor: "text-blue-500",
          change: {
            value: "",
            type: "success",
            text: "30 days without issues"
          }
        },
        {
          title: "Compliance Rate",
          value: "100%",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          ),
          iconBg: "bg-green-50",
          iconColor: "text-green-500",
          change: {
            value: "",
            type: "success",
            text: "FERPA compliant"
          }
        }
      ];
    }
    
    return cards;
  };

  const renderChangeIndicator = (change: { value: string, type: string, text: string }) => {
    const getIconAndColor = () => {
      switch (change.type) {
        case 'increase':
          return {
            icon: (
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            ),
            color: 'text-green-500'
          };
        case 'decrease':
          return {
            icon: (
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            ),
            color: 'text-red-500'
          };
        case 'warning':
          return {
            icon: (
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
            color: 'text-yellow-500'
          };
        case 'success':
          return {
            icon: (
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ),
            color: 'text-green-500'
          };
        default:
          return {
            icon: (
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 12H6"
                />
              </svg>
            ),
            color: 'text-neutral-500'
          };
      }
    };
    
    const { icon, color } = getIconAndColor();
    
    return (
      <div className={`mt-3 text-xs flex items-center ${color}`}>
        {icon}
        <span>{change.value} {change.text}</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {getStatusCards().map((card, index) => (
        <Card 
          key={index} 
          className="bg-white shadow-sm p-4 hover:shadow-md transition-shadow duration-200 hover:-translate-y-1 transition-transform"
        >
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              <div className={card.iconColor}>
                {card.icon}
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-neutral-500">{card.title}</div>
              <div className="text-2xl font-semibold text-neutral-700">{card.value}</div>
            </div>
          </div>
          {renderChangeIndicator(card.change)}
        </Card>
      ))}
    </div>
  );
}
