import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, Loader2, Camera, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ConsumerNav, RatingStars, Avt } from '../../components/Shared';
import { supabase } from '../../lib/supabase';
import { createJob } from '../../lib/jobs';
import { getJobTypesForTrade } from '../../lib/jobTypes';
import { MAX_JOB_PHOTOS, uploadJobPhoto, deleteJobPhotos } from '../../lib/jobPhotos';
import { inputStyle, labelStyle } from '../provider/constants';

type PickedPhoto = { file: File; preview: string };

export const BookJobScreen: React.FC = () => {
  const { navigate, selectedProvider, currentUser, isDemo } = useApp();

  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const p = selectedProvider;
  const jobTypes = getJobTypesForTrade(p?.trade);

  // Free the preview object URLs when leaving the screen
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((ph) => URL.revokeObjectURL(ph.preview)), []);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const room = MAX_JOB_PHOTOS - photos.length;
    const picked = Array.from(files).filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
    if (picked.length > room) setError(`You can add up to ${MAX_JOB_PHOTOS} photos.`);
    else setError('');
    setPhotos((prev) => [...prev, ...picked.slice(0, room).map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
  };

  const removePhoto = (i: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  // Pre-fill location from profile
  useEffect(() => {
    if (currentUser?.id && !isDemo) {
      supabase
        .from('profiles')
        .select('area')
        .eq('id', currentUser.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.area) setLocation(data.area);
        });
    }
  }, [currentUser?.id, isDemo]);

  const handleSubmit = async () => {
    setError('');

    if (!jobTitle) { setError('Please select a job type.'); return; }
    if (!location.trim()) { setError('Please enter your location.'); return; }
    if (!p) { setError('No provider selected.'); return; }
    if (!currentUser) { setError('You must be logged in.'); return; }

    if (isDemo) {
      setDone(true);
      setTimeout(() => navigate('consumer-bookings'), 1800);
      return;
    }

    setSubmitting(true);

    let photoPaths: string[] = [];
    try {
      photoPaths = await Promise.all(photos.map((ph) => uploadJobPhoto(currentUser.id, ph.file)));
    } catch (e: any) {
      setSubmitting(false);
      setError(`Couldn't upload your photos: ${e?.message || 'please try again.'}`);
      return;
    }

    const { error: jobError } = await createJob({
      consumer_id:    currentUser.id,
      provider_id:    p.id,
      consumer_name:  currentUser.name,
      provider_name:  p.name,
      provider_trade: p.trade,
      title:          jobTitle,
      description:    description.trim(),
      location:       location.trim(),
      price:          p.priceFrom,
      ...(photoPaths.length ? { photos: photoPaths } : {}),
    });
    setSubmitting(false);

    if (jobError) {
      deleteJobPhotos(photoPaths);
      setError(jobError);
      return;
    }

    setDone(true);
    setTimeout(() => navigate('consumer-bookings'), 1800);
  };

  if (!p) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppHeader title="Request a Job" back="find-provider" />
        <div className="screen"><div className="screen-content">
          <div className="empty-state">
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>No provider selected.</div>
            <button className="btn btn-primary" onClick={() => navigate('find-provider')}>Find a Provider</button>
          </div>
        </div></div>
        <ConsumerNav />
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppHeader title="Request a Job" back="find-provider" />
        <div className="screen"><div className="screen-content">
          <div className="empty-state scale-pop" style={{ minHeight: 340 }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={50} color="var(--green)" />
            </div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22 }}>Request Sent!</div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 280 }}>
              {p.name} will review your request and accept or decline shortly.
            </div>
          </div>
        </div></div>
        <ConsumerNav />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Request a Job" back="find-provider" />

      <div className="screen">
        <div className="screen-content">

          {/* Provider summary */}
          <div className="card animate-in" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avt initials={p.initials} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{p.trade}</div>
              {p.rating > 0 && <RatingStars rating={p.rating} size={12} />}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 20 }}>R{p.priceFrom}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>call-out rate</div>
            </div>
          </div>

          {/* Job type */}
          <div className="card d1 animate-in">
            <label style={labelStyle}>What do you need? *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setJobTitle(type)}
                  style={{
                    padding: '7px 14px', borderRadius: 20, fontSize: 13,
                    fontFamily: 'var(--font-head)', fontWeight: 600, cursor: 'pointer',
                    border: jobTitle === type ? '2px solid var(--teal)' : '1.5px solid var(--border)',
                    background: jobTitle === type ? 'var(--teal-light)' : 'var(--card)',
                    color: jobTitle === type ? 'var(--teal)' : 'var(--text-secondary)',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card d2 animate-in">
            <label style={labelStyle}>Describe the problem (optional)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
              placeholder="E.g. Bathroom sink has been dripping for 3 days…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label style={{ ...labelStyle, marginTop: 14 }}>Add photos (optional, up to {MAX_JOB_PHOTOS})</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {photos.map((ph, i) => (
                <div key={ph.preview} style={{ position: 'relative', width: 76, height: 76 }}>
                  <img src={ph.preview} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border)' }} />
                  <button
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                    style={{ position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: '50%', border: '2px solid white', background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={13} color="white" />
                  </button>
                </div>
              ))}
              {photos.length < MAX_JOB_PHOTOS && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: 76, height: 76, borderRadius: 12, border: '1.5px dashed var(--teal)', background: 'var(--teal-light)', color: 'var(--teal)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 11 }}
                >
                  <Camera size={22} />
                  Add
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => { addPhotos(e.target.files); e.target.value = ''; }}
            />
          </div>

          {/* Location */}
          <div className="card d3 animate-in">
            <label style={labelStyle}>Your location *</label>
            <input
              style={inputStyle}
              placeholder="e.g. 12 Oak Street, Vanderbijlpark"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Price note */}
          <div className="card d4 animate-in" style={{ background: 'var(--teal-light)', border: '1px solid rgba(0,168,150,0.2)' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--teal)', marginBottom: 4 }}>
              In-App Payment Only
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The R{p.priceFrom} call-out rate is the minimum. Final price is agreed between you and the provider. Payment is processed through FIXA — never pay cash.
            </div>
          </div>

          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 13, color: '#B91C1C' }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ gap: 10 }}
          >
            {submitting
              ? <><Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> {photos.length ? 'Uploading photos…' : 'Sending…'}</>
              : 'Send Job Request'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            The provider will accept or decline within their response window. You won't be charged until the job is completed.
          </p>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ConsumerNav />
    </div>
  );
};
