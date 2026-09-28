import {
  FileArchive,
  FileCode2,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType2,
  File as GenericFile,
} from 'lucide-react';
import { getFileKind } from '../../utilities/fileHelpers';

const ICONS = {
  pdf: FileType2,
  doc: FileText,
  xls: FileSpreadsheet,
  ppt: FileText,
  img: FileImage,
  html: FileCode2,
  zip: FileArchive,
  other: GenericFile,
};

export default function FileIcon({ file, size = 'md' }) {
  const kind = getFileKind(file);
  const Icon = ICONS[kind];

  return (
    <span
      className={`file-icon file-icon--${kind} file-icon--${size}`}
      aria-hidden="true"
    >
      <Icon size={size === 'lg' ? 26 : 18} />
    </span>
  );
}
