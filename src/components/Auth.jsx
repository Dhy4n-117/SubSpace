import React, { useState } from 'react';
import { useSignUpEmailPassword, useSignInEmailPassword } from '@nhost/react';
import { LogIn, UserPlus, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUpEmailPassword, isLoading: isSignUpLoading, error: signUpError } = useSignUpEmailPassword();
  const { signInEmailPassword, isLoading: isSignInLoading, error: signInError } = useSignInEmailPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await signInEmailPassword(email, password);
    } else {
      await signUpEmailPassword(email, password);
    }
  };

  const error = isLogin ? signInError : signUpError;
  const isLoading = isLogin ? isSignInLoading : isSignUpLoading;

  return (
    <div style={{ 
      display: 'flex', minHeight: '100vh', alignItems: 'center', 
      justifyContent: 'center', padding: '1rem', position: 'relative',
      overflow: 'hidden'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass" 
        style={{ width: '100%', maxWidth: '440px', padding: '3.5rem 3rem', borderRadius: '32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            style={{ 
              width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              borderRadius: '22px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 1.5rem',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Sparkles size={40} color="white" />
          </motion.div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
            {isLogin ? 'Welcome Back' : 'Join SubSpace'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            {isLogin ? 'Enter your details to access your dashboard' : 'Start organizing your life, beautifully.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="search-input" 
                placeholder="name@example.com"
                style={{ maxWidth: 'none', paddingLeft: '3.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="search-input" 
                placeholder="••••••••"
                style={{ maxWidth: 'none', paddingLeft: '3.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', 
                  color: '#f87171', padding: '1rem', borderRadius: '12px', 
                  fontSize: '0.875rem', textAlign: 'center'
                }}
              >
                {error.message}
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.1rem', justifyContent: 'center' }} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
            <span style={{ fontSize: '1.1rem' }}>{isLogin ? 'Sign In' : 'Sign Up'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button 
            className="btn btn-ghost" 
            style={{ fontSize: '0.95rem', width: '100%', justifyContent: 'center' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
