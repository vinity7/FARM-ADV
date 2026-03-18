import { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Filter } from 'lucide-react';
import { io } from 'socket.io-client';
import { getAllPrices } from '../lib/api';

const mockData = {
  Rice: [
    { date: '12 Mar', price: 47.5 },
    { date: '13 Mar', price: 47.8 },
    { date: '14 Mar', price: 48.0 },
    { date: '15 Mar', price: 48.2 },
    { date: '16 Mar', price: 48.1 },
    { date: '17 Mar', price: 48.4 },
  ],
  Banana: [
    { date: '12 Mar', price: 62.0 },
    { date: '13 Mar', price: 63.5 },
    { date: '14 Mar', price: 63.8 },
    { date: '15 Mar', price: 64.2 },
    { date: '16 Mar', price: 64.8 },
    { date: '17 Mar', price: 65.0 },
  ],
  Tapioca: [
    { date: '12 Mar', price: 31.0 },
    { date: '13 Mar', price: 31.5 },
    { date: '14 Mar', price: 31.2 },
    { date: '15 Mar', price: 32.0 },
    { date: '16 Mar', price: 32.2 },
    { date: '17 Mar', price: 32.5 },
  ],
};

const cropinfo = {
  Rice: { current: 48.4, unit: 'kg', trend: 1.2, max: 48.5, min: 47.0 },
  Banana: { current: 65.0, unit: 'kg', trend: 2.5, max: 65.0, min: 61.5 },
  Tapioca: { current: 32.5, unit: 'kg', trend: 0.8, max: 33.0, min: 30.5 },
};

export default function MarketPrices() {
  const [selectedCrop, setSelectedCrop] = useState<keyof typeof mockData>('Rice');
  const [data, setData] = useState(mockData[selectedCrop]);

  useEffect(() => {
    // Initial fetch
    const fetchPrices = async () => {
      try {
        const { data: apiPrices } = await getAllPrices();
        // sync the current chart data if the crop matches
        const match = apiPrices.find((d: any) => d.crop.toLowerCase() === selectedCrop.toLowerCase());
        if (match) {
          const numericPrice = parseFloat(match.price.replace(/[₹/kgpiece]/g, ''));
          setData((prev) => {
            const last = prev[prev.length - 1];
            if (last.price !== numericPrice) {
              return [...prev.slice(1), { date: 'Now', price: numericPrice }];
            }
            return prev;
          });
        }
      } catch (err) {
        console.error('Failed to fetch prices', err);
      }
    };
    fetchPrices();
  }, [selectedCrop]);

  // Socket.io integration
  useEffect(() => {
    const socket = io(window.location.origin, { path: '/socket.io' });

    socket.on('priceUpdate', (updates: { crop: string; price: string }[]) => {
      const match = updates.find(u => u.crop.toLowerCase() === selectedCrop.toLowerCase());
      if (match) {
        const numericPrice = parseFloat(match.price.replace(/[₹/kg]/g, ''));
        setData((prevData) => {
          const newDate = new Date();
          const dateStr = `${newDate.getHours()}:${newDate.getMinutes().toString().padStart(2, '0')}`;
          return [
            ...prevData.slice(1),
            { date: dateStr, price: numericPrice }
          ];
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedCrop]);

  const currentInfo = cropinfo[selectedCrop];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Market Prices</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track live price trends across Kerala mandis.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Clock size={14} />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Crop Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(Object.keys(mockData) as Array<keyof typeof mockData>).map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              selectedCrop === crop
                ? 'bg-primary text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Price</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            ₹{data[data.length - 1]?.price.toFixed(1)}
            <span className="text-xs font-normal">/{currentInfo.unit}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">24h Change</div>
          <div className={`text-lg font-bold mt-1 flex items-center gap-1 ${currentInfo.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currentInfo.trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(currentInfo.trend)}%
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">7d High</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">₹{currentInfo.max}/{currentInfo.unit}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">7d Low</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">₹{currentInfo.min}/{currentInfo.unit}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Price Trend ({selectedCrop})</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-700/50" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#15803d"
                strokeWidth={3}
                dot={{ r: 4, stroke: '#15803d', strokeWidth: 2, fill: 'white' }}
                activeDot={{ r: 6, stroke: '#15803d', strokeWidth: 2, fill: '#15803d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

