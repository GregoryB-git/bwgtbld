'use client';

import { useState, useEffect } from 'react';
import { getProducerData, saveAssignmentStatus } from './actions';
import { User } from './types';

const COLS = ['todo', 'inprogress', 'done'] as const;
const LABELS = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };

type Task = { id: string; project_id: string; title: string; status: string };
type Project = { id: string; name: string; date: string };

export default function ProducerDashboard({ user }: { user: User }) {
  console.log('[ProducerDashboard] received user prop:', user);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<Task | null>(null);

  useEffect(() => {
  console.log('[ProducerDashboard] useEffect fired, user.id:', user.id);
  if (!user.id) {
    console.log('[ProducerDashboard] no user.id, returning early');
    return;
  }
  getProducerData(user.id).then(({ projects, assignments }) => {
    console.log('[ProducerDashboard] received projects:', projects);
    console.log('[ProducerDashboard] received assignments:', assignments);
    const sorted = [...projects].sort((a, b) => b.date.localeCompare(a.date));
    setProjects(sorted as Project[]);
    setTasks(assignments as Task[]);
    if (sorted.length) setActiveId(sorted[0].id);
  }).catch(err => {
    console.error('[ProducerDashboard] fetch error:', err);
  });
}, [user.id]);

  async function onDrop(status: string) {
    if (!dragging) return;
    const task = dragging;
    setDragging(null);
    setTasks(ts => ts.map(t => t.id === task.id ? { ...t, status } : t));
    await saveAssignmentStatus(task.id, status);
  }

  const visible = tasks.filter(t => t.project_id === activeId);

  return (
    <div style={{ display: 'flex', minHeight: '70vh', fontFamily: 'sans-serif' }}>
      <div style={{ width: 200, background: '#1e1e2e', color: '#cdd6f4', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #313244', fontSize: 13, fontWeight: 700 }}>
          Projects
        </div>
        <div style={{ flex: 1 }}>
          {projects.map(p => (
            <div key={p.id} onClick={() => setActiveId(p.id)} style={{
              padding: '10px 16px', cursor: 'pointer', fontSize: 13,
              background: activeId === p.id ? '#313244' : 'transparent',
              borderLeft: activeId === p.id ? '3px solid #89b4fa' : '3px solid transparent'
            }}>
              <div>{p.name}</div>
              <div style={{ fontSize: 11, color: '#6c7086' }}>{p.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: 24, overflow: 'auto', background: '#f4f5f7' }}>
        <h2 style={{ margin: '0 0 20px', color: '#1e1e2e' }}>
          {projects.find(p => p.id === activeId)?.name ?? ''}
        </h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {COLS.map(col => (
            <div key={col}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(col)}
              style={{ flex: 1, background: '#e2e8f0', borderRadius: 8, padding: 12, minHeight: 300 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#5e6ad2', marginBottom: 12 }}>
                {LABELS[col]} · {visible.filter(t => t.status === col).length}
              </div>
              {visible.filter(t => t.status === col).map(task => (
                <div key={task.id} draggable
                  onDragStart={() => setDragging(task)}
                  style={{
                    background: '#fff', borderRadius: 6, padding: '10px 12px',
                    marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,.1)',
                    cursor: 'grab', fontSize: 13, userSelect: 'none'
                  }}>
                  {task.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}