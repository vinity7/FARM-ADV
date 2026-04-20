import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Phone, MapPin, Truck, Star, Clock, Package, X, ExternalLink } from 'lucide-react';
import L from 'leaflet';

// Fix for missing marker icons in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const shops = [
  { 
    id: 1, 
    name: 'Pune Agri-Rental Hub', 
    lat: 18.5204, 
    lng: 73.8567, 
    address: 'Shivajinagar, Pune', 
    phone: '9829012345',
    rating: 4.8,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400',
    description: 'Premier rental service for modern tractors and sowing machinery in the Pune district.',
    products: ['Mahindra Tractor (₹1200/day)', 'Sowing Machine (₹800/day)', 'Rotary Tiller (₹600/day)'],
    hours: '8:00 AM - 7:00 PM',
    delivery: true
  },
  { 
    id: 2, 
    name: 'Mumbai Logistics & Rentals', 
    lat: 19.0760, 
    lng: 72.8777, 
    address: 'Bandra, Mumbai', 
    phone: '9909012345',
    rating: 4.6,
    reviews: 85,
    image: 'https://images.unsplash.com/photo-1586191128574-32354aa3da71?auto=format&fit=crop&q=80&w=400',
    description: 'Reliable transport vehicles for crop logistics. Trucks and mini-trucks available for daily hire.',
    products: ['Tata Ace (₹1500/day)', '407 Truck (₹3000/day)', 'Pick-up Van (₹1200/day)'],
    hours: '24/7 Service',
    delivery: true
  },
  { 
    id: 3, 
    name: 'Nagpur Harvester Experts', 
    lat: 21.1458, 
    lng: 79.0882, 
    address: 'Sitabuldi, Nagpur', 
    phone: '9448012345',
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1599908611100-3490b497c23a?auto=format&fit=crop&q=80&w=400',
    description: 'Expert combine harvesters and threshers for large scale farming operations.',
    products: ['Combine Harvester (₹2500/hr)', 'Seed Thresher (₹1200/day)', 'Power Tiller (₹1000/day)'],
    hours: '6:00 AM - 6:00 PM',
    delivery: false
  },
  { 
    id: 4, 
    name: 'Baramati Equipment Rental', 
    lat: 18.1506, 
    lng: 74.5771, 
    address: 'MIDC, Baramati', 
    phone: '9846054321',
    rating: 4.5,
    reviews: 90,
    image: 'https://images.unsplash.com/photo-1595009552535-be753427d05f?auto=format&fit=crop&q=80&w=400',
    description: 'Affordable manual and battery-operated equipment for small-scale farmers in Maharashtra.',
    products: ['Manual Seeder (₹200/day)', 'Battery Sprayer (₹150/day)', 'Hand Weeder (₹50/day)'],
    hours: '9:00 AM - 6:00 PM',
    delivery: true
  },
  { 
    id: 5, 
    name: 'Nashik Grape Equipment', 
    lat: 19.9975, 
    lng: 73.7898, 
    address: 'Panchavati, Nashik', 
    phone: '9765412345',
    rating: 4.7,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400',
    description: 'Specialized sprayers and pruning equipment for grape and onion farmers.',
    products: ['Power Sprayer (₹400/day)', 'Tractor-mounted Sprayer (₹1000/day)', 'Pruning Tools (₹100/day)'],
    hours: '7:30 AM - 8:00 PM',
    delivery: true
  },
  { 
    id: 6, 
    name: 'Kolhapur Heavy Agri', 
    lat: 16.7050, 
    lng: 74.2433, 
    address: 'Udyog Nagar, Kolhapur', 
    phone: '9881122334',
    rating: 4.9,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1599908611100-3490b497c23a?auto=format&fit=crop&q=80&w=400',
    description: 'Heavy machinery rentals for large scale sugarcane plantation and industrial farming.',
    products: ['Heavy Harvester (₹3000/hr)', 'Sugar Load Truck (₹4000/day)', 'Land Leveler (₹1500/day)'],
    hours: '6:00 AM - 10:00 PM',
    delivery: false
  },
  { 
    id: 7, 
    name: 'Satara Rental Hub', 
    lat: 17.6805, 
    lng: 73.9911, 
    address: 'Powai Naka, Satara', 
    phone: '9123456789',
    rating: 4.6,
    reviews: 54,
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400',
    description: 'General purpose farm equipment rentals for hilly terrain and small farms.',
    products: ['Mini Tractor (₹900/day)', 'Power Tiller (₹800/day)', 'Brush Cutter (₹300/day)'],
    hours: '8:00 AM - 6:00 PM',
    delivery: true
  },
  { 
    id: 8, 
    name: 'Sambhajinagar Rental Co.', 
    lat: 19.8762, 
    lng: 75.3433, 
    address: 'Cidco, Aurangabad', 
    phone: '9000100020',
    rating: 4.4,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1586191128574-32354aa3da71?auto=format&fit=crop&q=80&w=400',
    description: 'Providing tractors and water tankers for drought-prone regions and row crops.',
    products: ['Water Tanker 5000L (₹1200/trip)', 'Mahindra Jivo (₹1000/day)', 'Seed Drill (₹500/day)'],
    hours: '7:00 AM - 9:00 PM',
    delivery: true
  },
];

