import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Calendar, CheckCircle2, Circle, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
import type { Homework } from "@shared/schema";

const subjects = [
  "Mathematics", "Science", "English", "History", "Spanish", "French",
  "Mandarin", "Latin", "Computer Science", "Health", "Art", "Music", "Other"
];

export default function HomeworkPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isAddingHomework, setIsAddingHomework] = useState(false);
  const [newHomework, setNewHomework] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  const { data: homework = [], isLoading } = useQuery<Homework[]>({
    queryKey: ["/api/homework"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newHomework) => {
      return await apiRequest("POST", "/api/homework", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/homework"] });
      setIsAddingHomework(false);
      setNewHomework({ title: "", description: "", subject: "", dueDate: "", priority: "medium" });
      toast({ title: "Success", description: "Homework added!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      return await apiRequest("PATCH", `/api/homework/${id}`, {
        completed,
        completedAt: completed ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/homework"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/homework/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/homework"] });
      toast({ title: "Success", description: "Homework deleted" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHomework.title || !newHomework.dueDate) {
      toast({ title: "Error", description: "Title and due date are required", variant: "destructive" });
      return;
    }
    createMutation.mutate(newHomework);
  };

  const incomplete = homework.filter(hw => !hw.completed);
  const completed = homework.filter(hw => hw.completed);
  const overdue = incomplete.filter(hw => new Date(hw.dueDate) < new Date());
  const upcoming = incomplete.filter(hw => new Date(hw.dueDate) >= new Date());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => setLocation("/")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutoring
          </Button>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-600 rounded-xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  My Homework
                </h1>
                <p className="text-muted-foreground text-lg">
                  Stay organized and on track
                </p>
              </div>
            </div>

            <Dialog open={isAddingHomework} onOpenChange={setIsAddingHomework}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Homework
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-900">
                <DialogHeader>
                  <DialogTitle>Add New Homework</DialogTitle>
                  <DialogDescription>
                    Track your assignments and never miss a deadline
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Title *</label>
                    <Input
                      value={newHomework.title}
                      onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                      placeholder="Math Chapter 5 Problems"
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Description</label>
                    <Textarea
                      value={newHomework.description}
                      onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
                      placeholder="Problems 1-20 on pages 145-147"
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium block">Subject</label>
                      <Select value={newHomework.subject} onValueChange={(value) => setNewHomework({ ...newHomework, subject: value })}>
                        <SelectTrigger className="bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
                          {subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium block">Priority</label>
                      <Select value={newHomework.priority} onValueChange={(value: any) => setNewHomework({ ...newHomework, priority: value })}>
                        <SelectTrigger className="bg-white dark:bg-gray-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Due Date *</label>
                    <Input
                      type="date"
                      value={newHomework.dueDate}
                      onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add Homework"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">To Do</p>
                    <p className="text-3xl font-bold">{upcoming.length}</p>
                  </div>
                  <Circle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                    <p className="text-3xl font-bold text-red-600">{overdue.length}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{completed.length}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overdue Section */}
          {overdue.length > 0 && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Overdue Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdue.map(hw => (
                    <HomeworkItem
                      key={hw.id}
                      homework={hw}
                      onToggle={toggleCompleteMutation.mutate}
                      onDelete={deleteMutation.mutate}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>Stay ahead of your deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming homework! Great job staying on top of things! 🎉
                </p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map(hw => (
                    <HomeworkItem
                      key={hw.id}
                      homework={hw}
                      onToggle={toggleCompleteMutation.mutate}
                      onDelete={deleteMutation.mutate}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Section */}
          {completed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Completed</CardTitle>
                <CardDescription>Nice work!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completed.map(hw => (
                    <HomeworkItem
                      key={hw.id}
                      homework={hw}
                      onToggle={toggleCompleteMutation.mutate}
                      onDelete={deleteMutation.mutate}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function HomeworkItem({
  homework,
  onToggle,
  onDelete,
  getPriorityColor,
}: {
  homework: Homework;
  onToggle: (data: { id: number; completed: boolean }) => void;
  onDelete: (id: number) => void;
  getPriorityColor: (priority: string) => string;
}) {
  const daysUntil = Math.ceil((new Date(homework.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntil < 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`flex items-start gap-3 p-4 rounded-lg border ${homework.completed ? 'bg-gray-50 opacity-75' : 'bg-white'}`}
    >
      <button
        onClick={() => onToggle({ id: homework.id, completed: !homework.completed })}
        className="mt-1 flex-shrink-0"
      >
        {homework.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400 hover:text-blue-600" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className={`font-medium ${homework.completed ? 'line-through text-gray-500' : ''}`}>
              {homework.title}
            </h3>
            {homework.description && (
              <p className="text-sm text-muted-foreground mt-1">{homework.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {homework.subject && (
                <Badge variant="outline" className="text-xs">
                  {homework.subject}
                </Badge>
              )}
              <Badge variant="outline" className={`text-xs ${getPriorityColor(homework.priority || 'medium')}`}>
                {homework.priority}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span className={isOverdue && !homework.completed ? 'text-red-600 font-medium' : ''}>
                  {isOverdue && !homework.completed ? `${Math.abs(daysUntil)} days overdue` :
                   daysUntil === 0 ? 'Due today' :
                   daysUntil === 1 ? 'Due tomorrow' :
                   `Due in ${daysUntil} days`}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(homework.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
