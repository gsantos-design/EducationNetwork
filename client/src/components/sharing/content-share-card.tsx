import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ShareButton from "./share-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown, BookOpen, Award, Clock } from "lucide-react";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: "resource" | "article" | "achievement" | "assignment";
  tags: string[];
  createdAt: string;
  url?: string;
  subject?: string;
  level?: string;
}

interface ContentShareCardProps {
  item: ContentItem;
  allowComments?: boolean;
  allowRating?: boolean;
  className?: string;
}

export default function ContentShareCard({ 
  item, 
  allowComments = true, 
  allowRating = true,
  className = ""
}: ContentShareCardProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "resource":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "article":
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case "achievement":
        return <Award className="h-4 w-4 text-amber-500" />;
      case "assignment":
        return <Clock className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };
  
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "resource":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "article":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "achievement":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "assignment":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "";
    }
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      // In a real app, this would submit to an API
      console.log("Comment submitted:", comment);
      setComment("");
      setShowCommentForm(false);
    }
  };

  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
            <CardDescription className="mt-1">{item.description}</CardDescription>
          </div>
          <ShareButton 
            title={item.title}
            description={item.description}
            url={item.url}
            hashtags={item.tags}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <Badge variant="outline" className={getTypeBadgeColor(item.type)}>
            {getTypeIcon(item.type)}
            <span className="ml-1 capitalize">{item.type}</span>
          </Badge>
          
          {item.subject && (
            <Badge variant="outline" className="bg-slate-100">
              {item.subject}
            </Badge>
          )}
          
          {item.level && (
            <Badge variant="outline" className="bg-slate-100">
              Level: {item.level}
            </Badge>
          )}
          
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-slate-100">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="text-sm text-gray-500 flex items-center">
          <span className="mr-1">
            Shared on {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start pt-2 gap-4">
        {allowRating && (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setRating(rating + 1)}
              className="px-2"
            >
              <ArrowUp className="h-5 w-5 text-green-600" />
              <span className="ml-1">{rating}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setRating(Math.max(0, rating - 1))}
              className="px-2"
            >
              <ArrowDown className="h-5 w-5 text-red-600" />
            </Button>
          </div>
        )}
        
        {allowComments && (
          <div className="w-full">
            {!showCommentForm ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCommentForm(true)}
              >
                Add Comment
              </Button>
            ) : (
              <div className="space-y-2 w-full">
                <Label htmlFor="comment">Your comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Add your thoughts about this content..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowCommentForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSubmitComment}
                    disabled={!comment.trim()}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}