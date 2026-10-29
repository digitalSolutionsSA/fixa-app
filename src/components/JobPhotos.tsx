import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getJobPhotoUrls } from '../lib/jobPhotos';

/** Thumbnails of a job's photos; tap one to view it full screen. */
export const JobPhotos: React.FC<{ paths?: string[] | null; size?: number }> = ({ paths, size = 72 }) => {
  const [urls, setUrls] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const key = (paths || []).join('|');

  useEffect(() => {
    if (!paths?.length) { setUrls([]); return; }
    getJobPhotoUrls(paths).then(setUrls);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!urls.length) return null;

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {urls.map((u) => (
          <button key={u} onClick={(e) => { e.stopPropagation(); setOpen(u); }}
            style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}>
            <img src={u} alt="Job photo" style={{ width: size, height: size, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', display: 'block' }} />
          </button>
        ))}
      </div>
      {open && (
        <div onClick={() => setOpen(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <img src={open} alt="Job photo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={() => setOpen(null)} aria-label="Close"
            style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top) + 12px)', right: 16, width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={22} color="white" />
          </button>
        </div>
      )}
    </>
  );
};
