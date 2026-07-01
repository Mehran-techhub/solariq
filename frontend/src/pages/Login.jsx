import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthSplitLayout from '../components/auth/AuthSplitLayout';

export default function Login() {
  const { login, forgotPassword, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { register: registerReset, handleSubmit: handleResetSubmit, formState: { errors: resetErrors, isSubmitting: isResetSubmitting } } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const res = await login(data.email, data.password);
      if (res.success) {
        const name = res.user?.full_name?.split(' ')[0] || 'User';
        toast.success(`Welcome back, ${name}!`);
        if (res.user?.role === 'admin') navigate('/admin/dashboard');
        else navigate('/dashboard');
      } else {
        setServerError(res.message || 'Invalid email or password.');
      }
    } catch {
      setServerError('Unable to connect to the server. Please try again later.');
    }
  };

  const onForgotPassword = async (data) => {
    setServerError('');
    try {
      const res = await forgotPassword(data.email);
      if (res.success) {
        toast.success(res.message || 'If an account exists, reset instructions were sent.');
        reset({ email: data.email });
        setShowReset(false);
      } else {
        setServerError(res.message || 'Unable to request a reset link.');
      }
    } catch {
      setServerError('Unable to request a reset link.');
    }
  };

  useEffect(() => {
    if (!googleClientId) return;
    if (document.getElementById('google-gsi-script')) return;
    const s = document.createElement('script');
    s.id = 'google-gsi-script';
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    document.body.appendChild(s);
  }, [googleClientId]);

  const handleGoogleSignIn = () => {
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            const res = await googleLogin({ email: payload.email, full_name: payload.name || payload.email?.split('@')[0] || 'Google User' });
            if (res.success) {
              toast.success('Signed in with Google!');
              if (res.user?.role === 'admin') navigate('/admin/dashboard');
              else navigate('/dashboard');
            } else toast.error(res.message || 'Google sign-in failed');
          } catch { toast.error('Google sign-in could not be completed.'); }
        },
      });
      window.google.accounts.id.prompt();
      return;
    }
    setShowGoogleModal(true);
  };

  const doGoogleLogin = async () => {
    if (!googleEmail.trim()) { toast.error('Enter your Google email'); return; }
    setGoogleLoading(true);
    try {
      const name = googleEmail.split('@')[0].replace(/[._]/g, ' ');
      const res = await googleLogin({ email: googleEmail.trim().toLowerCase(), full_name: name });
      if (res.success) {
        toast.success('Signed in with Google!');
        setShowGoogleModal(false);
        if (res.user?.role === 'admin') navigate('/admin/dashboard');
        else navigate('/dashboard');
      } else toast.error(res.message || 'Google sign-in failed');
    } catch { toast.error('Google sign-in could not be completed.'); }
    finally { setGoogleLoading(false); }
  };

  return (
    <AuthSplitLayout>
      <div className="text-center mb-7">
        <h2 className="text-3xl font-bold text-white mb-2">{showReset ? 'Reset Password' : 'Sign In'}</h2>
        <p className="text-gray-400 text-sm">
          {showReset ? 'Enter your email to receive reset instructions.' : 'Access your solar energy dashboard.'}
        </p>
      </div>

      {serverError && (
        <div className="mb-5 p-3 rounded-xl text-sm flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-300">
          <span className="mt-0.5 shrink-0">&#9888;</span>
          <span>{serverError}</span>
        </div>
      )}

      {!showReset ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                className={`block w-full pl-11 pr-3 py-2.5 bg-[#0a0f16] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all`}
                placeholder="Enter your Email here"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email address' }
                })}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`block w-full pl-11 pr-11 py-2.5 bg-[#0a0f16] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all`}
                placeholder="Enter your Password here"
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <input id="remember_me" type="checkbox" className="h-4 w-4 rounded border-gray-600 bg-[#0a0f16] text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 focus:border-emerald-500 transition-colors cursor-pointer" {...register('remember')} />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                Remember me
              </label>
            </div>
            <button type="button" onClick={() => { setShowReset(true); setServerError(''); }} className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            ) : (
              <span className="flex items-center relative z-10">
                Sign In <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit(onForgotPassword)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                className={`block w-full pl-11 pr-3 py-2.5 bg-[#0a0f16] border ${resetErrors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all`}
                placeholder="Enter your Email here"
                {...registerReset('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email address' }
                })}
              />
            </div>
            {resetErrors.email && <p className="mt-1 text-xs text-red-400">{resetErrors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isResetSubmitting}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all relative group overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isResetSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            ) : (
              <span className="relative z-10">Send Reset Link</span>
            )}
          </button>

          <div className="text-center pt-1">
            <button type="button" onClick={() => { setShowReset(false); setServerError(''); }} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Back to sign in
            </button>
          </div>
        </form>
      )}

      {!showReset && (
        <>
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#111823] text-gray-500">Or sign in with</span>
            </div>
          </div>
          <div className="mt-6">
            <button type="button" onClick={handleGoogleSignIn}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-white/10 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>
        </>
      )}

      <p className="mt-6 text-center text-sm text-gray-400">
        {showReset ? '' : <>Don't have an account?{' '}</>}
        {!showReset && (
          <Link to="/register" className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
            Create Account
          </Link>
        )}
      </p>

      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-md rounded-2xl border p-6 relative" style={{ backgroundColor: '#111823', borderColor: 'rgba(255,255,255,0.1)' }}>
            <button onClick={() => setShowGoogleModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2">Google Sign-In</h3>
            <p className="text-sm text-gray-400 mb-5">Enter your Google email to sign in or create an account.</p>
            <input type="email" value={googleEmail} onChange={(e) => setGoogleEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0a0f16] text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowGoogleModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-300 border border-white/10 hover:bg-white/5 transition-all"
              >Cancel</button>
              <button onClick={doGoogleLogin} disabled={googleLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >{googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}</button>
            </div>
          </div>
        </div>
      )}
    </AuthSplitLayout>
  );
}
