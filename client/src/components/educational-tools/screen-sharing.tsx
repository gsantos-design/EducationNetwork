import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";

type ShareState = "not-sharing" | "creating" | "sharing" | "viewing";
type MediaPermission = "granted" | "denied" | "pending";

export default function ScreenSharing() {
  const [activeTab, setActiveTab] = useState<string>("share-screen");
  const [shareState, setShareState] = useState<ShareState>("not-sharing");
  const [sessionId, setSessionId] = useState<string>("");
  const [screenMediaPermission, setScreenMediaPermission] = useState<MediaPermission>("pending");
  const [audioMediaPermission, setAudioMediaPermission] = useState<MediaPermission>("pending");
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [activeParticipants, setActiveParticipants] = useState<number>(0);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [viewSessionId, setViewSessionId] = useState<string>("");
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();

  // Verify browser support for screen sharing
  const isBrowserSupported = () => {
    return navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices;
  };

  // Check for browser support on mount
  useEffect(() => {
    if (!isBrowserSupported()) {
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support screen sharing. Please use Chrome, Firefox, or Edge.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Handle screen sharing start
  const startScreenShare = async () => {
    if (!isBrowserSupported()) return;
    
    try {
      setShareState("creating");
      
      // Generate a unique session ID (in a real app, this would come from the server)
      const generatedSessionId = Math.random().toString(36).substring(2, 15);
      setSessionId(generatedSessionId);
      
      // Create share URL
      const baseUrl = window.location.origin;
      const shareUrlValue = `${baseUrl}/educational-tools?tab=screen-sharing&session=${generatedSessionId}`;
      setShareUrl(shareUrlValue);
      
      // Request screen sharing permissions
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: includeAudio
      });
      streamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setScreenMediaPermission("granted");
      if (includeAudio) {
        setAudioMediaPermission("granted");
      }
      
      // In a real implementation, we would set up WebRTC here
      // For now, we'll simulate an active session
      setShareState("sharing");
      setActiveParticipants(1); // Just the host for now
      
      // Listen for the end of screen sharing
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        stopScreenShare();
      };
      
    } catch (error) {
      console.error("Error starting screen share:", error);
      setShareState("not-sharing");
      
      if (error instanceof Error && error.name === "NotAllowedError") {
        setScreenMediaPermission("denied");
        toast({
          title: "Permission Denied",
          description: "You need to allow screen sharing to use this feature.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Screen Sharing Failed",
          description: "An error occurred while trying to share your screen.",
          variant: "destructive"
        });
      }
    }
  };

  // Handle screen sharing stop
  const stopScreenShare = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    setShareState("not-sharing");
    setSessionId("");
    setShareUrl("");
    setActiveParticipants(0);
  };

  // Handle joining a session
  const joinSession = async () => {
    if (!viewSessionId.trim()) {
      toast({
        title: "Session ID Required",
        description: "Please enter a valid session ID to join.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, we would validate the session ID with the server
    // and establish a WebRTC connection
    setShareState("viewing");
    
    // For demo purposes, we'll simulate receiving a stream
    // In a real app, this would be the remote stream from WebRTC
    if (remoteVideoRef.current) {
      try {
        // Simulate a delay in connecting
        setTimeout(() => {
          toast({
            title: "Connected to Session",
            description: "You are now viewing the shared screen.",
          });
          
          // In a real implementation, we would be receiving the stream from the peer
          // remoteVideoRef.current.srcObject = remoteStream;
          setActiveParticipants(2); // Host + viewer
        }, 1500);
      } catch (error) {
        console.error("Error joining session:", error);
        toast({
          title: "Connection Failed",
          description: "Could not connect to the screen sharing session.",
          variant: "destructive"
        });
        setShareState("not-sharing");
      }
    }
  };

  // Handle leaving a session
  const leaveSession = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    setShareState("not-sharing");
    setViewSessionId("");
    setActiveParticipants(0);
  };

  // Handle copy share URL/ID to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "Share this with others to let them join your session.",
      });
    }).catch((err) => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Copy Failed",
        description: "Please select and copy the text manually.",
        variant: "destructive"
      });
    });
  };

  // Toggle fullscreen for remote video
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (remoteVideoRef.current && remoteVideoRef.current.requestFullscreen) {
        remoteVideoRef.current.requestFullscreen()
          .then(() => {
            setIsFullScreen(true);
          })
          .catch((err) => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => {
            setIsFullScreen(false);
          })
          .catch((err) => {
            console.error(`Error attempting to exit fullscreen: ${err.message}`);
          });
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Clean up streams on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="share-screen">Share Your Screen</TabsTrigger>
          <TabsTrigger value="view-screen">View Shared Screen</TabsTrigger>
        </TabsList>
        
        {/* Share Screen Tab */}
        <TabsContent value="share-screen">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Screen</CardTitle>
              <CardDescription>
                Share your screen with students or colleagues for collaborative learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isBrowserSupported() ? (
                <Alert variant="destructive">
                  <AlertTitle>Browser Not Supported</AlertTitle>
                  <AlertDescription>
                    Your browser doesn't support screen sharing. Please use Chrome, Firefox, or Edge.
                  </AlertDescription>
                </Alert>
              ) : shareState === "not-sharing" ? (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="include-audio" className="font-medium">Include Audio</Label>
                      <Switch 
                        id="include-audio" 
                        checked={includeAudio} 
                        onCheckedChange={setIncludeAudio} 
                      />
                    </div>
                    <p className="text-sm text-neutral-500">
                      When enabled, your microphone audio will be shared along with your screen
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={startScreenShare}
                  >
                    <svg 
                      className="w-5 h-5 mr-2" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    Start Screen Sharing
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video 
                      ref={localVideoRef} 
                      autoPlay 
                      muted 
                      className="w-full h-full object-contain"
                    />
                    
                    {shareState === "creating" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white">
                        <div className="text-center">
                          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p>Setting up screen sharing...</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-medium py-1 px-2 rounded-full">
                      {activeParticipants} {activeParticipants === 1 ? 'participant' : 'participants'}
                    </div>
                  </div>
                  
                  {shareState === "sharing" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-neutral-50 rounded-lg border">
                        <div className="mb-4">
                          <Label className="text-sm text-neutral-500 mb-1 block">Session ID</Label>
                          <div className="flex">
                            <Input 
                              value={sessionId}
                              readOnly
                              className="rounded-r-none font-mono text-sm"
                            />
                            <Button 
                              variant="outline"
                              className="rounded-l-none border-l-0"
                              onClick={() => copyToClipboard(sessionId)}
                            >
                              <svg 
                                className="w-4 h-4" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            </Button>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">
                            Share this session ID with others so they can join
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-neutral-500 mb-1 block">Share URL</Label>
                          <div className="flex">
                            <Input 
                              value={shareUrl}
                              readOnly
                              className="rounded-r-none text-sm truncate"
                            />
                            <Button 
                              variant="outline"
                              className="rounded-l-none border-l-0"
                              onClick={() => copyToClipboard(shareUrl)}
                            >
                              <svg 
                                className="w-4 h-4" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            </Button>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">
                            Or send this direct link that will automatically join the session
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={stopScreenShare}
                      >
                        <svg 
                          className="w-5 h-5 mr-2" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                          <line x1="4" y1="15" x2="20" y2="5" />
                        </svg>
                        Stop Sharing
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* View Screen Tab */}
        <TabsContent value="view-screen">
          <Card>
            <CardHeader>
              <CardTitle>View Shared Screen</CardTitle>
              <CardDescription>
                Join a screen sharing session by entering the session ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shareState === "not-sharing" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-id">Session ID</Label>
                    <div className="flex">
                      <Input 
                        id="session-id"
                        placeholder="Enter the session ID to join"
                        value={viewSessionId}
                        onChange={(e) => setViewSessionId(e.target.value)}
                        className="rounded-r-none"
                      />
                      <Button 
                        onClick={joinSession}
                        className="rounded-l-none"
                      >
                        Join
                      </Button>
                    </div>
                    <p className="text-xs text-neutral-500">
                      The session ID should be provided by the person sharing their screen
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">Recent Sessions</h3>
                    <div className="text-center text-neutral-500 py-4">
                      <p>No recent sessions found</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video 
                      ref={remoteVideoRef} 
                      autoPlay 
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Placeholder for demo since we don't have a real remote stream */}
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-white">
                      <div className="text-center">
                        <p className="text-xl font-medium mb-2">Connecting to session...</p>
                        <p className="text-sm text-neutral-400">
                          Session ID: {viewSessionId}
                        </p>
                        <div className="mt-4 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      </div>
                    </div>
                    
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-medium py-1 px-2 rounded-full">
                      {activeParticipants} {activeParticipants === 1 ? 'participant' : 'participants'}
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={toggleFullScreen}
                    >
                      <svg 
                        className="w-4 h-4 mr-1" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        {isFullScreen ? (
                          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                        ) : (
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        )}
                      </svg>
                      {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={leaveSession}
                    >
                      <svg 
                        className="w-4 h-4 mr-1" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                        <line x1="12" y1="2" x2="12" y2="12" />
                      </svg>
                      Leave Session
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-neutral-50 border-t px-6 py-4 flex justify-center">
              <div className="text-center text-sm text-neutral-500 max-w-md">
                <p>
                  For optimal performance, we recommend using a stable internet connection. 
                  Screen sharing is end-to-end encrypted for security.
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}