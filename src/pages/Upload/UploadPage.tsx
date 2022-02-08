import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import UploadDashboard from 'components/Upload/Dashboard/UploadDashboard';
import UploadTree from 'components/Upload/TreeView/Tree/UploadTree';
import Preview from 'components/Upload/Preview/Preview';
import { useAppSelector } from 'hooks/store-hook';
import 'styles/upload.scss';

const UploadPage: React.FC = () => {
  const previewTree = useAppSelector((state) => state.upload.previewTree);

  const navigate = useNavigate();

  useEffect(() => {
    !previewTree && navigate('/user/videos');
  }, [previewTree, navigate]);

  const isPreview = previewTree?.root.info?.url;

  return (
    <div className="upload-page">
      {previewTree && <UploadDashboard tree={previewTree} />}
      {previewTree && <UploadTree tree={previewTree} />}
      {isPreview && <Preview tree={previewTree} />}
    </div>
  );
};

export default UploadPage;
