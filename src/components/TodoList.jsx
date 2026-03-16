import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useSignOut } from '@nhost/react';
import { GET_TODOS, ADD_TODO, TOGGLE_TODO, DELETE_TODO, nhost } from '../constants';
import { LogOut, Plus, CheckCircle2, Circle, Trash2, ListTodo, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TodoList = () => {
  const [newTodo, setNewTodo] = useState('');
  const { data, loading, error } = useQuery(GET_TODOS);
  const { signOut } = useSignOut();

  const [addTodo, { loading: isAdding }] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_TODOS }]
  });

  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }]
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await addTodo({ variables: { title: newTodo } });
    setNewTodo('');
  };

  const user = nhost.auth.getUser();

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="glass" style={{ padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
            <ListTodo size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Subspace Tasks</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Organize your day, beautifully.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right', display: 'none' /* Hidden on mobile */ }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user?.email}</p>
          </div>
          <button onClick={signOut} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Input Section */}
      <form onSubmit={handleAdd} className="glass" style={{ 
        padding: '0.5rem', borderRadius: '16px', display: 'flex', gap: '0.5rem', 
        marginBottom: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
      }}>
        <input 
          type="text" 
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="input-field"
          style={{ flex: 1, border: 'none', background: 'transparent', boxShadow: 'none' }}
        />
        <button type="submit" className="btn btn-primary" disabled={isAdding || !newTodo.trim()}>
          {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          <span>Add</span>
        </button>
      </form>

      {/* Todo List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : error ? (
          <div style={{ color: '#f87171', textAlign: 'center', padding: '2rem' }}>Error loading tasks.</div>
        ) : data?.todos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <p>No tasks yet. Start by adding one above!</p>
          </div>
        ) : (
          <AnimatePresence>
            {data.todos.map((todo) => (
              <motion.div 
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-morphism"
                style={{ 
                  padding: '1rem', borderRadius: '14px', display: 'flex', 
                  alignItems: 'center', justifyContent: 'space-between',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <button 
                    onClick={() => toggleTodo({ variables: { id: todo.id, is_completed: !todo.is_completed } })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: todo.is_completed ? 'var(--accent)' : 'var(--muted)' }}
                  >
                    {todo.is_completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>
                  <span style={{ 
                    fontSize: '1rem', 
                    textDecoration: todo.is_completed ? 'line-through' : 'none',
                    color: todo.is_completed ? 'var(--muted)' : 'var(--foreground)',
                    transition: 'all 0.2s'
                  }}>
                    {todo.title}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTodo({ variables: { id: todo.id } })}
                  className="btn-ghost"
                  style={{ padding: '0.4rem', borderRadius: '8px', border: 'none', color: '#f87171' }}
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TodoList;
