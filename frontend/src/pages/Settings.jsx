import { useState, useEffect } from 'react';
import { Shield, Key, Building, Bell, CreditCard, Save, X, Eye, EyeOff, Plug, PlugZap, Hotel } from 'lucide-react';
import api from '../utils/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [integrations, setIntegrations] = useState([]);
  
  // Dynamic Profile State
  const [profile, setProfile] = useState({ hotelName: '', email: '', address: '123 Verified Road (Mock DB)' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal State
  const [selectedOTA, setSelectedOTA] = useState(null);
  const [showKeys, setShowKeys] = useState(false);

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
    // Fetch integrations
    api.get('/integrations').then(res => setIntegrations(res.data)).catch(err => console.error(err));
    // Fetch Profile
    api.get('/auth/me').then(res => {
       if(res.data?.user) {
         setProfile(prev => ({ ...prev, hotelName: res.data.user.hotelName || '', email: res.data.user.email || '' }));
       }
    }).catch(err => console.error(err));
  }, []);

  const tabs = [
    { id: 'profile', label: 'Hotel Profile', icon: Building },
    { id: 'security', label: 'Security & MFA', icon: Shield },
    { id: 'api', label: 'OTA Integrations', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const handleViewKeys = (ota) => {
    setSelectedOTA(ota);
    setShowKeys(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Settings & Configurations</h2>
        <p className="text-gray-500 text-sm">Manage your hotel, integrations, and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${activeTab === tab.id 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-dark-700 pb-4">Hotel Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hotel Name</label>
                  <input type="text" className="input-field" value={profile.hotelName} onChange={e => setProfile({...profile, hotelName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <input type="email" className="input-field" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <input type="text" className="input-field" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-dark-700 flex justify-end">
                <button 
                  onClick={async () => {
                     setIsSaving(true);
                     try {
                        await api.put('/settings/profile', { hotelName: profile.hotelName, email: profile.email });
                        alert('Profile successfully updated!');
                        // Refresh the UI context
                        window.location.reload();
                     } catch(err) {
                        alert('Error saving profile');
                     } finally {
                        setIsSaving(false);
                     }
                  }}
                  disabled={isSaving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-dark-700 pb-4">Authentication & Roles</h3>
              
              <div className="p-4 border border-gray-200 dark:border-dark-700 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-1">Multi-Factor Authentication (MFA)</h4>
                  <p className="text-sm text-gray-500">Require an extra security step (mock simulator) for sensitive actions.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="card space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-dark-700 pb-4">OTA Integrations</h3>
              <p className="text-sm text-gray-500 mb-6">Manage API connections mapping to active external channel managers.</p>

              <div className="space-y-4">
                {integrations.map(ota => (
                  <div key={ota.id} className="p-4 border border-gray-200 dark:border-dark-700 rounded-xl flex items-center justify-between gap-4 bg-gray-50 dark:bg-dark-800/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg flex items-center justify-center shadow-sm">
                        <Hotel className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{ota.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          {ota.connected ? (
                            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                              <PlugZap className="w-3.5 h-3.5" /> Connected
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                              <Plug className="w-3.5 h-3.5" /> Not Connected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleViewKeys(ota)}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      View API Keys
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="card space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-dark-700 pb-4">Notifications</h3>
              
              <div className="space-y-3">
                {mockNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-xl flex items-start gap-4 transition-colors relative overflow-hidden
                      ${notification.read 
                        ? 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700' 
                        : 'bg-primary-50 dark:bg-dark-700 border-primary-100 dark:border-dark-700 shadow-sm'}`}
                  >
                    {!notification.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>}
                    
                    <div className={`p-2 rounded-lg 
                      ${notification.type === 'billing' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 
                        notification.type === 'booking' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 
                        'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'}`}
                    >
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-semibold ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="card space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-dark-700 pb-4">Roomora Billing & Plans</h3>
              
              <div className="p-6 border border-gray-200 dark:border-dark-700 rounded-xl bg-white dark:bg-dark-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-primary-700/30 dark:text-primary-100 border border-transparent dark:border-primary-700/50">Popular</span>
                </div>
                <h4 className="text-xl font-bold mb-2">Roomora Pro</h4>
                <p className="text-gray-500 mb-4 text-sm">₹199 / month</p>
                <ul className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div> Unlimited OTA Integrations</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div> Dynamic Pricing AI</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div> Priority Support</li>
                </ul>
                <button 
                  onClick={async () => {
                    try {
                      // Dynamically load Razorpay SDK
                      const loadRazorpay = () => new Promise(resolve => {
                        const script = document.createElement('script');
                        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                        script.onload = () => resolve(true);
                        script.onerror = () => resolve(false);
                        document.body.appendChild(script);
                      });
                      
                      const res = await loadRazorpay();
                      if (!res) return alert('Razorpay SDK failed to load');

                      // Fetch Order from backend
                      const orderRes = await api.post('/payments/create-order');
                      const { order } = orderRes.data;
                      
                      const options = {
                        key: 'rzp_test_mockkey123', // Demo Mock Key
                        amount: order.amount,
                        currency: order.currency,
                        name: 'Roomora Software',
                        description: 'Pro Plan Upgrade',
                        order_id: order.id,
                        handler: async function (response) {
                          try {
                            const verifyRes = await api.post('/payments/verify', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
                            
                            // Rehydrate updated User Session state containing updated plan properties
                            const userRes = await api.get('/auth/me');
                            localStorage.setItem('user', JSON.stringify(userRes.data.user));
                            alert('Payment successful! You are now upgraded to Roomora Pro.');
                            window.location.reload();
                          } catch (e) {
                            alert('Verification failed');
                          }
                        },
                        theme: { color: '#0ea5e9' }
                      };
                      const rzp1 = new window.Razorpay(options);
                      rzp1.open();
                    } catch (e) {
                      console.error(e);
                      alert('Error initializing payment checkout.');
                    }
                  }}
                  className="w-full btn-primary py-2"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Keys Modal */}
      {selectedOTA && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-dark-700 bg-gray-50 dark:bg-dark-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded flex items-center justify-center">
                  <Hotel className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight">{selectedOTA.name} Keys</h3>
                  <p className="text-xs text-gray-500">Production credentials</p>
                </div>
              </div>
              <button onClick={() => setSelectedOTA(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowKeys(!showKeys)}
                  className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors bg-primary-50 dark:bg-primary-500/10 px-3 py-1.5 rounded-md"
                >
                  {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showKeys ? 'Hide Keys' : 'Show Keys'}
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
                  <div className="p-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg font-mono text-sm break-all">
                    {showKeys ? (selectedOTA.apiKey || 'Not generated') : '•'.repeat(24)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Secret Key</label>
                  <div className="p-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg font-mono text-sm break-all">
                    {showKeys ? (selectedOTA.secret || 'Not generated') : '•'.repeat(32)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint URL</label>
                  <div className="p-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg font-mono text-sm break-all text-blue-600 dark:text-blue-400">
                    {selectedOTA.endpoint}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-dark-800/50 border-t border-gray-100 dark:border-dark-700 flex justify-end gap-3">
              <button onClick={() => setSelectedOTA(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
