import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flower2, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Spinner } from '@/components/ui/Feedback';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = async () => {
  if (!email) {
    setError('Please enter your email address first.');
    return;
  }

  setError('');
  setLoading(true);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  setLoading(false);

  if (error) {
    setError(error.message);
  } else {
    setError('Password reset email sent. Please check your email.');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-cream to-sand-50 px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <Flower2 className="text-sage-600" size={32} />
            <span className="text-2xl font-serif font-semibold text-sage-700">Willow Creek</span>
          </Link>
          <h1 className="text-3xl text-ink mb-2">Welcome back</h1>
          <p className="text-ink/50">Sign in to manage your bookings and classes</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-clay-50 text-clay-700 text-sm rounded-xl px-4 py-3 border border-clay-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="text-right">
  <Link
    to="/forgot-password"
    className="text-sm text-sage-600 hover:text-sage-700"
  >
    Forgot Password?
  </Link>
</div>   
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? <Spinner size={18} /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-ink/50 mt-6">
            New to Willow Creek?{' '}
            <Link to="/signup" className="text-sage-600 font-medium hover:text-sage-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