export default function SuppliersMap() {
  const [selectedShop, setSelectedShop] = useState<any>(null);
  // Center map on Central India coords for nationwide view
  const position: [number, number] = [20.5937, 78.9629];

  const handleWhatsAppOrder = (phone: string, shopName: string) => {
    const text = `Hello ${shopName},\nI would like to inquire about renting agricultural equipment (Machinery Info: ${selectedShop?.products.join(', ') || 'Various'}).`;
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package size={24} className="text-primary" /> Equipment Rental
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Rent tractors, trucks, and sowing machines within a 5km radius.</p>
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden h-[500px] z-0">
        <MapContainer center={position} zoom={5} scrollWheelZoom={false} className="h-full w-full rounded-xl">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {shops.map((shop) => (
            <Marker key={shop.id} position={[shop.lat, shop.lng]}>
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-slate-900 text-sm">{shop.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin size={12} className="shrink-0" /> {shop.address}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Phone size={12} className="shrink-0" /> {shop.phone}
                  </p>
                  
                  <button
                    onClick={() => handleWhatsAppOrder(shop.phone, shop.name)}
                    className="mt-3 flex items-center justify-center gap-1 w-full py-1.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
                  >
                    <Phone size={14} /> Contact for Rental
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Info Card */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
        <MapPin size={16} className="text-primary" />
        <span>Select a rental service below or tap a marker for equipment and rates.</span>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shops.map((shop) => (
          <div 
            key={shop.id}
            className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={shop.image} 
                alt={shop.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white shadow-sm">
                <Star size={12} className="text-yellow-400 fill-yellow-400" /> {shop.rating}
              </div>
              {shop.delivery && (
                <div className="absolute bottom-3 left-3 bg-primary/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                  Home Delivery
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                {shop.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {shop.description}
              </p>
              
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {shop.address.split(',')[0]}</span>
                <span className="flex items-center gap-1"><Clock size={14} className="text-primary" /> {shop.hours.split('-')[0]}</span>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedShop(shop)}
                  className="flex-1 py-2 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleWhatsAppOrder(shop.phone, shop.name)}
                  className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={16} /> Rent Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedShop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-64">
              <img 
                src={selectedShop.image} 
                alt={selectedShop.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedShop(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold">{selectedShop.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-200">
                  <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" /> {selectedShop.rating} ({selectedShop.reviews} reviews)</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {selectedShop.address}</span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">About Supplier</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedShop.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Package size={16} className="text-primary" /> Products Available
                  </h3>
                  <ul className="space-y-2">
                    {selectedShop.products.map((p: string) => (
                      <li key={p} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Clock size={16} className="text-primary" /> Business Hours
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{selectedShop.hours}</p>
                    <p className="text-xs text-slate-400 mt-1">Open All Days</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Info</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                      <Phone size={14} className="text-primary" /> +91 {selectedShop.phone}
                    </p>
                    <button className="text-xs text-primary font-bold mt-2 flex items-center gap-1 hover:underline">
                      <ExternalLink size={12} /> Get Directions on Google Maps
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex gap-4">
                <button
                  onClick={() => setSelectedShop(null)}
                  className="flex-1 py-3 px-6 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleWhatsAppOrder(selectedShop.phone, selectedShop.name)}
                  className="flex-[2] py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 dark:shadow-none transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={20} /> Inquire for Rental
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

