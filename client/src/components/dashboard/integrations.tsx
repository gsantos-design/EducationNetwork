import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Integrations() {
  // Integration data
  const integrations = [
    {
      name: "Google Classroom",
      status: "Connected",
      icon: (
        <svg 
          className="w-5 h-5 text-red-500" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 0C5.34 0 0 5.34 0 12s5.34 12 12 12 12-5.34 12-12S18.66 0 12 0zm0 21.6c-5.29 0-9.6-4.31-9.6-9.6S6.71 2.4 12 2.4 21.6 6.71 21.6 12 17.29 21.6 12 21.6z" />
          <path d="M12 5.52c-3.58 0-6.48 2.9-6.48 6.48s2.9 6.48 6.48 6.48 6.48-2.9 6.48-6.48S15.58 5.52 12 5.52zm0 9.6c-1.73 0-3.12-1.4-3.12-3.12S10.27 8.88 12 8.88s3.12 1.4 3.12 3.12-1.4 3.12-3.12 3.12z" />
        </svg>
      )
    },
    {
      name: "Zoom",
      status: "Connected",
      icon: (
        <svg 
          className="w-5 h-5 text-blue-500" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M10 7.5v9l6-4.5-6-4.5z" />
        </svg>
      )
    },
    {
      name: "Canvas",
      status: "Connected",
      icon: (
        <svg 
          className="w-5 h-5 text-purple-500" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
        >
          <path d="M4 21V3h16v18H4zm4-4h8v-2H8v2zm0-4h8v-2H8v2zm0-4h8V7H8v2z" />
        </svg>
      )
    }
  ];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Connected Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {integrations.map((integration, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-md"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                  {integration.icon}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{integration.name}</div>
                  <div className="text-xs text-neutral-500">{integration.status}</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-white border-neutral-200 text-neutral-700"
              >
                Configure
              </Button>
            </div>
          ))}
          
          <Button 
            variant="ghost" 
            className="w-full text-primary"
          >
            <svg
              className="mr-1 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Connect New Tool</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
