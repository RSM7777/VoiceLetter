import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

// The combined data structure with your text and audio timings
const messageContent = [
  { text: "Dear Dad,", isBold: true, start: 0, end: 1 },
  {
    text: "I don't say this nearly enough, but I wanted to write it down so you'd always know.",
    isBold: false,
    start: 1,
    end: 4,
  },
  {
    text: "You are, and always will be, the most important people in my life.",
    isBold: false,
    start: 4,
    end: 8,
  },
  {
    text: `You gave me this life, but more than that, you taught me how to live it. Every lesson and every 
sacrifice has shaped me into the person I am today. Not everyone gets to choose their own 
path, but you gave me that freedom—and I will always be grateful for it.`,
    isBold: false,
    start: 8,
    end: 21,
  },
  {
    text: "No matter how old I get or where life takes me, in my heart, I will always be your little kid.",
    isBold: false,
    start: 21,
    end: 25.5,
  },
  {
    text: `If I'm not around when you read this, just know that I'm leaving this letter with you with a whole 
lot of love and gratitude.`,
    isBold: false,
    start: 25,
    end: 31,
  },
  {
    text: `I built legacy note because it’s so easy to lose touch—and sometimes, we never say what 
truly matters. With legacy note, you can write a letter to anyone important in your life, mom, 
dad, old friends just by typing, and they’ll hear it as if you said it yourself.`,
    isBold: false,
    start: 31,
    end: 44,
  },
  {
    text: `Whether you send it today or save it for a time in the future, Legacy Note makes sure your 
most important words never go unsaid.`,
    isBold: false,
    start: 44,
    end: 51,
  },
  {
    text: "With love and gratitude, your son",
    isBold: false,
    start: 51,
    end: 53,
  },
  { text: "- rohit Chetla", isBold: true, start: 53, end: 53 },
];

export const VoiceLetter = (): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const hasInteracted = useRef(false);

  /**
   *  FINAL STABLE SOLUTION
   * This single effect handles everything: autoplay, scrolling, and unmuting on first interaction.
   */
  useEffect(() => {
    const audio = audioRef.current;
    const card = cardRef.current;
    if (!audio || !card) return;

    // Standard listeners to keep React state in sync with the audio element
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // This function unmutes the audio after the first user interaction.
    const unlockAudio = () => {
      if (hasInteracted.current) return; // Only run this logic once
      hasInteracted.current = true;
      audio.muted = false;

      // If the component is currently visible, try to play again now that it's unmuted.
      if (
        card.getBoundingClientRect().top < window.innerHeight &&
        card.getBoundingClientRect().bottom > 0
      ) {
        audio.play().catch(() => {});
      }

      // Clean up the interaction listeners after they have served their purpose.
      window.removeEventListener("scroll", unlockAudio);
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    // Listen for the first interaction of any kind.
    window.addEventListener("scroll", unlockAudio);
    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);

    // IntersectionObserver to play/pause when scrolling in/out of view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Always attempt to play. It will be silent until the user interacts.
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(card);

    // Main cleanup function
    return () => {
      observer.unobserve(card);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      window.removeEventListener("scroll", unlockAudio);
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []); // The empty array ensures this entire setup runs only once.

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Manually clicking the play button should always unlock and unmute.
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      audio.muted = false;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio
        .play()
        .catch((error) => console.error("Audio Playback Error:", error));
    }
  };

  const handleTimeUpdate = () => {
    const time = audioRef.current?.currentTime;
    if (time === undefined) return;
    setCurrentTime(time);
    const currentHighlightIndex = messageContent.findIndex(
      (item) => time >= item.start && time <= item.end
    );
    setHighlightedIndex(currentHighlightIndex);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPositionInPixels = e.clientX - rect.left;
    const clickPositionAsPercentage = clickPositionInPixels / rect.width;
    const newTime = duration * clickPositionAsPercentage;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={cardRef}
      className="min-h-screen w-full flex-col items-center justify-center p-4 sm:px-6 mx:p-8 bg-[#FFECB8]"
    >
      <motion.div className="flex justify-center mb-1 max-w-4xl mx-auto tracking-tight">
        
      </motion.div>
      <audio
        ref={audioRef}
        src="/audio.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
        muted // Start muted to allow silent autoplay to begin
        autoPlay
        loop
      />

      <Card className="w-full max-w-5xl mx-auto flex flex-col overflow-hidden rounded-lg border relative">
        <CardHeader className="relative w-full h-48 p-0">
          <img
            src="/temp.jpg"
            alt="Letter background"
            className="absolute inset-0 w-full h-full object-cover object-left"
          />
          <div className="absolute -right-[280px] md:right-0 max-w-xl bottom-0 flex flex-col sm:flex-row w-full justify-end px-5">
            <button
              onClick={handlePlayPause}
              className="p-3 text-foreground rounded-full hover:bg-muted/50 transition-colors flex-shrink-0"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <div className="hidden md:flex w-1/2 items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground">
                {formatTime(currentTime)}
              </span>
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="w-full h-2 bg-muted rounded-full cursor-pointer group"
              >
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-background border-2 border-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <span className="font-mono text-sm text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="font-['Montserrat'] flex flex-col gap-8 p-3 sm:p-10 bg-card">
          <div className="space-y-2 md:space-y-4">
            {messageContent.map((item, index) => (
              <h1
                key={index}
                className={`text-xs md:text-xl leading-relaxed p-1 rounded-md transition-colors duration-300 text-card-foreground ${
                  item.isBold ? "font-bold" : "font-medium"
                } ${
                  index === highlightedIndex
                    ? "bg-yellow-200 dark:bg-yellow-800"
                    : "bg-transparent"
                }`}
              >
                {item.text}
              </h1>
            ))}
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
};
