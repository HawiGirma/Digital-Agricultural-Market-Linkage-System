import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  Settings,
  MapPin,
  CreditCard,
  Bell,
  LogOut
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatETB } from '../utils/formatCurrency';

export function Account() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const { favoriteItems, removeFavorite, orders } = useCart();
  const { user, logout, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    updateUser({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
      fullName: `${profileForm.firstName} ${profileForm.lastName}`,
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const addressList = [
    {
      id: 'home',
      title: 'Home Address',
      name: user?.fullName || 'John Doe',
      address: '123 Greenway Avenue, Apt 4B',
      city: 'San Francisco, CA 94107',
      phone: user?.phone || '+1 (555) 123-4567',
    },
    {
      id: 'work',
      title: 'Work Address',
      name: user?.fullName || 'John Doe',
      address: '456 Market Street, Floor 12',
      city: 'San Francisco, CA 94111',
      phone: user?.phone || '+1 (555) 987-6543',
    },
  ];

  const paymentList = [
    {
      id: 'visa',
      label: 'Visa',
      details: '**** **** **** 4821',
      expires: '09/28',
      cardholder: user?.fullName || 'John Doe',
    },
    {
      id: 'paypal',
      label: 'PayPal',
      details: user?.email || 'john.doe@email.com',
      expires: 'Connected',
      cardholder: 'PayPal Account',
    },
  ];

  const settingsList = [
    {
      id: 'newsletter',
      label: 'Email Newsletter',
      description: 'Receive updates about promotions and new products.',
      value: 'Subscribed',
    },
    {
      id: 'sms_alerts',
      label: 'SMS Alerts',
      description: 'Get shipping and order notifications by text message.',
      value: 'Enabled',
    },
    {
      id: 'saved_addresses',
      label: 'Saved Addresses',
      description: 'Manage locations used for fast checkout.',
      value: '2 saved',
    },
    {
      id: 'payment_methods',
      label: 'Payment Methods',
      description: 'Manage your saved cards and wallets.',
      value: '2 methods',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-emerald-950 dark:text-emerald-100 mb-2">
          My account
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          Profile, orders, and preferences — AgriLink Ethiopia MVP
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
            
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-xl shadow-md p-8">

            {/* PROFILE */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                <div className="space-y-6">
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-green-600" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">{user?.fullName || 'User'}</h3>
                      <p className="text-gray-600">{user?.email || 'user@email.com'}</p>
                      <button className="text-green-600 text-sm mt-2">
                        Change Profile Picture
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))}
                      placeholder="First Name"
                      className="input"
                    />
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Last Name"
                      className="input"
                    />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Email"
                      className="input"
                    />
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone"
                      className="input"
                    />
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Save Changes
                  </motion.button>

                </div>
              </div>
            )}

            {/* ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Order History</h2>

                {orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">No orders yet</p>
                    <p>Place an order from checkout to see it here.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border p-4 rounded-lg mb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div>
                          <p className="font-semibold">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatETB(order.total)}</p>
                          <p className="text-sm text-gray-500">{order.itemCount} items</p>
                        </div>
                      </div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-3">{order.status}</p>
                      {(order.deliveryLocation || order.phone) && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                          {order.customerName && <span>{order.customerName} · </span>}
                          {order.phone}
                          {order.deliveryLocation && (
                            <span className="block mt-1">{order.deliveryLocation}</span>
                          )}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* FAVORITES */}
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Favorites</h2>

                {favoriteItems.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">No favorites yet</p>
                    <p>Add products from the home page to see them here.</p>
                  </div>
                ) : (
                  favoriteItems.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg mb-3 gap-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-emerald-800 dark:text-emerald-400">{formatETB(p.price)}</span>
                        <button
                          onClick={() => removeFavorite(p.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ADDRESSES */}
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>

                {addressList.map((address) => (
                  <div key={address.id} className="border rounded-xl p-5 mb-4 bg-green-50">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{address.title}</p>
                        <p className="text-sm text-gray-500">{address.name}</p>
                      </div>
                      <span className="text-sm text-green-700 font-semibold">Primary</span>
                    </div>
                    <p className="text-gray-700">{address.address}</p>
                    <p className="text-gray-700">{address.city}</p>
                    <p className="text-gray-500 text-sm mt-2">{address.phone}</p>
                  </div>
                ))}
              </div>
            )}

            {/* PAYMENT */}
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>

                {paymentList.map((payment) => (
                  <div key={payment.id} className="border rounded-xl p-5 mb-4 bg-blue-50">
                    <div className="flex justify-between items-center gap-4 mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{payment.label}</p>
                        <p className="text-sm text-gray-500">{payment.cardholder}</p>
                      </div>
                      <span className="text-sm text-blue-700 font-semibold">{payment.expires}</span>
                    </div>
                    <p className="text-gray-700">{payment.details}</p>
                  </div>
                ))}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

                {settingsList.map((setting) => (
                  <div key={setting.id} className="border rounded-xl p-5 mb-4 bg-white">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{setting.label}</p>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <span className="text-sm text-gray-700 font-semibold">{setting.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </motion.div>

      </div>
    </div>
  );
}
export default Account;