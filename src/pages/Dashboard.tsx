import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { CloudSun, TrendingUp, TrendingDown, MessageSquare, Calendar, Bell, AlertTriangle } from 'lucide-react';
import { getAllPrices } from '../lib/api';

interface PriceItem {
  name: string;
  price: number;
  change: number;
  unit: string;
}

export default function Dashboard() {
  const [prices, setPrices] = useState<PriceItem[]>([
    { name: 'Rice', price: 45.0, change: 0, unit: 'kg' },
    { name: 'Coconut', price: 25.0, change: 0, unit: 'piece' },
    { name: 'Tapioca', price: 30.0, change: 0, unit: 'kg' },
    { name: 'Banana', price: 30.0, change: 0, unit: 'kg' },
  ]);

  // Get the logged-in user's name
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'Farmer';
  const userDistrict = user.district || 'Kerala';

  // Initial fetch for prices
  useEffect(() => {
    const fetchInitialPrices = async () => {
      try {
        const { data } = await getAllPrices();
        // data: [{ crop: 'rice', price: '₹45/kg', date: '...' }]
        setPrices((prev) =>
          prev.map((item) => {
            const match = data.find((d: any) => d.crop.toLowerCase() === item.name.toLowerCase());
            if (match) {
              const numericPrice = parseFloat(match.price.replace(/[₹/kgpiece]/g, ''));
              return { ...item, price: numericPrice };
            }
            return item;
          })
        );
      } catch (err) {
        console.error('Failed to fetch initial prices:', err);
      }
    };
    fetchInitialPrices();
  }, []);

  // Connect to Socket.io for live price updates
  useEffect(() => {
    const socket = io(window.location.origin, { path: '/socket.io' });

    socket.on('priceUpdate', (updates: { crop: string; price: string }[]) => {
      setPrices((prev) =>
        prev.map((item) => {
          const match = updates.find(
            (u) => item.name.toLowerCase().includes(u.crop.toLowerCase())
          );
          if (match) {
            const numericPrice = parseFloat(match.price.replace(/[₹/kgpiece]/g, ''));
            if (!isNaN(numericPrice)) {
              const change = parseFloat((((numericPrice - item.price) / item.price) * 100).toFixed(1));
              return { ...item, price: numericPrice, change };
            }
          }
          return item;
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Good Morning, {userName}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Here is your farm overview for today.</p>
        </div>
        <button className="relative p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <Bell size={20} className="text-slate-600 dark:text-slate-300" />
          <span className="absolute top-1 right-1 w-2h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{userDistrict}, Kerala</div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mt-1">32°C</div>
            </div>
            <CloudSun size={40} className="text-amber-500" />
          </div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Mostly Sunny</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div>Humidity: <span className="font-medium text-slate-700 dark:text-slate-200">65%</span></div>
            <div>Wind: <span className="font-medium text-slate-700 dark:text-slate-200">12 km/h</span></div>
            <div>Precip: <span className="font-medium text-slate-700 dark:text-slate-200">10%</span></div>
            <div>UV Index: <span className="font-medium text-slate-700 dark:text-slate-200">High</span></div>
          </div>
        </div>

        {/* Live Prices Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" /> Live Mandi Prices
            </h2>
            <Link to="/market-prices" className="text-sm font-semibold text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {prices.map((item) => (
              <div key={item.name} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-300 truncate">{item.name}</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">₹{item.price}<span className="text-xs font-normal">/{item.unit}</span></div>
                <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(item.change)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions & Alerts */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick AI Chat Banner */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-2xl shadow-md text-white flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare size={24} /> Quick AI Assistant
              </h3>
              <p className="text-green-100 text-sm mt-1">Upload a crop photo for instant disease diagnosis.</p>
            </div>
            <Link to="/ai-chat" className="px-6 py-2 bg-white text-green-700 font-bold rounded-lg shadow-sm hover:bg-green-50 transition-colors whitespace-nowrap">
              Ask AI Now
            </Link>
          </div>

          {/* Alerts */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell size={20} className="text-amber-500" /> Advisory & Alerts
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/40">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-sm font-semibold text-amber-800 dark:text-amber-200">Weather Alert</div>
                  <p className="text-xs text-amber-700 dark:text-amber-300/80">Heavy rainfall isolated in {userDistrict} starting tomorrow. Secure your harvest.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <Calendar className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">Ninjate Season</div>
                  <p className="text-xs text-blue-700 dark:text-blue-300/80">Ideal time for sowing paddy (Mundakan season) approaches. Check calendar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Preview / Quick Links */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={20} className="text-primary" /> Upcoming Tasks
              </h2>
              <Link to="/calendar" className="text-sm font-semibold text-primary hover:underline">Open</Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-200">Fertilizer Application</span>
                </div>
                <span className="text-xs text-slate-500">Today</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-200">Watering Schedule</span>
                </div>
                <span className="text-xs text-slate-500">Mar 19</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
