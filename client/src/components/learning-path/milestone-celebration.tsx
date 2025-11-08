import React, { useState, useEffect } from 'react';
import { useConfetti, ConfettiCelebration } from '@/components/ui/confetti-celebration';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Award, Trophy, Medal, Star, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type MilestoneType = {
  id: string | number;
  title: string;
  description: string;
  type: 'milestone' | 'badge' | 'certificate' | 'level-up';
  iconType?: 'trophy' | 'medal' | 'award' | 'star';
  subject?: string;
  earnedAt?: string;
};

type MilestoneCelebrationProps = {
  milestone: MilestoneType | null;
  onClose: () => void;
};

export function MilestoneCelebration({ milestone, onClose }: MilestoneCelebrationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { triggerConfetti, ConfettiComponent } = useConfetti();
  
  useEffect(() => {
    if (milestone) {
      setIsOpen(true);
      // Trigger confetti with a slight delay to ensure dialog is visible
      setTimeout(() => {
        triggerConfetti({
          particleCount: 250, 
          spread: 100,
          duration: 5000,
          colors: getColorsForMilestone(milestone.type)
        });
      }, 300);
    } else {
      setIsOpen(false);
    }
  }, [milestone]);
  
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };
  
  const getIcon = () => {
    if (!milestone) return null;
    
    switch (milestone.iconType) {
      case 'trophy':
        return <Trophy className="h-12 w-12 text-yellow-500" />;
      case 'medal':
        return <Medal className="h-12 w-12 text-yellow-400" />;
      case 'star':
        return <Star className="h-12 w-12 text-yellow-400" />;
      default:
        return <Award className="h-12 w-12 text-blue-500" />;
    }
  };
  
  const getColorsForMilestone = (type?: string): string[] => {
    switch (type) {
      case 'milestone':
        return ['#FFD700', '#FFA500', '#FF8C00', '#FF7F50', '#FF6347']; // Gold and orange hues
      case 'badge':
        return ['#4682B4', '#5F9EA0', '#6495ED', '#7B68EE', '#9370DB']; // Blue and purple hues
      case 'certificate':
        return ['#228B22', '#32CD32', '#3CB371', '#2E8B57', '#008000']; // Green hues
      case 'level-up':
        return ['#FF1493', '#FF69B4', '#FFB6C1', '#DB7093', '#C71585']; // Pink and magenta hues
      default:
        return ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']; // Rainbow
    }
  };
  
  if (!milestone) return null;
  
  return (
    <>
      <ConfettiComponent />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                {getIcon()}
              </div>
              
              <Badge 
                className="mb-2 text-xs"
                variant={milestone.type === 'milestone' ? 'default' : 'secondary'}
              >
                {milestone.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
              
              <DialogTitle className="text-xl font-bold text-center">
                {milestone.title}
              </DialogTitle>
            </div>
            
            <DialogDescription className="text-center">
              {milestone.description}
            </DialogDescription>
            
            {milestone.subject && (
              <div className="mt-2 text-center">
                <span className="text-sm font-medium">Subject: </span>
                <span className="text-sm">{milestone.subject}</span>
              </div>
            )}
            
            {milestone.earnedAt && (
              <div className="mt-1 text-xs text-muted-foreground text-center">
                Earned on {new Date(milestone.earnedAt).toLocaleDateString()}
              </div>
            )}
          </DialogHeader>
          
          <div className="bg-primary/5 p-4 rounded-lg my-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
              <p className="text-sm">
                Great job! Keep up the excellent progress on your learning journey.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center gap-3 mt-4">
            <Button
              variant="default"
              className="w-full"
              onClick={handleClose}
            >
              Continue Learning
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Trigger extra confetti for fun
                triggerConfetti({
                  particleCount: 100,
                  duration: 2000,
                  spread: 90
                });
              }}
            >
              Celebrate Again!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}