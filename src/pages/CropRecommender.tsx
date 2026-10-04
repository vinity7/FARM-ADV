import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Leaf } from 'lucide-react';

export default function CropRecommender() {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    
    // Convert all values to numbers
    const payload = {
      N: Number(formData.N),
      P: Number(formData.P),
      K: Number(formData.K),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      ph: Number(formData.ph),
      rainfall: Number(formData.rainfall)
    };

    try {
      // Assuming your Flask API is running on port 5001
      const response = await fetch('http://127.0.0.1:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setPrediction(data.recommended_crop);
        toast.success(`Recommended crop: ${data.recommended_crop}`);
      } else {
        toast.error('Prediction failed. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
      toast.error('Failed to connect to ML API. Make sure Flask is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
      <div className="mb-8 flex items-center gap-4 border-b pb-4 border-slate-100 dark:border-slate-700">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <Leaf size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Crop Recommender (ML)</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Powered by Random Forest. Enter your soil metrics to get a scientific prediction.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nitrogen (N)</label>
              <input type="number" step="any" name="N" value={formData.N} onChange={handleChange} required className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phosphorous (P)</label>
              <input type="number" step="any" name="P" value={formData.P} onChange={handleChange} required className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Potassium (K)</label>
              <input type="number" step="any" name="K" value={formData.K} onChange={handleChange} required className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Temperature (°C)</label>
              <input type="number" step="any" name="temperature" value={formData.temperature} onChange={handleChange} required className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Humidity (%)</label>
              <input type="number" step="any" name="humidity" value={formData.humidity} onChange={handleChange} required className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">pH Level</label>
              <input type="number" step="any" name="ph" value={formData.ph} onChange={handleChange} required className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rainfall (mm)</label>
            <input type="number" step="any" name="rainfall" value={formData.rainfall} onChange={handleChange} required className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? 'Analyzing Data...' : 'Get Recommendation'}
          </button>
        </form>

        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          {prediction ? (
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf size={48} />
              </div>
              <h3 className="text-xl text-slate-500 dark:text-slate-400 font-medium">Recommended Crop</h3>
              <p className="text-4xl font-bold text-slate-800 dark:text-slate-100 mt-2 capitalize">{prediction}</p>
            </div>
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500">
              <Leaf size={64} className="mx-auto mb-4 opacity-50" />
              <p>Enter soil parameters and click submit to see the prediction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
