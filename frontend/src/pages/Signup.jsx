import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading ,error,} = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-2xl p-8 transition-transform transform hover:scale-[1.02] duration-300">
        <h2 className="text-center text-4xl font-bold text-white mb-8 tracking-wide drop-shadow-[0_1px_4px_rgba(255,255,255,0.3)]">
          Leetcode
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name Field */}
          <div className="form-control">
            <label className="label mb-2">
              <span className="text-gray-300 text-sm font-medium">First Name</span>
            </label>
            <input
              type="text"
              placeholder="John"
              className={`input w-full bg-white/10 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 ${errors.firstName ? 'border-red-500 focus:ring-red-400' : ''}`}
              {...register('firstName')}
            />
            {errors.firstName && (
              <span className="text-red-400 text-sm mt-2">{errors.firstName.message}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="label mb-2">
              <span className="text-gray-300 text-sm font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className={`input w-full bg-white/10 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 ${errors.emailId ? 'border-red-500 focus:ring-red-400' : ''}`}
              {...register('emailId')}
            />
            {errors.emailId && (
              <span className="text-red-400 text-sm mt-2">{errors.emailId.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label mb-2">
              <span className="text-gray-300 text-sm font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`input w-full bg-white/10 border border-gray-600 text-white placeholder-gray-400 rounded-xl pr-12 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 ${errors.password ? 'border-red-500 focus:ring-red-400' : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-indigo-300 transition duration-200"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-400 text-sm mt-2">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control mt-8">
            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-lg font-semibold tracking-wide text-white transition-all duration-300 ${
                loading
                  ? 'bg-indigo-500/60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]'
              }`}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
            {error && (
  <div className="mt-4 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-center text-red-300">
    {error}
  </div>
)}
          </div>
        </form>

        <div className="text-center mt-6 text-gray-300">
          <span className="text-sm">
            Already have an account?{' '}
            <NavLink to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Login
            </NavLink>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
