import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Award, 
  ArrowUpRight, 
  Users, 
  Book, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminLevel } from "@shared/schema";

// Helper to generate educator profile avatar initials
function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

// Helper to generate a performance color based on score
function getPerformanceColor(score: number) {
  if (score >= 90) return "text-indigo-600";
  if (score >= 75) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

// Helper to get the badge color for improvement areas
function getImprovementBadgeColor(priority: 'high' | 'medium' | 'low') {
  switch (priority) {
    case 'high':
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case 'medium':
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case 'low':
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

// Sample data definitions
const sampleEducatorProfiles = [
  {
    id: 1,
    name: "Sarah Johnson",
    department: "Mathematics",
    school: "Washington High School",
    district: "Metro District",
    evaluationScore: 92,
    studentOutcomes: 94,
    classEngagement: 90,
    expertise: ["Algebra", "Calculus", "AP Mathematics"],
    yearOfExperience: 8,
    profileImage: "",
    adminLevel: AdminLevel.SCHOOL,
    strengths: ["Curriculum development", "Student engagement", "Innovative teaching methods"],
    improvementAreas: [
      { area: "Digital tool integration", priority: "low" as const },
      { area: "Parent communication", priority: "medium" as const }
    ],
    recentFeedback: "Excellent progress in implementing the new math curriculum. Students show improved test scores."
  },
  {
    id: 2,
    name: "Michael Peterson",
    department: "Science",
    school: "Lincoln High School",
    district: "Metro District",
    evaluationScore: 78,
    studentOutcomes: 80,
    classEngagement: 76,
    expertise: ["Biology", "Environmental Science", "Lab Management"],
    yearOfExperience: 5,
    profileImage: "",
    adminLevel: AdminLevel.DEPARTMENT,
    strengths: ["Lab coordination", "Research-based teaching", "Student mentoring"],
    improvementAreas: [
      { area: "Classroom management", priority: "medium" as const },
      { area: "Assessment variety", priority: "medium" as const }
    ],
    recentFeedback: "Good progress with lab activities. Consider more diverse assessment methods."
  },
  {
    id: 3,
    name: "Amanda Rodriguez",
    department: "English",
    school: "Jefferson Academy",
    district: "Eastern District",
    evaluationScore: 64,
    studentOutcomes: 62,
    classEngagement: 68,
    expertise: ["Literature", "Creative Writing", "ESL"],
    yearOfExperience: 3,
    profileImage: "",
    adminLevel: AdminLevel.DISTRICT,
    strengths: ["Creative lesson planning", "Individual student attention"],
    improvementAreas: [
      { area: "Curriculum pacing", priority: "high" as const },
      { area: "Student accountability", priority: "high" as const },
      { area: "Assessment design", priority: "medium" as const }
    ],
    recentFeedback: "Needs significant improvement in maintaining classroom pace and ensuring all students meet objectives."
  },
  {
    id: 4,
    name: "James Wilson",
    department: "History",
    school: "Washington High School",
    district: "Metro District",
    evaluationScore: 88,
    studentOutcomes: 85,
    classEngagement: 92,
    expertise: ["American History", "Political Science", "Debate"],
    yearOfExperience: 12,
    profileImage: "",
    adminLevel: AdminLevel.SCHOOL,
    strengths: ["Discussion facilitation", "Critical thinking development", "Content knowledge"],
    improvementAreas: [
      { area: "Technology integration", priority: "low" as const },
    ],
    recentFeedback: "Excellent at engaging students in thoughtful discussions. Could benefit from incorporating more digital resources."
  },
  {
    id: 5,
    name: "David Chen",
    department: "Mathematics",
    school: "Roosevelt Middle School",
    district: "Northern District",
    evaluationScore: 56,
    studentOutcomes: 54,
    classEngagement: 60,
    expertise: ["Pre-Algebra", "Geometry"],
    yearOfExperience: 2,
    profileImage: "",
    adminLevel: AdminLevel.DEPARTMENT,
    strengths: ["Content knowledge", "One-on-one instruction"],
    improvementAreas: [
      { area: "Classroom management", priority: "high" as const },
      { area: "Student engagement", priority: "high" as const },
      { area: "Differentiated instruction", priority: "medium" as const }
    ],
    recentFeedback: "Struggling with maintaining an orderly classroom environment. Needs immediate intervention and mentoring."
  }
];

// Sample departments data
const sampleDepartments = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Science" },
  { id: 3, name: "English" },
  { id: 4, name: "History" }
];

export default function EducatorProfiles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdminLevel, setSelectedAdminLevel] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [currentEducator, setCurrentEducator] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Fetch educator profiles for admins from our new API endpoint
  const { data: educatorProfiles, isLoading, error } = useQuery({
    queryKey: ["/api/analytics/educator-performance"],
    enabled: true,
  });

  // Fetch departments for filtering
  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
    queryFn: () => sampleDepartments, // Will use sample data for now
    enabled: true,
  });

  // Fetch districts and schools for admin level filtering
  const { data: adminRegions = [] } = useQuery({
    queryKey: ["/api/admin-regions"],
    queryFn: () => [], // Will use sample data for now
    enabled: true,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Educator Profiles</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !educatorProfiles) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Educator Profiles</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p>Unable to load educator profiles. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  // Use the data from the query
  const profiles = educatorProfiles;

  // Filter the profiles based on search query and filters
  const filteredProfiles = Array.isArray(profiles) ? profiles.filter((profile: any) => {
    // Search filter
    const matchesSearch = 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Admin level filter
    const matchesAdminLevel = 
      selectedAdminLevel === "all" || 
      profile.adminLevel === selectedAdminLevel;
    
    // Department filter
    const matchesDepartment = 
      selectedDepartment === "all" || 
      profile.department === selectedDepartment;
    
    return matchesSearch && matchesAdminLevel && matchesDepartment;
  }) : [];

  // Sort profiles by evaluation score (lowest first to highlight struggling educators)
  const sortedProfiles = [...filteredProfiles].sort((a: any, b: any) => 
    a.evaluationScore - b.evaluationScore
  );

  const openEducatorDetails = (educator: any) => {
    setCurrentEducator(educator);
    setShowDetailsDialog(true);
  };

  const departmentOptions = departments.length > 0 ? departments : sampleDepartments;

  const adminLevelOptions = [
    { value: AdminLevel.DISTRICT, label: "District" },
    { value: AdminLevel.SCHOOL, label: "School" },
    { value: AdminLevel.DEPARTMENT, label: "Department" },
  ];

  // Performance categories
  const performanceCategories = {
    needsImprovement: sortedProfiles.filter((p: any) => p.evaluationScore < 60),
    average: sortedProfiles.filter((p: any) => p.evaluationScore >= 60 && p.evaluationScore < 75),
    good: sortedProfiles.filter((p: any) => p.evaluationScore >= 75 && p.evaluationScore < 90),
    excellent: sortedProfiles.filter((p: any) => p.evaluationScore >= 90)
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Educator Profiles & Performance</CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search educators..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedAdminLevel} onValueChange={setSelectedAdminLevel}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Admin Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {adminLevelOptions.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentOptions.map((dept: any) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="needs-improvement" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="needs-improvement" className="relative">
              Needs Improvement
              {performanceCategories.needsImprovement.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {performanceCategories.needsImprovement.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="average">Average</TabsTrigger>
            <TabsTrigger value="good">Good</TabsTrigger>
            <TabsTrigger value="excellent">Excellent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="needs-improvement" className="space-y-4">
            {performanceCategories.needsImprovement.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No educators in this category.</p>
              </div>
            ) : (
              performanceCategories.needsImprovement.map((educator: any) => (
                <EducatorCard 
                  key={educator.id} 
                  educator={educator} 
                  onClick={() => openEducatorDetails(educator)} 
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="average" className="space-y-4">
            {performanceCategories.average.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No educators in this category.</p>
              </div>
            ) : (
              performanceCategories.average.map((educator: any) => (
                <EducatorCard 
                  key={educator.id} 
                  educator={educator} 
                  onClick={() => openEducatorDetails(educator)} 
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="good" className="space-y-4">
            {performanceCategories.good.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No educators in this category.</p>
              </div>
            ) : (
              performanceCategories.good.map((educator: any) => (
                <EducatorCard 
                  key={educator.id} 
                  educator={educator} 
                  onClick={() => openEducatorDetails(educator)} 
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="excellent" className="space-y-4">
            {performanceCategories.excellent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No educators in this category.</p>
              </div>
            ) : (
              performanceCategories.excellent.map((educator: any) => (
                <EducatorCard 
                  key={educator.id} 
                  educator={educator} 
                  onClick={() => openEducatorDetails(educator)} 
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Educator Details Dialog */}
      {currentEducator && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Educator Profile</DialogTitle>
              <DialogDescription>
                Detailed view of educator performance and improvement opportunities
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {/* Left column - Basic info */}
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage src={currentEducator.profileImage} />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {getInitials(currentEducator.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-medium">{currentEducator.name}</h3>
                  <p className="text-muted-foreground">{currentEducator.department}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <span>{currentEducator.school}</span>
                    <span>•</span>
                    <span>{currentEducator.district}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Admin Level:</strong> {currentEducator.adminLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Expertise:</strong> {currentEducator.expertise.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Experience:</strong> {currentEducator.yearOfExperience} years
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {currentEducator.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Middle column - Performance metrics */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Performance Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Overall Evaluation</span>
                        <span className={`font-medium ${getPerformanceColor(currentEducator.evaluationScore)}`}>
                          {currentEducator.evaluationScore}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            currentEducator.evaluationScore >= 90 ? 'bg-indigo-500' :
                            currentEducator.evaluationScore >= 75 ? 'bg-green-500' :
                            currentEducator.evaluationScore >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${currentEducator.evaluationScore}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Student Outcomes</span>
                        <span className={`font-medium ${getPerformanceColor(currentEducator.studentOutcomes)}`}>
                          {currentEducator.studentOutcomes}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            currentEducator.studentOutcomes >= 90 ? 'bg-indigo-500' :
                            currentEducator.studentOutcomes >= 75 ? 'bg-green-500' :
                            currentEducator.studentOutcomes >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${currentEducator.studentOutcomes}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Class Engagement</span>
                        <span className={`font-medium ${getPerformanceColor(currentEducator.classEngagement)}`}>
                          {currentEducator.classEngagement}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            currentEducator.classEngagement >= 90 ? 'bg-indigo-500' :
                            currentEducator.classEngagement >= 75 ? 'bg-green-500' :
                            currentEducator.classEngagement >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${currentEducator.classEngagement}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recent Feedback</h4>
                  <p className="text-sm border rounded-md p-3 bg-secondary/20">
                    {currentEducator.recentFeedback}
                  </p>
                </div>
              </div>
              
              {/* Right column - Improvement areas and actions */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Areas for Improvement</h4>
                  {currentEducator.improvementAreas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No improvement areas identified</p>
                  ) : (
                    <ul className="space-y-2">
                      {currentEducator.improvementAreas.map((area: any, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          {area.priority === 'high' ? (
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                          ) : area.priority === 'medium' ? (
                            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                          )}
                          <div>
                            <span className="text-sm">{area.area}</span>
                            <Badge 
                              variant="outline" 
                              className={`ml-2 ${getImprovementBadgeColor(area.priority)}`}
                            >
                              {area.priority} priority
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Action Items</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full flex justify-start gap-2">
                      <Award className="h-4 w-4" />
                      <span>Schedule Performance Review</span>
                    </Button>
                    <Button variant="outline" className="w-full flex justify-start gap-2">
                      <Users className="h-4 w-4" />
                      <span>Assign Mentor</span>
                    </Button>
                    <Button variant="outline" className="w-full flex justify-start gap-2">
                      <Book className="h-4 w-4" />
                      <span>Recommend Professional Development</span>
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">
                    <span>Generate Improvement Plan</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

// Educator card component
function EducatorCard({ educator, onClick }: { educator: any, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer border rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex-shrink-0 flex items-start md:items-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={educator.profileImage} />
          <AvatarFallback className="text-lg bg-primary/10 text-primary">
            {getInitials(educator.name)}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex-grow space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h3 className="font-medium text-lg">{educator.name}</h3>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-primary/10">{educator.department}</Badge>
            <Badge variant="outline" className="bg-secondary/50">{educator.school}</Badge>
            <Badge variant="outline">{educator.adminLevel}</Badge>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <span>{educator.expertise.join(", ")}</span>
          <span className="mx-2">•</span>
          <span>{educator.yearOfExperience} years experience</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Evaluation</span>
              <span className={getPerformanceColor(educator.evaluationScore)}>{educator.evaluationScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  educator.evaluationScore >= 90 ? 'bg-indigo-500' :
                  educator.evaluationScore >= 75 ? 'bg-green-500' :
                  educator.evaluationScore >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${educator.evaluationScore}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Outcomes</span>
              <span className={getPerformanceColor(educator.studentOutcomes)}>{educator.studentOutcomes}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  educator.studentOutcomes >= 90 ? 'bg-indigo-500' :
                  educator.studentOutcomes >= 75 ? 'bg-green-500' :
                  educator.studentOutcomes >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${educator.studentOutcomes}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Engagement</span>
              <span className={getPerformanceColor(educator.classEngagement)}>{educator.classEngagement}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  educator.classEngagement >= 90 ? 'bg-indigo-500' :
                  educator.classEngagement >= 75 ? 'bg-green-500' :
                  educator.classEngagement >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${educator.classEngagement}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 flex items-center">
        <Button variant="ghost" size="sm">
          <span className="sr-only">View Details</span>
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}