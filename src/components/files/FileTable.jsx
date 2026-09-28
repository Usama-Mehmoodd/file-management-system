import FileActions from './FileActions';
import FileIcon from './FileIcon';
import { formatBytes, getFileMeta } from '../../utilities/fileHelpers';

export default function FileTable({ files, actions }) {
  return (
    <div className="file-table-wrap">
      <table className="file-table">
        <caption className="visually-hidden">Your uploaded files</caption>
        <thead>
          <tr>
            <th scope="col">File</th>
            <th scope="col">Type</th>
            <th scope="col">Size</th>
            <th scope="col">Uploaded</th>
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const meta = getFileMeta(file);
            return (
              <tr key={file._id}>
                <td>
                  <div className="file-cell">
                    <FileIcon file={file} />
                    <div className="file-cell__text">
                      <span className="file-cell__name" title={file.fileName}>
                        {file.fileName}
                      </span>
                      <span className="file-cell__sub">{meta.label}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge-type badge-type--${meta.color}`}>
                    {meta.badge}
                  </span>
                </td>
                <td className="file-table__muted">{formatBytes(file.size)}</td>
                <td className="file-table__muted">{file.uploadTime || '—'}</td>
                <td className="file-table__actions">
                  <FileActions file={file} {...actions} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
