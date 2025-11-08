import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { UserRole } from "@shared/schema";
import {
  Play,
  Pause,
  RefreshCcw,
  Volume2,
  Volume1,
  VolumeX,
  Moon,
  Settings,
  Check,
  Clock
} from "lucide-react";

type AmbientSound = {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
};

const ambientSounds: AmbientSound[] = [
  {
    id: "rain",
    name: "Rain",
    description: "Gentle rainfall on a window",
    audioUrl: "/ambient/rain.mp3"
  },
  {
    id: "forest",
    name: "Forest",
    description: "Peaceful woodland ambience",
    audioUrl: "/ambient/forest.mp3"
  },
  {
    id: "cafe",
    name: "Café",
    description: "Coffee shop background noise",
    audioUrl: "/ambient/cafe.mp3"
  },
  {
    id: "fire",
    name: "Fireplace",
    description: "Crackling fire sounds",
    audioUrl: "/ambient/fire.mp3"
  },
  {
    id: "waves",
    name: "Ocean Waves",
    description: "Gentle ocean waves",
    audioUrl: "/ambient/waves.mp3"
  },
  {
    id: "whitenoise",
    name: "White Noise",
    description: "Continuous white noise",
    audioUrl: "/ambient/whitenoise.mp3"
  }
];

export default function FocusTimer({ currentRole }: { currentRole: string }) {
  // Timer state
  const [duration, setDuration] = useState(25 * 60); // 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWhisperMode, setIsWhisperMode] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  
  // Audio state
  const [selectedSound, setSelectedSound] = useState<AmbientSound | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer interval reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Format time function (converts seconds to mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start/pause timer
  const toggleTimer = () => {
    if (isRunning) {
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // Start timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  // Reset timer
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(duration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  // Handle timer completion
  const handleTimerComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setIsCompleted(true);
    setCompletedSessions(prev => prev + 1);
    
    // Play completion sound
    const audio = new Audio("/ambient/complete.mp3");
    audio.volume = volume / 100;
    audio.play();
  };

  // Handle duration change
  const handleDurationChange = (mins: number) => {
    const newDuration = mins * 60;
    setDuration(newDuration);
    setTimeLeft(newDuration);
    resetTimer();
  };

  // Handle ambient sound selection
  const handleSoundSelect = (sound: AmbientSound) => {
    console.log("Selected sound:", sound.name, "URL:", sound.audioUrl);
    setSelectedSound(sound);
    setAudioEnabled(true);
    
    if (audioRef.current) {
      // Always pause current sound first
      audioRef.current.pause();
      
      // Set new source and play
      audioRef.current.src = sound.audioUrl;
      audioRef.current.loop = true;
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      
      // Play with error handling
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`Now playing: ${sound.name}`);
            setAudioEnabled(true);  // Confirm audio is now enabled
          })
          .catch(error => {
            console.error("Audio playback failed:", error);
            
            // Try one more time after a short delay (helps with browser autoplay policies)
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play()
                  .then(() => {
                    console.log(`Retry successful: now playing ${sound.name}`);
                    setAudioEnabled(true);
                  })
                  .catch(err => console.error("Retry playback failed:", err));
              }
            }, 1000);
          });
      }
    } else {
      console.error("Audio element not initialized");
      // Create new audio element if it doesn't exist
      audioRef.current = new Audio(sound.audioUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      audioRef.current.play()
        .then(() => {
          console.log(`Now playing: ${sound.name}`);
          setAudioEnabled(true);
        })
        .catch(err => console.error("Fallback playback failed:", err));
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}, volume: ${volume}%`);
    
    if (audioRef.current) {
      // When toggling, use the new state value rather than the previous state
      audioRef.current.volume = newMutedState ? 0 : volume / 100;
      console.log(`Set audio volume to ${audioRef.current.volume}`);
      
      // If unmuting and no sound is playing, try to play
      if (!newMutedState && selectedSound && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => console.log(`Resumed playing ${selectedSound.name}`))
          .catch(err => console.error("Could not resume audio:", err));
      }
    }
  };

  // Toggle whisper mode
  const toggleWhisperMode = () => {
    setIsWhisperMode(!isWhisperMode);
  };

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    // Log for debugging
    console.log("Audio initialized");
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Add a default sound when component mounts
  useEffect(() => {
    // Set the rain as default sound if no sound is selected
    if (!selectedSound && ambientSounds.length > 0) {
      const defaultSound = ambientSounds[0]; // Rain sound
      setSelectedSound(defaultSound);
      
      // Short timeout to ensure audio element is initialized
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = defaultSound.audioUrl;
          audioRef.current.volume = isMuted ? 0 : volume / 100;
          audioRef.current.loop = true;
          console.log("Loading default sound:", defaultSound.name);
          
          // Try to play the default sound
          audioRef.current.play()
            .then(() => {
              console.log(`Now playing default sound: ${defaultSound.name}`);
              setAudioEnabled(true);
            })
            .catch(error => {
              console.warn("Could not autoplay default sound:", error.message);
              console.log("User interaction required to play audio due to browser policy");
              setAudioEnabled(false);
            });
        }
      }, 500);
    }
  }, []);

  // Calculate progress percentage
  const progressPercentage = ((duration - timeLeft) / duration) * 100;

  // Whisper mode title class
  const whisperModeClass = isWhisperMode ? 
    "text-lg md:text-xl font-light text-neutral-500" : 
    "text-xl md:text-2xl font-medium";

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={whisperModeClass}>
          {isWhisperMode ? "Whisper Mode Focus Timer" : "Focus Timer"}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Moon 
            className={`h-4 w-4 ${isWhisperMode ? "text-indigo-500" : "text-neutral-400"}`}
          />
          <Switch
            checked={isWhisperMode}
            onCheckedChange={toggleWhisperMode}
            className="data-[state=checked]:bg-indigo-500"
          />
          <Label
            htmlFor="whisper-mode"
            className={`text-sm ${isWhisperMode ? "text-indigo-500 font-medium" : "text-neutral-500"}`}
          >
            Whisper Mode
          </Label>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-center mb-6">
          <div 
            className={`text-5xl md:text-6xl font-bold ${
              isCompleted 
                ? "text-green-500" 
                : isRunning 
                  ? isWhisperMode ? "text-indigo-400" : "text-primary" 
                  : isWhisperMode ? "text-neutral-400" : "text-neutral-700"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
          
          <Progress 
            value={progressPercentage} 
            className={`w-full h-2 mt-4 ${
              isWhisperMode ? "bg-neutral-200" : "bg-neutral-100"
            }`}
          />
          
          <div className="flex justify-center space-x-3 mt-4">
            <Button
              onClick={toggleTimer}
              size="lg"
              className={`rounded-full ${isWhisperMode ? 'bg-indigo-500 hover:bg-indigo-600' : ''}`}
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="rounded-full"
            >
              <RefreshCcw className="h-5 w-5" />
            </Button>
          </div>
          
          {isCompleted && (
            <div className="mt-4 text-green-500 flex items-center justify-center font-medium">
              <Check className="mr-1 h-5 w-5" /> Focus session completed! 
            </div>
          )}
        </div>
        
        <Tabs defaultValue="duration" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="duration">Timer Settings</TabsTrigger>
            <TabsTrigger value="ambient">Ambient Sounds</TabsTrigger>
          </TabsList>
          
          <TabsContent value="duration" className="pt-4">
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[15, 25, 30, 45, 60, 90].map(mins => (
                <Button
                  key={mins}
                  variant={duration === mins * 60 ? "default" : "outline"}
                  onClick={() => handleDurationChange(mins)}
                  className={`${
                    duration === mins * 60 
                      ? isWhisperMode ? "bg-indigo-500" : ""
                      : ""
                  } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isRunning}
                >
                  <Clock className="h-4 w-4 mr-1" /> {mins}m
                </Button>
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">
                  Volume: {volume}%
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : volume < 50 ? (
                    <Volume1 className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                value={[volume]}
                onValueChange={handleVolumeChange}
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm font-medium">
                  Completed Sessions: <span className="text-green-500">{completedSessions}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={true}
                >
                  <Settings className="h-4 w-4 mr-1" /> More Settings
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ambient" className="space-y-4 pt-4">
            {!audioEnabled && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-amber-700 text-sm">
                <p className="font-medium mb-1">Enable sounds by interacting with a button below</p>
                <p className="text-xs">
                  Due to browser policies, audio can only play after a user interaction.
                  Click any sound button below to enable ambient sounds.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              {ambientSounds.map((sound) => (
                <Button
                  key={sound.id}
                  variant={selectedSound?.id === sound.id ? "default" : "outline"}
                  className={`h-auto py-3 justify-start flex-col items-start text-left ${
                    selectedSound?.id === sound.id && isWhisperMode ? "bg-indigo-500" : ""
                  }`}
                  onClick={() => {
                    handleSoundSelect(sound);
                    setAudioEnabled(true);
                  }}
                >
                  <div className="font-medium">{sound.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {sound.description}
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="text-xs text-neutral-500 text-center mt-2">
              {audioEnabled 
                ? "Select an ambient sound to enhance your focus and create a productive study environment."
                : "Click any sound to enable ambient audio features."}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className={`flex justify-between text-xs ${isWhisperMode ? "text-neutral-400" : "text-neutral-500"}`}>
        <div>
          {isWhisperMode 
            ? "Whisper Mode reduces visual distractions" 
            : "Enable Whisper Mode for deep focus"
          }
        </div>
        <div>
          {currentRole === UserRole.STUDENT 
            ? "Student Focus Mode" 
            : "Educator Mode"
          }
        </div>
      </CardFooter>
    </Card>
  );
}