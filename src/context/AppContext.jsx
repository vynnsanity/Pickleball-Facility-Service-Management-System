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
  { id: 1, opponentName: 'Chris', date: '09/05/2026', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chris' },
  { id: 2, opponentName: 'Nazzer', date: '09/04/2026', result: 'LOSS', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nazzer' },
  { id: 3, opponentName: 'Soffy', date: '09/03/2026', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Soffy' },
  { id: 4, opponentName: 'Kier', date: '09/01/2026', result: 'LOSS', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kier' },
  { id: 5, opponentName: 'Owen', date: '08/29/2026', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Owen' },
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
      isPending: false,
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
      isPending: false,
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
      isPending: false,
      baseRate: 300,
    };
  }),
];

const INITIAL_COURTS = [
  { id: 'court-1', name: 'Court 1', type: 'Indoor', surface: 'Pro Cushion Hardcourt', desc: 'Climate-controlled court with LED tournament lighting.', open: true, isPending: false, baseRate: 250 },
  { id: 'court-2', name: 'Court 2', type: 'Indoor', surface: 'Pro Cushion Hardcourt', desc: 'Standard indoor court with high-visibility boundary lines.', open: true, isPending: false, baseRate: 250 },
  { id: 'court-3', name: 'Court 3', type: 'Indoor', surface: 'Pro Cushion Hardcourt', desc: 'Acoustically damped court optimal for video review matches.', open: true, isPending: false, baseRate: 250 },
  { id: 'court-4', name: 'Court 4', type: 'Outdoor', surface: 'Acrylic Composite', desc: 'Shaded outdoor court with professional wind fence netting.', open: true, isPending: false, baseRate: 200 },
  { id: 'court-5', name: 'Court 5', type: 'Outdoor', surface: 'Acrylic Composite', desc: 'Outdoor court positioned for daytime tournament play.', open: true, isPending: false, baseRate: 200 },
];

export function AppProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('player');
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [matchHistory, setMatchHistory] = useState(INITIAL_HISTORY);
  const [notifications, setNotifications] = useState([]);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [courts, setCourts] = useState(INITIAL_COURTS);

  const [isQueuing, setIsQueuing] = useState(false);
  const [queueTime, setQueueTime] = useState(0);

  const equipments = inventory.filter(item => !item.isRented && !item.isPending).length;

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

  // PLAYER RENT ITEM
  const rentItem = (itemId, durationHours) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item || item.isRented || item.isPending) return;

    const totalPrice = item.baseRate * durationHours;

    setInventory(prev => prev.map(invItem => 
      invItem.id === itemId ? { ...invItem, isPending: true } : invItem
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

  // PLAYER BOOK COURT
  const bookCourt = (courtId, durationHours) => {
    const court = courts.find(c => c.id === courtId);
    if (!court || !court.open || court.isPending) return;

    const totalPrice = court.baseRate * durationHours;

    setCourts(prev => prev.map(c => 
      c.id === courtId ? { ...c, isPending: true } : c
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

  // ADMIN APPROVE: Removes notification and locks item as Occupied / Rented
  const approveRequest = (notifId, targetId, itemType) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));

    if (itemType === 'equipment') {
      setInventory(prev => prev.map(invItem => 
        invItem.id === targetId ? { ...invItem, isRented: true, isPending: false } : invItem
      ));
    } else if (itemType === 'court') {
      setCourts(prev => prev.map(c => 
        c.id === targetId ? { ...c, open: false, isPending: false } : c
      ));
    }

    alert('Request approved! Status updated to Occupied.');
  };

  // ADMIN REJECT: Updates status to 'Rejected' and frees up item/court
  const rejectRequest = (notifId, targetId, itemType) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, status: 'Rejected' } : n
    ));

    if (itemType === 'equipment') {
      setInventory(prev => prev.map(invItem => 
        invItem.id === targetId ? { ...invItem, isRented: false, isPending: false } : invItem
      ));
    } else if (itemType === 'court') {
      setCourts(prev => prev.map(c => 
        c.id === targetId ? { ...c, open: true, isPending: false } : c
      ));
    }

    alert('Request rejected. The player will see the rejection update.');
  };

  // PLAYER DISMISS / CANCEL: Completely deletes the notification entry
  const dismissNotification = (notifId, targetId, itemType, isPending) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));

    if (isPending) {
      if (itemType === 'equipment') {
        setInventory(prev => prev.map(invItem => 
          invItem.id === targetId ? { ...invItem, isRented: false, isPending: false } : invItem
        ));
      } else if (itemType === 'court') {
        setCourts(prev => prev.map(c => 
          c.id === targetId ? { ...c, open: true, isPending: false } : c
        ));
      }
    }
  };

  const toggleRole = () => setCurrentRole(prev => (prev === 'player' ? 'admin' : 'player'));

  return (
    <AppContext.Provider value={{
      currentRole, toggleRole,
      profile, setProfile,
      matchHistory,
      notifications, approveRequest, rejectRequest, dismissNotification,
      inventory, setInventory, rentItem,
      courts, setCourts, bookCourt,
      equipments,
      isQueuing, queueTime,
      startQueue, cancelQueue
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);