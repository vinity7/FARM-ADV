import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  Tag, 
  IndianRupee, 
  PieChart, 
  X,
  Filter,
  ExternalLink,
  Award
} from 'lucide-react';
import { getLedger, addLedgerEntry, deleteLedgerEntry } from '../lib/api';
import toast from 'react-hot-toast';

interface LedgerEntry {
  _id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}

export default function Ledger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Seeds',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Seeds', 'Fertilizer', 'Labor', 'Pesticides', 'Equipment', 'Sales', 'Rent', 'Other'
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userState = user.state || 'India';

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const { data } = await getLedger();
      setEntries(data);
    } catch (err) {
      toast.error('Failed to fetch ledger entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addLedgerEntry({
        ...formData,
        amount: Number(formData.amount)
      });
      toast.success('Entry added successfully');
      setIsModalOpen(false);
      setFormData({
        type: 'expense',
        category: 'Seeds',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchEntries();
    } catch (err) {
      toast.error('Failed to add entry');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await deleteLedgerEntry(id);
      toast.success('Entry deleted');
      fetchEntries();
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart size={24} className="text-primary" /> Agri-Journal & Ledger
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track your farm expenses and income.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Add Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Income</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{totalIncome.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
              <TrendingDown size={24} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Expenses</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{totalExpenses.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl border shadow-sm ${balance >= 0 ? 'bg-primary/5 border-primary/20' : 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${balance >= 0 ? 'bg-primary text-white' : 'bg-red-600 text-white'}`}>
              <IndianRupee size={24} />
            </div>
            <div>
              <div className={`text-xs font-bold uppercase tracking-wider ${balance >= 0 ? 'text-primary/70' : 'text-red-500'}`}>Net Profit</div>
              <div className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-primary' : 'text-red-600 dark:text-red-400'}`}>₹{balance.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Transaction List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Filter size={16} />
                <span className="text-xs font-semibold">All Categories</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-slate-400">Loading your records...</div>
              ) : entries.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                    <Tag className="text-slate-400" />
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">No records found. Start by adding your first entry!</div>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {entries.map((entry) => (
                      <tr key={entry._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <CalendarIcon size={14} className="text-primary" />
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-400 rounded-md uppercase">
                            {entry.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 italic">
                          {entry.description || '-'}
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold text-right ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.type === 'income' ? '+' : '-'} ₹{entry.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleDeleteEntry(entry._id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Government Schemes */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Award size={20} className="text-amber-500" /> Govt. Schemes
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="text-[10px] font-bold text-amber-600 mb-1 uppercase tracking-wider">National</div>
                  <ExternalLink size={12} className="text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">PM-KISAN Nidhi</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">₹6,000 annual financial benefit to all landholding farmers.</p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="text-[10px] font-bold text-blue-600 mb-1 uppercase tracking-wider">State: {userState}</div>
                  <ExternalLink size={12} className="text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">KCC - Kisan Credit Card</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Collateral-free agricultural loans up to ₹1.6 lakh with low interest.</p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl hover:bg-green-100 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="text-[10px] font-bold text-green-600 mb-1 uppercase tracking-wider">Insurance</div>
                  <ExternalLink size={12} className="text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">PM Fasal Bima Yojna</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Crop insurance scheme for natural calamities and pests.</p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-all">
              Find More Schemes
            </button>
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Entry</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddEntry} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${formData.type === 'expense' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${formData.type === 'income' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
                >
                  Income
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Save Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
