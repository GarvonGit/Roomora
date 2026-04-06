import { useState, useEffect } from 'react';
import { RefreshCw, Edit, X } from 'lucide-react';
import api from '../utils/api';

export default function Inventory() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [rooms, setRooms] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Price & Inventory Modal State
  const [editingRoom, setEditingRoom] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [newAvailable, setNewAvailable] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    'Booking.com': true,
    'Agoda': true,
    'MakeMyTrip': true,
    'Goibibo': true
  });
  const [updateStatus, setUpdateStatus] = useState({ loading: false, message: '', error: false });
  const [logs, setLogs] = useState([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSuggestionStr, setAiSuggestionStr] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [selectedDate]);

  const fetchInventory = async () => {
    try {
      const res = await api.get(`/inventory?date=${selectedDate}`);
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
    setNewAvailable(room.available);
    setUpdateStatus({ loading: false, message: '', error: false });
    setAiSuggestionStr('');
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
      
      let invMsg = '';
      if (Number(newAvailable) !== editingRoom.available) {
        const soldCount = editingRoom.total_count - Number(newAvailable);
        await api.post('/inventory/update', { id: editingRoom.id, sold_count: soldCount, date: selectedDate });
        invMsg = ' & Inventory synced';
        fetchInventory(); // refresh list to secure new available count
      }
      
      setUpdateStatus({ loading: false, message: res.data.message + invMsg, error: false });
      setLogs(res.data.logs);
      
      // Update local state for price
      setRooms(rooms.map(r => r.id === editingRoom.id ? { ...r, base_price: Number(newPrice), available: Number(newAvailable) } : r));
      
      // Auto close after success
      setTimeout(() => {
        setEditingRoom(null);
      }, 2000);
    } catch (err) {
      setUpdateStatus({ loading: false, message: 'Failed to update price', error: true });
    }
  };

  const handleQuickInventoryChange = async (room, delta) => {
    const newAvailable = Math.min(Math.max(0, room.available + delta), room.total_count);
    if (newAvailable === room.available) return;
    
    // Instantly update UI for snappy feedback
    setRooms(rooms.map(r => r.id === room.id ? { ...r, available: newAvailable } : r));

    const soldCount = room.total_count - newAvailable;
    
    try {
      await api.post('/inventory/update', { id: room.id, sold_count: soldCount, date: selectedDate });
    } catch(err) {
      console.error('Failed to quick update inventory:', err);
      fetchInventory(); // Revert on failure
    }
  };

  const handleAskAI = async () => {
    setIsAILoading(true);
    setUpdateStatus({ loading: false, message: 'Analyzing data locally...', error: false });
    setAiSuggestionStr('');
    try {
      const occupancy = editingRoom.total_count > 0 
        ? Math.round(((editingRoom.total_count - newAvailable) / editingRoom.total_count) * 100) 
        : 0;
        
      const res = await api.post('/pricing/suggest-ai', {
        base_price: Number(editingRoom.base_price),
        occupancy: occupancy,
        occasions: [], // Could fetch holidays here
        historical_summary: "Typical local demand for this time.",
        demand_matrix: { "weekend": false }
      });
      
      const data = res.data;
      if (data.error) {
        setUpdateStatus({ loading: false, message: data.error + ': ' + data.fallback, error: true });
      } else {
        setNewPrice(data.suggested_price || Math.floor(editingRoom.base_price * data.multiplier));
        setUpdateStatus({ loading: false, message: 'AI Suggestion APPLIED automatically.', error: false });
        setAiSuggestionStr(`Reasoning: ${data.reasoning} | Confidence: ${data.confidence}%`);
      }
    } catch(err) {
      setUpdateStatus({ loading: false, message: 'Local AI failed to respond', error: true });
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Master Inventory & Channel Sync</h2>
          <p className="text-gray-500 text-sm">Manage room availability and dynamic pricing across all platforms</p>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field py-2"
          />
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Update All Channels'}
          </button>
        </div>
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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 dark:bg-dark-800 rounded-lg p-1">
                      <button 
                        onClick={() => handleQuickInventoryChange(room, -1)}
                        disabled={room.available <= 0}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-dark-700 rounded shadow-sm disabled:opacity-30 transition-all font-bold"
                      >-</button>
                      <span className={`w-8 text-center text-sm font-bold ${
                        room.available <= 2 ? 'text-red-500' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {room.available}
                      </span>
                      <button 
                        onClick={() => handleQuickInventoryChange(room, 1)}
                        disabled={room.available >= room.total_count}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-dark-700 rounded shadow-sm disabled:opacity-30 transition-all font-bold"
                      >+</button>
                    </div>
                    <span className="text-xs text-gray-400">/ {room.total_count}</span>
                  </div>
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
              <h3 className="font-semibold text-lg">Manage Room for {new Date(selectedDate).toLocaleDateString()}</h3>
              <button onClick={() => setEditingRoom(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePriceUpdate} className="p-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Room Type</p>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{editingRoom.type}</p>
                  <p className="text-xs text-gray-400">Total Capacity: {editingRoom.total_count}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <button 
                    type="button" 
                    onClick={handleAskAI} 
                    disabled={isAILoading}
                    className="mt-2 text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded hover:bg-purple-200 transition-colors flex items-center justify-center gap-1 w-full"
                  >
                    {isAILoading ? 'Thinking...' : '🤖 Ask Roomora AI'}
                  </button>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Available Rooms</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    max={editingRoom.total_count}
                    value={newAvailable}
                    onChange={(e) => setNewAvailable(e.target.value)}
                    className="input-field"
                    placeholder="Unsold count"
                  />
                </div>
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
              
              {aiSuggestionStr && (
                <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg text-xs text-purple-800 dark:bg-purple-900/10 dark:border-purple-800/30 dark:text-purple-300">
                  {aiSuggestionStr}
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
