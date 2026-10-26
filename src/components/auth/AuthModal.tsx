import React, { useState } from 'react';
import { Mail, Lock, User, Phone, X, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email || !email.includes('@')) {
      errs.email = 'Please provide a valid email address';
    }
    if (mode === 'login' || mode === 'register') {
      if (!password || password.length < 6) {
        errs.password = 'Password must be at least 6 characters';
      }
    }
    if (mode === 'register') {
      if (!name.trim()) {
        errs.name = 'Full name is required';
      }
      if (!phone || phone.length < 10) {
        errs.phone = 'Valid phone number required (e.g. 08034567890)';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'login') {
        login(email);
      } else if (mode === 'register') {
        register(name, email, phone);
      } else if (mode === 'forgot') {
        setForgotSent(true);
        showToast('Password reset link sent to your email');
      }
    }, 700);
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      login('google.user@example.com', 'Google User');
      showToast('Signed in securely with Google');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF9F3] border border-stone-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white border-b border-stone-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
              <span>Crave with Vee Account</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#222222] font-display mt-0.5">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {mode === 'forgot' && forgotSent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F7EE] text-[#2E9D63] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#222222]">Check Your Email</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                We sent password recovery instructions to <span className="font-semibold text-stone-700">{email}</span>.
              </p>
              <button
                onClick={() => {
                  setForgotSent(false);
                  setMode('login');
                }}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#222222] text-white text-xs font-bold hover:bg-[#333333] transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="e.g. Babatunde Adeleke"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all ${
                        errors.name ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all ${
                      errors.email ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (Nigeria)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      placeholder="+234 803 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all ${
                        errors.phone ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
              )}

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] font-semibold text-[#FF6B35] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all ${
                        errors.password ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] text-white text-sm font-bold shadow-md shadow-[#FF6B35]/20 flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In to Crave with Vee'}
                      {mode === 'register' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Link'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Social login & Guest */}
              {mode !== 'forgot' && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-stone-200" />
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                      <span className="bg-[#FFF9F3] px-3 text-stone-400 font-semibold">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors mt-2"
                  >
                    Continue browsing as guest
                  </button>
                </>
              )}
            </form>
          )}

          {/* Footer toggle */}
          <div className="mt-5 pt-4 border-t border-stone-200/80 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-stone-500">
                Don’t have an account yet?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="font-bold text-[#FF6B35] hover:underline"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-500">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-[#FF6B35] hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E9D63]" />
            <span>End-to-end encrypted session & authentic customer protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
