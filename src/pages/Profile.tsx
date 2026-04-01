import { useState, useEffect } from 'react';
import { MapPin, Globe, History, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getMe, updateProfile } from '../lib/api';

export default function Profile() {
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getMe();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        console.error('Failed to refresh user profile', err);
      }
    };
    fetchUser();
  }, []);
  
  const handleProfileUpdate = async (updates: any) => {
    setIsUpdating(true);
    try {
      const { data } = await updateProfile(updates);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const queryHistory = [
    { id: 1, query: 'Paddy leaf turning yellow', date: '15 Mar 2026', status: 'Resolved' },
    { id: 2, query: 'Mandi price of Banana in India', date: '12 Mar 2026', status: 'Resolved' },
    { id: 3, query: 'Best fertilizer for coconut tree', date: '05 Mar 2026', status: 'Resolved' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>

      {/* User Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user.name?.[0] || 'U'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name || 'User'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
            <MapPin size={14} /> {user.district}, {user.state}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Jan 2026'}</p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe size={18} className="text-primary" /> Preferences
        </div>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">App Language</div>
              <div className="text-xs text-slate-500">Choose your preferred language</div>
            </div>
            <div className={`flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
              <button
                onClick={() => handleProfileUpdate({ language: 'english' })}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                  user.language === 'english' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleProfileUpdate({ language: 'hindi' })}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                  user.language === 'hindi' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Location Settings</label>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400">State</label>
                <select
                  value={user.state}
                  onChange={(e) => handleProfileUpdate({ state: e.target.value })}
                  className="w-full mt-1 bg-slate-100 dark:bg-slate-700 border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  {["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"].map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400">District</label>
                <input
                  type="text"
                  value={user.district}
                  onChange={(e) => setUser({ ...user, district: e.target.value })}
                  onBlur={(e) => handleProfileUpdate({ district: e.target.value })}
                  className="w-full mt-1 bg-slate-100 dark:bg-slate-700 border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Query History */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <History size={18} className="text-primary" /> Query History
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {queryHistory.map((item) => (
            <button
              key={item.id}
              className="w-full p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">{item.query}</div>
                <div className="text-xs text-slate-500 mt-1">{item.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                  {item.status}
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <button
        onClick={handleLogout}
        className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 text-red-600 font-semibold rounded-xl border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={18} /> Log Out
      </button>
    </div>
  );
}

