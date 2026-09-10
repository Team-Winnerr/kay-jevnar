import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { UserRole, UserProfile } from '../types';

interface BiteJoyAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const BiteJoyAuthModal: React.FC<BiteJoyAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      let loggedProfile: UserProfile;
      if (isRegister) {
        loggedProfile = await registerUser(name, email, password, role, rollNumber);
      } else {
        loggedProfile = await loginUser(email, password);
      }
      onSuccess(loggedProfile);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole: UserRole) => {
    setLoading(true);
    setError('');
    const demoEmail = demoRole === 'admin' ? 'admin@kayjevnar.edu' : 'student@kayjevnar.edu';
    const demoPass = 'Pass123!';
    try {
      let loggedProfile: UserProfile;
      try {
        loggedProfile = await loginUser(demoEmail, demoPass);
      } catch (e) {
        loggedProfile = await registerUser(
          demoRole === 'admin' ? 'Kitchen Head' : 'Campus Student',
          demoEmail,
          demoPass,
          demoRole,
          demoRole === 'student' ? '2026CS101' : undefined
        );
      }
      onSuccess(loggedProfile);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-modal-backdrop" style={{ justifyContent: 'center', alignItems: 'center' }} onClick={onClose}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '440px',
          borderRadius: '28px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#9CA3AF' }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="/logo.png"
            alt="काय Jevnar?"
            style={{ height: '54px', maxWidth: '220px', objectFit: 'contain', margin: '0 auto 10px', display: 'block' }}
          />
          <h3 style={{ margin: '4px 0', fontSize: '22px', fontWeight: '900', color: '#161616' }}>
            {isRegister
              ? 'Create Account'
              : (role === 'admin' ? 'Canteen Admin Portal' : 'Welcome to काय Jevnar')}
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#78716C' }}>
            {isRegister
              ? 'Join to skip long canteen queues'
              : (role === 'admin' ? 'Sign in to access KDS & inventory controls' : 'Sign in to place campus orders')}
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>
            {error}
          </div>
        )}

        {/* Role Picker (Always visible for both Sign In and Register) */}
        <div style={{ display: 'flex', background: '#F5F5F5', borderRadius: '14px', padding: '4px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => {
              setRole('student');
              if (email === 'admin@kayjevnar.edu') {
                setEmail('');
                setPassword('');
              }
            }}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              background: role === 'student' ? '#FFFFFF' : 'transparent',
              color: role === 'student' ? '#161616' : '#78716C',
              boxShadow: role === 'student' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🎓 Student
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('admin');
              if (!email) {
                setEmail('admin@kayjevnar.edu');
                setPassword('Pass123!');
              }
            }}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              background: role === 'admin' ? '#FFFFFF' : 'transparent',
              color: role === 'admin' ? '#161616' : '#78716C',
              boxShadow: role === 'admin' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            👨‍🍳 Canteen Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #EBE6DF', fontSize: '14px', outline: 'none' }}
              />
              {role === 'student' && (
                <input
                  type="text"
                  placeholder="Roll Number / Student ID"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  style={{ padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #EBE6DF', fontSize: '14px', outline: 'none' }}
                />
              )}
            </>
          )}

          <input
            type="email"
            placeholder="College Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #EBE6DF', fontSize: '14px', outline: 'none' }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #EBE6DF', fontSize: '14px', outline: 'none' }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#FF5B22', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '900', fontSize: '15px', cursor: 'pointer', marginTop: '8px' }}
          >
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#FF5B22', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
          </button>
        </div>
      </div>
    </div>
  );
};
