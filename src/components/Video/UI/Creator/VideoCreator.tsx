import { Link } from 'react-router-dom';

import Avatar from 'components/Common/UI/Avatar/Avatar';
import { TreeInfoClient } from 'store/types/video';
import './VideoCreator.scss';

interface VideoCreatorProps {
  info: TreeInfoClient;
}

const VideoCreator: React.FC<VideoCreatorProps> = ({ info }) => {
  return (
    <Link className="video-creator" to={`/channel/${info.creator}`}>
      <Avatar width="2.5rem" height="2.5rem" src={info.creatorInfo.picture} />
      <div className="video-creator__name">{info.creatorInfo.name}</div>
    </Link>
  );
};

export default VideoCreator;
