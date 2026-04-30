import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, MapPin } from 'lucide-react';

export default function NGODashboard({ token }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchAvailableFood = async () => {
    try {
      const res = await fetch('https://ahar-seva-backend.onrender.com/api/food/all-food', {
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
    fetchAvailableFood();
  }, []);

  const handleAccept = async (foodId) => {
    setAcceptingId(foodId);
    try {
      const res = await fetch(`https://ahar-seva-backend.onrender.com/api/food/accept-food/${foodId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setFoods(foods.filter(f => f._id !== foodId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#3D3D30]">Available Surplus <span className="text-accent-sage text-xl ml-2 font-light italic">{foods.length} nearby</span></h1>
          <p className="text-gray-400 font-medium mt-1">Discover nourishing meals waiting to be shared.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2 bg-white border border-warm-border rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-warm-bg transition-colors shadow-sm">Filter</button>
          <button className="px-5 py-2 bg-white border border-warm-border rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-warm-bg transition-colors shadow-sm">Sort by Distance</button>
        </div>
      </header>

      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white/50 rounded-[40px] border border-dashed border-warm-border">
            <div className="w-12 h-12 border-4 border-primary-olive border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-serif italic text-lg">Scanning the local harvest...</p>
          </div>
        ) : foods.length === 0 ? (
          <div className="bg-white border border-warm-border rounded-[40px] p-20 text-center shadow-sm">
            <div className="w-20 h-20 bg-warm-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-warm-border" size={40} />
            </div>
            <p className="text-2xl font-serif font-bold text-[#3D3D30] mb-2">The table is empty.</p>
            <p className="text-gray-400 font-medium">Check back soon for new surplus from hotels.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foods.map((food, idx) => (
              <motion.div 
                key={food._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[32px] p-8 border border-warm-border shadow-sm flex flex-col justify-between hover:border-primary-olive hover:shadow-xl transition-all group"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-warm-bg rounded-2xl group-hover:bg-primary-olive/5 transition-colors">
                      <span className="text-3xl">🥘</span>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${food.status === 'available' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {food.status === 'available' ? 'Freshly Listed' : 'Claimed'}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-bold mb-1 text-[#3D3D30] group-hover:text-primary-olive transition-colors">{food.foodName}</h3>
                  <p className="text-sm text-gray-400 mb-6 font-medium">Prepared with care by {food.hotelName}</p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Quantity</span>
                      <span className="text-sm font-bold text-primary-olive">{food.quantity}</span>
                    </div>
                    {food.location && (
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                          <MapPin size={10} />
                          Location
                        </span>
                        <span className="text-sm font-bold text-primary-olive">{food.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => handleAccept(food._id)}
                    disabled={acceptingId === food._id}
                    className="w-full py-4 bg-primary-olive text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#4A4A35] transition-all shadow-lg shadow-primary-olive/20 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {acceptingId === food._id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      "Accept Donation"
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Posted {new Date(food.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
