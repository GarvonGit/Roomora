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
          Powered by Google Gemini 2.5 AI
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl"
        >
          The intelligent OS for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-primary-400 dark:to-blue-400">
            modern hotel revenue.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl leading-relaxed"
        >
          Automate dynamic pricing, seamlessly manage your live inventory, and skyrocket your booking profits with real-time OTA integration and predictive AI intelligence.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link to="/signup" className="px-8 py-4 rounded-full text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2">
            Start Free Trial
          </Link>
          <Link to="/dashboard" className="px-8 py-4 rounded-full text-base font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-transform active:scale-95 flex items-center justify-center gap-2">
            Go to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Dashboard Preview Image using a polished CSS layout mock */}
        <motion.div 
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
          className="mt-20 w-full max-w-5xl relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 dark:opacity-40 animate-pulse" />
          <div className="relative rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl p-2 md:p-4 overflow-hidden">
            {/* Mock Dashboard Top Bar */}
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="mx-auto px-4 py-1 rounded bg-gray-100 dark:bg-slate-800 text-xs text-gray-500 dark:text-gray-400 font-mono tracking-wider">
                app.roomora.co
              </div>
            </div>
            
            {/* Mock Dashboard Content area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* Sidebar mock */}
               <div className="hidden md:flex flex-col gap-3 p-4 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-800">
                  <div className="h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center px-3 mb-4">
                     <div className="h-2 w-16 bg-blue-500 rounded-full" />
                  </div>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-6 flex items-center px-3 gap-2 opacity-50">
                      <div className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-slate-700" />
                      <div className="h-2 w-20 bg-gray-300 dark:bg-slate-700 rounded-full" />
                    </div>
                  ))}
               </div>
               
               {/* Main content mock */}
               <div className="col-span-2 flex flex-col gap-4 p-2 md:p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="h-5 w-32 bg-gray-800 dark:bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-48 bg-gray-300 dark:bg-gray-600 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                     {[1, 2, 3, 4].map(i => (
                       <div key={i} className="aspect-video bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-800 p-4 flex flex-col justify-between hover:border-blue-300 transition-colors">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40" />
                          <div className="h-4 w-1/2 bg-gray-900 dark:bg-gray-100 rounded" />
                       </div>
                     ))}
                  </div>
                  <div className="h-48 mt-2 bg-gradient-to-t from-blue-50/50 to-transparent dark:from-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 flex items-end p-0 overflow-hidden">
                     <svg className="w-full h-24 text-blue-500 drop-shadow-md" viewBox="0 0 100 20" preserveAspectRatio="none">
                       <path d="M0,20 L0,5 L10,8 L20,3 L30,10 L40,4 L50,12 L60,2 L70,8 L80,1 L90,6 L100,0 L100,20 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
                     </svg>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 bg-white dark:bg-slate-900 py-24 border-y border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Everything you need to dominate your market.
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Stop leaving money on the table. Roomora seamlessly manages all aspects of hotel revenue with pure AI automation.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard 
               icon={Sparkles}
               title="AI Dynamic Pricing"
               description="Our Gemini AI engine calculates supply, demand, holidays, and live inventory to inject real-time scarcity markups and discounts automatically."
               delay={0.1}
            />
            <FeatureCard 
               icon={RefreshCw}
               title="Universal OTA Sync"
               description="MakeMyTrip, Agoda, Booking.com, Airbnb—we sync them all instantly. Never overbook a room again with secure webhook integrations."
               delay={0.2}
            />
            <FeatureCard 
               icon={CalendarDays}
               title="Smart Calendar"
               description="Visually track the entire month's pricing strategies and booking limits at a glance. Manage walk-ins with simple + and - availability controls."
               delay={0.3}
            />
            <FeatureCard 
               icon={BarChart3}
               title="Predictive Analytics"
               description="Gain historical and future insight on your ADR (Average Daily Rate) and RevPAR with flawless daily, weekly, and monthly visualizations."
               delay={0.4}
            />
            <FeatureCard 
               icon={ShieldCheck}
               title="Secure & Reliable"
               description="Backed by modern enterprise security paradigms so you can safely store data locally or sync to the cloud without worry."
               delay={0.5}
            />
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex flex-col justify-center overflow-hidden relative">
               <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
               <h3 className="text-2xl font-bold mb-2">Ready to transform your revenue?</h3>
               <Link to="/signup" className="mt-6 self-start px-6 py-2 bg-white text-blue-900 font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all">
                 Get Started
               </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Roomora Software Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <motion.div 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', delay: delay } }
      }}
      className="bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 p-8 rounded-2xl hover:shadow-xl hover:border-blue-100 dark:hover:border-slate-700 transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-primary-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
}
