import React, { useState } from 'react';
import { NhostProvider, useAuthenticationStatus } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { nhost } from './constants';
import Auth from './components/Auth';
import TodoList from './components/TodoList';
import { 
  Sun, 
  Star, 
  Calendar, 
  User, 
  Hash, 
  LogOut, 
  LayoutGrid,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

function Sidebar({ activeTab, setActiveTab }) {
  const { signOut } = nhost.auth;

  const navItems = [
    { id: 'all', label: 'All Tasks', icon: LayoutGrid },
    { id: 'today', label: 'My Day', icon: Sun },
    { id: 'important', label: 'Important', icon: Star },
    { id: 'planned', label: 'Planned', icon: Calendar },
  ];

  return (
    <div className="sidebar glass-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Hash color="white" size={24} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>SubSpace</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => (
          <div 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} />
            <span style={{ fontWeight: '500' }}>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </div>
        <div className="nav-item" onClick={() => signOut()}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
      <div className="search-container">
        <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" className="search-input" placeholder="Search tasks, categories..." />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-ghost btn-icon glass">
          <Bell size={20} />
        </button>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem 0.5rem 0.5rem', borderRadius: '100px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--accent))' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Pro User</span>
        </div>
      </div>
    </header>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const [activeTab, setActiveTab] = useState('all');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-darker)' }}>
        <Loader2 className="animate-spin" color="var(--primary)" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="bg-mesh" />
        <Auth />
      </>
    );
  }

  return (
    <div className="app-layout">
      <div className="bg-mesh" />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header />
        <TodoList activeTab={activeTab} />
      </main>
    </div>
  );
}

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <AppContent />
      </NhostApolloProvider>
    </NhostProvider>
  );
}

const Loader2 = ({ className, color, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export default App;
