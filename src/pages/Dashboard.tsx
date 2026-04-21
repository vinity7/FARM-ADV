import { CloudSun, MessageSquare, Bell, AlertTriangle, Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, TrendingUp, Eye, Compass, Waves, Sunrise, Sunset } from 'lucide-react';
import { useState, useEffect } from 'react';


export default function Dashboard() {
  // Get the logged-in user's name
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'Farmer';
  const userDistrict = user.district || 'Pune';

  // Weather data states (Placeholders for real API)
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for Real Weather API Integration
    // Example: fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userDistrict}&appid=YOUR_API_KEY`)
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        // Mocking API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setWeatherData({
          temp: 32,
          condition: 'Mostly Sunny',
          feelsLike: 34,
          humidity: 65,
          windSpeed: 12,
          windDir: 'NW',
          precip: 10,
          uvIndex: 'High',
          soilMoisture: '24%',
          pressure: '1012 hPa',
          visibility: '12 km',
          sunrise: '06:12 AM',
          sunset: '06:45 PM'
        });
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [userDistrict]);


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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expanded Weather Hub */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 lg:col-span-3">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              {/* Current Weather Main */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Current Weather</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{userDistrict}, {user.state || 'India'}</div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-5xl font-extrabold text-slate-900 dark:text-white">{loading ? '--' : weatherData?.temp}°C</div>
                      <div className="h-12 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                      <div>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{loading ? 'Loading...' : weatherData?.condition}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Feels like {weatherData?.feelsLike}°C</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-3xl">
                    <CloudSun size={48} className="text-amber-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Droplets size={18} className="text-blue-500" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Humidity</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{weatherData?.humidity}%</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Wind size={18} className="text-slate-500" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Wind</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{weatherData?.windSpeed} km/h</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <CloudRain size={18} className="text-primary" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Precip</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{weatherData?.precip}%</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Thermometer size={18} className="text-red-500" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">UV Index</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{weatherData?.uvIndex}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/20 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">5-Day Forecast</h3>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { day: 'Thu', temp: 31, icon: <Sun className="text-amber-500" /> },
                    { day: 'Fri', temp: 29, icon: <CloudSun className="text-amber-500" /> },
                    { day: 'Sat', temp: 28, icon: <CloudRain className="text-blue-500" /> },
                    { day: 'Sun', temp: 30, icon: <Sun className="text-amber-500" /> },
                    { day: 'Mon', temp: 32, icon: <Cloud className="text-slate-400" /> },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center p-2 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all cursor-default">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">{item.day}</span>
                      <div className="mb-2">{item.icon}</div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{item.temp}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Weather Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-700">
                <Compass size={20} className="text-primary mb-2" />
                <div className="text-[10px] font-bold text-slate-400 uppercase">Wind Direction</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{weatherData?.windDir}</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-700">
                <Droplets size={20} className="text-green-500 mb-2" />
                <div className="text-[10px] font-bold text-slate-400 uppercase">Soil Moisture</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{weatherData?.soilMoisture}</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-700">
                <Waves size={20} className="text-blue-400 mb-2" />
                <div className="text-[10px] font-bold text-slate-400 uppercase">Pressure</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{weatherData?.pressure}</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-700">
                <Eye size={20} className="text-slate-500 mb-2" />
                <div className="text-[10px] font-bold text-slate-400 uppercase">Visibility</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{weatherData?.visibility}</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-700">
                <Sunrise size={20} className="text-amber-500 mb-2" />
                <div className="text-[10px] font-bold text-slate-400 uppercase">Sunrise</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{weatherData?.sunrise}</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-700">
                <Sunset size={20} className="text-orange-500 mb-2" />
                <div className="text-[10px] font-bold text-slate-400 uppercase">Sunset</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{weatherData?.sunset}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Quick Actions & Alerts */}
        <div className="space-y-6">

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
                  <p className="text-xs text-amber-700 dark:text-amber-300/80">Unseasonal rain expected in {userDistrict} next week. Cover your crops.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <MessageSquare className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">Agri Advisor</div>
                  <p className="text-xs text-blue-700 dark:text-blue-300/80">Ideal time for sowing paddy approaches in your region. Consult current weather charts before proceeding.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
