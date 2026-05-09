import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981'];

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    Promise.all([API.get('/tasks'), API.get('/projects')]).then(([t, p]) => {
      setTasks(t.data); setProjects(p.data);
    });
  }, []);

  const completed = tasks.filter(t => t.isCompleted).length;
  const pending = tasks.filter(t => !t.isCompleted).length;
  const pieData = [{ name: 'Completed', value: completed }, { name: 'Pending', value: pending }];
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'HIGH').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'MEDIUM').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'LOW').length },
  ];
  const projectData = projects.map(p => ({
    name: p.name.length > 10 ? p.name.slice(0, 10) + '...' : p.name,
    tasks: tasks.filter(t => t.project?.id === p.id).length,
    completed: tasks.filter(t => t.project?.id === p.id && t.isCompleted).length,
  }));
  const weeklyData = [
    { day: 'Mon', tasks: 3 }, { day: 'Tue', tasks: 5 }, { day: 'Wed', tasks: 2 },
    { day: 'Thu', tasks: 7 }, { day: 'Fri', tasks: 4 }, { day: 'Sat', tasks: 6 },
    { day: 'Sun', tasks: completed },
  ];

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Analytics</h2>
          <p className="text-gray-400 mt-1">Track your productivity trends</p>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold text-lg mb-4">Task Completion</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold text-lg mb-4">Tasks by Priority</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold text-lg mb-4">Weekly Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="tasks" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold text-lg mb-4">Project Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Total" />
                <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}