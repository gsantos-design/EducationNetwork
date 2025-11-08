// Script to generate ambient sounds using Web Audio API
import fs from 'fs';
import { exec } from 'child_process';

console.log('Generating ambient sound files...');

// Command to create a rain sound (white noise filtered)
const rainCmd = `ffmpeg -f lavfi -i "anoisesrc=color=white:duration=10" -af "lowpass=f=1000,highpass=f=100" -acodec libmp3lame -ab 128k -y client/public/ambient/rain.mp3`;

// Command to create a forest sound (brown noise with some filtered components)
const forestCmd = `ffmpeg -f lavfi -i "anoisesrc=color=brown:duration=10" -af "lowpass=f=800" -acodec libmp3lame -ab 128k -y client/public/ambient/forest.mp3`;

// Command to create a cafe sound (pink noise with mid-frequency emphasis)
const cafeCmd = `ffmpeg -f lavfi -i "anoisesrc=color=pink:duration=10" -af "bandpass=f=800:width_type=h:width=200" -acodec libmp3lame -ab 128k -y client/public/ambient/cafe.mp3`;

// Command to create a fire sound (filtered brown noise with some crackle)
const fireCmd = `ffmpeg -f lavfi -i "anoisesrc=color=brown:duration=10" -af "lowpass=f=600,highpass=f=100" -acodec libmp3lame -ab 128k -y client/public/ambient/fire.mp3`;

// Command to create ocean waves (filtered white noise with low frequency emphasis)
const wavesCmd = `ffmpeg -f lavfi -i "anoisesrc=color=white:duration=10" -af "lowpass=f=500,volume=2" -acodec libmp3lame -ab 128k -y client/public/ambient/waves.mp3`;

// Command to create white noise
const whiteNoiseCmd = `ffmpeg -f lavfi -i "anoisesrc=color=white:duration=10" -acodec libmp3lame -ab 128k -y client/public/ambient/whitenoise.mp3`;

// Command to create a completion sound (simple sine wave beep)
const completeCmd = `ffmpeg -f lavfi -i "sine=frequency=800:duration=1" -acodec libmp3lame -ab 128k -y client/public/ambient/complete.mp3`;

// Execute the commands
exec(rainCmd, (error) => {
  if (error) {
    console.error(`Error generating rain sound: ${error}`);
    return;
  }
  console.log('Rain sound generated.');

  exec(forestCmd, (error) => {
    if (error) {
      console.error(`Error generating forest sound: ${error}`);
      return;
    }
    console.log('Forest sound generated.');

    exec(cafeCmd, (error) => {
      if (error) {
        console.error(`Error generating cafe sound: ${error}`);
        return;
      }
      console.log('Cafe sound generated.');

      exec(fireCmd, (error) => {
        if (error) {
          console.error(`Error generating fire sound: ${error}`);
          return;
        }
        console.log('Fire sound generated.');

        exec(wavesCmd, (error) => {
          if (error) {
            console.error(`Error generating waves sound: ${error}`);
            return;
          }
          console.log('Waves sound generated.');

          exec(whiteNoiseCmd, (error) => {
            if (error) {
              console.error(`Error generating white noise: ${error}`);
              return;
            }
            console.log('White noise generated.');

            exec(completeCmd, (error) => {
              if (error) {
                console.error(`Error generating complete sound: ${error}`);
                return;
              }
              console.log('Complete sound generated.');
              console.log('All ambient sounds have been generated successfully!');
            });
          });
        });
      });
    });
  });
});