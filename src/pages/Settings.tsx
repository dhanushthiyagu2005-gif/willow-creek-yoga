import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Settings() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email ?? '');
      }
    };

    getUser();
  }, []);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (newPassword && newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const updateData: {
      email?: string;
      password?: string;
    } = {};

    if (email.trim()) {
      updateData.email = email.trim();
    }

    if (newPassword) {
      updateData.password = newPassword;
    }

    const { error } = await supabase.auth.updateUser(updateData);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setNewPassword('');
    setConfirmPassword('');

    setMessage(
      'Account updated successfully. If you changed your email, check your email inbox for a confirmation link.'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-semibold">
          Account Settings
        </h1>

        <p className="mb-8 text-gray-500">
          Update your admin email and password.
        </p>

        <form onSubmit={handleUpdateAccount} className="space-y-5">

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full rounded-lg border px-4 py-3 outline-none"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave empty if you don't want to change it"
              className="w-full rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Success */}
          {message && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Account'}
          </button>

        </form>
      </div>
    </div>
  );
}