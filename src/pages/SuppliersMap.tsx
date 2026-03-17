import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Phone, MapPin, ShoppingCart } from 'lucide-react';
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
  { id: 1, name: 'Krishi Bhavan Fertilisers', lat: 10.0159, lng: 76.3419, address: 'Near Kakkanad, Ernakulam', phone: '9846012345' },
  { id: 2, name: 'Greenery Agri Center', lat: 10.0180, lng: 76.3390, address: 'Vazhakkala, Ernakulam', phone: '9846054321' },
  { id: 3, name: 'Agro Seeds & Co', lat: 10.0120, lng: 76.3450, address: 'Palarivattom, Ernakulam', phone: '9846099999' },
  { id: 4, name: 'Organic Farm Supplies', lat: 10.0200, lng: 76.3430, address: 'Edappally, Ernakulam', phone: '9846088888' },
];

export default function SuppliersMap() {
  // Center map on Ernakulam coords
  const position: [number, number] = [10.0159, 76.3419];

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
        <MapContainer center={position} zoom={14} scrollWheelZoom={false} className="h-full w-full rounded-xl">
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
        <span>Tap on a marker to see details and order directly via WhatsApp.</span>
      </div>
    </div>
  );
}

