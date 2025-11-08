import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ShareButton from "./share-button";
import { Award, Trophy, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: "badge" | "certificate" | "level-up" | "milestone";
  earnedAt: string;
  subject?: string;
  progress?: number;
  maxProgress?: number;
  level?: string;
  iconType?: "award" | "trophy" | "medal" | "star";
}

interface AchievementShareProps {
  achievement: Achievement;
  className?: string;
}

export default function AchievementShare({ 
  achievement,
  className = ""
}: AchievementShareProps) {
  const renderIcon = () => {
    const iconProps = {
      className: "h-8 w-8",
      strokeWidth: 1.5
    };
    
    switch (achievement.iconType) {
      case "trophy":
        return <Trophy {...iconProps} className={cn(iconProps.className, "text-amber-500")} />;
      case "medal":
        return <Medal {...iconProps} className={cn(iconProps.className, "text-blue-500")} />;
      case "star":
        return <Star {...iconProps} className={cn(iconProps.className, "text-purple-500")} />;
      case "award":
      default:
        return <Award {...iconProps} className={cn(iconProps.className, "text-green-500")} />;
    }
  };
  
  const getBackgroundGradient = () => {
    switch (achievement.type) {
      case "badge":
        return "bg-gradient-to-r from-blue-50 to-indigo-50";
      case "certificate":
        return "bg-gradient-to-r from-green-50 to-emerald-50";
      case "level-up":
        return "bg-gradient-to-r from-amber-50 to-yellow-50";
      case "milestone":
        return "bg-gradient-to-r from-purple-50 to-pink-50";
      default:
        return "bg-white";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const progressPercentage = achievement.progress && achievement.maxProgress 
    ? (achievement.progress / achievement.maxProgress) * 100 
    : null;

  const shareTitle = `I earned the "${achievement.title}" achievement on EdConnect!`;
  const shareDescription = achievement.description;
  const shareHashtags = ["edconnect", "education", "achievement", 
    achievement.subject ? achievement.subject.toLowerCase().replace(/\s+/g, '') : null,
    achievement.type
  ].filter(Boolean) as string[];

  return (
    <Card className={cn(
      "overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl", 
      getBackgroundGradient(),
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white shadow-sm">
              {renderIcon()}
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{achievement.title}</CardTitle>
              <CardDescription className="mt-1 text-sm">
                {achievement.description}
              </CardDescription>
            </div>
          </div>
          
          <ShareButton 
            title={shareTitle}
            description={shareDescription}
            hashtags={shareHashtags}
            variant="ghost"
            size="sm"
          />
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <Badge className="capitalize">
            {achievement.type.replace('-', ' ')}
          </Badge>
          
          {achievement.subject && (
            <Badge variant="outline" className="bg-white/50">
              {achievement.subject}
            </Badge>
          )}
          
          {achievement.level && (
            <Badge variant="outline" className="bg-white/50">
              Level: {achievement.level}
            </Badge>
          )}
        </div>
        
        {progressPercentage !== null && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span>{achievement.progress} / {achievement.maxProgress}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
        
        <div className="text-sm text-gray-500 mt-4">
          <span>Earned on {formatDate(achievement.earnedAt)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="bg-white/80 pt-3 pb-3 text-sm text-gray-500">
        <p>Share this achievement with your network!</p>
      </CardFooter>
    </Card>
  );
}