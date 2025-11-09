import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
  Star,
  Sparkles,
  Brain,
  Target,
  Heart,
  Users,
  Award,
  Lock,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleEarlyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    // TODO: Implement email collection
    toast({
      title: "Thanks for your interest!",
      description: "We'll be in touch soon with early access details."
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm text-base px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Tutoring for NYC Students
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Child's Personal AI Tutor
              <br />
              <span className="text-yellow-300">For Just $29.99/Month</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Professional tutoring quality. Affordable pricing. Available 24/7.
              Help your child excel in NYC's most competitive schools without breaking the bank.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-2xl"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                See How It Works
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                </div>
                <span className="font-medium">50+ NYC Students Trust EdConnect</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                <span className="ml-2 font-medium">Rated Excellent by Parents</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              The Challenge Every NYC Parent Faces
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <DollarSign className="h-10 w-10 text-red-600 mb-2" />
                  <CardTitle className="text-red-900">Tutoring is Expensive</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-800">
                    Private tutors charge $50-100/hour. Kumon costs $150-200/month.
                    That's $600-1,200+ per month for quality help.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <Clock className="h-10 w-10 text-orange-600 mb-2" />
                  <CardTitle className="text-orange-900">Scheduling is Hard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-800">
                    Finding tutors who match your schedule is nearly impossible.
                    Last-minute homework help? Forget about it.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <Users className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle className="text-purple-900">One Size Doesn't Fit All</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-800">
                    Every child learns differently. Group classes and generic apps
                    can't adapt to your child's unique learning style.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-100 text-green-700 border-green-300 text-base px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                The EdConnect Solution
              </Badge>
              <h2 className="text-5xl font-bold mb-4">
                Professional Tutoring, Powered by AI
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get the same quality as a $100/hour tutor, available 24/7, for just $29.99/month
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Brain className="h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle>Personalized Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI adapts to your child's learning style, pace, and needs.
                    Every session is tailored just for them.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Clock className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>Available 24/7</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Homework help at 11 PM? Test prep on Sunday morning?
                    Your AI tutor is always ready to help.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Target className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle>All Subjects Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Math, Science, English, History, Languages - everything your
                    child needs in one place.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BookOpen className="h-12 w-12 text-orange-600 mb-4" />
                  <CardTitle>Homework Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Never miss a deadline. Built-in homework organizer keeps
                    your child on track with all assignments.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-pink-600 mb-4" />
                  <CardTitle>Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    See exactly where your child is improving and what needs
                    more attention. Data-driven insights.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-12 w-12 text-indigo-600 mb-4" />
                  <CardTitle>Safe & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    FERPA compliant. Your child's data is protected.
                    Conversations stay private and secure.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-muted-foreground">
                Affordable options for every family
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Standard Plan */}
              <Card className="border-2 hover:shadow-2xl transition-all">
                <CardHeader className="text-center pb-8">
                  <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-300 mx-auto">
                    Popular Choice
                  </Badge>
                  <CardTitle className="text-3xl mb-2">Standard</CardTitle>
                  <CardDescription className="text-lg">
                    Ready-to-use AI tutoring
                  </CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-blue-600">$29.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>24/7 AI tutoring in all subjects</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Homework tracker & organizer</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Progress tracking & insights</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Visual learning tools</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Practice quizzes & flashcards</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Safe & private environment</span>
                  </div>

                  <Button className="w-full mt-6" size="lg">
                    Start Free Trial
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    No credit card required
                  </p>
                </CardContent>
              </Card>

              {/* Custom Plan */}
              <Card className="border-2 border-purple-300 hover:shadow-2xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold">
                  PREMIUM
                </div>
                <CardHeader className="text-center pb-8">
                  <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-300 mx-auto">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Fully Personalized
                  </Badge>
                  <CardTitle className="text-3xl mb-2">Custom</CardTitle>
                  <CardDescription className="text-lg">
                    Tailored to your child's needs
                  </CardDescription>
                  <div className="mt-6">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      $199 <span className="text-base font-normal text-muted-foreground">one-time setup</span>
                    </div>
                    <div className="text-4xl font-bold text-purple-600">
                      + $29.99<span className="text-lg font-normal text-muted-foreground">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Everything in Standard</strong></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Custom AI trained on your child's learning style</strong></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Personalized curriculum aligned with their classes</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Support for learning differences (ADHD, dyslexia, etc.)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Weekly parent progress reports</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Priority support & customization</span>
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" size="lg">
                    Get Custom Setup
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Setup completed within 48 hours
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Comparison */}
            <div className="mt-12 text-center">
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                <strong>Compare:</strong> Private tutors charge $50-100/hour ($800-1,600/month for 2 sessions/week).
                Kumon costs $150-200/month per subject. EdConnect gives you unlimited help in all subjects for just $29.99/month.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              Perfect for NYC's Top Schools
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Award className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Specialized High Schools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Stuyvesant, Bronx Science, Brooklyn Tech, and more
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      SHSAT prep support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Advanced math & science help
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      College prep guidance
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <GraduationCap className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle>All NYC Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Public, private, and charter schools (Grades 1-12)
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      State exam preparation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Homework help & test prep
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Learning difference support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              What NYC Parents Are Saying
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Real results from real families
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <CardTitle className="text-lg">"Finally, affordable help!"</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    "We were spending $400/month on tutoring for just math. EdConnect gives
                    us help in ALL subjects for $30/month. It's been a game-changer for our family."
                  </p>
                  <p className="font-medium">- Maria R., Parent of Stuyvesant Student</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <CardTitle className="text-lg">"Available when we need it"</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    "My daughter has ADHD and needs help at odd hours. EdConnect is there
                    at 10 PM when she's doing homework. That's impossible with regular tutors."
                  </p>
                  <p className="font-medium">- James L., Parent of 10th Grader</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <CardTitle className="text-lg">"Grades are improving!"</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    "My son went from a C to an A- in chemistry in just 6 weeks.
                    The AI tutor explains things in ways that click for him. Worth every penny."
                  </p>
                  <p className="font-medium">- Sarah K., Parent of Brooklyn Tech Student</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              Built by Educators, For Students
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Former Teacher</h3>
                <p className="text-muted-foreground text-sm">
                  Created by someone who understands classroom challenges
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">FERPA Compliant</h3>
                <p className="text-muted-foreground text-sm">
                  Your child's data is protected by federal education privacy laws
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">100% Private</h3>
                <p className="text-muted-foreground text-sm">
                  Tutoring sessions are never shared with teachers or parents
                </p>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
              <CardContent className="pt-6">
                <p className="text-center text-lg leading-relaxed">
                  <strong>Our Mission:</strong> Every child deserves access to quality tutoring,
                  regardless of their family's income. We're making that possible through AI technology,
                  bringing the same level of support that wealthy families pay $1,000+/month for
                  to all NYC students for just $29.99.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-5xl font-bold mb-6">
              Ready to Help Your Child Succeed?
            </h2>
            <p className="text-2xl mb-8 text-white/90">
              Start your free trial today. No credit card required.
            </p>

            <form onSubmit={handleEarlyAccess} className="max-w-md mx-auto mb-8">
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-gray-900"
                />
                <Button type="submit" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Get Started
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>No credit card needed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-6 w-6 text-purple-400" />
                  <span className="font-bold text-xl">EdConnect</span>
                </div>
                <p className="text-gray-400 text-sm">
                  AI-powered tutoring for NYC students. Making quality education accessible.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">How It Works</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Parent Resources</a></li>
                  <li><a href="#" className="hover:text-white">Student Guide</a></li>
                  <li><a href="mailto:support@edconnect.edu" className="hover:text-white">support@edconnect.edu</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2025 EdConnect. All rights reserved. FERPA Compliant.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
