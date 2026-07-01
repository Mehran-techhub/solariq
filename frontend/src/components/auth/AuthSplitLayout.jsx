import { Link } from 'react-router-dom';
import { Sun, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthSplitLayout({ children }) {
  return (
    <div className="min-h-screen flex w-full bg-[#0a0f16] text-white overflow-hidden font-sans">
      {/* Left side - Brand Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0d141e] flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Logo and Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Sun className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SolarIQ</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 max-w-md mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6"
          >
            Smarter Solar <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Decisions Begin Here.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 text-lg mb-12"
          >
            The most advanced platform for monitoring, predicting, and optimizing your solar energy usage.
          </motion.p>

          {/* Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-200">Secure Account Access</h3>
                <p className="text-sm text-gray-500 mt-1">Enterprise-grade security protecting your energy data.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-200">Real-Time Monitoring</h3>
                <p className="text-sm text-gray-500 mt-1">Track your energy production and consumption instantly.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-200">Future-Ready Platform</h3>
                <p className="text-sm text-gray-500 mt-1">AI-powered predictions for maximum optimization.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-16 text-sm text-gray-500">
          © {new Date().getFullYear()} SolarIQ Inc. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 relative">
        
        {/* Mobile Logo (visible only on small screens) */}
        <div className="lg:hidden flex items-center gap-2 mb-8 mt-4 ml-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">SolarIQ</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[450px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#111823] p-8 sm:p-10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/5 relative backdrop-blur-sm w-full"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
