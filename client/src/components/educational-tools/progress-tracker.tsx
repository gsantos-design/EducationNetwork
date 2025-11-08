import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// Demo data for the progress tracker
const studentData = {
  name: "Alex Johnson",
  grade: "9th Grade",
  subjects: [
    { 
      name: "Mathematics", 
      grade: "A-", 
      progress: 87, 
      trend: "improving",
      assessments: [
        { name: "Quiz 1", score: 82, maxScore: 100, date: "2023-09-10" },
        { name: "Homework 2", score: 88, maxScore: 100, date: "2023-09-17" },
        { name: "Quiz 2", score: 85, maxScore: 100, date: "2023-09-24" },
        { name: "Project 1", score: 90, maxScore: 100, date: "2023-10-05" },
        { name: "Midterm Exam", score: 87, maxScore: 100, date: "2023-10-15" }
      ],
      skills: [
        { name: "Algebra", level: 4, outOf: 5 },
        { name: "Geometry", level: 3, outOf: 5 },
        { name: "Statistics", level: 4, outOf: 5 },
        { name: "Calculus", level: 2, outOf: 5 }
      ]
    },
    { 
      name: "Science", 
      grade: "B+", 
      progress: 78, 
      trend: "stable",
      assessments: [
        { name: "Lab Report 1", score: 75, maxScore: 100, date: "2023-09-12" },
        { name: "Quiz 1", score: 80, maxScore: 100, date: "2023-09-19" },
        { name: "Lab Report 2", score: 72, maxScore: 100, date: "2023-09-26" },
        { name: "Research Project", score: 85, maxScore: 100, date: "2023-10-07" },
        { name: "Midterm Exam", score: 78, maxScore: 100, date: "2023-10-17" }
      ],
      skills: [
        { name: "Scientific Method", level: 4, outOf: 5 },
        { name: "Lab Techniques", level: 3, outOf: 5 },
        { name: "Data Analysis", level: 4, outOf: 5 },
        { name: "Scientific Writing", level: 3, outOf: 5 }
      ]
    },
    { 
      name: "English", 
      grade: "A", 
      progress: 92, 
      trend: "improving",
      assessments: [
        { name: "Essay 1", score: 88, maxScore: 100, date: "2023-09-14" },
        { name: "Reading Quiz", score: 95, maxScore: 100, date: "2023-09-21" },
        { name: "Discussion", score: 90, maxScore: 100, date: "2023-09-28" },
        { name: "Book Report", score: 93, maxScore: 100, date: "2023-10-09" },
        { name: "Midterm Exam", score: 94, maxScore: 100, date: "2023-10-19" }
      ],
      skills: [
        { name: "Reading Comprehension", level: 5, outOf: 5 },
        { name: "Writing", level: 4, outOf: 5 },
        { name: "Critical Analysis", level: 5, outOf: 5 },
        { name: "Grammar", level: 4, outOf: 5 }
      ]
    },
    { 
      name: "History", 
      grade: "B", 
      progress: 75, 
      trend: "declining",
      assessments: [
        { name: "Quiz 1", score: 78, maxScore: 100, date: "2023-09-11" },
        { name: "Essay", score: 75, maxScore: 100, date: "2023-09-18" },
        { name: "Presentation", score: 80, maxScore: 100, date: "2023-09-25" },
        { name: "Research Paper", score: 73, maxScore: 100, date: "2023-10-06" },
        { name: "Midterm Exam", score: 70, maxScore: 100, date: "2023-10-16" }
      ],
      skills: [
        { name: "Historical Context", level: 3, outOf: 5 },
        { name: "Primary Source Analysis", level: 4, outOf: 5 },
        { name: "Chronological Thinking", level: 3, outOf: 5 },
        { name: "Historical Writing", level: 3, outOf: 5 }
      ]
    }
  ],
  attendance: {
    present: 28,
    absent: 1,
    late: 2,
    total: 31,
    absenceDates: ["2023-09-15"],
    lateDates: ["2023-09-22", "2023-10-12"]
  },
  goals: [
    { id: 1, description: "Improve calculus skills with additional practice", completed: false, dueDate: "2023-11-15", subject: "Mathematics" },
    { id: 2, description: "Complete science fair project ahead of deadline", completed: true, dueDate: "2023-10-10", subject: "Science" },
    { id: 3, description: "Read two extra books for English class", completed: false, dueDate: "2023-12-01", subject: "English" }
  ],
  behavior: {
    positiveIncidents: 3,
    negativeIncidents: 0,
    notes: [
      { date: "2023-09-20", note: "Helped organize class study group", type: "positive" },
      { date: "2023-10-03", note: "Volunteered to help clean lab equipment", type: "positive" },
      { date: "2023-10-14", note: "Assisted new student with finding resources", type: "positive" }
    ]
  }
};

