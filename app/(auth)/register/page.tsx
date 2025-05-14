"use client";

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import Link from 'next/link';

const Register = () => {
    const { isDarkMode } = useTheme();
    // const signUp = useAuthStore((state) => state.signUp);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        // try {
        //   await signUp(email, password);
        //   // navigate('/admin/dashboard');
        // } catch (err) {
        //   setError('Registration failed');
        // } finally {
        //   setLoading(false);
        // }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${
            isDarkMode ? 'bg-[#121826]' : 'bg-gray-50'
        }`}>
            <div className={`max-w-md w-full space-y-8 p-8 rounded-xl ${
                isDarkMode 
                    ? 'bg-gray-900 border border-gray-800' 
                    : 'bg-white shadow-lg'
            }`}>
                <div>
                    <h2 className={`text-3xl font-bold text-center ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        Register
                    </h2>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="flex items-center p-4 rounded-lg text-red-500 bg-red-100">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div>
                            <label 
                                htmlFor="email" 
                                className={`block text-sm font-medium ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    isDarkMode 
                                        ? 'bg-gray-800 border-gray-700 text-white' 
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            />
                        </div>
                        
                        <div>
                            <label 
                                htmlFor="password" 
                                className={`block text-sm font-medium ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    isDarkMode 
                                        ? 'bg-gray-800 border-gray-700 text-white' 
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            />
                        </div>

                        <div>
                            <label 
                                htmlFor="confirm-password" 
                                className={`block text-sm font-medium ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    isDarkMode 
                                        ? 'bg-gray-800 border-gray-700 text-white' 
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                            loading 
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                <span>Registering...</span>
                            </div>
                        ) : (
                            <span>Register</span>
                        )}
                    </button>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className={`text-sm ${
                            isDarkMode 
                                ? 'text-indigo-400 hover:text-indigo-300' 
                                : 'text-indigo-600 hover:text-indigo-700'
                            }`}
                        >
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;