// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_PROFILE = {
  fullName: 'Venedict',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Venedict',
  mmr: 3294,
  isMember: true,
  membershipExpiry: 'Dec 25, 2026',
};

const INITIAL_HISTORY = [
  { id: 1, opponentName: 'Chris', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chris' },
  { id: 2, opponentName: 'Nazzer', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nazzer' },
  { id: 3, opponentName: 'Soffy', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Soffy' },
  { id: 4, opponentName: 'Kier', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kier' },
  { id: 5, opponentName: 'Owen', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Owen' },
];

const INITIAL_INVENTORY = [
  ...Array.from({ length: 10 }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    return {
      id: `paddle-${letter}`,
      name: `Paddle Pair ${letter}`,
      brand: 'PRO',
      category: 'Paddles',
      condition: i % 2 === 0 ? 'Brand New' : 'Excellent',
      desc: 'Pair of 2 graphite carbon paddles with cushioned grip.',
      isRented: false,
      baseRate: 100,
    };
  }),
  ...Array.from({ length: 5 }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    return {
      id: `ball-${letter}`,
      name: `Ball Set ${letter}`,
      brand: 'OFFICIAL',
      category: 'Balls',
      condition: 'Brand New',
      desc: 'Set of 5 USAPA approved outdoor pickleballs.',
      isRented: false,
      baseRate: 80,
    };
  }),
  ...Array.from({ length: 3 }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    return {
      id: `machine-${letter}`,
      name: `Ball Machine ${letter}`,
      brand: 'AUTO',
      category: 'Ball Machines',
      condition: 'Excellent',
      desc: '1 Automated ball launcher with adjustable speed and oscillation.',
      isRented: false,
      baseRate: 300,
    };
  }),
];

// Initial 5 Courts Catalog
const INITIAL_COURTS = [
  { id: 'court-1', name: 'Court 1', type: 'Indoor', surface: 'Pro Cushion Hardcourt', desc: 'Climate-controlled court with LED tournament lighting.', open: true, baseRate: 250 },
  { id: 'court-2', name: 'Court 2', type: 'Indoor', surface: 'Pro Cushion Hardcourt', desc: 'Standard indoor court with high-visibility boundary lines.', open: true, baseRate: 250 },
  { id: 'court-3', name: 'Court 3', type: 'Indoor', surface: 'Pro Cushion Hardcourt', desc: 'Acoustically damped court optimal for video review matches.', open: true, baseRate: 250 },
  { id: 'court-4', name: 'Court 4', type: 'Outdoor', surface: 'Acrylic Composite', desc: 'Shaded outdoor court with professional wind fence netting.', open: true, baseRate: 200 },
  { id: 'court-5', name: 'Court 5', type: 'Outdoor', surface: 'Acrylic Composite', desc: 'Outdoor court positioned for daytime tournament play.', open: true, baseRate: 200 },
];

export function AppProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('player');
  const [viewType, setViewType] = useState('mobile');

  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [matchHistory, setMatchHistory] = useState(INITIAL_HISTORY);
  const [notifications, setNotifications] = useState([]);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [courts, setCourts] = useState(INITIAL_COURTS);

  const [isQueuing, setIsQueuing] = useState(false);
  const [queueTime, setQueueTime] = useState(0);

  const equipments = inventory.filter(item => !item.isRented).length;

  useEffect(() => {
    let interval = null;
    if (isQueuing) {
      interval = setInterval(() => {
        setQueueTime(prev => prev + 1);
      }, 1000);
    } else {
      setQueueTime(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isQueuing]);

  const startQueue = () => {
    if (!profile.isMember) {
      alert('Membership inactive! Please subscribe to join the queue.');
      return;
    }
    setIsQueuing(true);
  };

  const cancelQueue = () => setIsQueuing(false);

  // Rent Equipment Action
  const rentItem = (itemId, durationHours) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item || item.isRented) return;

    const totalPrice = item.baseRate * durationHours;

    setInventory(prev => prev.map(invItem => 
      invItem.id === itemId ? { ...invItem, isRented: true } : invItem
    ));

    setNotifications(prev => [
      {
        id: Date.now(),
        targetId: item.id,
        itemType: 'equipment',
        title: item.name,
        duration: `${durationHours} hr(s)`,
        totalPrice: `₱${totalPrice}`,
        status: 'Pending Approval',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    alert(`Rental Pending! Request for ${item.name} sent for admin approval.`);
  };

  // Book Court Action
  const bookCourt = (courtId, durationHours) => {
    const court = courts.find(c => c.id === courtId);
    if (!court || !court.open) return;

    const totalPrice = court.baseRate * durationHours;

    setCourts(prev => prev.map(c => 
      c.id === courtId ? { ...c, open: false } : c
    ));

    setNotifications(prev => [
      {
        id: Date.now(),
        targetId: court.id,
        itemType: 'court',
        title: court.name,
        duration: `${durationHours} hr(s)`,
        totalPrice: `₱${totalPrice}`,
        status: 'Pending Approval',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    alert(`Court Booking Pending! Request for ${court.name} sent for admin approval.`);
  };

  // Cancel Pending Request (Works for both Equipment and Courts)
  const cancelRequest = (notifId, targetId, itemType) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));

    if (itemType === 'equipment') {
      setInventory(prev => prev.map(invItem => 
        invItem.id === targetId ? { ...invItem, isRented: false } : invItem
      ));
    } else if (itemType === 'court') {
      setCourts(prev => prev.map(c => 
        c.id === targetId ? { ...c, open: true } : c
      ));
    }

    alert('Request cancelled successfully.');
  };

  const toggleRole = () => setCurrentRole(prev => (prev === 'player' ? 'admin' : 'player'));
  const toggleViewType = () => setViewType(prev => (prev === 'mobile' ? 'desktop' : 'mobile'));

  return (
    <AppContext.Provider value={{
      currentRole, toggleRole,
      viewType, toggleViewType,
      profile, setProfile,
      matchHistory,
      notifications, cancelRequest,
      inventory, rentItem,
      courts, bookCourt,
      equipments,
      isQueuing, queueTime,
      startQueue, cancelQueue
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);