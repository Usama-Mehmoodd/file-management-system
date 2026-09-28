import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import WelcomeSection from '../../components/dashboard/WelcomeSection';

import StatsCards from '../../components/dashboard/StatsCards';
import UploadZone from '../../components/dashboard/UploadZone';
import FileManager from '../../components/files/FileManager';
import MyModal from '../../components/MyModal';
import EditModal from '../../components/EditModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../utilities/axios';
import { getTimeDifference } from '../../../helper';
import { buildStats, countsByCategory } from '../../utilities/fileHelpers';

/* Storage quota shown in the sidebar + stats card.
   Move this to an env var or a backend field when you have one. */
const STORAGE_QUOTA = 10 * 1024 ** 3; // 10 GB

export default function Home() {
  const { user, logout } = useAuth();

  const [filesData, setFilesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // View state
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState(
    () => localStorage.getItem('fm-view') || 'list'
  );

  // Upload states
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [uploadError, setUploadError] = useState('');
  const [activeFile, setActiveFile] = useState(null);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editFile, setEditFile] = useState(false);
  const [singleFile, setSingleFile] = useState({
    fileName: '',
    mimetype: '',
    fileID: '',
  });

  const uploadZoneRef = useRef(null);

  useEffect(() => {
    getAllFiles();
    
  }, []);

  useEffect(() => {
    localStorage.setItem('fm-view', view);
  }, [view]);

  /* --- Data ------------------------------------------------------------ */

  const getAllFiles = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');

      const response = await api.get('/files');
      setFilesData(transformFiles(response.data.data));
    } catch (error) {
      console.error('Error fetching files:', error);
      setLoadError('Unable to load files');
    } finally {
      setLoading(false);
    }
  }, []);

  /*
    Keeps `uploadTime` as the human string the table shows, and adds
    `uploadedAt` as the raw Date so newest/oldest sorting actually works.
  */
  function transformFiles(files) {

    const arr = Array.from(files);

    return arr.map((file) => {

      const uploadedAt = new Date(file.uploadTime);

      return {
        ...file,
        uploadedAt,
        uploadTime: getTimeDifference(uploadedAt),
      };
    });
  }

  /* --- Upload ---------------------------------------------------------- */

  async function uploadFileToBackend(file) {
    const formData = new FormData();
    formData.append('file', file);

    setActiveFile({ name: file.name, size: file.size });
    setStatus('uploading');
    setProgress(0);
    setUploadError('');

    try {
      await api.post('/files/upload-file', formData, {
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      setProgress(100);
      setStatus('success');
      await getAllFiles();

    } catch (error) {

      console.error('Error uploading file:', error);
      setUploadError('Upload failed. Check the file and try again.');

      setStatus('error');

    } finally {

      setTimeout(() => {
        setStatus('idle');
        setActiveFile(null);
      }, 2500);

    }
  }

  /* --- Row actions ----------------------------------------------------- */

  function handleEdit(file) {
    setSingleFile({ fileName: file.fileName, fileID: file._id });
    setEditFile(true);
  }

  function handleDelete(file) {
    setSingleFile({
      fileName: file.fileName,
      mimetype: file.contentType || file.mimetype,
      fileID: file._id,
    });
    setShowModal(true);
  }


  function handleDownload(file) {
    const url = file.url || file.fileUrl || file.path || file.location;
    if (!url) {
      console.warn('No download URL on this file record:', file);
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName || 'download';
    link.rel = 'noopener';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const hasDownloadUrl = filesData.some(
    (f) => f.url || f.fileUrl || f.path || f.location
  );

  const actions = {
    onEdit: handleEdit,
    onDelete: handleDelete,
    ...(hasDownloadUrl ? { onDownload: handleDownload } : {}),
  };

  /* --- Derived --------------------------------------------------------- */

  const stats = useMemo(() => buildStats(filesData), [filesData]);
  const counts = useMemo(() => countsByCategory(filesData), [filesData]);

  const categoriesOfSidebar = ['all', 'pictures', 'pdf', 'docs', 'excel'];

  function handleSidebarSelect(key) {
    // user select the side bar category  
    if (categoriesOfSidebar.includes(key)) {
      setCategory(key);
    }
    if (key === 'dashboard') {
      setCategory('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function scrollToUpload() {
    uploadZoneRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  return (
    <DashboardLayout
      category={category}
      onCategoryChange={handleSidebarSelect}
      search={search}
      onSearchChange={setSearch}
      user={user}
      onLogout={logout}
      counts={counts}
      storage={{ used: stats.totalBytes, total: STORAGE_QUOTA }}
    >
      <div className="dashboard-top">
        <WelcomeSection user={user} />
        <div ref={uploadZoneRef}>
          <UploadZone
            onFileSelected={uploadFileToBackend}
            status={status}
            progress={progress}
            activeFile={activeFile}
            error={uploadError}
          />
        </div>
      </div>

      <StatsCards
        stats={stats}
        storageTotal={STORAGE_QUOTA}
        loading={loading && filesData.length === 0}
      />

      <FileManager
        files={filesData}
        loading={loading}
        error={loadError}
        onRetry={getAllFiles}
        category={category}
        onCategoryChange={setCategory}
        counts={counts}
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        view={view}
        onViewChange={setView}
        actions={actions}
        onUploadClick={scrollToUpload}
      />

      {showModal && (
        <MyModal
          show={showModal}
          details={singleFile}
          getAllFiles={getAllFiles}
          onHide={() => setShowModal(false)}
        />
      )}

      {editFile && (
        <EditModal
          show={editFile}
          details={singleFile}
          getAllFiles={getAllFiles}
          onHide={() => setEditFile(false)}
        />
      )}
    </DashboardLayout>
  );
}
