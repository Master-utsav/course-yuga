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

  useEffect(() => {
    const disableActions = (e: Event) => {
      e.preventDefault(); // Prevent default behavior
      e.stopPropagation(); // Stop event propagation
    };

    const disableShortcuts = (e: KeyboardEvent) => {
      // Block specific keys like F12, Ctrl+Shift+I, and others
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K', 'U'].includes(e.key)) ||
        e.key === 'ContextMenu'
      ) {
        disableActions(e);
      }
    };

    // Add event listeners to the window
    window.addEventListener('contextmenu', disableActions); // Disable right-click
    window.addEventListener('keydown', disableShortcuts); // Disable specific shortcuts
    window.addEventListener('mousedown', disableActions); // Disable middle mouse button

    return () => {
      // Cleanup on component unmount
      window.removeEventListener('contextmenu', disableActions);
      window.removeEventListener('keydown', disableShortcuts);
      window.removeEventListener('mousedown', disableActions);
    };
  }, []);

  // Initialize the Video.js player when the video element is set
  useEffect(() => {
    if (videoElement && !playerRef.current) {
      playerRef.current = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true, // Makes the player responsive
        preload: 'auto',
        playbackRates: [0.5, 1, 1.5, 2], // Speed options
      });
    }

    // Cleanup on unmount to avoid re-initialization issues
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoElement]); // Re-run when videoElement changes

  return (
    <div className="video-container w-full aspect-video">
      <video
        ref={(el) => setVideoElement(el)} // Use callback ref to set the video element
        className="video-js vjs-theme-forest vjs-big-play-button vjs-control-bar"
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