// Helper function to get chart data from assessments
function getChartData(assessments: { name: string, score: number, maxScore: number, date: string }[]) {
  return assessments.map(assessment => ({
    name: assessment.name,
    score: assessment.score,
    date: new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));
}

// Helper function to get color based on progress
function getProgressColor(progress: number): string {
  if (progress >= 90) return "bg-green-500";
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 70) return "bg-yellow-500";
  if (progress >= 60) return "bg-orange-500";
  return "bg-red-500";
}

// Helper function to get badge style based on trend
function getTrendBadge(trend: string) {
  if (trend === "improving") {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Improving</Badge>;
  } else if (trend === "stable") {
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Stable</Badge>;
  } else {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Needs Attention</Badge>;
  }
}

export default function ProgressTracker() {
  const [activeSubject, setActiveSubject] = useState(studentData.subjects[0]);
  const [activeTab, setActiveTab] = useState("overview");
  const [newGoal, setNewGoal] = useState({ description: "", subject: "", dueDate: "" });

  const handleAddGoal = () => {
    // In a real application, this would update the data store
    console.log("Adding new goal:", newGoal);
    // Reset form
    setNewGoal({ description: "", subject: "", dueDate: "" });
  };

  const handleToggleGoalCompletion = (goalId: number) => {
    // In a real application, this would update the data store
    console.log("Toggling goal completion:", goalId);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="goals">Goals & Notes</TabsTrigger>
        </TabsList>
        
        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Student Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 text-xl font-medium">
                    {studentData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{studentData.name}</h3>
                    <p className="text-neutral-500">{studentData.grade}</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500">Attendance Rate</p>
                    <p className="text-lg font-medium">
                      {Math.round((studentData.attendance.present / studentData.attendance.total) * 100)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Overall GPA</p>
                    <p className="text-lg font-medium">3.71</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Completed Goals</p>
                    <p className="text-lg font-medium">
                      {studentData.goals.filter(g => g.completed).length}/{studentData.goals.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Behavior Notes</p>
                    <p className="text-lg font-medium">
                      +{studentData.behavior.positiveIncidents} / -{studentData.behavior.negativeIncidents}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Progress Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={studentData.subjects.map(subject => ({
                      name: subject.name,
                      progress: subject.progress
                    }))}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Subject Progress</h3>
            <div className="grid gap-3">
              {studentData.subjects.map((subject, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="font-medium">{subject.name}</div>
                        <div className="ml-2 text-sm font-medium">{subject.grade}</div>
                      </div>
                      {getTrendBadge(subject.trend)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className={`h-2 ${getProgressColor(subject.progress)}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Assessments</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {studentData.subjects.flatMap(subj => 
                    subj.assessments.slice(-1).map(assessment => ({
                      ...assessment,
                      subject: subj.name
                    }))
                  ).sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                  ).slice(0, 5).map((assessment, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">{assessment.name}</div>
                        <div className="text-xs text-neutral-500">{assessment.subject} • {new Date(assessment.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm font-medium">
                        {assessment.score}/{assessment.maxScore}
                        <span className="ml-1 text-xs">
                          ({Math.round((assessment.score / assessment.maxScore) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Goals</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {studentData.goals.filter(goal => !goal.completed).map((goal, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">{goal.description}</div>
                        <div className="text-xs text-neutral-500">{goal.subject} • Due: {new Date(goal.dueDate).toLocaleDateString()}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleGoalCompletion(goal.id)}
                      >
                        Complete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* SUBJECTS TAB */}
        <TabsContent value="subjects" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Subject List */}
            <Card className="w-full md:w-64">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium mb-3">Subjects</h3>
                  {studentData.subjects.map((subject, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSubject(subject)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeSubject.name === subject.name 
                          ? 'bg-primary-50 text-primary-700 font-medium' 
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {subject.name}
                      <span className="float-right font-medium">{subject.grade}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Subject Details */}
            <div className="flex-1 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{activeSubject.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-medium">{activeSubject.grade}</span>
                      {getTrendBadge(activeSubject.trend)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{activeSubject.progress}%</span>
                    </div>
                    <Progress 
                      value={activeSubject.progress} 
                      className={`h-2.5 ${getProgressColor(activeSubject.progress)}`} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills */}
                    <div>
                      <h3 className="text-base font-medium mb-3">Skills Mastery</h3>
                      <div className="space-y-3">
                        {activeSubject.skills.map((skill, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{skill.name}</span>
                              <span>Level {skill.level}/{skill.outOf}</span>
                            </div>
                            <Progress 
                              value={(skill.level / skill.outOf) * 100} 
                              className="h-2" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Assessment Trends */}
                    <div>
                      <h3 className="text-base font-medium mb-3">Assessment Trends</h3>
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart
                          data={getChartData(activeSubject.assessments)}
                          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#4f46e5" 
                            strokeWidth={2} 
                            dot={{ r: 4 }} 
                            activeDot={{ r: 6 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Assessment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium py-2 pl-1">Assessment</th>
                          <th className="text-left font-medium py-2">Date</th>
                          <th className="text-right font-medium py-2 pr-1">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeSubject.assessments.map((assessment, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="py-3 pl-1">{assessment.name}</td>
                            <td className="py-3">{new Date(assessment.date).toLocaleDateString()}</td>
                            <td className="py-3 pr-1 text-right">
                              <span className={`font-medium ${
                                assessment.score >= 90 ? 'text-green-600' :
                                assessment.score >= 80 ? 'text-emerald-600' :
                                assessment.score >= 70 ? 'text-yellow-600' :
                                assessment.score >= 60 ? 'text-orange-600' : 'text-red-600'
                              }`}>
                                {assessment.score}/{assessment.maxScore}
                                <span className="ml-1 text-xs">
                                  ({Math.round((assessment.score / assessment.maxScore) * 100)}%)
                                </span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* ATTENDANCE TAB */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {Math.round((studentData.attendance.present / studentData.attendance.total) * 100)}%
                </div>
                <div className="text-sm text-neutral-500">Attendance Rate</div>
                <Progress 
                  value={(studentData.attendance.present / studentData.attendance.total) * 100}
                  className="h-2 mt-3 w-full"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {studentData.attendance.present}
                </div>
                <div className="text-sm text-neutral-500">Days Present</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {studentData.attendance.absent}
                </div>
                <div className="text-sm text-neutral-500">Days Absent</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {studentData.attendance.late}
                </div>
                <div className="text-sm text-neutral-500">Days Late</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Attendance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium mb-2">Absent Dates</h3>
                  {studentData.attendance.absenceDates.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {studentData.attendance.absenceDates.map((date, index) => (
                        <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {new Date(date).toLocaleDateString()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500">No absences recorded.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-2">Late Dates</h3>
                  {studentData.attendance.lateDates.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {studentData.attendance.lateDates.map((date, index) => (
                        <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          {new Date(date).toLocaleDateString()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500">No late arrivals recorded.</p>
                  )}
                </div>
                
                <div className="pt-4">
                  <h3 className="text-base font-medium mb-3">Notes</h3>
                  <Textarea 
                    placeholder="Add attendance notes here..."
                    className="h-24"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button size="sm">Save Notes</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Attendance Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 text-center">
                <p className="text-neutral-500">Calendar view will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* GOALS & NOTES TAB */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Student Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.goals.length > 0 ? (
                    <div className="space-y-3">
                      {studentData.goals.map((goal, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id={`goal-${goal.id}`}
                            checked={goal.completed}
                            onChange={() => handleToggleGoalCompletion(goal.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <label 
                              htmlFor={`goal-${goal.id}`}
                              className={`text-sm font-medium ${goal.completed ? 'line-through text-neutral-400' : ''}`}
                            >
                              {goal.description}
                            </label>
                            <div className="text-xs text-neutral-500 mt-0.5">
                              {goal.subject} • Due: {new Date(goal.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 rounded-full"
                          >
                            <svg 
                              className="h-4 w-4 text-neutral-400" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                            <span className="sr-only">More options</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500 text-center py-4">No goals set yet.</p>
                  )}
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">Add New Goal</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="goalDescription" className="sr-only">Description</Label>
                        <Textarea 
                          id="goalDescription"
                          placeholder="What do you want to achieve?"
                          value={newGoal.description}
                          onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                          className="resize-none"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="goalSubject" className="sr-only">Subject</Label>
                          <Select
                            value={newGoal.subject}
                            onValueChange={(value) => setNewGoal({...newGoal, subject: value})}
                          >
                            <SelectTrigger id="goalSubject">
                              <SelectValue placeholder="Subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {studentData.subjects.map((subject, index) => (
                                <SelectItem key={index} value={subject.name}>
                                  {subject.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="goalDueDate" className="sr-only">Due Date</Label>
                          <Input 
                            id="goalDueDate"
                            type="date"
                            value={newGoal.dueDate}
                            onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={handleAddGoal}
                        disabled={!newGoal.description || !newGoal.subject || !newGoal.dueDate}
                        className="w-full"
                      >
                        <svg 
                          className="w-4 h-4 mr-1" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Goal
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Behavior Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <Card className="bg-green-50 border-green-100">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                          +{studentData.behavior.positiveIncidents}
                        </div>
                        <div className="text-sm text-green-700">Positive Notes</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-100">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">
                          {studentData.behavior.negativeIncidents}
                        </div>
                        <div className="text-sm text-red-700">Concerns</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-3">Recent Notes</h3>
                    <div className="space-y-3">
                      {studentData.behavior.notes.length > 0 ? (
                        studentData.behavior.notes.map((note, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-md text-sm ${
                              note.type === 'positive' 
                                ? 'bg-green-50 border border-green-100 text-green-800'
                                : 'bg-red-50 border border-red-100 text-red-800'
                            }`}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {note.type === 'positive' ? 'Positive' : 'Concern'}
                              </span>
                              <span>{new Date(note.date).toLocaleDateString()}</span>
                            </div>
                            <p className="mt-1">{note.note}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-neutral-500 text-center py-2">No behavior notes recorded.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">Add New Note</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="noteType" className="sr-only">Note Type</Label>
                        <Select defaultValue="positive">
                          <SelectTrigger id="noteType">
                            <SelectValue placeholder="Note Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="positive">Positive Note</SelectItem>
                            <SelectItem value="concern">Concern</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="noteText" className="sr-only">Note</Label>
                        <Textarea 
                          id="noteText"
                          placeholder="Enter behavior note..."
                          className="resize-none"
                          rows={3}
                        />
                      </div>
                      <Button className="w-full">
                        <svg 
                          className="w-4 h-4 mr-1" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Note
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}