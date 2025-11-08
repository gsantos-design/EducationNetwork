import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContentShareCard, { ContentItem } from "./content-share-card";
import AchievementShare, { Achievement } from "./achievement-share";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data
const sampleContent: ContentItem[] = [
  {
    id: "1",
    title: "Algebra Made Simple",
    description: "A comprehensive guide to basic algebra concepts with interactive examples.",
    type: "resource",
    tags: ["math", "algebra", "interactive"],
    createdAt: "2025-03-15T14:48:00.000Z",
    subject: "Mathematics",
    level: "Intermediate"
  },
  {
    id: "2",
    title: "The Evolution of Literary Analysis",
    description: "Explore how literary analysis techniques have evolved over the centuries.",
    type: "article",
    tags: ["literature", "analysis", "research"],
    createdAt: "2025-03-10T09:30:00.000Z",
    subject: "English Literature",
    level: "Advanced"
  },
  {
    id: "3",
    title: "Physics Experiment: Pendulum Motion",
    description: "Instructions for conducting a physics experiment on pendulum motion and gravity.",
    type: "assignment",
    tags: ["physics", "experiment", "gravity"],
    createdAt: "2025-03-12T11:20:00.000Z",
    subject: "Physics",
    level: "Intermediate"
  }
];

const sampleAchievements: Achievement[] = [
  {
    id: "1",
    title: "Mathematics Master",
    description: "Completed advanced algebra with a perfect score!",
    type: "certificate",
    earnedAt: "2025-03-15T14:48:00.000Z",
    subject: "Mathematics",
    iconType: "trophy",
    level: "Advanced"
  },
  {
    id: "2",
    title: "Consistent Learner",
    description: "Completed 30 days of consecutive learning activities",
    type: "milestone",
    earnedAt: "2025-03-05T10:30:00.000Z",
    progress: 30,
    maxProgress: 30,
    iconType: "medal"
  },
  {
    id: "3",
    title: "Essay Excellence",
    description: "Wrote an exceptional essay that received the highest marks",
    type: "badge",
    earnedAt: "2025-02-28T09:15:00.000Z",
    subject: "English Literature",
    iconType: "award"
  }
];

export default function KnowledgeSharingHub() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>(sampleContent);
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    type: "resource" as ContentItem["type"],
    tags: "",
    subject: "",
    level: ""
  });

  const handleCreateContent = () => {
    if (!newItem.title || !newItem.description) {
      toast({
        title: "Missing information",
        description: "Please fill out title and description",
        variant: "destructive"
      });
      return;
    }

    const tagsArray = newItem.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newContentItem: ContentItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      type: newItem.type,
      tags: tagsArray,
      createdAt: new Date().toISOString(),
      subject: newItem.subject || undefined,
      level: newItem.level || undefined
    };

    setContentItems([newContentItem, ...contentItems]);
    setShowCreateDialog(false);
    resetForm();

    toast({
      title: "Content created",
      description: "Your content has been created and can now be shared"
    });
  };

  const resetForm = () => {
    setNewItem({
      title: "",
      description: "",
      type: "resource",
      tags: "",
      subject: "",
      level: ""
    });
  };

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Knowledge Sharing Hub</h1>
          <p className="text-gray-500 mt-2">
            Share educational resources, achievements, and knowledge with your network
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Shareable Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Content</DialogTitle>
              <DialogDescription>
                Create educational content that you can share with your network
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  placeholder="Enter a descriptive title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Write a detailed description of your content"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Content Type</Label>
                  <Select 
                    value={newItem.type} 
                    onValueChange={(value: ContentItem["type"]) => 
                      setNewItem({...newItem, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resource">Resource</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Input
                    id="subject"
                    value={newItem.subject}
                    onChange={(e) => setNewItem({...newItem, subject: e.target.value})}
                    placeholder="e.g. Mathematics"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="level">Level (Optional)</Label>
                  <Select 
                    value={newItem.level} 
                    onValueChange={(value) => setNewItem({...newItem, level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newItem.tags}
                    onChange={(e) => setNewItem({...newItem, tags: e.target.value})}
                    placeholder="e.g. math, algebra, tutorial"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateContent}>Create & Share</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="content">Educational Content</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map(item => (
              <ContentShareCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map(achievement => (
              <AchievementShare key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}