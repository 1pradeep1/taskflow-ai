import Sidebar from '../components/Sidebar';
import { MessageSquare, UserPlus } from 'lucide-react';

const members = [
  { name: 'Pradeep C', role: 'Full Stack Developer', status: 'online', avatar: 'P', tasks: 12 },
  { name: 'Yuvaraj V', role: 'Project Manager', status: 'online', avatar: 'Y', tasks: 8 },
  { name: 'Anitha R', role: 'UI/UX Designer', status: 'away', avatar: 'A', tasks: 5 },
  { name: 'Karthik M', role: 'Backend Developer', status: 'offline', avatar: 'K', tasks: 9 },
  { name: 'Divya S', role: 'QA Engineer', status: 'online', avatar: 'D', tasks: 6 },
];

const comments = [
  { author: 'Yuvaraj V', text: 'Dashboard looks great! Lets review the analytics section.', time: '2 hours ago', avatar: 'Y' },
  { author: 'Anitha R', text: 'Updated the UI components for mobile responsiveness.', time: '4 hours ago', avatar: 'A' },
  { author: 'Pradeep C', text: 'JWT authentication is working perfectly now.', time: '6 hours ago', avatar: 'P' },
  { author: 'Karthik M', text: 'API endpoints are ready for testing.', time: '1 day ago', avatar: 'K' },
];

export default function Team() {
  return (
    <div className="flex bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Team</h2>
            <p className="text-gray-400 mt-1">Collaborate with your team members</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-medium transition-all">
            <UserPlus size={20} /> Add Member
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold text-lg mb-4">Team Members</h3>
            <div className="space-y-4">
              {members.map((m, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-800 rounded-xl">
                  <div className="relative">
                    <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">{m.avatar}</div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-gray-800 ${
                      m.status === 'online' ? 'bg-green-400' : m.status === 'away' ? 'bg-yellow-400' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{m.name}</p>
                    <p className="text-gray-400 text-xs">{m.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">{m.tasks}</p>
                    <p className="text-gray-400 text-xs">tasks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={20} className="text-blue-400" />
              <h3 className="text-white font-semibold text-lg">Activity Timeline</h3>
            </div>
            <div className="space-y-4">
              {comments.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{c.avatar}</div>
                  <div className="flex-1 bg-gray-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white text-sm font-medium">{c.author}</p>
                      <p className="text-gray-500 text-xs">{c.time}</p>
                    </div>
                    <p className="text-gray-300 text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}