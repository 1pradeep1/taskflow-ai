import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { Plus, Pencil, Trash2, X, CheckCircle, Circle } from 'lucide-react';

const emptyForm = { title: '', description: '', priority: 'MEDIUM', tags: '', dueDate: '', projectId: '' };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');

  const fetchData = async () => {
    const [tRes, pRes] = await Promise.all([API.get('/tasks'), API.get('/projects')]);
    setTasks(tRes.data); setProjects(pRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, projectId: form.projectId ? parseInt(form.projectId) : null };
    if (editId) { await API.put(`/tasks/${editId}`, payload); }
    else { await API.post('/tasks', payload); }
    setShowModal(false); setForm(emptyForm); setEditId(null); fetchData();
  };

  const handleEdit = (t) => {
    setForm({ title: t.title, description: t.description || '', priority: t.priority, tags: t.tags || '', dueDate: t.dueDate || '', projectId: t.project?.id || '' });
    setEditId(t.id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) { await API.delete(`/tasks/${id}`); fetchData(); }
  };

  const toggleComplete = async (t) => {
    await API.put(`/tasks/${t.id}`, { ...t, isCompleted: !t.isCompleted, projectId: t.project?.id });
    fetchData();
  };

  const filtered = tasks
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter(t => filterPriority === 'ALL' || t.priority === filterPriority);

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Tasks</h2>
            <p className="text-gray-400 mt-1">Manage and track all your tasks</p>
          </div>
          <button onClick={() => { setShowModal(true); setForm(emptyForm); setEditId(null); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-medium transition-all">
            <Plus size={20} /> New Task
          </button>
        </div>
        <div className="flex gap-4 mb-6">
          <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        <div className="space-y-3">
          {filtered.map(t => (
            <div key={t.id} className={`bg-gray-900 rounded-2xl p-5 border transition-all ${t.isCompleted ? 'border-green-500/30 opacity-75' : 'border-gray-800 hover:border-blue-500/50'}`}>
              <div className="flex items-center gap-4">
                <button onClick={() => toggleComplete(t)} className="text-gray-400 hover:text-green-400 transition-colors flex-shrink-0">
                  {t.isCompleted ? <CheckCircle size={24} className="text-green-400" /> : <Circle size={24} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-white font-medium ${t.isCompleted ? 'line-through text-gray-500' : ''}`}>{t.title}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {t.project && <span className="text-blue-400 text-xs">📁 {t.project.name}</span>}
                    {t.tags && <span className="text-gray-400 text-xs">🏷️ {t.tags}</span>}
                    {t.dueDate && <span className="text-gray-400 text-xs">📅 {t.dueDate}</span>}
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${
                  t.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                  t.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                }`}>{t.priority}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(t)} className="text-gray-400 hover:text-blue-400 transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-20 text-gray-500">No tasks found. Click "New Task" to create one!</div>}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl font-bold">{editId ? 'Edit Task' : 'New Task'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input placeholder="Task Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} />
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
                <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">No Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input placeholder="Tags (e.g. frontend, urgent)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all">
                  {editId ? 'Update Task' : 'Create Task'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}