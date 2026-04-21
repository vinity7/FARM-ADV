import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { registerUser } from '../lib/api';

export default function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      district: '',
      state: '',
      password: '',
      language: 'english',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number')
        .required('Phone number is required'),
      district: Yup.string()
        .required('District is required'),
      state: Yup.string()
        .required('State is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      language: Yup.string()
        .required('Language is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await registerUser(values);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Registration failed. Please try again.';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Join KISANKART Today</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Create your account to get personalized farm advice</p>
        </div>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="John Doe"
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="9876543210"
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State</label>
            <select
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                formik.touched.state && formik.errors.state ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
            >
              <option value="" disabled>Select State</option>
              {["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"].map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {formik.touched.state && formik.errors.state && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">District</label>
            <input
              type="text"
              name="district"
              value={formik.values.district}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your district"
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                formik.touched.district && formik.errors.district ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {formik.touched.district && formik.errors.district && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.district}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Language</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => formik.setFieldValue('language', 'english')}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                  formik.values.language === 'english'
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-primary'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => formik.setFieldValue('language', 'hindi')}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                  formik.values.language === 'hindi'
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-primary'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-md transition-colors mt-6 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
