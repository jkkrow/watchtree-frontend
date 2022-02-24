import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router';

import VideoItem from '../Item/VideoItem';
import LoaderList from 'components/Common/UI/Loader/List/LoaderList';
import VideoLoader from '../Loader/VideoLoader';
import LoadingSpinner from 'components/Common/UI/Loader/Spinner/LoadingSpinner';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useSearch } from 'hooks/search-hook';
import { useAppThunk } from 'hooks/store-hook';
import { AppThunk } from 'store';
import { VideoTreeClient } from 'store/slices/video-slice';
import './VideoList.scss';

interface VideoListProps {
  id?: 'history' | 'favorites';
  label?: string;
  max?: number;
  forceUpdate?: boolean;
  onFetch: ReturnType<AppThunk>;
}

const VideoList: React.FC<VideoListProps> = ({
  id,
  label,
  max = 12,
  forceUpdate,
  onFetch,
}) => {
  const { dispatchThunk, data, setData, loading, loaded } = useAppThunk<{
    videos: VideoTreeClient[];
    count: number;
  }>({ videos: [], count: 0 });

  const { currentPage, itemsPerPage } = usePaginate(max);
  const { keyword } = useSearch();

  const { id: channelId } = useParams<{ id: string }>();

  useEffect(() => {
    dispatchThunk(
      onFetch({
        page: currentPage,
        max: itemsPerPage,
        search: keyword,
        channelId,
      }),
      { forceUpdate }
    );
  }, [
    dispatchThunk,
    currentPage,
    itemsPerPage,
    keyword,
    channelId,
    forceUpdate,
    onFetch,
  ]);

  const filterList = useCallback(
    (videoId: string) => {
      setData((prevData) => ({
        videos: prevData.videos.filter((video) => video._id !== videoId),
        count: prevData.count--,
      }));
    },
    [setData]
  );

  return (
    <div className="video-list">
      {label && (!loaded || data.videos.length > 0) && (
        <h3 className={`video-list__label${!loaded ? ' loading' : ''}`}>
          {label}
        </h3>
      )}
      <LoaderList
        className="video-list__loader"
        loading={!loaded}
        loader={<VideoLoader detail />}
        rows={3}
      />
      <div className="video-list__container">
        <LoadingSpinner on={loaded && loading} overlay />
        {loaded &&
          data.videos.length > 0 &&
          data.videos.map((item) => (
            <VideoItem
              key={item._id}
              id={id}
              video={item}
              onDelete={filterList}
            />
          ))}
      </div>
      {!loading && loaded && !data.videos.length && (
        <div className="video-list__empty">No {label || 'video found'}</div>
      )}
      {loaded && (
        <Pagination
          count={data.count}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          keyword={keyword}
        />
      )}
    </div>
  );
};

export default VideoList;
