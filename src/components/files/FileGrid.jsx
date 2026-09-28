import FileActions from './FileActions';
import FileIcon from './FileIcon';
import { formatBytes, getFileMeta } from '../../utilities/fileHelpers';

export default function FileGrid({ files, actions }) {
  return (
    <ul className="file-grid">
      {files.map((file) => {
        const meta = getFileMeta(file);
        return (
          <li key={file._id} className="file-card">
            <div className="file-card__head">
              <FileIcon file={file} size="lg" />
              <FileActions file={file} {...actions} />
            </div>

            <p className="file-card__name" title={file.fileName}>
              {file.fileName}
            </p>

            <div className="file-card__meta">
              <span className={`badge-type badge-type--${meta.color}`}>
                {meta.badge}
              </span>
              <span className="text-meta">{formatBytes(file.size)}</span>
            </div>

            <span className="text-meta">{file.uploadTime || '—'}</span>
          </li>
        );
      })}
    </ul>
  );
}
