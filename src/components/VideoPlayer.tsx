'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onTimeUpdate?: (currentTime: number) => void;
  seekTime?: number | null;
}

export default function VideoPlayer({ src, poster, onTimeUpdate, seekTime }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');

  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTime;
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [seekTime]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((cur / dur) * 100);
    setCurrentTimeStr(formatTime(cur));
    setDurationStr(formatTime(dur));
    if (onTimeUpdate) onTimeUpdate(cur);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTo = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTo;
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border-slate-700/80 group shadow-2xl bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity"
        >
          <div className="w-16 h-16 rounded-full bg-[#1683DF]/90 border border-[#93CCE9]/50 flex items-center justify-center text-white shadow-2xl shadow-[#1683DF]/50 hover:scale-110 transition-transform">
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          </div>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleSeek}
          className="w-full h-1.5 accent-[#1683DF] bg-slate-700/60 rounded-lg cursor-pointer appearance-none"
        />

        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="hover:text-white transition-colors">
              {isPlaying ? <Pause className="w-5 h-5 text-[#93CCE9]" /> : <Play className="w-5 h-5 text-[#93CCE9]" />}
            </button>
            <button onClick={toggleMute} className="hover:text-white transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <span className="font-mono text-[11px] text-slate-400">
              {currentTimeStr} / {durationStr}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1683DF]/20 text-[#93CCE9] border border-[#1683DF]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 4K Director Master
            </span>
            <button onClick={toggleFullscreen} className="hover:text-white transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}