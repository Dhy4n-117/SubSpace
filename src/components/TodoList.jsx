import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TODOS, ADD_TODO, TOGGLE_TODO, DELETE_TODO } from '../constants';
import { 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Star, 
  ChevronRight,
  MoreVertical,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TodoList = ({ activeTab, searchQuery }) => {
  const [newTodo, setNewTodo] = useState('');
  const { loading, error, data } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await addTodo({ variables: { title: newTodo } });
    setNewTodo('');
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'today': return 'My Day';
      case 'important': return 'Important';
      case 'planned': return 'Planned';
      default: return 'All Tasks';
    }
  };

  const getFilteredTodos = () => {
    if (!data?.todos) return [];
    
    let filtered = [...data.todos];

    // Filter by Tab
    switch (activeTab) {
      case 'today': 
        // Logic: Tasks created today or with "today" in title
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(t => t.created_at.startsWith(today) || t.title.toLowerCase().includes('today'));
        break;
      case 'important': 
        // Logic: Tasks with ! or "important" in title
        filtered = filtered.filter(t => t.title.includes('!') || t.title.toLowerCase().includes('important') || t.title.toLowerCase().includes('urgent'));
        break;
      case 'planned':
        // Logic: Tasks with date-like strings (simple mockup)
        filtered = filtered.filter(t => /\d+/.test(t.title));
        break;
      default: 
        break;
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(query));
    }

    return filtered;
  };

  if (loading) return null;
  if (error) return <div className="glass" style={{ padding: '2rem', color: '#f87171' }}>Error loading tasks.</div>;

  const filteredTodos = getFilteredTodos();

  return (
    <div style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>{getPageTitle()}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <motion.form 
        onSubmit={handleAdd} 
        style={{ marginBottom: '2.5rem', position: 'relative' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
          <div style={{ padding: '0 1rem', color: 'var(--primary)' }}>
            <Plus size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Add a task" 
            style={{ 
              flex: 1, background: 'transparent', border: 'none', color: 'white', 
              padding: '1rem 0.5rem', fontSize: '1.1rem', outline: 'none' 
            }}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
            Add
          </button>
        </div>
      </motion.form>

      <div className="task-grid">
        <AnimatePresence mode="popLayout">
          {filteredTodos.map((todo, index) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={`task-card glass ${todo.is_completed ? 'completed' : ''}`}
            >
              <div 
                className={`checkbox-custom ${todo.is_completed ? 'checked' : ''}`}
                onClick={() => toggleTodo({ variables: { id: todo.id, is_completed: !todo.is_completed } })}
              >
                {todo.is_completed && <Check size={14} strokeWidth={3} />}
              </div>
              
              <div style={{ flex: 1 }}>
                <div className="task-title" style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{todo.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CalendarIcon size={12} /> Tasks
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {new Date(todo.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button className="btn-ghost btn-icon" style={{ color: 'var(--text-muted)' }}>
                  <Star size={18} />
                </button>
                <button 
                  className="btn-ghost btn-icon" 
                  style={{ color: '#f87171' }}
                  onClick={() => deleteTodo({ variables: { id: todo.id } })}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTodos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}
          >
            <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
              <CalendarIcon size={48} style={{ margin: '0 auto' }} />
            </div>
            <p>No tasks here. Enjoy your day!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
