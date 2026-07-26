import { useRef, useState, useEffect, useCallback } from 'react';

export interface FrameStepperProps {
  videoSrc: string;
}

const STEP_FRAME = 1 / 30;

export function FrameStepper({ videoSrc }: FrameStepperProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [finding, setFinding] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => {
      const fps = 30;
      const total = Math.floor(video.duration * fps);
      setTotalFrames(total);
    };
    video.addEventListener('loadedmetadata', onMeta);
    return () => video.removeEventListener('loadedmetadata', onMeta);
  }, []);

  const syncFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const fps = 30;
    const frame = Math.floor(video.currentTime * fps);
    setCurrentFrame(frame);
    if (frame >= 120 && frame <= 150) {
      setFinding(
        'Lip-sync mismatch detected at frames 120-150: audio and video tracks are offset by approximately 3 frames, consistent with AI-generated deepfake assembly.',
      );
    }
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const step = useCallback((dir: -1 | 1) => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setPlaying(false);
    const newTime = Math.max(0, Math.min(video.duration, video.currentTime + dir * STEP_FRAME));
    video.currentTime = newTime;
  }, []);

  const seekTo = useCallback((frame: number) => {
    const video = videoRef.current;
    if (!video) return;
    const fps = 30;
    video.currentTime = frame / fps;
  }, []);

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const fraction = x / rect.width;
      const frame = Math.floor(fraction * totalFrames);
      seekTo(frame);
    },
    [totalFrames, seekTo],
  );

  return (
    <div data-testid="tool-frame-stepper" style={{ padding: '16px' }}>
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        onTimeUpdate={syncFrame}
        onEnded={() => setPlaying(false)}
        style={{ width: '100%', maxHeight: '300px', background: '#000', borderRadius: '8px' }}
        data-testid="fs-video"
      />

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
        <button onClick={() => step(-1)} data-testid="fs-step-back" style={btnStyle}>
          {'◀'}
        </button>
        <button onClick={togglePlay} data-testid="fs-play" style={btnStyle}>
          {playing ? '⏸' : '▶'}
        </button>
        <button onClick={() => step(1)} data-testid="fs-step-forward" style={btnStyle}>
          {'▶'}
        </button>
        <span
          data-testid="fs-frame-counter"
          style={{ color: '#ccc', marginLeft: '8px', fontFamily: 'monospace' }}
        >
          Frame {currentFrame} / {totalFrames}
        </span>
      </div>

      <div
        onClick={handleTimelineClick}
        data-testid="fs-timeline"
        style={{
          marginTop: '8px',
          height: '8px',
          background: '#333',
          borderRadius: '4px',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: totalFrames > 0 ? `${(currentFrame / totalFrames) * 100}%` : '0%',
            height: '100%',
            background: '#f39c12',
            borderRadius: '4px',
            transition: 'width 0.1s',
          }}
        />
        {totalFrames > 0 && (
          <div
            style={{
              position: 'absolute',
              left: `${(120 / totalFrames) * 100}%`,
              right: `${100 - (150 / totalFrames) * 100}%`,
              top: '-2px',
              bottom: '-2px',
              background: 'rgba(255,68,68,0.3)',
              borderRadius: '2px',
              pointerEvents: 'none',
            }}
            title="Suspicious region"
          />
        )}
      </div>

      <div
        style={{
          marginTop: '8px',
          fontSize: '15px',
          color: '#666',
          fontFamily: 'var(--pixel-font)',
        }}
      >
        Tip: Step through frames 120-150 to spot the lip-sync mismatch
      </div>

      {finding && (
        <div
          data-testid="fs-finding"
          style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(46, 204, 113, 0.15)',
            borderLeft: '3px solid #2ecc71',
            borderRadius: '4px',
            color: '#2ecc71',
            fontSize: '17px',
            lineHeight: '1.5',
          }}
        >
          🔍 {finding}
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: '#2a2a4a',
  color: '#fff',
  border: '1px solid #4a4a8a',
  borderRadius: '6px',
  padding: '10px 18px',
  cursor: 'pointer',
  fontFamily: 'var(--pixel-font)',
  fontSize: '17px',
  minWidth: '44px',
};
