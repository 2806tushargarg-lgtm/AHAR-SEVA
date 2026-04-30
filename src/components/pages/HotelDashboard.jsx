import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Package, CheckCircle } from 'lucide-react';

export default function HotelDashboard({ token }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newFood, setNewFood] = useState({ foodName: '', quantity: '', location: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchFoods = async () => {
    try {
      const res = await fetch('/api/food/my-food', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFoods(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleAddFood = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/food/add-food', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFood)
      });
      if (res.ok) {
        setNewFood({ foodName: '', quantity: '', location: '' });
        setShowModal(false);
        fetchFoods();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[32px] border border-warm-border shadow-sm">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#3D3D30]">Inventory Control</h1>
          <p className="text-gray-400 font-medium mt-1">Manage your surplus and track communal impact.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-3 bg-primary-olive text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#4A4A35] transition-all shadow-lg shadow-primary-olive/20 hover:shadow-primary-olive/30 active:scale-[0.98]"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-warm-border">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Your Contribution</h2>
            <div className="space-y-6">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-serif font-bold text-primary-olive">{foods.length}</span>
                <span className="text-sm text-gray-500 mb-2">Total Listings</span>
              </div>
              <div className="w-full bg-warm-bg h-2 rounded-full overflow-hidden">
                <div className="bg-primary-olive h-full w-full opacity-40 animate-pulse"></div>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-medium">Tracking your daily distribution goals. Every listing helps a family.</p>
            </div>
          </div>
          
          <div className="bg-primary-olive rounded-[32px] p-8 text-white shadow-lg shadow-primary-olive/10 flex flex-col justify-between h-56">
            <p className="text-xl font-serif italic leading-snug">"No one has ever become poor by giving."</p>
            <div className="flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-white/20"></div>
              <span className="text-[10px] uppercase tracking-widest opacity-60">Anne Frank</span>
            </div>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-9">
          <h2 className="text-xl font-bold text-[#3D3D30] mb-8 flex items-center gap-3 pl-2">
            <div className="w-2 h-2 bg-primary-olive rounded-full"></div>
            Recent Donations
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6 bg-white/50 rounded-[40px] border border-dashed border-warm-border">
              <div className="w-12 h-12 border-4 border-primary-olive border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 font-serif italic text-lg text-center">Syncing your kitchen inventory...</p>
            </div>
          ) : foods.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-warm-border rounded-[40px] p-24 text-center">
              <div className="w-24 h-24 bg-warm-bg rounded-full flex items-center justify-center mx-auto mb-8">
                <Package className="text-warm-border" size={48} />
              </div>
              <p className="text-2xl font-serif font-bold text-[#3D3D30] mb-2">Clean slate.</p>
              <p className="text-gray-400 font-medium mb-10">No donations listed yet. What's extra in your kitchen today?</p>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-white border border-primary-olive text-primary-olive px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-warm-bg transition-colors"
              >
                Create First Entry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {foods.map((food, idx) => (
                <motion.div 
                  key={food._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white rounded-[32px] p-8 border border-warm-border shadow-sm flex flex-col justify-between group hover:border-primary-olive transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-warm-bg rounded-2xl group-hover:bg-primary-olive/5 transition-colors">
                        <span className="text-3xl">🥘</span>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${food.status === 'available' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                        {food.status}
                      </span>
                    </div>
                    
                    <h3 className="font-serif font-bold text-2xl text-[#3D3D30] mb-2">{food.foodName}</h3>
                    
                    <div className="flex flex-wrap gap-6 mt-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Quantity</span>
                        <span className="text-sm font-bold text-primary-olive">{food.quantity}</span>
                      </div>
                      {food.location && (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Pickup Info</span>
                          <span className="text-sm font-bold text-primary-olive">{food.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-warm-bg flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>Listed on {new Date(food.createdAt).toLocaleDateString()}</span>
                    {food.status === 'accepted' && (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle size={14} />
                        <span>Accepted by NGO</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#3D3D30]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-12 relative z-[101] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-olive to-accent-sage"></div>
              <h2 className="text-3xl font-serif font-bold mb-2">New Donation Entry</h2>
              <p className="text-sm text-gray-400 font-medium mb-8">Detail your surplus to connect with nearby NGOs.</p>
              
              <form onSubmit={handleAddFood} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3D3D30] mb-2 pl-1">Food Name</label>
                  <input 
                    className="w-full px-6 py-4 bg-warm-bg border border-warm-border rounded-2xl outline-none focus:ring-2 focus:ring-primary-olive font-medium text-[#3D3D30]"
                    placeholder="e.g. Garden Buffet Spread"
                    value={newFood.foodName}
                    onChange={(e) => setNewFood({...newFood, foodName: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3D3D30] mb-2 pl-1">Quantity</label>
                    <input 
                      className="w-full px-6 py-4 bg-warm-bg border border-warm-border rounded-2xl outline-none focus:ring-2 focus:ring-primary-olive font-medium text-[#3D3D30]"
                      placeholder="e.g. 30 servings"
                      value={newFood.quantity}
                      onChange={(e) => setNewFood({...newFood, quantity: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3D3D30] mb-2 pl-1">Pickup Point</label>
                    <input 
                      className="w-full px-6 py-4 bg-warm-bg border border-warm-border rounded-2xl outline-none focus:ring-2 focus:ring-primary-olive font-medium text-[#3D3D30]"
                      placeholder="e.g. Lobby Entrance"
                      value={newFood.location}
                      onChange={(e) => setNewFood({...newFood, location: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 rounded-2xl border border-warm-border font-bold uppercase tracking-widest text-[10px] hover:bg-warm-bg transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-1 bg-primary-olive text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#4A4A35] transition-all shadow-lg shadow-primary-olive/20 disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Broadcast Listing'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
