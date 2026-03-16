import React from 'react';
import { NhostProvider, useAuthenticationStatus } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { ApolloProvider } from '@apollo/client';
import { nhost } from './constants';
import Auth from './components/Auth';
import TodoList from './components/TodoList';
import './index.css';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="btn-primary" style={{ padding: '1rem', borderRadius: '50%', width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {!isAuthenticated ? <Auth /> : <TodoList />}
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

export default App;
