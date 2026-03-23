import { useState, useEffect } from 'react';
import { RefreshCw, Edit, X } from 'lucide-react';
import api from '../utils/api';

export default function Inventory() {
  const [rooms, setRooms] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Price Update Modal State
  const [editingRoom, setEditingRoom] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    'Booking.com': true,
    'Agoda': true,
    'MakeMyTrip': true,
    'Goibibo': true
  });
  const [updateStatus, setUpdateStatus] = useState({ loading: false, message: '', error: false });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await api.post('/inventory/sync-all');
      alert('Channels synced successfully');
    } catch(err) {
      console.error(err);
    }
    setIsSyncing(false);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setNewPrice(room.base_price);
    setUpdateStatus({ loading: false, message: '', error: false });
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handlePriceUpdate = async (e) => {
    e.preventDefault();
    const platforms = Object.keys(selectedPlatforms).filter(k => selectedPlatforms[k]);
    
    if (platforms.length === 0) {
      setUpdateStatus({ loading: false, message: 'Select at least one platform', error: true });
      return;
    }

    setUpdateStatus({ loading: true, message: 'Updating prices...', error: false });

    try {
      const res = await api.post('/pricing/update', {
        roomId: editingRoom.id,
        newPrice: Number(newPrice),
        platforms
      });
      
      setUpdateStatus({ loading: false, message: res.data.message, error: false });
      setLogs(res.data.logs);
      
      // Update local state
      setRooms(rooms.map(r => r.id === editingRoom.id ? { ...r, base_price: Number(newPrice) } : r));
      
      // Auto close after success
      setTimeout(() => {
        setEditingRoom(null);
      }, 2000);
    } catch (err) {
      setUpdateStatus({ loading: false, message: 'Failed to update price', error: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Master Inventory & Channel Sync</h2>
          <p className="text-gray-500 text-sm">Manage room availability and dynamic pricing across all platforms</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Update All Channels'}
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-dark-700 text-gray-500 dark:text-gray-400">
              <th className="pb-3 px-4 font-medium">Room Type</th>
              <th className="pb-3 px-4 font-medium">Total Rooms</th>
              <th className="pb-3 px-4 font-medium">Available</th>
              <th className="pb-3 px-4 font-medium">Base Price</th>
              <th className="pb-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                <td className="py-4 px-4 font-medium">{room.type}</td>
                <td className="py-4 px-4">{room.total_count}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    room.available > 5 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {room.available} Left
                  </span>
                </td>
                <td className="py-4 px-4 font-medium">₹{room.base_price.toLocaleString('en-IN')}/night</td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => openEditModal(room)} className="p-2 text-gray-500 hover:text-primary-600 transition-colors bg-gray-100 dark:bg-dark-800 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length > 0 && (
        <div className="card mt-6">
          <h3 className="font-semibold mb-3">Recent Price Updates Audit Log</h3>
          <div className="space-y-2">
            {logs.slice().reverse().map((log) => (
              <div key={log.id} className="text-sm p-3 bg-gray-50 dark:bg-dark-800 rounded">
                <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span> - 
                Room {rooms.find(r=>r.id === log.room_id)?.type} price changed from <span className="line-through text-red-500">₹{log.old_price}</span> to <span className="font-semibold text-green-500">₹{log.new_price}</span> by {log.changed_by}.
                <div className="mt-1 text-xs text-gray-500">Platforms Updated: {log.platforms_updated}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-dark-700">
              <h3 className="font-semibold text-lg">Selective Price Update</h3>
              <button onClick={() => setEditingRoom(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePriceUpdate} className="p-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Room Type</p>
                <p className="font-semibold">{editingRoom.type}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">New Price (₹)</label>
                <input 
                  type="number" 
                  required 
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="input-field"
                  placeholder="e.g. 2000"
                />
              </div>

              <div className="pt-2">
                <label className="text-sm font-medium mb-2 block">Select Target Platforms</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(selectedPlatforms).map(platform => (
                    <label key={platform} className="flex items-center gap-2 text-sm cursor-pointer p-2 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedPlatforms[platform]}
                        onChange={() => handlePlatformToggle(platform)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 bg-white dark:bg-dark-900 w-4 h-4 cursor-pointer"
                      />
                      {platform}
                    </label>
                  ))}
                </div>
              </div>

              {updateStatus.message && (
                <div className={`p-3 rounded-lg text-sm ${updateStatus.error ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'}`}>
                  {updateStatus.message}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingRoom(null)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={updateStatus.loading} className="btn-primary">
                  {updateStatus.loading ? 'Updating...' : 'Update Prices'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
