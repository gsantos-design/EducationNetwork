import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole } from "@shared/schema";

interface QuickActionsProps {
  currentRole: string;
}

export default function QuickActions({ currentRole }: QuickActionsProps) {
  // Define action buttons based on role
  const getActionButtons = () => {
    // Default actions for educators
    let actions = [
      {
        icon: (
          <svg
            className="w-5 h-5 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        ),
        label: "Add Student",
        bgColor: "bg-primary-50",
        textColor: "text-primary-700",
        hoverBgColor: "hover:bg-primary-100"
      },
      {
        icon: (
          <svg
            className="w-5 h-5 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
        label: "New Assignment",
        bgColor: "bg-secondary-50",
        textColor: "text-secondary-700",
        hoverBgColor: "hover:bg-secondary-100"
      },
      {
        icon: (
          <svg
            className="w-5 h-5 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
        label: "Schedule",
        bgColor: "bg-blue-50",
        textColor: "text-blue-500",
        hoverBgColor: "hover:bg-blue-100"
      },
      {
        icon: (
          <svg
            className="w-5 h-5 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        ),
        label: "Messages",
        bgColor: "bg-orange-50",
        textColor: "text-orange-700",
        hoverBgColor: "hover:bg-orange-100"
      },
      {
        icon: (
          <svg
            className="w-5 h-5 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        ),
        label: "Generate AI Lesson Plan",
        bgColor: "bg-neutral-50",
        textColor: "text-neutral-700",
        hoverBgColor: "hover:bg-neutral-100",
        colSpan: true
      }
    ];

    // Student-specific actions
    if (currentRole === UserRole.STUDENT) {
      actions = [
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          label: "Submit Assignment",
          bgColor: "bg-primary-50",
          textColor: "text-primary-700",
          hoverBgColor: "hover:bg-primary-100"
        },
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          ),
          label: "Join Class",
          bgColor: "bg-secondary-50",
          textColor: "text-secondary-700",
          hoverBgColor: "hover:bg-secondary-100"
        },
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
          label: "My Schedule",
          bgColor: "bg-blue-50",
          textColor: "text-blue-500",
          hoverBgColor: "hover:bg-blue-100"
        },
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          ),
          label: "Message Teacher",
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          hoverBgColor: "hover:bg-orange-100"
        },
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          ),
          label: "Study Resources",
          bgColor: "bg-neutral-50",
          textColor: "text-neutral-700",
          hoverBgColor: "hover:bg-neutral-100",
          colSpan: true
        }
      ];
    }

    // Admin-specific actions
    if (currentRole === UserRole.ADMIN) {
      actions = [
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          ),
          label: "Manage Students",
          bgColor: "bg-primary-50",
          textColor: "text-primary-700",
          hoverBgColor: "hover:bg-primary-100"
        },
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
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
          label: "Manage Educators",
          bgColor: "bg-indigo-50",
          textColor: "text-indigo-700",
          hoverBgColor: "hover:bg-indigo-100"
        },
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
              />
            </svg>
          ),
          label: "Manage Classes",
          bgColor: "bg-secondary-50",
          textColor: "text-secondary-700",
          hoverBgColor: "hover:bg-secondary-100"
        },
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          label: "View Reports",
          bgColor: "bg-blue-50",
          textColor: "text-blue-500",
          hoverBgColor: "hover:bg-blue-100"
        },
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ),
          label: "System Settings",
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          hoverBgColor: "hover:bg-orange-100"
        },
        {
          icon: (
            <svg
              className="w-5 h-5 mb-1"
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
          label: "Compliance Dashboard",
          bgColor: "bg-neutral-50",
          textColor: "text-neutral-700",
          hoverBgColor: "hover:bg-neutral-100",
          colSpan: true
        }
      ];
    }

    return actions;
  };

  const actions = getActionButtons();

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`flex flex-col items-center justify-center p-3 ${action.bgColor} rounded-lg ${action.textColor} ${action.hoverBgColor} ${
                action.colSpan ? 'col-span-2' : ''
              }`}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
