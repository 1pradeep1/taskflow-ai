import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { generateSuggestions } from '../utils/suggestions';
import API from '../services/api';
import { FolderKanban, CheckSquare, Clock, TrendingUp, Activity, Lightbulb } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, tRes] = await Promise.all([API.get('/projects'), API.get('/tasks')]);
        setProjects(pRes.data);
        setTasks(tRes.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const completed = tasks.filter(t => t.isCompleted).length;
  const pending = tasks.filter(t => !t.isCompleted).length;
  const productivity = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const suggestions = generateSuggestions(tasks, projects);

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderKanban, color: 'bg-blue-500' },
    { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, color: 'bg-purple-500' },
    { label: 'Completed', value: completed, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Pending', value: pending, icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Good morning, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-gray-400 mt-1">Here's your productivity overview for today.</p>
        </div>
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-3xl font-bold text-white">{value}</span>
              </div>
              <p className="text-gray-400 text-sm">{label}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Overall Productivity</h3>
            <span className="text-2xl font-bold text-blue-400">{productivity}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-700"
              style={{ width: `${productivity}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-400 text-sm">{completed} completed</span>
            <span className="text-gray-400 text-sm">{pending} remaining</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-yellow-400" />
              <h3 className="text-white font-semibold text-lg">AI Suggestions</h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div key={i} className={`p-3 rounded-xl text-sm ${
                  s.type === 'warning' ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20' :
                  s.type === 'danger' ? 'bg-red-500/10 text-red-300 border border-red-500/20' :
                  s.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/20' :
                  'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                }`}>{s.message}</div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={20} className="text-blue-400" />
              <h3 className="text-white font-semibold text-lg">Recent Projects</h3>
            </div>
            {loading ? <p className="text-gray-400">Loading...</p> :
              projects.length === 0 ? <p className="text-gray-400 text-sm">No projects yet. Create your first project!</p> :
              <div className="space-y-3">
                {projects.slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
                    <div>
                      <p className="text-white text-sm font-medium">{p.name}</p>
                      <p className="text-gray-400 text-xs">{p.status}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      p.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                      p.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{p.priority}</span>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  );
}