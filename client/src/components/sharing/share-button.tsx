import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Share, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Copy,
  CheckCircle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  hashtags?: string[];
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function ShareButton({
  title,
  description = "",
  url = window.location.href,
  hashtags = [],
  className = "",
  variant = "outline",
  size = "icon"
}: ShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const shareText = `${title}${description ? ": " + description : ""}`;
  const hashtagString = hashtags.length > 0 ? hashtags.map(tag => `#${tag}`).join(" ") : "";
  
  const shareData = {
    title,
    text: `${shareText} ${hashtagString}`,
    url
  };
  
  const shareToTwitter = () => {
    const text = encodeURIComponent(shareText);
    const tags = encodeURIComponent(hashtags.join(","));
    const shareUrl = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}&hashtags=${tags}`, "_blank");
  };
  
  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };
  
  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  };
  
  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\n${url}\n\n${hashtagString}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${title}${description ? "\n" + description : ""}\n${url}\n${hashtagString}`);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Link has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to your clipboard",
        variant: "destructive"
      });
    }
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "Content has been shared"
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast({
            title: "Share failed",
            description: "There was an error sharing this content",
            variant: "destructive"
          });
        }
      }
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the Web Share API"
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          aria-label="Share content"
          className={className}
        >
          <Share className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this content</DialogTitle>
          <DialogDescription>
            Share this content with your network or copy the link
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <div className="grid grid-cols-4 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center h-20 space-y-2" 
                    onClick={shareToTwitter}
                  >
                    <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                    <span className="text-xs">Twitter</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on Twitter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center h-20 space-y-2" 
                    onClick={shareToFacebook}
                  >
                    <Facebook className="h-6 w-6 text-[#3b5998]" />
                    <span className="text-xs">Facebook</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on Facebook</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center h-20 space-y-2" 
                    onClick={shareToLinkedIn}
                  >
                    <Linkedin className="h-6 w-6 text-[#0077b5]" />
                    <span className="text-xs">LinkedIn</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on LinkedIn</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center h-20 space-y-2" 
                    onClick={shareViaEmail}
                  >
                    <Mail className="h-6 w-6 text-gray-600" />
                    <span className="text-xs">Email</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share via Email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 place-items-center rounded-md border border-input bg-background p-2 text-sm text-muted-foreground truncate">
              {url}
            </div>
            <Button variant="secondary" size="icon" onClick={copyToClipboard}>
              {copied ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                <Copy className="h-4 w-4" />
              }
            </Button>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="default"
            onClick={handleNativeShare}
            className="w-full sm:w-auto"
          >
            <Share className="mr-2 h-4 w-4" />
            <span>Share Now</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}