import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { profileApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Loader2, Save, Building2, Camera, Trash2, Bell, AlertTriangle } from 'lucide-react';
import TimeAgo from '../utils/TimeAgo';

const INSTALLATION_TYPES = [
  { value: 'homeowner', label: 'Homeowner' },
  { value: 'installer', label: 'Installer' },
  { value: 'other', label: 'Other' },
];

export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();

  useEffect(() => {
    if (user) reset({ full_name: user.full_name, email: user.email, phone: user.phone || '', installation_type: user.installation_type || 'homeowner' });
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await profileApi.update(data);
      if (res.success) {
        toast.success('Profile updated');
        if (res.data) {
          const currentUser = JSON.parse(localStorage.getItem('solariq_user') || '{}');
          localStorage.setItem('solariq_user', JSON.stringify({ ...currentUser, ...res.data }));
        }
      } else {
        toast.error(res.message || 'Update failed');
      }
    } catch { toast.error('Cannot connect to server.'); }
  };

  const resizeImage = (file, maxSize) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, size, size, 0, 0, maxSize, maxSize);
        canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', 0.85);
      };
      img.src = url;
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploading(true);
    setImgError(false);
    try {
      const resized = await resizeImage(file, 256);
      const res = await profileApi.uploadPhoto(resized);
      if (res.success) {
        toast.success('Photo updated');
        if (res.data) {
          const currentUser = JSON.parse(localStorage.getItem('solariq_user') || '{}');
          localStorage.setItem('solariq_user', JSON.stringify({ ...currentUser, ...res.data }));
        }
      } else toast.error(res.message || 'Upload failed');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handlePhotoRemove = async () => {
    try {
      const res = await profileApi.removePhoto();
      if (res.success) {
        toast.success('Photo removed');
        setImgError(false);
        if (res.data) {
          const currentUser = JSON.parse(localStorage.getItem('solariq_user') || '{}');
          localStorage.setItem('solariq_user', JSON.stringify({ ...currentUser, ...res.data }));
        }
      }
    } catch { toast.error('Failed to remove photo'); }
  };

  const avatarUrl = (user?.profile_image && !imgError)
    ? `${import.meta.env.VITE_API_URL || ''}${user.profile_image}`
    : null;
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold theme-text">Profile Settings</h1>
        <p className="theme-text-secondary mt-1">Manage your account, installation type, and preferences.</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: 'var(--accent-emerald-bg)', border: '2px solid var(--nav-active-border)' }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                  ) : (
                    <span style={{ color: 'var(--accent-emerald)' }}>{initials}</span>
                  )}
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-2 rounded-full shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: 'var(--accent-emerald)', color: 'white' }}>
                  <Camera className="w-4 h-4" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" className="hidden" onChange={handlePhotoUpload} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold theme-text">{user?.full_name}</h2>
                <p className="theme-text-muted text-sm">{user?.email}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: 'var(--accent-emerald)', backgroundColor: 'var(--accent-emerald-bg)', border: '1px solid var(--nav-active-border)' }}>{user?.role}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full theme-text-muted" style={{ backgroundColor: 'var(--badge-bg)', border: '1px solid var(--badge-border)' }}>ID: #{user?.id}</span>
                </div>
                {uploading && <p className="text-xs mt-2" style={{ color: 'var(--accent-emerald)' }}><Loader2 className="w-3 h-3 inline animate-spin mr-1" />Uploading...</p>}
              </div>
              {avatarUrl && (
                <button onClick={handlePhotoRemove} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--accent-red)' }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="px-6 sm:px-8 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs theme-text-muted">Joined</p>
              <p className="text-sm font-semibold theme-text capitalize">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '\u2014'}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs theme-text-muted">Last Login</p>
              <p className="text-sm font-semibold theme-text capitalize">{user?.last_login ? <TimeAgo date={user.last_login} /> : '\u2014'}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs theme-text-muted">Installation</p>
              <p className="text-sm font-semibold theme-text capitalize">{user?.installation_type || '\u2014'}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs theme-text-muted">Account</p>
              <p className="text-sm font-semibold theme-text capitalize">{user?.is_active ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <h2 className="text-lg font-bold theme-text mb-6">Personal Information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 theme-text-secondary">Full Name</label>
                <input type="text" className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500 transition-all" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} {...register('full_name', { required: 'Name is required' })} />
                {errors.full_name && <p className="mt-1 text-xs text-red-400">{errors.full_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 theme-text-secondary">Phone</label>
                <input type="text" className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500 transition-all" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="+92 300 0000000" {...register('phone')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 theme-text-muted">Email (read-only)</label>
              <input type="email" disabled value={user?.email || ''} className="w-full px-3 py-2.5 rounded-xl text-sm cursor-not-allowed" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-2 theme-text-secondary">
                <Building2 className="w-4 h-4" /> Installation Type
              </label>
              <select className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500 transition-all" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} {...register('installation_type')}>
                {INSTALLATION_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <p className="text-xs mt-1 theme-text-muted">Helps tailor predictions and recommendations for your setup.</p>
            </div>
            <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-60" style={{ background: 'var(--gradient-emerald)' }}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </div>

        <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <h2 className="text-lg font-bold theme-text mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 theme-text-muted" />
                <div><p className="text-sm font-medium theme-text">Notifications</p><p className="text-xs theme-text-muted">Push and email notifications</p></div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all opacity-50" style={{ backgroundColor: 'var(--accent-emerald)' }}></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 theme-text-muted" />
                <div><p className="text-sm font-medium theme-text">Email Alerts</p><p className="text-xs theme-text-muted">System alerts and reports</p></div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all opacity-50" style={{ backgroundColor: 'var(--accent-emerald)' }}></div>
              </label>
            </div>
            <p className="text-xs theme-text-muted italic">Preferences management coming in next update</p>
          </div>
        </div>
      </div>
    </div>
  );
}
