import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Phone, MapPin, ShoppingCart, Star, Clock, Package, X, ExternalLink } from 'lucide-react';
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
    name: 'Kisan Agri Services', 
    lat: 26.9124, 
    lng: 75.7873, 
    address: 'Jaipur, Rajasthan', 
    phone: '9829012345',
    rating: 4.5,
    reviews: 450,
    image: 'https://images.unsplash.com/photo-1595009552535-be753427d05f?auto=format&fit=crop&q=80&w=400',
    description: 'Specialized in multi-brand agri inputs and advisory services across Rajasthan.',
    products: ['Agri Inputs', 'Advisory', 'Seeds'],
    hours: '9:00 AM - 6:00 PM',
    delivery: true
  },
  { 
    id: 2, 
    name: 'Infinite Biotech', 
    lat: 23.0225, 
    lng: 72.5714, 
    address: 'Ahmedabad, Gujarat 380051', 
    phone: '9909012345',
    rating: 4.7,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400',
    description: 'Leading producer of high-quality bio products and specialized fertilizers for sustainable growth.',
    products: ['Bio Products', 'Bio Fertilizers', 'Growth Promoters'],
    hours: '8:00 AM - 8:00 PM',
    delivery: true
  },
  { 
    id: 3, 
    name: 'Bhoomi Agro Company', 
    lat: 16.8302, 
    lng: 75.7100, 
    address: 'Vijayapur, Karnataka 586101', 
    phone: '9448012345',
    rating: 4.3,
    reviews: 180,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400',
    description: 'Trusted seeds and agri-machinery supplier serving the Karnataka farming belt.',
    products: ['Hybrid Seeds', 'Agri Tools', 'Tractors'],
    hours: '9:30 AM - 7:30 PM',
    delivery: false
  },
  { 
    id: 4, 
    name: 'IFFCO', 
    lat: 28.6139, 
    lng: 77.2090, 
    address: 'Nationwide (HQ: New Delhi)', 
    phone: '18001031967',
    rating: 4.9,
    reviews: 5000,
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=400',
    description: 'World\'s largest cooperative society providing affordable and high-quality fertilizers nationwide.',
    products: ['Urea', 'DAP', 'NPK Fertilizers'],
    hours: '10:00 AM - 5:00 PM',
    delivery: true
  },
  { 
    id: 5, 
    name: 'Coromandel International', 
    lat: 17.4447, 
    lng: 78.4664, 
    address: 'Nationwide (HQ: Hyderabad)', 
    phone: '18004252828',
    rating: 4.6,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43143ed6d?auto=format&fit=crop&q=80&w=400',
    description: 'India\'s leading provider of fertilizers, crop protection chemicals, and specialty nutrients.',
    products: ['Phosphatic Fertilizers', 'Pesticides', 'Organic Nutrients'],
    hours: '9:00 AM - 6:30 PM',
    delivery: true
  },
  { 
    id: 6, 
    name: 'UPL Limited', 
    lat: 19.0760, 
    lng: 72.8777, 
    address: 'Nationwide (HQ: Mumbai)', 
    phone: '2271528000',
    rating: 4.8,
    reviews: 3500,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9bdad1b69?auto=format&fit=crop&q=80&w=400',
    description: 'Global leader in sustainable agriculture providing advanced agrochemicals and crop solutions.',
    products: ['Agrochemicals', 'Pesticides', 'Post-harvest Solutions'],
    hours: '8:00 AM - 6:00 PM',
    delivery: true
  },
  { 
    id: 7, 
    name: 'Greenery Agri Center', 
    lat: 10.0528, 
    lng: 76.3305, 
    address: 'Kalamassery, Kerala', 
    phone: '9846054321',
    rating: 4.4,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400',
    description: 'Specialized pesticides and expert advice for intensive farming in the Kerala region.',
    products: ['Intensive Pesticides', 'Bio-fertilizers', 'Farm Consultation'],
    hours: '8:30 AM - 5:30 PM',
    delivery: true
  },
];

export default function SuppliersMap() {
  const [selectedShop, setSelectedShop] = useState<any>(null);
  // Center map on Central India coords for nationwide view
  const position: [number, number] = [20.5937, 78.9629];

  const handleWhatsAppOrder = (phone: string, shopName: string) => {
    const text = `Hello ${shopName},\nI would like to place an order for agricultural supplies.`;
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin size={24} className="text-primary" /> Suppliers Map
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Agri-shops within a 5km radius of your location.</p>
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
                    <ShoppingCart size={14} /> WhatsApp Order
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
        <span>Select a supplier below or tap a marker for detailed information.</span>
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
                  <ShoppingCart size={16} /> Order
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
                  <ShoppingCart size={20} /> Place Order via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

