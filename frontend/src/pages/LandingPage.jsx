import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CalendarDays, RefreshCw, BarChart3, ShieldCheck, TrendingUp } from 'lucide-react';

export default function LandingPage({ darkMode, setDarkMode }) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 dark:bg-primary-600/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-black tracking-tighter text-blue-900 dark:text-white flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 flex items-center justify-center">
            <span className="text-white text-lg leading-none">R</span>
          </div>
          Roomora<span className="text-blue-600 dark:text-primary-500">.</span>
        </motion.div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full shadow-sm"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <Link to="/login" className="hidden md:block text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/dashboard" className="px-5 py-2.5 rounded-full text-sm font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all flex items-center gap-2">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-primary-900/30 border border-blue-200 dark:border-primary-800/50 text-blue-800 dark:text-primary-300 font-medium text-sm mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
          Roomora Revenue Intelligence · Autonomous & Deterministic Pricing
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl"
        >
          The Intelligent Revenue OS <br className="hidden md:block" /> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-primary-400 dark:to-blue-400">Indian Hotels</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl leading-relaxed"
        >
          Stop guessing room rates. Roomora gives hotel owners real-time AI suggestions based on occupancy, demand, Indian Festivals, Events and Live Market conditions — so you earn more without extra work.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link to="/signup" className="px-8 py-4 rounded-full text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2">
            Start Free 30-Day Trial
          </Link>
          <Link to="/dashboard" className="px-8 py-4 rounded-full text-base font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-transform active:scale-95 flex items-center justify-center gap-2">
            Go to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Dashboard Preview Image - Ultra Premium CSS Mock */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
          className="mt-20 w-full max-w-5xl relative group perspective-1000"
        >
          {/* Ambient Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-20 dark:opacity-40 group-hover:opacity-40 dark:group-hover:opacity-60 transition-opacity duration-700 animate-pulse" />

          <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-blue-900/20 overflow-hidden transform transition-transform duration-700 hover:scale-[1.02]">

            {/* Mac OS Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-100/50 dark:bg-slate-950/50 border-b border-gray-200/50 dark:border-slate-800/50">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-rose-500/50 shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500/50 shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-emerald-500/50 shadow-sm" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-6 py-1.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  app.roomora.co
                </div>
              </div>
              <div className="w-16" /> {/* Spacer for symmetry */}
            </div>

            {/* Mock Dashboard Layout */}
            <div className="flex h-[450px]">
              {/* Sidebar mock */}
              <div className="hidden md:flex flex-col w-64 p-4 bg-slate-50/50 dark:bg-slate-950/50 border-r border-gray-100/50 dark:border-slate-800/50">
                <div className="flex items-center gap-3 mb-8 px-2">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg text-white flex items-center justify-center font-bold">R</div>
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-md" />
                </div>

                <div className="space-y-3">
                  <div className="h-10 bg-white dark:bg-blue-900/40 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800/50 flex items-center px-3" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 flex items-center px-3 gap-3 transition-colors">
                      <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700/50" />
                      <div className={`h-2.5 rounded-full bg-slate-200 dark:bg-slate-700/50 ${i % 2 === 0 ? 'w-24' : 'w-16'}`} />
                    </div>
                  ))}
                </div>

                <div className="mt-auto h-12 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/30 flex items-center px-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping mr-2" />
                  <div className="h-2.5 w-20 bg-blue-300 dark:bg-blue-700/50 rounded-full" />
                </div>
              </div>

              {/* Main content mock */}
              <div className="flex-1 flex flex-col p-6 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="h-6 w-48 bg-slate-800 dark:bg-white rounded-md mb-2 shadow-sm" />
                    <div className="h-3 w-64 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm" />
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { color: 'blue', tr: 'M 0,20 Q 15,5 30,15 T 60,10 T 100,0' },
                    { color: 'purple', tr: 'M 0,10 Q 20,20 40,5 T 80,15 T 100,5' },
                    { color: 'green', tr: 'M 0,15 Q 10,0 25,10 T 55,20 T 100,5' },
                    { color: 'orange', tr: 'M 0,5 Q 20,15 40,10 T 70,20 T 100,10' }
                  ].map((mock, i) => (
                    <div key={i} className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm overflow-hidden group">
                      {/* Value */}
                      <div className={`w-10 h-10 rounded-xl bg-${mock.color}-50 dark:bg-${mock.color}-900/20 mb-4 flex items-center justify-center`}>
                        <div className={`w-5 h-5 rounded bg-${mock.color}-500/50`} />
                      </div>
                      <div className="h-5 w-24 bg-slate-800 dark:bg-white rounded-md mb-2" />
                      <div className="h-3 w-16 bg-slate-300 dark:bg-slate-700 rounded-full" />

                      {/* Mini sparkline */}
                      <svg className={`absolute bottom-0 left-0 w-full h-12 text-${mock.color}-500 opacity-20 dark:opacity-30 group-hover:scale-y-110 transition-transform origin-bottom`} viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d={mock.tr} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Large Chart */}
                <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-4 w-32 bg-slate-800 dark:bg-white rounded-md" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-md" />
                      <div className="h-6 w-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-md border border-blue-100 dark:border-blue-800/50" />
                    </div>
                  </div>

                  {/* Gorgeous Area Chart Mock */}
                  <div className="flex-1 relative mt-2">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-full border-t border-dashed border-gray-200 dark:border-slate-800" />
                      ))}
                    </div>

                    {/* Animated Wave SVG */}
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.svg
                        className="absolute top-0 left-0 w-[200%] h-full drop-shadow-2xl"
                        viewBox="0 0 200 100"
                        preserveAspectRatio="none"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                      >
                        <defs>
                          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Background purple wave (looping 0 to 200) */}
                        <path
                          d="M 0,80 Q 20,40 40,60 T 70,50 T 100,80 Q 120,40 140,60 T 170,50 T 200,80 L 200,100 L 0,100 Z"
                          fill="url(#grad2)"
                        />
                        <path
                          d="M 0,80 Q 20,40 40,60 T 70,50 T 100,80 Q 120,40 140,60 T 170,50 T 200,80"
                          fill="none" stroke="#a855f7" strokeWidth="2" vectorEffect="non-scaling-stroke"
                        />

                        {/* Foreground blue wave (looping 0 to 200) */}
                        <path
                          d="M 0,90 Q 25,50 50,70 T 80,60 T 100,90 Q 125,50 150,70 T 180,60 T 200,90 L 200,100 L 0,100 Z"
                          fill="url(#grad1)"
                        />
                        <path
                          d="M 0,90 Q 25,50 50,70 T 80,60 T 100,90 Q 125,50 150,70 T 180,60 T 200,90"
                          fill="none" stroke="#3b82f6" strokeWidth="3" vectorEffect="non-scaling-stroke"
                        />
                      </motion.svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 bg-white dark:bg-slate-900 py-32 border-y border-gray-100 dark:border-slate-800 transition-colors duration-300 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">dominate</span> your market.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Roomora isn't just a dashboard — it's your hotel's new brain. We've automated the heavy lifting so you can focus on your guests.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[300px]">
            
            {/* 1. REVENUE INTELLIGENCE (Large) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-slate-950 p-10 flex flex-col justify-between border border-slate-800"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-auto">
                    <div>
                      <h3 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">Autonomous Pricing</h3>
                      <p className="text-slate-400 text-lg max-w-md">Our algorithm detects local events & occupancy spikes in milliseconds, suggesting the perfect shelf price every night.</p>
                    </div>
                </div>

                {/* VISUAL COMPONENT: PRICE OPTIMIZER MOCKUP */}
                <div className="mt-8 relative h-48 bg-white/5 rounded-3xl border border-white/10 p-6 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/5 blur-3xl" />
                    <div className="flex gap-8 items-end relative z-10 w-full justify-around">
                        {[
                          { label: 'Standard', old: '₹1400', new: '₹1650', h: 60, p: '18%' },
                          { label: 'Executive', old: '₹2200', new: '₹2800', h: 90, p: '27%' },
                          { label: 'Suite', old: '₹4500', new: '₹5200', h: 75, p: '15%' }
                        ].map((item, idx) => (
                           <div key={idx} className="flex flex-col items-center">
                              <motion.div 
                                initial={{ height: 0 }}
                                whileInView={{ height: `${item.h}%` }}
                                transition={{ delay: idx * 0.2 + 0.5, duration: 1 }}
                                className="w-16 bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-xl relative group"
                              >
                                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">+{item.p}</div>
                              </motion.div>
                              <p className="text-xs text-slate-500 mt-3 font-semibold uppercase tracking-widest">{item.label}</p>
                              <p className="text-[10px] text-slate-600 line-through">{item.old}</p>
                              <p className="text-sm text-white font-bold">{item.new}</p>
                           </div>
                        ))}
                    </div>
                </div>
              </div>
            </motion.div>

            {/* 2. OTA SYNC (Narrow) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 p-8"
            >
               <h4 className="text-xl font-bold mb-2">Real-time Hub</h4>
               <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Master inventory synced to BDC, MMT, Agoda & Airbnb instantly.</p>
               
               {/* VISUAL: PULSING HUB */}
               <div className="flex justify-center items-center py-4 relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute w-16 h-16 rounded-full bg-blue-500/20"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white z-10 shadow-lg">
                    <RefreshCw className="w-6 h-6 animate-spin-slow" />
                  </div>
                  {/* Floating OTA icons */}
                  {[0, 90, 180, 270].map((deg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1, x: Math.cos(deg * Math.PI / 180) * 50, y: Math.sin(deg * Math.PI / 180) * 50 }}
                      transition={{ delay: 1 + (i * 0.1) }}
                      className="absolute w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-gray-100 dark:border-slate-700 flex items-center justify-center text-[8px] font-black"
                    >
                      {['BDC', 'MMT', 'AGO', 'AIR'][i]}
                    </motion.div>
                  ))}
               </div>
            </motion.div>

            {/* 3. CALENDAR HEATMAP (Small) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8"
            >
               <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Smart Forecast</h4>
               <p className="text-sm text-gray-500 mb-6">See demand spikes before they happen.</p>
               
               {/* VISUAL: MINI HEATMAP */}
               <div className="grid grid-cols-5 gap-1.5 opacity-80">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-8 rounded-md ${i === 7 || i === 8 || i === 12 ? 'bg-orange-500 scale-110 shadow-lg shadow-orange-500/30' : 'bg-blue-100 dark:bg-slate-800'}`}
                    />
                  ))}
               </div>
               <div className="mt-3 flex justify-between text-[10px] font-bold text-orange-500 animate-pulse uppercase">
                  <span>Standard</span>
                  <span>⚠ High Demand Day</span>
               </div>
            </motion.div>

            {/* 4. SMART ANALYTICS (Bottom Wide) */}
            <motion.div 
               initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
               className="md:col-span-6 md:row-span-1 relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-500/5 to-transparent border border-gray-200 dark:border-slate-800 p-8 flex items-center justify-between"
            >
               <div className="max-w-md">
                 <h4 className="text-2xl font-black mb-3">Predictive Analytics</h4>
                 <p className="text-gray-600 dark:text-gray-400">Track ADR, RevPAR, and occupancy trends with clear, actionable charts that tell you exactly what's working.</p>
               </div>
               
               {/* VISUAL: COMPACT CHART */}
               <div className="hidden lg:flex gap-2 items-end h-32 pr-20">
                  {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className={`w-4 rounded-full ${i === 6 ? 'bg-emerald-500 shadow-xl shadow-emerald-500/30' : 'bg-slate-200 dark:bg-slate-800'}`}
                    />
                  ))}
                  <div className="ml-4 text-emerald-500">
                     <TrendingUp className="w-8 h-8" />
                     <p className="text-xs font-black">+24%</p>
                  </div>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Contact & Demo CTA Section */}
      <section className="relative z-10 bg-slate-50 dark:bg-slate-950 py-32 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative p-10 md:p-20 rounded-[3rem] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden text-center"
          >
            {/* Background design */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-8 relative z-10">
              Ready to grow your RevPAR?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Join the new generation of revenue-focused hoteliers. Start your 30-day journey to better occupancy today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <a
                href="mailto:business.gaarv@gmail.com?subject=Roomora%20Demo%20Request"
                className="px-10 py-5 rounded-full text-lg font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                Request 1-on-1 Demo <Sparkles className="w-5 h-5" />
              </a>
              <Link
                to="/signup"
                className="px-10 py-5 rounded-full text-lg font-black bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white shadow-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Start Free Trial
              </Link>
            </div>
            <p className="mt-10 text-sm font-medium text-gray-500 dark:text-gray-400 relative z-10">
              No credit card required · Instant setup · Multi-tenant secure
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-12 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs">R</div>
            Roomora.
          </div>
          <p>© 2026 Roomora Software. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-600 dark:hover:text-primary-400 transition">Terms</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-primary-400 transition">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


