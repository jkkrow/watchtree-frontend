import { CSSTransition } from 'react-transition-group';

import PreviewPlayer from './Player/PreviewPlayer';
import { VideoTreeClient, PlayerNode } from 'store/slices/video-slice';
import './Preview.scss';

interface PreviewProps {
  video: VideoTreeClient;
  on: boolean;
  onUnmounted: () => void;
}

const Preview: React.FC<PreviewProps> = ({ video, on, onUnmounted }) => {
  return video.root.info ? (
    <CSSTransition
      in={on}
      classNames="video-preview"
      timeout={300}
      mountOnEnter
      unmountOnExit
      onExited={onUnmounted}
    >
      <div className="video-preview">
        <PreviewPlayer treeId={video._id} video={video.root as PlayerNode} />
      </div>
    </CSSTransition>
  ) : null;
};

export default Preview;
