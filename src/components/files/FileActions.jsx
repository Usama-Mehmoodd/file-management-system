import { Dropdown } from 'react-bootstrap';
import { Download, Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';

export default function FileActions({ file, onPreview, onDownload, onEdit, onDelete }) {
  return (
    <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
      <Dropdown.Toggle
        as="button"
        type="button"
        bsPrefix="ui-icon-btn"
        className="ui-icon-btn file-actions__trigger"
        aria-label={`Actions for ${file.fileName}`}
      >
        <MoreVertical size={18} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {onPreview && (
          <Dropdown.Item as="button" type="button" onClick={() => onPreview(file)}>
            <Eye size={16} className="me-2" aria-hidden="true" />
            Preview
          </Dropdown.Item>
        )}
        {onDownload && (
          <Dropdown.Item as="button" type="button" onClick={() => onDownload(file)}>
            <Download size={16} className="me-2" aria-hidden="true" />
            Download
          </Dropdown.Item>
        )}
        <Dropdown.Item as="button" type="button" onClick={() => onEdit(file)}>
          <Pencil size={16} className="me-2" aria-hidden="true" />
          Rename
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          as="button"
          type="button"
          className="dropdown-item--danger"
          onClick={() => onDelete(file)}
        >
          <Trash2 size={16} className="me-2" aria-hidden="true" />
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
