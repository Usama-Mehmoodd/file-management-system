import { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, CloudUpload, File as FileIcon } from 'lucide-react';
import { formatBytes } from '../../utilities/fileHelpers';

export default function UploadZone({
  onFileSelected,
  status = 'idle', // idle | uploading | success | error
  progress = 0,
  activeFile = null, // { name, size }
  error = '',
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const busy = status === 'uploading';

  function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    onFileSelected(fileList[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (busy) return;
    handleFiles(e.dataTransfer.files);
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (!busy) setDragging(true);
  }

  function openPicker() {
    if (!busy) inputRef.current?.click();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  }

  return (
    <section className="ui-card upload-zone-card" aria-label="Upload files">
      <div
        className={`upload-zone ${dragging ? 'is-dragging' : ''} ${
          busy ? 'is-busy' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-disabled={busy}
        aria-label="Drop a file here or click to choose a file"
      >
        <span className="upload-zone__icon">
          <CloudUpload size={28} aria-hidden="true" />
        </span>

        <p className="upload-zone__title">
          {dragging ? 'Drop to upload' : 'Drop files here'}
        </p>
        <p className="upload-zone__hint">or click to choose from your device</p>

        <span className="ui-btn ui-btn-primary upload-zone__btn">
          Choose file
        </span>

        <p className="upload-zone__types">PDF · DOC · XLSX · PPT · Images</p>

        <input
          ref={inputRef}
          id="file-upload"
          name="file"
          type="file"
          className="visually-hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = ''; // allow re-selecting the same file
          }}
          disabled={busy}
        />
      </div>

      {status === 'uploading' && (
        <div className="upload-progress" aria-live="polite">
          <div className="upload-progress__head">
            <FileIcon size={16} aria-hidden="true" />
            <span className="upload-progress__name">
              {activeFile?.name || 'Uploading file'}
            </span>
            <span className="upload-progress__percent">{progress}%</span>
          </div>
          <div
            className="upload-progress__bar"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="upload-progress__fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          {activeFile?.size != null && (
            <span className="text-meta">{formatBytes(activeFile.size)}</span>
          )}
        </div>
      )}

      {status === 'success' && (
        <div className="upload-status upload-status--success" role="status">
          <CheckCircle2 size={18} aria-hidden="true" />
          Uploaded {activeFile?.name ? `“${activeFile.name}”` : 'successfully'}
        </div>
      )}

      {status === 'error' && (
        <div className="upload-status upload-status--error" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          {error || "That file didn't upload. Try again."}
        </div>
      )}
    </section>
  );
}
