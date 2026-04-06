import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CalendarDays, RefreshCw, BarChart3, ShieldCheck } from 'lucide-react';

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
          Powered by Local Ollama AI · Free &amp; Private
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
      <section className="relative z-10 bg-white dark:bg-slate-900 py-24 border-y border-gray-100 dark:border-slate-800 transition-colors duration-300 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-6">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">dominate</span> your local market.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Roomora is built for Indian hoteliers — from boutique properties to mid-size hotels. Centralize bookings, eliminate overbooking, and grow revenue with smart automation.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto] md:auto-rows-[minmax(250px,_auto)]"
          >
            {/* Box 1 (Large) - AI Pricing */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-900 to-slate-900 border border-slate-800 p-8 md:p-12 flex flex-col justify-end min-h-[400px]"
            >
              {/* Decorative Glows */}
              <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-500/20 rounded-full blur-[100px]"></motion.div>
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }} className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px]"></motion.div>

              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="bg-white/10 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/10 relative z-10"
              >
                <Sparkles className="w-8 h-8 text-blue-300" />
              </motion.div>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 relative z-10 tracking-tight">AI-Powered Dynamic Pricing</h3>
              <p className="text-blue-100/70 text-lg md:text-xl max-w-xl relative z-10 leading-relaxed font-medium">
                Our built-in AI analyzes occupancy, upcoming occasions, historical data, and demand patterns to recommend optimal prices and multipliers automatically. Get profitable suggestions you can apply in one click.
              </p>
            </motion.div>

            {/* Box 2 - OTA Sync */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 flex flex-col hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-colors duration-300"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform duration-300">
                <RefreshCw className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-3">Seamless OTA Sync</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Instant two-way updates with MakeMyTrip, Goibibo, Booking.com, Agoda, and more. Never double-book again. Push prices and inventory across all channels simultaneously.
              </p>
            </motion.div>

            {/* Box 3 - Smart Calendar */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 flex flex-col hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-colors duration-300"
            >
              <div className="bg-orange-100 dark:bg-orange-900/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400 group-hover:-rotate-12 transition-transform duration-300">
                <CalendarDays className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-3">Smart Visual Calendar</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                See your entire month at a glance — automated pricing strategies, booking limits, occupancy forecasts, and holiday impacts.
              </p>
            </motion.div>

            {/* Box 4 - Predictive Analytics */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 flex items-center hover:shadow-2xl hover:shadow-green-500/10 transition-colors duration-300 min-h-[250px]"
            >
              <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 group-hover:opacity-[0.15] dark:group-hover:opacity-30 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-all duration-700">
                <BarChart3 className="w-64 h-64 text-green-500 translate-x-12 translate-y-16" />
              </div>
              <div className="relative z-10 max-w-lg">
                <div className="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-500">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-3">Actionable Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Track ADR, RevPAR, occupancy trends, and revenue KPIs with clear charts. Know exactly what's working and where to improve.
                </p>
              </div>
            </motion.div>

            {/* Box 5 - Secure / Try Now */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 border border-purple-400 shadow-xl p-8 flex flex-col justify-center items-center text-center hover:shadow-purple-500/40 transition-colors duration-500"
            >
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                <ShieldCheck className="w-12 h-12 mb-4 text-white opacity-90" />
              </motion.div>
              <h3 className="text-2xl font-black tracking-tight text-white mb-2">Enterprise-Grade Security</h3>
              <p className="text-indigo-100 leading-relaxed mb-8 flex-grow text-sm">
                Multi-tenant isolation, audit logs, and secure data handling so your hotel information stays private and protected.
              </p>
              <Link to="/signup" className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-full hover:scale-105 transition-transform w-full shadow-lg shadow-black/10">
                Start Free Trial
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact & Demo CTA Section */}
      <section className="relative z-10 bg-slate-50 dark:bg-slate-950 py-24 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="p-10 md:p-14 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Ready to increase your occupancy and ADR?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Join hundreds of smart hotel owners who are using Roomora to run more profitable properties with less daily effort.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:business.gaarv@gmail.com?subject=Roomora%20Demo%20Request"
                className="px-8 py-4 rounded-full text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                Request a Live Demo
              </a>
              <a
                href="mailto:business.gaarv@gmail.com?subject=Roomora%20Sales%20Enquiry"
                className="px-8 py-4 rounded-full text-base font-bold bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white shadow-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                Contact Sales
              </a>
            </div>
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Or email us directly at <a href="mailto:business.gaarv@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">business.gaarv@gmail.com</a>
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


