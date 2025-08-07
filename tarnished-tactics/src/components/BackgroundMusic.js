import React, { useState, useRef, useEffect } from 'react';

function BackgroundMusic({ audioSrc }) {
  const [isMuted, setIsMuted] = useState(true); // Start muted for better UX
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.volume = 0.3; // Start at 30% volume
    }
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isMuted) {
        // Unmute and play
        audio.muted = false;
        audio.play().then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        }).catch((error) => {
          console.log('Audio play failed:', error);
        });
      } else {
        // Mute and pause
        audio.muted = true;
        audio.pause();
        setIsPlaying(false);
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="background-music-control">
      <audio 
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        muted={isMuted}
      />
      <button 
        onClick={toggleMute}
        className="music-toggle-button"
        title={isMuted ? "Play background music" : "Mute background music"}
      >
        {isMuted ? '🔇' : '🎵'}
      </button>
    </div>
  );
}

export default BackgroundMusic;