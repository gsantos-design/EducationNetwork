import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { 
  Loader2, Award, Trophy, Medal, Star, ZoomIn, ZoomOut, 
  Move, RotateCcw, Calendar, Filter, ChevronLeft, ChevronRight,
  BarChart2, List, PartyPopper
} from "lucide-react";
import { MilestoneCelebration, MilestoneType } from "./milestone-celebration";

type Achievement = {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  type: string; // badge, certificate, milestone, level-up
  earnedAt: string;
  subject: string | null;
  pathNodeId: string | null;
  progress: number | null;
  maxProgress: number | null;
  level: string | null;
  iconType: string | null;
  shared: boolean;
  visible: boolean;
  isPublic: boolean;
  createdByEducator: boolean;
};

type LearningPathNode = {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'mastered';
  type: 'concept' | 'skill' | 'assessment' | 'educator-assessment';
  dependencies: string[];
  progress: number;
  score?: number;
  subject: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  achievements?: Achievement[];
};

type LearningPath = {
  id: string;
  title: string;
  description: string;
  subject: string;
  nodes: LearningPathNode[];
  progress: number;
};

export default function LearningPathVisualization() {
  const { user } = useAuth();
  const { toast } = useToast();
  const visualizationRef = useRef<HTMLDivElement>(null);
  
  // Filter states
  const [activeSubject, setActiveSubject] = useState<string>("all");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("all");
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Milestone celebration state
  const [activeMilestone, setActiveMilestone] = useState<MilestoneType | null>(null);
  
  // Zoom and pan states
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [position, setPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [startPanPosition, setStartPanPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [isHistoryView, setIsHistoryView] = useState<boolean>(false);
  const [viewType, setViewType] = useState<'graph' | 'list'>('graph');
  
  const { data: learningPaths, isLoading, error } = useQuery({
    queryKey: ["/api/learning-paths"],
    enabled: !!user,
  });
  
  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ["/api/achievements"],
    enabled: !!user,
  });
  
  // Example progress history data - in a real app, this would come from API
  const [progressHistory] = useState([
    { date: '2024-01-01', progress: 10 },
    { date: '2024-01-15', progress: 25 },
    { date: '2024-02-01', progress: 35 },
    { date: '2024-02-15', progress: 40 },
    { date: '2024-03-01', progress: 60 },
    { date: '2024-03-15', progress: 75 },
    { date: '2024-03-26', progress: 85 },
  ]);
  
  // Pan event handlers
  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsPanning(true);
    setStartPanPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    
    // Change cursor style
    if (visualizationRef.current) {
      visualizationRef.current.style.cursor = 'grabbing';
    }
  };
  
  const handlePanMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const newX = e.clientX - startPanPosition.x;
    const newY = e.clientY - startPanPosition.y;
    
    setPosition({ x: newX, y: newY });
    
    // Prevent text selection while panning
    e.preventDefault();
  };
  
  const handlePanEnd = () => {
    setIsPanning(false);
    
    // Reset cursor style
    if (visualizationRef.current) {
      visualizationRef.current.style.cursor = 'grab';
    }
  };
  
  // Setup and cleanup pan event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      
      const newX = e.clientX - startPanPosition.x;
      const newY = e.clientY - startPanPosition.y;
      
      setPosition({ x: newX, y: newY });
    };
    
    const handleMouseUp = () => {
      setIsPanning(false);
      
      // Reset cursor style
      if (visualizationRef.current) {
        visualizationRef.current.style.cursor = 'grab';
      }
    };
    
    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, startPanPosition]);

  // Type guard to check if we have proper learning paths data
  const isValidLearningPaths = (data: any): data is LearningPath[] => {
    return Array.isArray(data) && data.length > 0 && 'id' in data[0] && 'nodes' in data[0];
  };
  
  // Select a default learning path when data loads
  useEffect(() => {
    if (learningPaths && isValidLearningPaths(learningPaths)) {
      setSelectedPath(learningPaths[0]);
    }
  }, [learningPaths]);

  // Connect achievements to learning path nodes
  useEffect(() => {
    if (!selectedPath || !achievements) return;
    
    // Create a copy of the selected path with achievements attached to nodes
    const pathWithAchievements = {
      ...selectedPath,
      nodes: selectedPath.nodes.map(node => {
        // Find achievements that are linked to this node
        const nodeAchievements = Array.isArray(achievements) 
          ? achievements.filter(achievement => achievement.pathNodeId === node.id)
          : [];
        
        return {
          ...node,
          achievements: nodeAchievements
        };
      })
    };
    
    setSelectedPath(pathWithAchievements);
  }, [selectedPath?.id, achievements]);

  // Handler for clicking a node in the visualization
  const handleNodeClick = (nodeId: string) => {
    if (!selectedPath) return;
    setSelectedNodeId(nodeId);
    
    const node = selectedPath.nodes.find(n => n.id === nodeId);
    if (node) {
      const nodeAchievements = node.achievements || [];
      const achievementInfo = nodeAchievements.length > 0
        ? `\n\n🏆 Achievements (${nodeAchievements.length}): ${nodeAchievements.map(a => a.title).join(', ')}`
        : '';
      
      // Check if this node has any milestone achievements
      const milestone = nodeAchievements.find(a => 
        a.type === 'milestone' || a.type === 'badge' || a.type === 'certificate' || a.type === 'level-up'
      );
      
      if (milestone && node.status === 'completed' && Math.random() < 0.7) {
        // Convert achievement to milestone format for celebration
        setActiveMilestone({
          id: milestone.id,
          title: milestone.title,
          description: milestone.description || '',
          type: milestone.type as 'milestone' | 'badge' | 'certificate' | 'level-up',
          iconType: milestone.iconType as 'trophy' | 'medal' | 'award' | 'star' || 'award',
          subject: milestone.subject || undefined,
          earnedAt: milestone.earnedAt
        });
      } else {
        // Show regular toast for nodes without achievements or if we don't want to show celebration every time
        toast({
          title: node.title,
          description: `${node.description}${achievementInfo}`,
          duration: 5000,
        });
      }
    }
  };

  // Filter unique subjects from all learning paths
  const getUniqueSubjects = () => {
    if (!learningPaths || !Array.isArray(learningPaths)) return ["all"];
    
    const subjects = new Set<string>();
    subjects.add("all");
    
    learningPaths.forEach((path: LearningPath) => {
      subjects.add(path.subject);
    });
    
    return Array.from(subjects);
  };
  
  // Get unique difficulty levels
  const getUniqueDifficulties = () => {
    if (!selectedPath || !selectedPath.nodes) return ["all"];
    
    const difficulties = new Set<string>();
    difficulties.add("all");
    
    selectedPath.nodes.forEach(node => {
      difficulties.add(node.difficulty);
    });
    
    return Array.from(difficulties);
  };

  // Filter learning paths based on selected subject
  const getFilteredPaths = () => {
    if (!learningPaths || !Array.isArray(learningPaths)) return [];
    
    if (activeSubject === "all") {
      return learningPaths;
    }
    
    return learningPaths.filter((path: LearningPath) => path.subject === activeSubject);
  };
  
  // Zoom control handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };
  
  const handleReset = () => {
    setZoomLevel(100);
    setPosition({ x: 0, y: 0 });
  };
  
  // Toggle between progress history view and path view
  const toggleHistoryView = () => {
    setIsHistoryView(prev => !prev);
  };
  
  // Toggle between graph and list view
  const toggleViewType = () => {
    setViewType(prev => prev === 'graph' ? 'list' : 'graph');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Paths</CardTitle>
          <CardDescription>Your personalized learning journey</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error || !learningPaths) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Paths</CardTitle>
          <CardDescription>Your personalized learning journey</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Unable to load learning paths</h3>
            <p className="text-sm text-muted-foreground mb-4">
              There was an error loading your learning path data. Please try again later.
            </p>
            <Button variant="outline">Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Milestone celebration component */}
      <MilestoneCelebration 
        milestone={activeMilestone} 
        onClose={() => setActiveMilestone(null)} 
      />
      
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {user?.role === UserRole.STUDENT 
                ? "My Learning Journey" 
                : user?.role === UserRole.ADMIN 
                  ? "Learning Paths & Educator Performance" 
                  : "Student Learning Paths"}
            </CardTitle>
            <CardDescription>
              {user?.role === UserRole.STUDENT 
                ? "Visualize your personalized learning path and progress" 
                : user?.role === UserRole.ADMIN
                  ? "Monitor curriculum implementation and analyze educator effectiveness"
                  : "View and manage student learning progress"}
            </CardDescription>
          </div>
          {user?.role !== UserRole.STUDENT && (
            <Button size="sm" variant="outline">
              <svg 
                className="w-4 h-4 mr-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Path
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subject Filter */}
        <div className="flex overflow-x-auto py-2 no-scrollbar">
          <div className="flex space-x-2">
            {getUniqueSubjects().map(subject => (
              <Badge 
                key={subject} 
                variant={activeSubject === subject ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveSubject(subject)}
              >
                {subject === "all" ? "All Subjects" : subject}
              </Badge>
            ))}
          </div>
        </div>

        {/* Path Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getFilteredPaths().map(path => (
            <Card 
              key={path.id} 
              className={`cursor-pointer hover:border-primary/50 transition-colors ${
                selectedPath?.id === path.id ? 'border-primary' : ''
              }`}
              onClick={() => setSelectedPath(path)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-1">{path.title}</h3>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary" className="text-xs">{path.subject}</Badge>
                  <span className="text-xs text-muted-foreground">{path.progress}% complete</span>
                </div>
                <div className="w-full h-1 bg-secondary/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visualization */}
        {selectedPath && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">{selectedPath.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{selectedPath.description}</p>
            
            {/* Visualization Controls */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
              {/* View Type and Progress History Toggles */}
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant={viewType === 'graph' ? "default" : "outline"}
                  onClick={toggleViewType}
                  className="h-8"
                >
                  <BarChart2 className="h-4 w-4 mr-1" />
                  Graph
                </Button>
                <Button 
                  size="sm" 
                  variant={viewType === 'list' ? "default" : "outline"}
                  onClick={toggleViewType}
                  className="h-8"
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
                <div className="h-5 border-l border-neutral-300 mx-1"></div>
                <Button 
                  size="sm" 
                  variant={isHistoryView ? "default" : "outline"}
                  onClick={toggleHistoryView}
                  className="h-8"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  {isHistoryView ? "Current View" : "Progress History"}
                </Button>
              </div>
              
              {/* Difficulty Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={activeDifficulty} onValueChange={setActiveDifficulty}>
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {getUniqueDifficulties().map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty === 'all' ? 'All Levels' : difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 bg-background/60 backdrop-blur-sm rounded-md p-1 border">
                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <div className="text-xs px-1 min-w-[40px] text-center">{zoomLevel}%</div>
                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="h-5 border-l border-neutral-200 mx-1"></div>
                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {isHistoryView ? (
              <div className="bg-secondary/10 p-4 rounded-lg min-h-[300px]">
                <h4 className="text-sm font-medium mb-3">Progress History</h4>
                <div className="h-[250px] relative">
                  {/* Simple line chart for progress history */}
                  <div className="absolute bottom-0 left-0 right-0 h-[200px] border-l border-b border-neutral-300">
                    {/* Y-axis labels */}
                    <div className="absolute -left-8 bottom-0 text-xs">0%</div>
                    <div className="absolute -left-8 bottom-[100px] text-xs">50%</div>
                    <div className="absolute -left-8 bottom-[200px] text-xs">100%</div>
                    
                    {/* Progress line */}
                    <svg className="absolute inset-0 h-full w-full overflow-visible">
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>
                      
                      {/* Plot the line */}
                      {progressHistory.length > 0 && (
                        <>
                          <path 
                            d={`M0,${200 - (progressHistory[0].progress * 2)} ${progressHistory.map((point, i) => 
                              `L${(i / (progressHistory.length - 1)) * 100}%,${200 - (point.progress * 2)}`
                            ).join(' ')}`}
                            fill="none"
                            stroke="rgb(99, 102, 241)"
                            strokeWidth="2"
                          />
                          {/* Add area fill below the line */}
                          <path 
                            d={`M0,${200 - (progressHistory[0].progress * 2)} ${progressHistory.map((point, i) => 
                              `L${(i / (progressHistory.length - 1)) * 100}%,${200 - (point.progress * 2)}`
                            ).join(' ')} L100%,200 L0,200 Z`}
                            fill="url(#progressGradient)"
                          />
                          {/* Add data points */}
                          {progressHistory.map((point, i) => (
                            <circle 
                              key={i}
                              cx={`${(i / (progressHistory.length - 1)) * 100}%`}
                              cy={200 - (point.progress * 2)}
                              r="4"
                              fill="white"
                              stroke="rgb(99, 102, 241)"
                              strokeWidth="2"
                              className="transition-all duration-300 hover:r-5"
                            />
                          ))}
                        </>
                      )}
                    </svg>
                  </div>
                  
                  {/* X-axis dates */}
                  <div className="absolute bottom-[-25px] left-0 right-0 flex justify-between">
                    {progressHistory.map((point, i) => (
                      <div key={i} className="text-xs rotate-45 origin-top-left transform translate-y-2">
                        {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : viewType === 'graph' ? (
              <div 
                className="relative bg-secondary/10 p-4 rounded-lg overflow-hidden cursor-grab" 
                ref={visualizationRef}
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center center',
                }}
                onMouseDown={handlePanStart}
                onMouseMove={handlePanMove}
                onMouseUp={handlePanEnd}
                onMouseLeave={handlePanEnd}
              >
                {/* Panning instructions */}
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground border z-10">
                  <Move className="h-3 w-3 inline-block mr-1" /> Click and drag to pan
                </div>
                
                {/* Learning path visualization */}
                <div 
                  className="flex flex-col space-y-6"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                  }}
                >
                  {/* We'll group nodes by their dependency level */}
                  {renderLearningPathVisual(
                    selectedPath, 
                    handleNodeClick, 
                    activeDifficulty === 'all' ? null : activeDifficulty
                  )}
                </div>
              </div>
            ) : (
              // List view
              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="space-y-2">
                  {selectedPath.nodes
                    .filter(node => activeDifficulty === 'all' || node.difficulty === activeDifficulty)
                    .sort((a, b) => {
                      // Sort by status: not-started, in-progress, completed, mastered
                      const statusOrder = {
                        'not-started': 0, 
                        'in-progress': 1, 
                        'completed': 2, 
                        'mastered': 3
                      };
                      return statusOrder[a.status] - statusOrder[b.status];
                    })
                    .map(node => (
                      <div 
                        key={node.id}
                        className="flex items-center p-2 rounded-md hover:bg-secondary/20 cursor-pointer"
                        onClick={() => handleNodeClick(node.id)}
                      >
                        <div className={`w-4 h-4 rounded-full mr-3 ${getNodeBackgroundColor(node.status, node.type)}`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{node.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {node.type.charAt(0).toUpperCase() + node.type.slice(1)} | {node.difficulty} | {node.estimatedHours} hrs
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {node.progress}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mt-6">
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs">In Progress</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-neutral-400" />
                  <span className="text-xs">Not Started</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs">Mastered</span>
                </div>

                {/* Achievement badges legend */}
                <div className="h-4 border-l border-neutral-300 mx-1"></div>
                <div className="flex items-center space-x-1">
                  <div className="flex items-center justify-center">
                    <Award className="h-3 w-3 text-yellow-500" />
                  </div>
                  <span className="text-xs">Badge</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex items-center justify-center">
                    <Trophy className="h-3 w-3 text-yellow-500" />
                  </div>
                  <span className="text-xs">Trophy</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="text-[9px] py-0 px-1 h-3 border-yellow-500 text-yellow-600 dark:text-yellow-400">
                    M
                  </Badge>
                  <span className="text-xs">Milestone</span>
                </div>
                
                {/* Test button for milestone celebration */}
                <div className="h-4 border-l border-neutral-300 mx-1"></div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 text-xs gap-1 bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
                  onClick={() => {
                    setActiveMilestone({
                      id: "demo-1",
                      title: "Achievement Unlocked!",
                      description: "You've completed a major milestone in your learning journey. Keep up the great work!",
                      type: "milestone",
                      iconType: "trophy",
                      subject: selectedPath.subject,
                      earnedAt: new Date().toISOString()
                    });
                  }}
                >
                  <PartyPopper className="h-3 w-3" /> Demo Celebration
                </Button>
                
                {/* Only show educator performance legend for admin users */}
                {user?.role === UserRole.ADMIN && (
                  <>
                    <div className="h-4 border-l border-neutral-300 mx-1"></div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      <span className="text-xs">Excellent Educator</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-xs">Average Educator</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-xs">Struggling Educator</span>
                    </div>
                  </>
                )}
              </div>
              
              <Button variant="outline" size="sm">
                <svg 
                  className="w-4 h-4 mr-1" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
                Customize Path
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Function to organize and render the learning path visualization
function renderLearningPathVisual(
  path: LearningPath, 
  onNodeClick: (nodeId: string) => void,
  difficultyFilter: string | null = null
) {
  // Filter nodes by difficulty if filter is active
  const filteredNodes = difficultyFilter 
    ? path.nodes.filter(node => node.difficulty === difficultyFilter)
    : path.nodes;
    
  const nodesByLevel = organizeNodesByLevel(filteredNodes);
  
  return (
    <div className="relative">
      {nodesByLevel.map((levelNodes, levelIndex) => (
        <div key={levelIndex} className="flex justify-between mb-20 relative">
          {/* Draw connecting lines between nodes */}
          {levelIndex < nodesByLevel.length - 1 && (
            <div className="absolute top-12 left-0 right-0 h-20 z-0">
              {levelNodes.map(node => 
                node.dependencies.length === 0 && levelIndex > 0 ? (
                  <div 
                    key={`line-${node.id}`}
                    className="absolute w-0.5 bg-neutral-200"
                    style={{
                      left: `calc(${(levelNodes.indexOf(node) + 0.5) * (100 / levelNodes.length)}%)`,
                      height: '100%',
                      top: 0,
                    }}
                  />
                ) : null
              )}
            </div>
          )}
          
          {/* Render nodes at this level */}
          {levelNodes.map((node, nodeIndex) => (
            <div 
              key={node.id}
              className="flex flex-col items-center relative z-10"
              style={{ width: `${100 / levelNodes.length}%` }}
            >
              {/* Achievement badges */}
              {node.achievements && node.achievements.length > 0 && (
                <div className="absolute -top-3 -right-3 z-20">
                  {node.achievements.slice(0, 1).map((achievement) => {
                    // Render achievement badge icon based on type
                    const getAchievementIcon = () => {
                      switch(achievement.iconType) {
                        case 'trophy': 
                          return <Trophy className="h-4 w-4 text-yellow-500" />;
                        case 'medal': 
                          return <Medal className="h-4 w-4 text-yellow-300" />;
                        case 'star': 
                          return <Star className="h-4 w-4 text-yellow-300" />;
                        default: 
                          return <Award className="h-4 w-4 text-yellow-400" />;
                      }
                    };
                    
                    return (
                      <div 
                        key={achievement.id}
                        className="h-7 w-7 rounded-full bg-white dark:bg-black border-2 border-primary flex items-center justify-center shadow-md relative group"
                        title={achievement.title}
                      >
                        {getAchievementIcon()}
                        {node.achievements && node.achievements.length > 1 && (
                          <span className="absolute -top-1 -right-1 text-[10px] bg-primary text-white h-4 w-4 rounded-full flex items-center justify-center">
                            {node.achievements.length}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div 
                className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transform transition-transform hover:scale-105 ${getNodeBackgroundColor(node.status, node.type)}`}
                onClick={() => onNodeClick(node.id)}
              >
                <div className="text-center p-1">
                  <div className="text-xs font-medium text-white">{node.title}</div>
                  {node.type === 'educator-assessment' ? (
                    <div className="text-[10px] text-white/90 mt-1">
                      Performance: {node.score}%
                    </div>
                  ) : node.status === 'completed' || node.status === 'mastered' ? (
                    <div className="text-[10px] text-white/90 mt-1">
                      {node.score ? `Score: ${node.score}%` : 'Completed'}
                    </div>
                  ) : (
                    <div className="text-[10px] text-white/90 mt-1">
                      {node.progress}% done
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs mt-2 font-medium">
                {node.type === 'educator-assessment' 
                  ? 'Educator' 
                  : node.type.charAt(0).toUpperCase() + node.type.slice(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {node.estimatedHours} hrs | {node.difficulty}
              </div>
              
              {/* Show milestone indicator if needed */}
              {node.achievements && node.achievements.some(a => a.type === 'milestone') && (
                <div className="mt-1">
                  <Badge variant="outline" className="text-[10px] border-yellow-500 text-yellow-600 dark:text-yellow-400">
                    Milestone
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Helper function to organize nodes by their dependency level
function organizeNodesByLevel(nodes: LearningPathNode[]): LearningPathNode[][] {
  const result: LearningPathNode[][] = [];
  const processed = new Set<string>();
  
  // Start with nodes that have no dependencies
  let currentLevel = nodes.filter(node => node.dependencies.length === 0);
  
  while (currentLevel.length > 0) {
    result.push([...currentLevel]);
    
    // Mark all current level nodes as processed
    currentLevel.forEach(node => processed.add(node.id));
    
    // Find nodes whose dependencies are all processed
    currentLevel = nodes.filter(node => 
      !processed.has(node.id) && // Not already processed
      node.dependencies.every(depId => processed.has(depId)) // All dependencies processed
    );
  }
  
  // Handle any remaining nodes (possible circular dependencies)
  const remaining = nodes.filter(node => !processed.has(node.id));
  if (remaining.length > 0) {
    result.push(remaining);
  }
  
  return result;
}

// Get background color based on node status
function getNodeBackgroundColor(status: LearningPathNode['status'], type?: string): string {
  // Special handling for educator performance nodes
  if (type === 'educator-assessment') {
    switch (status) {
      case 'not-started':
        return 'bg-red-500'; // Poor performance
      case 'in-progress':
        return 'bg-yellow-500'; // Average performance
      case 'completed':
        return 'bg-green-500'; // Good performance
      case 'mastered':
        return 'bg-indigo-500'; // Excellent performance
      default:
        return 'bg-neutral-300';
    }
  }
  
  // Regular learning nodes
  switch (status) {
    case 'not-started':
      return 'bg-neutral-400';
    case 'in-progress':
      return 'bg-blue-500';
    case 'completed':
      return 'bg-green-500';
    case 'mastered':
      return 'bg-purple-500';
    default:
      return 'bg-neutral-300';
  }
}