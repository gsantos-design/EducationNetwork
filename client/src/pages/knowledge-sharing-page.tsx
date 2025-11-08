import { useAuth } from "@/hooks/use-auth";
import KnowledgeSharingHub from "@/components/sharing/knowledge-sharing-hub";

export default function KnowledgeSharingPage() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto py-6">
      <KnowledgeSharingHub />
    </div>
  );
}