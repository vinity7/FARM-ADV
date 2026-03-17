import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';

// Mock events data with district mapping
const districtEvents: Record<string, any[]> = {
  Ernakulam: [
    { title: '🌾 Sowing: Paddy (Mundakan)', start: '2026-03-20', end: '2026-03-25', backgroundColor: '#10b981', borderColor: '#059669' },
    { title: '🚜 Harvesting: Tapioca', start: '2026-03-25', backgroundColor: '#f59e0b', borderColor: '#d97706' },
    { title: '💧 Irrigation: Coconut', start: '2026-03-18', backgroundColor: '#3b82f6', borderColor: '#2563eb' },
  ],
  Thrissur: [
    { title: '🌾 Sowing: Paddy (Mundakan)', start: '2026-03-22', end: '2026-03-27', backgroundColor: '#10b981', borderColor: '#059669' },
    { title: '🍌 Sowing: Banana', start: '2026-03-28', backgroundColor: '#10b981', borderColor: '#059669' },
    { title: '🧴 Pesticide application', start: '2026-03-19', backgroundColor: '#ef4444', borderColor: '#dc2626' },
  ],
  Palakkad: [
    { title: '🌾 Harvesting: Paddy (Puncha)', start: '2026-03-15', end: '2026-03-20', backgroundColor: '#f59e0b', borderColor: '#d97706' },
    { title: '🪱 Soil Testing', start: '2026-03-24', backgroundColor: '#8b5cf6', borderColor: '#7c3aed' },
  ],
};

export default function CropCalendar() {
  const [selectedDistrict, setSelectedDistrict] = useState('Ernakulam');
  const [events, setEvents] = useState(districtEvents[selectedDistrict]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setEvents(districtEvents[district] || []);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon size={24} className="text-primary" /> Crop Calendar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Sowing, harvesting, and care schedules.</p>
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <Filter size={16} className="text-slate-400" />
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="Ernakulam">Ernakulam</option>
            <option value="Thrissur">Thrissur</option>
            <option value="Palakkad">Palakkad</option>
          </select>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek',
            }}
            height="auto"
            eventTextColor="white"
            eventDisplay="block"
          />
        </div>
      </div>

      {/* Legend / Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-slate-600 dark:text-slate-300">Sowing / Planting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-slate-600 dark:text-slate-300">Harvesting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-slate-600 dark:text-slate-300">Irrigation / Care</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-slate-600 dark:text-slate-300">Pest Control</span>
        </div>
      </div>
    </div>
  );
}

