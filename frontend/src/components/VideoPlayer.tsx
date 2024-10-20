/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; 
import '@videojs/themes/dist/forest/index.css'; 
import { VIDEO_API } from '@/lib/env';
import { getVerifiedToken } from '@/lib/cookieService';
// import axios from 'axios';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const playerRef = useRef<any>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const jwt = getVerifiedToken();
  
  // // Helper to fetch video blob with Range support
  // const fetchVideoBlob = React.useCallback(
  //   async (url: string, range: string) => {
  //     try {
  //       const response = await axios.get(url, {
  //         headers: {
  //           Authorization: `Bearer ${jwt}`,
  //           Range: range,
  //         },
  //         responseType: 'blob',
  //       });
  //       return URL.createObjectURL(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch video blob:', error);
  //       throw error;
  //     }
  //   },
  //   [jwt]
  // );

  // useEffect(() => {
  //   const initializeVideo = async () => {
  //     if (videoElement) {
  //       try {
  //         const blobUrl = await fetchVideoBlob(`${VIDEO_API}/stream-video/${videoUrl}`, 'bytes=0-');
  //         videoElement.src = blobUrl;
  //       } catch (error) {
  //         console.error('Failed to load video:', error);
  //       }
  //     }
  //   };
  //   initializeVideo();
  // }, [fetchVideoBlob, videoElement, videoUrl]);

  // useEffect(() => {
  //   const handleSeek = async () => {
  //     if (videoElement && playerRef.current) {
  //       const player = playerRef.current;
  //       const rangeStart = Math.floor(player.currentTime());
  //       const rangeHeader = `bytes=${rangeStart}-`;

  //       try {
  //         const blobUrl = await fetchVideoBlob(`${VIDEO_API}/stream-video/${videoUrl}`, rangeHeader);
  //         videoElement.src = blobUrl;
  //         videoElement.play();
  //       } catch (error) {
  //         console.error('Failed to fetch video for seek:', error);
  //       }
  //     }
  //   };

  //   if (videoElement) {
  //     videoElement.addEventListener('seeking', handleSeek);
  //   }

  //   return () => {
  //     if (videoElement) {
  //       videoElement.removeEventListener('seeking', handleSeek);
  //     }
  //   };
  // }, [fetchVideoBlob, videoElement, videoUrl]);

  useEffect(() => {
    if (videoElement && !playerRef.current) {
      const player = videojs(videoElement, {
        controls: true,
        responsive: true,
        autoplay: true,
        fluid: true,
        preload: 'auto',
        aspectRatio: '16:9',
        playbackRates: [0.5, 1, 1.5, 2],
        disablePictureInPicture: true,
        controlBar: {
          skipButtons: { forward: 10, backward: 10 },
        },
        userActions: {
          hotkeys: (event: KeyboardEvent) => handleHotkeys(event),
        },
      });
      playerRef.current = player;
      console.log('Playing video from URL:', videoUrl);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoElement, videoUrl]);

  const handleHotkeys = (event: KeyboardEvent) => {
    if (!playerRef.current) return;
    const player = playerRef.current;

    switch (event.key) {
      case ' ': // Play/Pause
        event.preventDefault(); // Prevent page scrolling
        if (player.paused()) player.play();
        else player.pause();
        break;
      case 'f': // Fullscreen
        if (!player.isFullscreen()) player.requestFullscreen();
        break;
      case 'Escape': // Exit fullscreen
        if (player.isFullscreen()) player.exitFullscreen();
        break;
      case 'ArrowRight':
        player.currentTime(player.currentTime() + 10);
        break;
      case 'ArrowLeft':
        player.currentTime(player.currentTime() - 10);
        break;
      case 'ArrowUp':
        player.volume(Math.min(player.volume() + 0.1, 1));
        break;
      case 'ArrowDown':
        player.volume(Math.max(player.volume() - 0.1, 0));
        break;
      default:
        break;
    }
  };
  
  useEffect(() => {
    const disableActions = (e: Event) => {
      e.preventDefault(); // Prevent default behavior
      e.stopPropagation(); // Stop event propagation
    };

    const disableShortcuts = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K', 'U'].includes(e.key)) ||
        e.key === 'ContextMenu'
      ) {
        disableActions(e);
      }
    };

    window.addEventListener('contextmenu', disableActions);
    window.addEventListener('keydown', disableShortcuts);
    window.addEventListener('mousedown', disableActions);

    return () => {
      window.removeEventListener('contextmenu', disableActions);
      window.removeEventListener('keydown', disableShortcuts);
      window.removeEventListener('mousedown', disableActions);
    };
  }, []);

  return (
    <div className="video-container w-full aspect-video flex justify-center items-center">
      <video
        ref={(el) => setVideoElement(el)}
        src={`${VIDEO_API}/stream-video/${videoUrl}?token=${jwt}`}
        className="video-js vjs-theme-forest vjs-big-play-button vjs-control-bar"
        controls
      >
        <p className="vjs-no-js">
          To view this video, please enable JavaScript or use a supported browser.
        </p>
      </video>
    </div>
  );
};

export default VideoPlayer;
