/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Default Video.js styling
import '@videojs/themes/dist/forest/index.css'; // Optional Forest theme

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const playerRef = useRef<any>(null); // Avoid video.js types
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null); // Store video element in state

  // Initialize the Video.js player when the video element is set
  useEffect(() => {
    if (videoElement && !playerRef.current) {
     const player = videojs(videoElement, {
        controls: true,
        responsive: true,
        autoplay: true,
        fluid: true, // Makes the player responsive
        preload: 'auto',
        enableSmoothSeeking: true, // provide a smoother seeking experience on mobile and desktop devices.
        aspectRatio: "16:9",
        playbackRates: [0.5, 1, 1.5, 2], // Speed options
        disablePictureInPicture : true,
        controlBar: {
          skipButtons: {
            forward: 10,
            backward: 10
          }
        },
        userActions: {
          hotkeys: (event: KeyboardEvent) => handleHotkeys(event),
        },
      });
      playerRef.current = player;
    }

    // Cleanup on unmount to avoid re-initialization issues
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoElement, videoUrl]); // Re-run when videoElement changes

  const handleHotkeys = (event: KeyboardEvent) => {
    if (!playerRef.current) return;

    const player = playerRef.current;

    switch (event.key) {
      case '': // Pause video
        player.pause();
        break;
      case ' ': 
        event.preventDefault(); // Prevent page from scrolling
        if (player.paused()) {
          player.play();
        } else {
          player.pause();
        }
        break;
      case 'f': // Fullscreen
        if (!player.isFullscreen()) {
          player.requestFullscreen();
        }
        break;
      case 'Escape': // Exit fullscreen
        if (player.isFullscreen()) {
          player.exitFullscreen();
        }
        break;
      case 'ArrowRight': // Skip forward 10s
        player.currentTime(player.currentTime() + 10);
        break;
      case 'ArrowLeft': // Skip backward 10s
        player.currentTime(player.currentTime() - 10);
        break;
      case 'ArrowUp': // Increase volume by 10%
        player.volume(Math.min(player.volume() + 0.1, 1)); // Max volume is 1
        break;
      case 'ArrowDown': // Decrease volume by 10%
        player.volume(Math.max(player.volume()  - 0.1, 0)); // Min volume is 0
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="video-container w-full aspect-video flex justify-center items-center">
      <video
        ref={(el) => setVideoElement(el)} // Use callback ref to set the video element
        className="video-js vjs-theme-forest vjs-big-play-button vjs-control-bar "
        controls
      >
        <source src={videoUrl} type="video/mp4" />
        <p className="vjs-no-js">
          To view this video, please enable JavaScript or use a supported browser.
        </p>
      </video>
    </div>
  );
};



export default VideoPlayer;
