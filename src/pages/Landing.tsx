import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-slate-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Empowering Kerala's Farmers with <span className="text-primary">Smart AI</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Get live mandi prices, crop disease diagnosis, and expert agricultural advice at your fingertips.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="text-3xl font-bold text-primary">2.5M+</div>
              <div className="text-sm text-slate-500">Farmers Joined</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="text-3xl font-bold text-primary">30%</div>
              <div className="text-sm text-slate-500">Yield Boost</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-slate-500">AI Advisory</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-lg transition-colors">
              Get Started
            </Link>
            <Link to="/about" className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
