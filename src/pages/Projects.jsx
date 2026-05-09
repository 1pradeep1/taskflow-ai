import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const emptyForm = { name: '', description: '', status: 'ACTIVE', priority: 'MEDIUM', dueDate: '' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchProjects = async () => {
    const res = await API.get('/projects');
    setProjects(res.data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) { await API.put(`/projects/${editId}`, form); }
    else { await API.post('/projects', form); }
    setShowModal(false); setForm(emptyForm); setEditId(null); fetchProjects();
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', status: p.status, priority: p.priority, dueDate: p.dueDate || '' });
    setEditId(p.id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) { await API.delete(`/projects/${id}`); fetchProjects(); }
  };

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Projects</h2>
            <p className="text-gray-400 mt-1">Manage all your projects</p>
          </div>
          <button onClick={() => { setShowModal(true); setForm(emptyForm); setEditId(null); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-medium transition-all">
            <Plus size={20} /> New Project
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {projects.map(p => (
            <div key={p.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-semibold text-lg">{p.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-gray-400 hover:text-blue-400 transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">{p.description || 'No description'}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  p.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400' :
                  p.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>{p.status}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  p.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                  p.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                }`}>{p.priority}</span>
                {p.dueDate && <span className="text-xs text-gray-400">📅 {p.dueDate}</span>}
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-3 text-center py-20 text-gray-500">No projects yet. Click "New Project" to get started!</div>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl font-bold">{editId ? 'Edit Project' : 'New Project'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input placeholder="Project Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} />
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all">
                  {editId ? 'Update Project' : 'Create Project'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}