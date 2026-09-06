// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext();

const INITIAL_PROFILE = {
  fullName: 'Venedict Perez',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Venedict',
  mmr: 3294,
  isMember: true,
  membershipExpiry: 'Dec 25, 2026',
};

const REGISTERED_PLAYERS = [
  { name: 'Chris', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chris', mmr: 3150 },
  { name: 'Nazzer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nazzer', mmr: 2980 },
  { name: 'Soffy', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Soffy', mmr: 3100 },
  { name: 'Kier', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kier', mmr: 2850 },
  { name: 'Owen', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Owen', mmr: 3200 },
];

const INITIAL_HISTORY = [
  { id: 1, opponentName: 'Owen - Soffy', date: '09/06/2026', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Owen' },
  { id: 2, opponentName: 'Chris', date: '09/05/2026', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chris' },
  { id: 3, opponentName: 'Nazzer', date: '09/04/2026', result: 'LOSS', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nazzer' },
  { id: 4, opponentName: 'Soffy', date: '09/03/2026', result: 'WIN', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Soffy' },
  { id: 5, opponentName: 'Kier', date: '09/01/2026', result: 'LOSS', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kier' },
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
      isRented: i === 0,
      occupiedBy: i === 0 ? 'Nazzer' : null,
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
      occupiedBy: null,
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
      occupiedBy: null,
      isPending: false,
      baseRate: 300,
    };
  }),
];

const INITIAL_COURTS = [
  { id: 'court-1', name: 'Court 1', type: 'Indoor', surface: 'Pro Cushion Hardcourt', desc: 'Climate-controlled court with LED tournament lighting.', open: true, occupiedBy: null, isPending: false, baseRate: 250 },
  { id: 'court-2', name: 'Court 2', type: 'Indoor', surface: 'Pro Cushion Hardcourt', desc: 'Standard indoor court with high-visibility boundary lines.', open: true, occupiedBy: null, isPending: false, baseRate: 250 },
  { id: 'court-3', name: 'Court 3', type: 'Indoor', surface: 'Pro Cushion Hardcourt', desc: 'Acoustically damped court optimal for video review matches.', open: true, occupiedBy: null, isPending: false, baseRate: 250 },
  { id: 'court-4', name: 'Court 4', type: 'Outdoor', surface: 'Acrylic Composite', desc: 'Shaded outdoor court with professional wind fence netting.', open: true, occupiedBy: null, isPending: false, baseRate: 200 },
  { id: 'court-5', name: 'Court 5', type: 'Outdoor', surface: 'Acrylic Composite', desc: 'Outdoor court positioned for daytime tournament play.', open: true, occupiedBy: null, isPending: false, baseRate: 200 },
];

const INITIAL_SYSTEM_LOGS = [
  { id: 'log-1', playerName: 'Chris', title: 'Court 1 Reservation', duration: '2 hr(s)', totalPrice: '₱500', status: 'Approved', timestamp: '10:15 AM' },
  { id: 'log-2', playerName: 'Nazzer', title: 'Paddle Pair A', duration: '1 hr(s)', totalPrice: '₱100', status: 'Approved', timestamp: '11:00 AM' }
];

export function AppProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('player');
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [matchHistory, setMatchHistory] = useState(INITIAL_HISTORY);
  const [notifications, setNotifications] = useState([]);
  const [systemLogs, setSystemLogs] = useState(INITIAL_SYSTEM_LOGS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [courts, setCourts] = useState(INITIAL_COURTS);

  // Queue & Match States
  const [isQueuing, setIsQueuing] = useState(false);
  const [queueTime, setQueueTime] = useState(0);
  const [matchFormat, setMatchFormat] = useState('single');
  const [activeMatch, setActiveMatch] = useState(null); // Active ongoing match object
  const [matchFoundModal, setMatchFoundModal] = useState(null); // Popup when match is found

  const isProcessingMatch = useRef(false);
  const [alertModal, setAlertModal] = useState(null);

  const showAlert = (title, message, type = 'success') => {
    setAlertModal({ title, message, type });
  };

  const hideAlert = () => setAlertModal(null);

  const equipments = inventory.filter(item => !item.isRented && !item.isPending).length;

  // QUEUE TIMER EFFECT
  useEffect(() => {
    let interval = null;

    if (isQueuing) {
      interval = setInterval(() => {
        setQueueTime(prev => {
          if (prev >= 4) {
            if (!isProcessingMatch.current) {
              isProcessingMatch.current = true;
              clearInterval(interval);
              triggerMatchFound();
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setQueueTime(0);
      isProcessingMatch.current = false;
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isQueuing]);

  // TRIGGER MATCH FOUND (ASSIGN COURT & NOTIFY PLAYER)
  const triggerMatchFound = () => {
    setIsQueuing(false);

    // Find available open court
    const openCourt = courts.find(c => c.open && !c.isPending) || courts[0];

    let opponentDisplayName = '';
    let primaryAvatar = '';

    if (matchFormat === 'double') {
      const shuffled = [...REGISTERED_PLAYERS].sort(() => 0.5 - Math.random());
      opponentDisplayName = `${shuffled[0].name} - ${shuffled[1].name}`;
      primaryAvatar = shuffled[0].avatar;
    } else {
      const p1 = REGISTERED_PLAYERS[Math.floor(Math.random() * REGISTERED_PLAYERS.length)];
      opponentDisplayName = p1.name;
      primaryAvatar = p1.avatar;
    }

    const matchObj = {
      id: `match-${Date.now()}`,
      courtId: openCourt.id,
      courtName: openCourt.name,
      opponentName: opponentDisplayName,
      opponentAvatar: primaryAvatar,
      format: matchFormat,
      playerName: profile.fullName.split(' ')[0]
    };

    // Mark court occupied
    setCourts(prev => prev.map(c => 
      c.id === openCourt.id ? { ...c, open: false, occupiedBy: `${profile.fullName.split(' ')[0]} vs ${opponentDisplayName}` } : c
    ));

    setActiveMatch(matchObj);
    setMatchFoundModal(matchObj);
  };

  // ADMIN FINALIZES MATCH WINNER
  const resolveMatchResult = (winner) => {
    if (!activeMatch) return;

    const isWin = winner === 'player';
    const resultStr = isWin ? 'WIN' : 'LOSS';
    const mmrChange = isWin ? +25 : -18;

    // Update Profile MMR
    setProfile(prev => ({
      ...prev,
      mmr: Math.max(0, prev.mmr + mmrChange)
    }));

    // Record Match History
    const todayStr = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const newMatch = {
      id: Date.now(),
      opponentName: activeMatch.opponentName,
      opponentAvatar: activeMatch.opponentAvatar,
      date: todayStr,
      result: resultStr
    };

    setMatchHistory(prev => [newMatch, ...prev]);

    // Free Court
    setCourts(prev => prev.map(c => 
      c.id === activeMatch.courtId ? { ...c, open: true, occupiedBy: null } : c
    ));

    setActiveMatch(null);

    showAlert(
      'Match Finalized',
      `Result recorded: ${profile.fullName.split(' ')[0]} ${resultStr} against ${activeMatch.opponentName} (${mmrChange > 0 ? '+' : ''}${mmrChange} MMR).`,
      'success'
    );
  };

  const startQueue = (format = 'single') => {
    if (!profile.isMember) {
      showAlert('Membership Required', 'Your membership is inactive. Please subscribe to join matchmaking.', 'warning');
      return;
    }
    setMatchFormat(format);
    isProcessingMatch.current = false;
    setIsQueuing(true);
  };

  const cancelQueue = () => {
    isProcessingMatch.current = false;
    setIsQueuing(false);
  };

  // PLAYER RENT ITEM
  const rentItem = (itemId, durationHours) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item || item.isRented || item.isPending) return;

    const totalPrice = item.baseRate * durationHours;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const pName = profile.fullName.split(' ')[0];

    setInventory(prev => prev.map(invItem => 
      invItem.id === itemId ? { ...invItem, isPending: true, occupiedBy: pName } : invItem
    ));

    const newNotif = {
      id: Date.now(),
      targetId: item.id,
      itemType: 'equipment',
      playerName: pName,
      title: item.name,
      duration: `${durationHours} hr(s)`,
      totalPrice: `₱${totalPrice}`,
      status: 'Pending Approval',
      timestamp: timeStr
    };

    setNotifications(prev => [newNotif, ...prev]);
    setSystemLogs(prev => [newNotif, ...prev]);

    showAlert('Rental Request Sent!', `Your request to rent ${item.name} for ₱${totalPrice} has been submitted.`, 'success');
  };

  // PLAYER BOOK COURT
  const bookCourt = (courtId, durationHours) => {
    const court = courts.find(c => c.id === courtId);
    if (!court || !court.open || court.isPending) return;

    const totalPrice = court.baseRate * durationHours;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const pName = profile.fullName.split(' ')[0];

    setCourts(prev => prev.map(c => 
      c.id === courtId ? { ...c, isPending: true, occupiedBy: pName } : c
    ));

    const newNotif = {
      id: Date.now(),
      targetId: court.id,
      itemType: 'court',
      playerName: pName,
      title: court.name,
      duration: `${durationHours} hr(s)`,
      totalPrice: `₱${totalPrice}`,
      status: 'Pending Approval',
      timestamp: timeStr
    };

    setNotifications(prev => [newNotif, ...prev]);
    setSystemLogs(prev => [newNotif, ...prev]);

    showAlert('Court Reservation Sent!', `Your request to book ${court.name} for ₱${totalPrice} has been submitted.`, 'success');
  };

  // ADMIN APPROVE
  const approveRequest = (notifId, targetId, itemType) => {
    const notif = notifications.find(n => n.id === notifId);
    const occupant = notif?.playerName || null;

    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, status: 'Approved' } : n
    ));

    setSystemLogs(prev => prev.map(log => 
      log.id === notifId ? { ...log, status: 'Approved' } : log
    ));

    if (itemType === 'equipment') {
      setInventory(prev => prev.map(invItem => 
        invItem.id === targetId ? { ...invItem, isRented: true, isPending: false, occupiedBy: occupant } : invItem
      ));
    } else if (itemType === 'court') {
      setCourts(prev => prev.map(c => 
        c.id === targetId ? { ...c, open: false, isPending: false, occupiedBy: occupant } : c
      ));
    }

    showAlert('Request Approved', `Approved ${notif?.title || 'request'}.`, 'success');
  };

  // ADMIN REJECT
  const rejectRequest = (notifId, targetId, itemType) => {
    const notif = notifications.find(n => n.id === notifId);

    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, status: 'Rejected' } : n
    ));

    setSystemLogs(prev => prev.filter(log => log.id !== notifId));

    if (itemType === 'equipment') {
      setInventory(prev => prev.map(invItem => 
        invItem.id === targetId ? { ...invItem, isRented: false, isPending: false, occupiedBy: null } : invItem
      ));
    } else if (itemType === 'court') {
      setCourts(prev => prev.map(c => 
        c.id === targetId ? { ...c, open: true, isPending: false, occupiedBy: null } : c
      ));
    }

    showAlert('Request Rejected', `Rejected request for ${notif?.title || 'item'}.`, 'error');
  };

  const dismissNotification = (notifId, targetId, itemType, isPending) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));

    if (isPending) {
      setSystemLogs(prev => prev.filter(log => log.id !== notifId));

      if (itemType === 'equipment') {
        setInventory(prev => prev.map(invItem => 
          invItem.id === targetId ? { ...invItem, isRented: false, isPending: false, occupiedBy: null } : invItem
        ));
      } else if (itemType === 'court') {
        setCourts(prev => prev.map(c => 
          c.id === targetId ? { ...c, open: true, isPending: false, occupiedBy: null } : c
        ));
      }
      showAlert('Request Cancelled', 'Your pending request has been cancelled.', 'warning');
    }
  };

  const toggleRole = () => setCurrentRole(prev => (prev === 'player' ? 'admin' : 'player'));

  return (
    <AppContext.Provider value={{
      currentRole, toggleRole,
      profile, setProfile,
      matchHistory,
      notifications, systemLogs, approveRequest, rejectRequest, dismissNotification,
      inventory, setInventory, rentItem,
      courts, setCourts, bookCourt,
      equipments,
      isQueuing, queueTime, startQueue, cancelQueue,
      activeMatch, matchFoundModal, setMatchFoundModal, resolveMatchResult,
      alertModal, showAlert, hideAlert
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);