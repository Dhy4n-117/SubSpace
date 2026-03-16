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
  Search,
  Menu,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const { signOut } = nhost.auth;

  const navItems = [
    { id: 'all', label: 'All Tasks', icon: LayoutGrid },
    { id: 'today', label: 'My Day', icon: Sun },
    { id: 'important', label: 'Important', icon: Star },
    { id: 'planned', label: 'Planned', icon: Calendar },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className="sidebar glass-nav"
      style={{ overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', marginBottom: '2rem', padding: '0 0.5rem' }}>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 color="white" size={24} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>TO-DO app</span>
            </motion.div>
          )}
          {isCollapsed && (
             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <CheckCircle2 color="white" size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isCollapsed && (
          <button className="btn-ghost btn-icon" onClick={() => setIsCollapsed(true)}>
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button 
          className="btn-ghost btn-icon" 
          style={{ margin: '0 auto 1.5rem auto' }}
          onClick={() => setIsCollapsed(false)}
        >
          <Menu size={24} />
        </button>
      )}

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => (
          <div 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={isCollapsed ? item.label : ''}
            style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
          >
            <item.icon size={20} />
            {!isCollapsed && <span style={{ fontWeight: '500' }}>{item.label}</span>}
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div 
          className="nav-item" 
          style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
          onClick={() => alert('Settings - Coming Soon')}
        >
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </div>
        <div 
          className="nav-item" 
          onClick={handleSignOut}
          style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Sign Out</span>}
        </div>
      </div>
    </motion.div>
  );
}

function Header({ searchQuery, setSearchQuery }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
      <div className="search-container">
        <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search your tasks..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-ghost btn-icon glass" onClick={() => alert('Notifications - No new alerts')}>
          <Bell size={20} />
        </button>
        <div 
          className="glass" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem 0.5rem 0.5rem', borderRadius: '100px', cursor: 'pointer' }}
          onClick={() => alert('Account Details - Coming Soon')}
        >
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <main className="main-content">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <TodoList activeTab={activeTab} searchQuery={searchQuery} />
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
