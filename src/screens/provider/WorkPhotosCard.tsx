import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { MAX_WORK_PHOTOS, addWorkPhoto, removeWorkPhoto, workPhotoUrl } from '../../lib/workPhotos';

/** "Previous Work" portfolio editor on the provider's Edit Profile page. Saves immediately. */
export const WorkPhotosCard: React.FC<{ providerId?: string | null }> = ({ providerId }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isReal = !!providerId && !providerId.startsWith('demo-');

  useEffect(() => {
    if (!isReal) return;
    supabase.from('profiles').select('work_photos').eq('id', providerId).maybeSingle()
      .then(({ data }) => setPaths((data?.work_photos as string[]) || []));
  }, [providerId, isReal]);

  const onPick = async (files: FileList | null) => {
    if (!files || !isReal) return;
    setError('');
    const room = MAX_WORK_PHOTOS - paths.length;
    const picked = Array.from(files).slice(0, room);
    if (files.length > room) setError(`You can show up to ${MAX_WORK_PHOTOS} photos.`);
    setBusy(true);
    let current = paths;
    try {
      for (const f of picked) {
        current = await addWorkPhoto(providerId!, current, f);
        setPaths(current);
      }
    } catch (e: any) {
      setError(`Couldn't upload: ${e?.message || 'please try again.'}`);
    } finally {
      setBusy(false);
    }
  };

  const onRemove = async (path: string) => {
    setBusy(true);
    setError('');
    try {
      setPaths(await removeWorkPhoto(providerId!, paths, path));
    } catch (e: any) {
      setError(`Couldn't remove: ${e?.message || 'please try again.'}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>Previous Work</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
        Show customers up to {MAX_WORK_PHOTOS} photos of jobs you've done. They appear when customers tap your profile.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
        {paths.map((p) => (
          <div key={p} style={{ position: 'relative', aspectRatio: '1' }}>
            <img src={workPhotoUrl(p)} alt="Previous work" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border)' }} />
            <button
              type="button"
              onClick={() => onRemove(p)}
              disabled={busy}
              aria-label="Remove photo"
              style={{ position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: '50%', border: '2px solid white', background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
            >
              <X size={13} color="white" />
            </button>
          </div>
        ))}
        {paths.length < MAX_WORK_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy || !isReal}
            style={{ aspectRatio: '1', borderRadius: 12, border: '1.5px dashed var(--teal)', background: 'var(--teal-light)', color: 'var(--teal)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 12 }}
          >
            {busy ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={22} />}
            {busy ? 'Saving…' : 'Add photo'}
          </button>
        )}
      </div>

      {error && <div style={{ fontSize: 12, color: 'var(--red-panic)', marginTop: 10 }}>{error}</div>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => { onPick(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
};
