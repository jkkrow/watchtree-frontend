import VideoCreator from '../Creator/VideoCreator';
import VideoDuration from '../Duration/VideoDuration';
import VideoFavorites from '../Favorites/VideoFavorites';
import VideoTags from '../Tags/VideoTags';
import VideoTimestamp from '../Timestamp/VideoTimestamp';
import VideoViews from '../Views/VideoViews';
import { VideoTreeClient } from 'store/types/video';
import './VideoDetail.scss';

interface VideoDetailProps {
  video: VideoTreeClient;
}

const VideoDetail: React.FC<VideoDetailProps> = ({ video }) => {
  return (
    <div className="video-detail">
      <div className="video-detail__header">
        <div className="video-detail__title">
          <h2>{video.info.title}</h2>
          <div className="video-detail__favorites">
            <VideoFavorites
              videoId={video._id}
              favorites={video.data.favorites}
              isFavorite={video.data.isFavorite}
              button
            />
          </div>
        </div>
        <div className="video-detail__createdAt">
          <VideoTimestamp createdAt={video.createdAt} />
        </div>
      </div>
      <div className="video-detail__creator">
        <VideoCreator info={video.info} />
      </div>
      <div className="video-detail__tags">
        <VideoTags tags={video.info.tags} />
      </div>
      <VideoViews views={video.data.views} />
      <VideoDuration
        minDuration={video.info.minDuration}
        maxDuration={video.info.maxDuration}
      />
      <p className="video-detail__description">{video.info.description}</p>
    </div>
  );
};

export default VideoDetail;
