import UploadDashboard from 'components/Upload/Dashboard/UploadDashboard';
import UploadTree from 'components/Upload/TreeView/Tree/UploadTree';
import UploadPreview from 'components/Upload/Preview/UploadPreview';
import { VideoTree } from 'store/types/video';
import './UploadLayout.scss';

interface UploadLayoutProps {
  tree: VideoTree;
}

const UploadLayout: React.FC<UploadLayoutProps> = ({ tree }) => {
  const isPreview = tree.root.info?.url;

  return (
    <div className="upload-layout">
      <div className="upload-layout__group">
        {isPreview && <UploadPreview tree={tree} />}
        <UploadDashboard tree={tree} />
      </div>
      <UploadTree tree={tree} />
    </div>
  );
};

export default UploadLayout;
