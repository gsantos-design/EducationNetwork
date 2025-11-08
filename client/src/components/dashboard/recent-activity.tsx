import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

interface RecentActivityProps {
  currentRole: string;
}

export default function RecentActivity({ currentRole }: RecentActivityProps) {
  const { user } = useAuth();
  
  // Get current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  // Activity items based on role
  const getActivityItems = () => {
    // Default activities for educators
    let activities = [
      {
        title: "Graded 28 Math Assignments",
        time: "9:30 AM"
      },
      {
        title: "Created new lesson plan: \"Introduction to Fractions\"",
        time: "11:15 AM"
      },
      {
        title: "Video conference with parent of Alex Johnson",
        time: "1:00 PM"
      },
      {
        title: "Updated Class 4B attendance records",
        time: "2:45 PM"
      }
    ];

    // Student-specific activities
    if (currentRole === UserRole.STUDENT) {
      activities = [
        {
          title: "Submitted Mathematics homework",
          time: "8:45 AM"
        },
        {
          title: "Attended Science class",
          time: "10:30 AM"
        },
        {
          title: "Received grade: 92% on English essay",
          time: "1:15 PM"
        },
        {
          title: "Joined study group for History",
          time: "3:00 PM"
        }
      ];
    }

    // Admin-specific activities
    if (currentRole === UserRole.ADMIN) {
      activities = [
        {
          title: "Generated monthly compliance report",
          time: "9:00 AM"
        },
        {
          title: "Approved 3 new educator accounts",
          time: "10:45 AM"
        },
        {
          title: "System backup completed successfully",
          time: "12:30 PM"
        },
        {
          title: "Updated FERPA compliance documentation",
          time: "2:15 PM"
        }
      ];
    }

    return activities;
  };

  const activities = getActivityItems();

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle>Recent Activity</CardTitle>
        <div className="text-sm text-neutral-500">
          Today, {formattedDate}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Activity Timeline */}
          {activities.map((activity, index) => (
            <div key={index} className="relative pl-6 pb-2">
              <div className="absolute left-0 top-1 w-4 h-4 bg-primary-100 border-2 border-primary-500 rounded-full"></div>
              <div className="text-sm">
                <div className="font-medium text-neutral-700">{activity.title}</div>
                <div className="text-neutral-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <Button variant="ghost" className="w-full text-primary">
            <span>View All Activity</span>
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
