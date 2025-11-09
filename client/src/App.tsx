import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import AuthPage from "@/pages/auth-page";
import AITutorPage from "@/pages/ai-tutor-page";
import ProgressPage from "@/pages/progress-page";
import HomeworkPage from "@/pages/homework-page";
import LandingPage from "@/pages/landing-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/landing" component={LandingPage} />
      <ProtectedRoute path="/" component={AITutorPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/progress" component={ProgressPage} />
      <ProtectedRoute path="/homework" component={HomeworkPage} />
      <ProtectedRoute path="*" component={AITutorPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
