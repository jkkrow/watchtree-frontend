import { memo } from 'react';

import { VideoNode } from 'store/slices/video-slice';
import './Selector.scss';

interface SelectorProps {
  on: boolean;
  high: boolean;
  next: VideoNode[];
  currentTime: number;
  selectionEndPoint: number;
  onSelect: (index: number) => void;
}

const Selector: React.FC<SelectorProps> = ({
  on,
  high,
  next,
  currentTime,
  selectionEndPoint,
  onSelect,
}) => {
  return (
    <div className={`vp-selector${on ? ' active' : ''}${high ? ' high' : ''}`}>
      <div className="vp-selector__container">
        {next.map(
          (video: VideoNode, index: number) =>
            video.info && (
              <button
                key={video.id}
                className="vp-selector__btn"
                onClick={() => onSelect(index)}
              >
                {video.info.label}
              </button>
            )
        )}
      </div>
      <div
        className={`vp-selector__timer${
          selectionEndPoint - currentTime <= 5 ? ' active' : ''
        }`}
      >
        {`Selector disapears in . . . ${
          Math.floor(selectionEndPoint) - Math.floor(currentTime)
        }`}
      </div>
    </div>
  );
};

export default memo(Selector);