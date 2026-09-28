/* ==========================================================================
   File helpers — type detection, size formatting, stats.
   Written defensively because the backend may send `size` as a number of
   bytes OR as an already-formatted string ("327.74 KB").
   ========================================================================== */

const UNIT_MULTIPLIER = {
  b: 1,
  kb: 1024,
  mb: 1024 ** 2,
  gb: 1024 ** 3,
  tb: 1024 ** 4,
};

/** Normalise whatever the API sends into a number of bytes, or null. */
export function parseSize(size) {
  if (size == null || size === '') return null;
  if (typeof size === 'number' && Number.isFinite(size)) return size;

  const str = String(size).trim();

  if (/^\d+(\.\d+)?$/.test(str)) return Number(str);

  const match = str.match(/^([\d.]+)\s*(B|KB|MB|GB|TB|bytes)$/i);
  if (match) {
    const unit = match[2].toLowerCase() === 'bytes' ? 'b' : match[2].toLowerCase();
    return parseFloat(match[1]) * (UNIT_MULTIPLIER[unit] || 1);
  }

  return null;
}

export function formatBytes(bytes, fallback = 'N/A') {
  const value = parseSize(bytes);
  if (value == null) return fallback;
  if (value === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const scaled = value / 1024 ** i;

  return `${scaled.toFixed(i === 0 ? 0 : scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2)} ${units[i]}`;
}

/* --- Type detection ----------------------------------------------------- */

const EXTENSION_KIND = {
  pdf: 'pdf',
  doc: 'doc',
  docx: 'doc',
  txt: 'doc',
  rtf: 'doc',
  odt: 'doc',
  xls: 'xls',
  xlsx: 'xls',
  csv: 'xls',
  ppt: 'ppt',
  pptx: 'ppt',
  png: 'img',
  jpg: 'img',
  jpeg: 'img',
  gif: 'img',
  webp: 'img',
  svg: 'img',
  bmp: 'img',
  avif: 'img',
  html: 'html',
  htm: 'html',
  zip: 'zip',
  rar: 'zip',
  '7z': 'zip',
  tar: 'zip',
  gz: 'zip',
};

export const KIND_META = {
  pdf: { badge: 'PDF', label: 'PDF document', color: 'pdf' },
  doc: { badge: 'DOC', label: 'Document', color: 'doc' },
  xls: { badge: 'XLS', label: 'Spreadsheet', color: 'xls' },
  ppt: { badge: 'PPT', label: 'Presentation', color: 'zip' },
  img: { badge: 'IMG', label: 'Image', color: 'img' },
  html: { badge: 'HTML', label: 'Web page', color: 'img' },
  zip: { badge: 'ZIP', label: 'Archive', color: 'zip' },
  other: { badge: 'FILE', label: 'File', color: 'other' },
};

/** Returns 'pdf' | 'doc' | 'xls' | 'ppt' | 'img' | 'html' | 'zip' | 'other' */
export function getFileKind(file) {
  const mime = (file?.contentType || file?.mimetype || '').toLowerCase();
  const ext = (file?.fileName || '').split('.').pop().toLowerCase();

  if (mime.startsWith('image/')) return 'img';
  if (mime === 'application/pdf') return 'pdf';
  if (mime === 'text/html') return 'html';
  if (mime.includes('spreadsheet') || mime.includes('excel') || mime === 'text/csv')
    return 'xls';
  if (mime.includes('presentation') || mime.includes('powerpoint')) return 'ppt';
  if (mime.includes('word') || mime === 'text/plain' || mime.includes('document'))
    return 'doc';
  if (mime.includes('zip') || mime.includes('compressed') || mime.includes('tar'))
    return 'zip';

  return EXTENSION_KIND[ext] || 'other';
}

export function getFileMeta(file) {
  return KIND_META[getFileKind(file)];
}

/** Maps a sidebar/tab category to the file kinds it contains. */
const CATEGORY_KINDS = {
  all: null,
  pictures: ['img'],
  pdf: ['pdf'],
  docs: ['doc'],
  excel: ['xls'],
};

export function matchesCategory(file, category) {
  const kinds = CATEGORY_KINDS[category];
  if (!kinds) return true;
  return kinds.includes(getFileKind(file));
}

/* --- Dates -------------------------------------------------------------- */

/** Safely pull a Date out of whatever date-ish field the record carries. */
export function getUploadDate(file) {
  const raw = file?.uploadedAt || file?.uploadTime || file?.createdAt;
  if (!raw) return null;
  const date = raw instanceof Date ? raw : new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

/* --- Stats -------------------------------------------------------------- */

export function buildStats(files = []) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let totalBytes = 0;
  let uploadsThisMonth = 0;
  const byKind = {};

  files.forEach((file) => {
    const bytes = parseSize(file.size);
    if (bytes != null) totalBytes += bytes;

    const date = getUploadDate(file);
    if (date && date >= monthStart) uploadsThisMonth += 1;

    const kind = getFileKind(file);
    byKind[kind] = (byKind[kind] || 0) + 1;
  });

  const topKinds = Object.entries(byKind)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([kind, count]) => ({
      kind,
      count,
      badge: KIND_META[kind].badge,
    }));

  return {
    totalFiles: files.length,
    totalBytes,
    uploadsThisMonth,
    topKinds,
  };
}

export function countsByCategory(files = []) {
  return {
    all: files.length,
    pictures: files.filter((f) => getFileKind(f) === 'img').length,
    pdf: files.filter((f) => getFileKind(f) === 'pdf').length,
    docs: files.filter((f) => getFileKind(f) === 'doc').length,
    excel: files.filter((f) => getFileKind(f) === 'xls').length,
  };
}
