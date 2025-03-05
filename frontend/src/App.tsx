import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Moon, Sun, Eye, EyeOff, Sparkles } from 'lucide-react';
import Dither from './Dither';

type Theme = 'cyberpunk' | 'pastel';

interface PasswordResponse {
  score: number;
  suggestion: string;
}

function App() {
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState<Theme>('cyberpunk');
  const [strength, setStrength] = useState<PasswordResponse | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const checkPassword = async () => {
    if (!password) {
      setError('Please enter a password');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) throw new Error('Failed to check password');
      const data: PasswordResponse = await response.json();
      setStrength(data);
    } catch (error) {
      console.error('Error checking password:', error);
      setError('Failed to check password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const themeStyles = {
    cyberpunk: {
      background: 'bg-black',
      card: 'bg-gray-900/50 backdrop-blur-lg border-pink-500/20',
      text: 'text-pink-500',
      accent: 'text-yellow-400',
      input: 'bg-gray-800/50 text-pink-500 border-pink-500/30 focus:border-pink-500',
      button: 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800',
      strength: {
        0: 'text-red-500',
        1: 'text-yellow-500',
        2: 'text-emerald-500'
      }
    },
    pastel: {
      background: 'bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100',
      card: 'bg-white/70 backdrop-blur-lg border-purple-200',
      text: 'text-purple-600',
      accent: 'text-blue-500',
      input: 'bg-white/50 text-purple-700 border-purple-200 focus:border-purple-400',
      button: 'bg-purple-400 hover:bg-purple-500 active:bg-purple-600',
      strength: {
        0: 'from-red-100 to-red-200 border-red-300 text-red-500',
        1: 'from-yellow-100 to-yellow-200 border-yellow-400 text-yellow-600',
        2: 'from-emerald-100 to-emerald-200 border-emerald-400 text-emerald-600'
      }
    }
  };

  const strengthEmoji = {
    0: '😡',
    1: '😬',
    2: '💪'
  };

  const strengthIcon = {
    0: <ShieldAlert className="w-6 h-6 text-red-500" />,
    1: <Shield className="w-6 h-6 text-yellow-500" />,
    2: <ShieldCheck className="w-6 h-6 text-green-500" />
  };

  
  return (
    <main className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <Dither
          waveColor={theme === 'cyberpunk' ? [0.7, 0.4, 0.7] : [0.6, 0.7, 0.9]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      <div className="relative z-10 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setTheme(theme === 'cyberpunk' ? 'pastel' : 'cyberpunk')}
            className={`${themeStyles[theme].button} text-white p-2 rounded-full transition-colors duration-300`}
          >
            {theme === 'cyberpunk' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${themeStyles[theme].card} p-6 rounded-xl border shadow-xl transition-colors duration-500`}
        >
          <h1 className={`text-2xl font-bold mb-6 ${themeStyles[theme].text} flex items-center gap-2`}>
            <Shield className="w-6 h-6" />
            Password Strength Checker
          </h1>

          <div className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg border ${themeStyles[theme].input} pr-10 transition-colors duration-300`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${themeStyles[theme].text} opacity-70 hover:opacity-100`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button
              onClick={checkPassword}
              disabled={isLoading}
              className={`${themeStyles[theme].button} w-full text-white px-4 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Check Password
                </>
              )}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <p className="text-red-500 text-sm">{error}</p>
              </motion.div>
            )}

            {strength && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Simple Shield Display */}
                <div className="flex flex-col items-center gap-4 py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`${themeStyles[theme].strength[strength.score]}`}
                  >
                    {strength.score === 0 ? (
                      <ShieldAlert className="w-20 h-20" />
                    ) : strength.score === 1 ? (
                      <Shield className="w-20 h-20" />
                    ) : (
                      <ShieldCheck className="w-20 h-20" />
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-xl font-bold ${themeStyles[theme].strength[strength.score]}`}
                  >
                    {strength.score === 0 ? 'Weak' : strength.score === 1 ? 'Medium' : 'Strong'}
                    <span>{strengthEmoji[strength.score]}</span>
                  </motion.div>
                </div>

                {/* Suggestion Box */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-lg ${theme === 'cyberpunk' ? 'bg-gray-800/50' : 'bg-white/50'} border ${theme === 'cyberpunk' ? 'border-pink-500/20' : 'border-purple-200'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={`w-5 h-5 ${themeStyles[theme].accent}`} />
                    <h3 className={`${themeStyles[theme].accent} font-semibold`}>Suggestion</h3>
                  </div>
                  <p className={`${themeStyles[theme].text} text-sm leading-relaxed`}>
                    {strength.suggestion}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      </div>
    </main>
  );
}

export default App;
