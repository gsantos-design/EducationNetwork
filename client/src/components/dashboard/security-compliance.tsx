import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SecurityCompliance() {
  // Security and compliance data
  const securityItems = [
    {
      title: "FERPA Compliance",
      description: "All data handling meets FERPA requirements",
      icon: (
        <svg
          className="w-5 h-5 mt-0.5 mr-2 text-green-500"
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
      bgColor: "bg-green-50 bg-opacity-50"
    },
    {
      title: "Data Encryption",
      description: "AES-256 encryption active for all data",
      icon: (
        <svg
          className="w-5 h-5 mt-0.5 mr-2 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      bgColor: "bg-blue-50 bg-opacity-50"
    },
    {
      title: "Last Security Audit",
      description: "May 1, 2023 - No issues found",
      icon: (
        <svg
          className="w-5 h-5 mt-0.5 mr-2 text-neutral-500"
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
      bgColor: "bg-neutral-50"
    }
  ];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Security & Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {securityItems.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 ${item.bgColor} rounded-md flex items-start`}
            >
              {item.icon}
              <div>
                <div className="text-sm font-medium text-neutral-700">{item.title}</div>
                <div className="text-xs text-neutral-500 mt-1">{item.description}</div>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full mt-2 py-2 px-4 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
          >
            View Compliance Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
