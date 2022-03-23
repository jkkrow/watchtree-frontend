import { useState, useRef, useCallback, useEffect } from 'react';

import { useTimeout } from 'hooks/timer-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { videoActions } from 'store/slices/video-slice';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
  active?: boolean;
}

export const useVolume = ({ videoRef, active = true }: Dependencies) => {
  const videoVolume = useAppSelector((state) => state.video.videoVolume);
  const dispatch = useAppDispatch();

  const [volumeState, setVolumeState] = useState(videoVolume || 1);

  const volumeData = useRef(videoVolume || 1);

  const [setVolumeTimeout] = useTimeout();

  const volumeChangeHandler = useCallback(() => {
    const video = videoRef.current!;

    setVolumeState(video.volume);

    if (video.volume === 0) {
      video.muted = true;
    } else {
      video.muted = false;
      volumeData.current = video.volume;
    }

    if (active) {
      setVolumeTimeout(() => {
        dispatch(videoActions.setVideoVolume(video.volume));
        localStorage.setItem('video-volume', `${video.volume}`);
      }, 300);
    }
  }, [videoRef, dispatch, active, setVolumeTimeout]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current!;

    if (video.volume !== 0) {
      volumeData.current = video.volume;
      video.volume = 0;
      setVolumeState(0);
    } else {
      video.volume = volumeData.current;
      setVolumeState(volumeData.current);
    }
  }, [videoRef]);

  const changeVolumeWithInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current!;
      video.volume = +event.target.value;
    },
    [videoRef]
  );

  const changeVolumeWithKey = useCallback(
    (direction: 1 | 0) => {
      const video = videoRef.current!;
      if (direction) {
        if (video.volume + 0.05 > 1) {
          video.volume = 1;
        } else {
          video.volume = +(video.volume + 0.05).toFixed(2);
        }
        return;
      }

      if (video.volume - 0.05 < 0) {
        video.volume = 0;
      } else {
        video.volume = +(video.volume - 0.05).toFixed(2);
      }
    },
    [videoRef]
  );

  const configureVolume = useCallback(() => {
    const video = videoRef.current!;
    video.volume = videoVolume || 1;
  }, [videoRef, videoVolume]);

  useEffect(() => {
    if (active) return;

    const video = videoRef.current!;
    video.volume = videoVolume;
  }, [videoRef, active, videoVolume]);

  return {
    volumeState,
    volumeChangeHandler,
    changeVolumeWithInput,
    changeVolumeWithKey,
    configureVolume,
    toggleMute,
  };
};
