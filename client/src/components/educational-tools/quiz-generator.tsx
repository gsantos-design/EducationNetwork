import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

type Question = {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  text: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
};

type Quiz = {
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  timeLimit: number;
  questions: Question[];
};

const defaultQuiz: Quiz = {
  title: "Math Quiz - Algebra Basics",
  description: "Test your understanding of basic algebraic concepts including equations, variables, and expressions.",
  subject: "Mathematics",
  gradeLevel: "9",
  timeLimit: 30,
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      text: "What is the value of x in the equation 3x + 5 = 14?",
      options: ["2", "3", "7", "5"],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 2,
      type: "true-false",
      text: "In an algebraic expression, the order of operations is: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction.",
      correctAnswer: "true",
      points: 3
    },
    {
      id: 3,
      type: "short-answer",
      text: "If f(x) = 2x² - 3x + 1, what is f(2)?",
      correctAnswer: "3",
      points: 8
    }
  ]
};

export default function QuizGenerator() {
  const [activeTab, setActiveTab] = useState("create");
  const [quiz, setQuiz] = useState<Quiz>(defaultQuiz);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionType, setQuestionType] = useState<Question['type']>("multiple-choice");
  const { toast } = useToast();

  const handleQuizChange = (field: keyof Quiz, value: string | number) => {
    setQuiz({ ...quiz, [field]: value });
  };

  const addNewQuestion = () => {
    const newId = quiz.questions.length > 0 
      ? Math.max(...quiz.questions.map(q => q.id)) + 1 
      : 1;
    
    const newQuestion: Question = {
      id: newId,
      type: questionType,
      text: "",
      options: questionType === 'multiple-choice' ? ["", "", "", ""] : undefined,
      correctAnswer: questionType === 'multiple-choice' ? 0 : 
                    questionType === 'true-false' ? "true" : "",
      points: 5
    };
    
    setCurrentQuestion(newQuestion);
  };

  const handleQuestionChange = (field: keyof Question, value: any) => {
    if (!currentQuestion) return;
    setCurrentQuestion({ ...currentQuestion, [field]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!currentQuestion || !currentQuestion.options) return;
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const saveQuestion = () => {
    if (!currentQuestion || !currentQuestion.text) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive"
      });
      return;
    }
    
    // Find if we're editing an existing question
    const existingIndex = quiz.questions.findIndex(q => q.id === currentQuestion.id);
    
    // Create a new questions array based on whether we're editing or adding
    const updatedQuestions = existingIndex >= 0 
      ? quiz.questions.map((q, i) => i === existingIndex ? currentQuestion : q)
      : [...quiz.questions, currentQuestion];
    
    setQuiz({ ...quiz, questions: updatedQuestions });
    setCurrentQuestion(null);
    
    toast({
      title: "Success",
      description: `Question ${existingIndex >= 0 ? 'updated' : 'added'} successfully`,
    });
  };

  const editQuestion = (id: number) => {
    const question = quiz.questions.find(q => q.id === id);
    if (question) {
      setQuestionType(question.type);
      setCurrentQuestion(question);
    }
  };

  const deleteQuestion = (id: number) => {
    const updatedQuestions = quiz.questions.filter(q => q.id !== id);
    setQuiz({ ...quiz, questions: updatedQuestions });
    
    if (currentQuestion && currentQuestion.id === id) {
      setCurrentQuestion(null);
    }
    
    toast({
      title: "Question deleted",
      description: "The question has been removed from the quiz",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: "Quiz exported",
      description: `Quiz has been exported as ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Quiz</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-6">
          {/* Quiz Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input 
                    id="title" 
                    value={quiz.title} 
                    onChange={(e) => handleQuizChange('title', e.target.value)} 
                    placeholder="Enter quiz title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    value={quiz.subject} 
                    onChange={(e) => handleQuizChange('subject', e.target.value)} 
                    placeholder="e.g. Mathematics, Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade Level</Label>
                  <Input 
                    id="grade" 
                    value={quiz.gradeLevel} 
                    onChange={(e) => handleQuizChange('gradeLevel', e.target.value)} 
                    placeholder="e.g. 9, 10, 11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time Limit (minutes)</Label>
                  <Input 
                    id="time" 
                    type="number" 
                    value={quiz.timeLimit.toString()} 
                    onChange={(e) => handleQuizChange('timeLimit', parseInt(e.target.value) || 0)} 
                    min="1"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={quiz.description} 
                    onChange={(e) => handleQuizChange('description', e.target.value)} 
                    placeholder="Enter quiz description"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Question Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex justify-between items-center">
                <span>Questions</span>
                <Button 
                  onClick={addNewQuestion} 
                  disabled={!!currentQuestion}
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
                  Add Question
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!currentQuestion ? (
                <div>
                  {quiz.questions.length > 0 ? (
                    <div className="space-y-4">
                      {quiz.questions.map((question, index) => (
                        <Card key={question.id} className="bg-neutral-50 shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex justify-between">
                              <div className="space-y-1">
                                <div className="text-sm font-medium">Question {index + 1} ({question.points} points)</div>
                                <div className="text-sm">{question.text}</div>
                                <div className="text-xs text-neutral-500 capitalize">Type: {question.type.replace('-', ' ')}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => editQuestion(question.id)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => deleteQuestion(question.id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-neutral-500">
                      <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                        <svg 
                          className="w-6 h-6 text-neutral-400" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-1">No questions yet</h3>
                      <p className="text-sm mb-3">Add your first question to get started.</p>
                      <Button onClick={addNewQuestion}>
                        <svg 
                          className="w-4 h-4 mr-1" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Question
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionType">Question Type</Label>
                    <RadioGroup 
                      value={questionType}
                      onValueChange={(value) => setQuestionType(value as Question['type'])}
                      className="flex gap-4 flex-wrap"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="multiple-choice" id="type-mc" />
                        <Label htmlFor="type-mc">Multiple Choice</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true-false" id="type-tf" />
                        <Label htmlFor="type-tf">True/False</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="short-answer" id="type-sa" />
                        <Label htmlFor="type-sa">Short Answer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="essay" id="type-essay" />
                        <Label htmlFor="type-essay">Essay</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="questionText">Question Text</Label>
                    <Textarea 
                      id="questionText"
                      value={currentQuestion.text}
                      onChange={(e) => handleQuestionChange('text', e.target.value)}
                      placeholder="Enter your question here"
                      rows={3}
                    />
                  </div>
                  
                  {questionType === 'multiple-choice' && (
                    <div className="space-y-3">
                      <Label>Answer Options</Label>
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <RadioGroup 
                            value={currentQuestion.correctAnswer?.toString() || "0"}
                            onValueChange={(value) => handleQuestionChange('correctAnswer', parseInt(value))}
                            className="flex"
                          >
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          </RadioGroup>
                          <Input 
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1"
                          />
                        </div>
                      ))}
                      <div className="text-xs text-neutral-500">
                        Select the radio button next to the correct answer
                      </div>
                    </div>
                  )}
                  
                  {questionType === 'true-false' && (
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <RadioGroup 
                        value={currentQuestion.correctAnswer?.toString() || "true"}
                        onValueChange={(value) => handleQuestionChange('correctAnswer', value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="true">True</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="false">False</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  
                  {questionType === 'short-answer' && (
                    <div className="space-y-2">
                      <Label htmlFor="correctAnswer">Correct Answer</Label>
                      <Input 
                        id="correctAnswer"
                        value={currentQuestion.correctAnswer?.toString() || ""}
                        onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                        placeholder="Enter the correct answer"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="questionPoints">Points</Label>
                    <Input 
                      id="questionPoints"
                      type="number"
                      value={currentQuestion.points.toString()}
                      onChange={(e) => handleQuestionChange('points', parseInt(e.target.value) || 0)}
                      min="1"
                      max="100"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentQuestion(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={saveQuestion}>
                      Save Question
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Subject:</span> {quiz.subject}
                  </div>
                  <div>
                    <span className="font-medium">Grade Level:</span> {quiz.gradeLevel}
                  </div>
                  <div>
                    <span className="font-medium">Time Limit:</span> {quiz.timeLimit} minutes
                  </div>
                  <div>
                    <span className="font-medium">Questions:</span> {quiz.questions.length}
                  </div>
                </div>
                
                <div className="text-sm space-y-1">
                  <div className="font-medium">Description:</div>
                  <div>{quiz.description}</div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium mb-4">Questions</h3>
                  
                  {quiz.questions.length > 0 ? (
                    <div className="space-y-6">
                      {quiz.questions.map((question, index) => (
                        <div key={question.id} className="space-y-2">
                          <div className="font-medium">
                            Question {index + 1}: <span className="text-neutral-700">{question.text}</span> <span className="text-sm font-normal text-neutral-500">({question.points} points)</span>
                          </div>
                          
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="pl-4 space-y-1">
                              {question.options.map((option, optIdx) => (
                                <div key={optIdx} className="flex items-center gap-2">
                                  <RadioGroup defaultValue="">
                                    <RadioGroupItem value="dummy" id={`dummy-${optIdx}`} />
                                  </RadioGroup>
                                  <Label htmlFor={`dummy-${optIdx}`} className="text-sm font-normal">
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {question.type === 'true-false' && (
                            <div className="pl-4 space-y-1">
                              <div className="flex items-center gap-2">
                                <RadioGroup defaultValue="">
                                  <RadioGroupItem value="dummy-true" id="dummy-true" />
                                </RadioGroup>
                                <Label htmlFor="dummy-true" className="text-sm font-normal">True</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroup defaultValue="">
                                  <RadioGroupItem value="dummy-false" id="dummy-false" />
                                </RadioGroup>
                                <Label htmlFor="dummy-false" className="text-sm font-normal">False</Label>
                              </div>
                            </div>
                          )}
                          
                          {question.type === 'short-answer' && (
                            <div className="pl-4">
                              <Input placeholder="Your answer" className="max-w-md" />
                            </div>
                          )}
                          
                          {question.type === 'essay' && (
                            <div className="pl-4">
                              <Textarea placeholder="Your answer" rows={4} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      <p>No questions added yet. Go to the Create tab to add questions.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Export Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 mt-2">
                        <svg 
                          className="w-6 h-6 text-blue-600" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <path d="M8 12h8M8 16h8M8 20h8" />
                        </svg>
                      </div>
                      <h3 className="font-medium mb-1">PDF Format</h3>
                      <p className="text-sm text-neutral-600 mb-3">Export as a printable PDF document</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleExport('pdf')}
                      >
                        Export as PDF
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3 mt-2">
                        <svg 
                          className="w-6 h-6 text-green-600" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="3" y1="9" x2="21" y2="9" />
                          <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                      </div>
                      <h3 className="font-medium mb-1">Google Forms</h3>
                      <p className="text-sm text-neutral-600 mb-3">Create a new Google Form with this quiz</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleExport('google')}
                      >
                        Export to Google
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3 mt-2">
                        <svg 
                          className="w-6 h-6 text-purple-600" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </div>
                      <h3 className="font-medium mb-1">Share Link</h3>
                      <p className="text-sm text-neutral-600 mb-3">Create a shareable online quiz link</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleExport('link')}
                      >
                        Create Link
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-3">Additional Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="option-answers" />
                      <Label htmlFor="option-answers" className="text-sm">Include answer key</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="option-points" />
                      <Label htmlFor="option-points" className="text-sm">Show point values</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="option-instructions" />
                      <Label htmlFor="option-instructions" className="text-sm">Include instructions</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}