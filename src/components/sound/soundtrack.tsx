import React from "react";
import { useSettings } from "@/store";

export const Soundtrack = () => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const { music } = useSettings();

  React.useEffect(() => {
    // Create audio element only once
    audioRef.current = new Audio("/sounds/soundtrack.wav"); // Replace with your audio file path
    audioRef.current.loop = true;

    // Cleanup function to stop and remove audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  React.useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (music) {
      audioRef.current.play().catch((error) => {
        console.warn("Audio playback failed:", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [music]); // Only re-run when music enabled state changes

  return null; // Component doesn't render anything visually
};
