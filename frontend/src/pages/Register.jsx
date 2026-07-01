import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, CheckCircle, Copy, AlertTriangle, XCircle, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthSplitLayout from '../components/auth/AuthSplitLayout';

const RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: '1 uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: '1 lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: '1 number', test: (p) => /[0-9]/.test(p) },
  { label: '1 special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
  const { register: registerUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const password = watch('password', '');
  const passedRules = RULES.filter(r => r.test(password)).length;
  const strength = password.length === 0 ? 0 : Math.round((passedRules / RULES.length) * 100);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        logout();
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, logout, navigate]);

  const onSubmit = async (data) => {
    setServerError('');
    if (data.password !== data.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (passedRules < RULES.length) {
      toast.error('Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      return;
    }
    try {
      const res = await registerUser({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      });
      if (res.success) {
        setNewUser({
          id: res.user?.id,
          iqId: res.user?.id ? `IQ-${String(res.user.id).padStart(4, '0')}` : null,
          email: res.user?.email,
          name: res.user?.full_name,
          created: new Date().toLocaleString(),
        });
        setShowSuccess(true);
      } else {
        setServerError(res.message || 'Registration failed.');
      }
    } catch {
      setServerError('Unable to connect to the server. Please try again later.');
    }
  };

  if (showSuccess && newUser) {
    return (
      <AuthSplitLayout>
        <div className="text-center py-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(5,150,105,0.15)' }}>
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Welcome to SolarIQ!</h3>
          <p className="text-gray-400 text-sm mb-6">Your account has been created successfully.</p>

          <div className="rounded-xl p-5 mb-6 space-y-3 text-left" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Account ID</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-lg">{newUser.iqId}</span>
                <button onClick={() => { navigator.clipboard.writeText(newUser.iqId); toast.success('Copied!'); }} className="p-1 rounded hover:bg-white/5 transition-colors" style={{ color: 'var(--text-muted)' }}>
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Full Name</span>
              <span className="text-white font-medium">{newUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Email</span>
              <span className="text-white">{newUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Created</span>
              <span className="text-white">{newUser.created}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-2">Redirecting to sign in...</p>
          <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-[shrink_3s_ease-in-out_forwards]" style={{ width: '100%' }} />
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="mt-4 w-full py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all">
            Go to Sign In Now
          </button>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout>
      <div className="text-center mb-7">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400 text-sm">Register to start managing your solar energy data.</p>
      </div>

      {serverError && (
        <div className="mb-5 p-3 rounded-xl text-sm flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-300">
          <span className="mt-0.5 shrink-0">&#9888;</span>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <User className="h-4.5 w-4.5" />
            </div>
            <input type="text"
              className={`block w-full pl-11 pr-3 py-2.5 bg-[#0a0f16] border ${errors.full_name ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all`}
              placeholder="Your Full Name"
              {...register('full_name', { required: 'Full name is required' })}
            />
          </div>
          {errors.full_name && <p className="mt-1 text-xs text-red-400">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <input type="email"
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
            <input type={showPassword ? 'text' : 'password'}
              className={`block w-full pl-11 pr-11 py-2.5 bg-[#0a0f16] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                validate: {
                  hasUpper: v => /[A-Z]/.test(v) || 'Must contain an uppercase letter',
                  hasLower: v => /[a-z]/.test(v) || 'Must contain a lowercase letter',
                  hasNumber: v => /[0-9]/.test(v) || 'Must contain a number',
                  hasSpecial: v => /[^A-Za-z0-9]/.test(v) || 'Must contain a special character',
                }
              })}
            />
            <button type="button" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}

          {password.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      strength === 100 ? 'bg-emerald-500' : strength >= 60 ? 'bg-emerald-400' : strength >= 40 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <span className={`text-[10px] font-semibold ${
                  strength === 100 ? 'text-emerald-400' : strength >= 60 ? 'text-emerald-300' : strength >= 40 ? 'text-amber-300' : 'text-red-300'
                }`}>
                  {strength === 100 ? 'Strong' : strength >= 60 ? 'Good' : strength >= 40 ? 'Fair' : 'Weak'}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {RULES.map((rule, i) => {
                  const passed = rule.test(password);
                  return (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      {passed ? (
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-gray-600 shrink-0" />
                      )}
                      <span className={passed ? 'text-emerald-400/80' : 'text-gray-500'}>{rule.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <input type={showConfirmPassword ? 'text' : 'password'}
              className={`block w-full pl-11 pr-11 py-2.5 bg-[#0a0f16] border ${errors.confirm ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all`}
              placeholder="••••••••"
              {...register('confirm', {
                required: 'Please confirm your password',
                validate: val => val === password || 'Passwords do not match'
              })}
            />
            <button type="button" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
              {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {errors.confirm && <p className="mt-1 text-xs text-red-400">{errors.confirm.message}</p>}
        </div>

        <div className="flex items-start pt-1">
          <div className="flex items-center h-5">
            <input id="terms" type="checkbox"
              className="w-4 h-4 rounded border-gray-600 bg-[#0a0f16] text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 focus:border-emerald-500 transition-colors cursor-pointer"
              {...register('terms', { required: 'You must agree to the Terms of Service' })}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-400 cursor-pointer">
              I agree to the <a href="#" className="text-emerald-400 hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a>.
            </label>
            {errors.terms && <p className="mt-1 text-xs text-red-400">{errors.terms.message}</p>}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full mt-1 flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
          ) : (
            <span className="flex items-center relative z-10">
              Create Account <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
          Sign In
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
