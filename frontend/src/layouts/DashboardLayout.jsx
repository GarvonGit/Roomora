import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarDays, 
  CalendarRange, 
  BarChart3, 
  Settings, 
  Moon, 
  Sun,
  LogOut,
  Bell,
  User,
  AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/inventory', icon: BedDouble, label: 'Inventory' },
  { path: '/bookings', icon: CalendarDays, label: 'Bookings' },
  { path: '/calendar', icon: CalendarRange, label: 'Calendar' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: 'Loading...', role: 'Admin', hotelName: 'Loading...' });
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: 'Payment Reminder',
      description: 'Your Roomora Pro plan will renew in 30 days. Please ensure your card on file is active.',
      time: '2 hours ago',
      type: 'billing',
      read: false
    },
    {
      id: 2,
      title: 'New Booking Received',
      description: 'Rahul Sharma booked a Deluxe Room via Booking.com checking in on Apr 1st.',
      time: '4 hours ago',
      type: 'booking',
      read: false
    },
    {
      id: 3,
      title: 'New Booking Received',
      description: 'Amit Patel booked an Executive Suite via Airbnb checking in on Apr 2nd.',
      time: 'Yesterday',
      type: 'booking',
      read: true
    },
    {
      id: 4,
      title: 'Integration Alert',
      description: 'Airbnb API keys were successfully synchronized.',
      time: '2 days ago',
      type: 'system',
      read: true
    }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Synchronize globally with the backend context
    import('../utils/api').then(({ default: api }) => {
      api.get('/auth/me').then(res => {
         if(res.data?.user) {
            setUser(prev => ({ ...prev, ...res.data.user }));
         }
      }).catch(console.error);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getDaysUntilExpiry = () => {
    if (!user.plan_expiry) return null;
    const diffTime = new Date(user.plan_expiry) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysToExpiry = getDaysUntilExpiry();
  const showWarning = daysToExpiry !== null && daysToExpiry <= 7;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
      {/* Top Warning Banner for Plan Expiry */}
      {showWarning && (
        <div className="bg-red-500 text-white text-sm font-medium py-2 px-4 flex justify-center items-center gap-2 z-50">
          <AlertTriangle className="w-4 h-4" />
          {daysToExpiry > 0 
            ? `Your Roomora ${user.plan_name} plan expires in ${daysToExpiry} days.` 
            : `Your Roomora ${user.plan_name} plan has expired.`}
          <NavLink to="/settings" className="underline ml-2 hover:text-red-100">Renew now</NavLink>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 flex flex-col transition-colors z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-500 font-bold text-xl">
            <BedDouble className="w-6 h-6" />
            <span>Roomora</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-700/30 border border-transparent dark:border-primary-700/50 flex items-center justify-center text-primary-600 dark:text-primary-100 font-bold uppercase">
              {user.username.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.username}</p>
              <p className="text-xs truncate">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between px-6 transition-colors">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 capitalize">
            {window.location.pathname.replace('/', '')}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium bg-gray-50 dark:bg-dark-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600">
              <User className="w-4 h-4 text-gray-500" />
              {user.hotelName}
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-dark-800"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center bg-gray-50 dark:bg-dark-800/50">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                    <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-700/30 dark:text-primary-100 py-0.5 px-2 rounded-full font-medium border border-transparent dark:border-primary-700/30">2 New</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map(notification => (
                      <div key={notification.id} className={`p-4 border-b border-gray-50 dark:border-dark-700/50 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors cursor-pointer ${notification.read ? 'opacity-70' : 'bg-primary-50/30 dark:bg-dark-700/50'}`}>
                         <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{notification.title}</h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notification.time}</span>
                         </div>
                         <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{notification.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100 dark:border-dark-700 text-center bg-gray-50 dark:bg-dark-800/50">
                    <NavLink to="/settings" onClick={() => setShowNotifications(false)} className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">View All in Settings</NavLink>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-dark-900 p-6 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
    </div>
  );
}
