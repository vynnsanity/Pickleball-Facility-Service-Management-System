// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('player');

  // Registered Player List (Strictly First Names)
  const registeredPlayers = ['Chris', 'Nazzer', 'Soffy', 'Kier', 'Owen'];

  // User Profile
  const [profile, setProfile] = useState({
    fullName: 'Tickler',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tickler',
    mmr: 3294,
    isMember: true,
    membershipExpiry: 'Dec 25, 2026'
  });

  const [alert, setAlert] = useState(null);

  const showAlert = (title, message, type = 'info') => {
    setAlert({ title, message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Inventory Data
  const [inventory, setInventory] = useState([
    { id: 'eq-1', name: 'Paddle Pair A', baseRate: 100, condition: 'Excellent', isRented: false, isPending: false, desc: 'Professional pickleball paddle pair.' },
    { id: 'eq-2', name: 'Paddle Pair B', baseRate: 100, condition: 'Good', isRented: false, isPending: false, desc: 'Standard composite paddle pair.' },
    { id: 'eq-3', name: 'Ball Set A', baseRate: 80, condition: 'Brand New', isRented: false, isPending: false, desc: 'Set of 4 high-durability outdoor balls.' },
    { id: 'eq-4', name: 'Ball Set B', baseRate: 80, condition: 'Good', isRented: false, isPending: false, desc: 'Set of 4 indoor pickleball balls.' },
  ]);

  // Courts Data
  const [courts, setCourts] = useState([
    { id: 'c-1', name: 'Court 1', type: 'Indoor', surface: 'Pro Cushion Hardcourt', baseRate: 250, open: true, isPending: false },
    { id: 'c-2', name: 'Court 2', type: 'Indoor', surface: 'Pro Cushion Hardcourt', baseRate: 250, open: true, isPending: false },
    { id: 'c-3', name: 'Court 3', type: 'Outdoor', surface: 'Standard Acrylic', baseRate: 200, open: true, isPending: false },
    { id: 'c-4', name: 'Court 4', type: 'Outdoor', surface: 'Standard Acrylic', baseRate: 200, open: true, isPending: false },
    { id: 'c-5', name: 'Court 5', type: 'Covered', surface: 'Premium Turf', baseRate: 300, open: true, isPending: false },
  ]);

  // Game History
  const [matchHistory, setMatchHistory] = useState([
    { id: 'gh-1', opponentName: 'Owen & Soffy', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Owen', date: '09/06/2026', result: 'WIN' },
    { id: 'gh-2', opponentName: 'Chris', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chris', date: '09/05/2026', result: 'WIN' },
    { id: 'gh-3', opponentName: 'Nazzer', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nazzer', date: '09/04/2026', result: 'LOSS' },
    { id: 'gh-4', opponentName: 'Soffy', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Soffy', date: '09/03/2026', result: 'WIN' },
    { id: 'gh-5', opponentName: 'Kier', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kier', date: '09/01/2026', result: 'LOSS' },
  ]);

  const [notifications, setNotifications] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);

  // Queue State
  const [isQueuing, setIsQueuing] = useState(false);
  const [queueFormat, setQueueFormat] = useState('single');
  const [queueTime, setQueueTime] = useState(0);
  const [activeMatch, setActiveMatch] = useState(null);
  const [matchFoundModal, setMatchFoundModal] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isQueuing) {
      interval = setInterval(() => setQueueTime(prev => prev + 1), 1000);
    } else {
      setQueueTime(0);
    }
    return () => clearInterval(interval);
  }, [isQueuing]);

  // Matchmaking Simulation (1v1 Duel or Full 2v2 Team)
  useEffect(() => {
    if (queueTime === 5 && isQueuing) {
      setIsQueuing(false);

      const shuffled = [...registeredPlayers].sort(() => 0.5 - Math.random());

      let userTeamName = profile.fullName;
      let opponentTeamName = '';

      if (queueFormat === 'double') {
        const teammate = shuffled[0];
        const opp1 = shuffled[1];
        const opp2 = shuffled[2];

        userTeamName = `${profile.fullName} & ${teammate}`;
        opponentTeamName = `${opp1} & ${opp2}`;
      } else {
        opponentTeamName = shuffled[0];
      }

      const matchData = {
        id: `match-${Date.now()}`,
        playerName: userTeamName,
        opponentName: opponentTeamName,
        courtName: 'Court 1',
        format: queueFormat === 'double' ? '2 vs 2 Team' : '1 vs 1 Duel',
        timestamp: 'Just now'
      };

      setActiveMatch(matchData);
      setMatchFoundModal(matchData);
      showAlert('Match Found!', `${userTeamName} vs ${opponentTeamName} on Court 1.`, 'success');
    }
  }, [queueTime, isQueuing, queueFormat, profile.fullName]);

  const toggleRole = () => setCurrentRole(prev => prev === 'player' ? 'admin' : 'player');

  const startQueue = (format) => {
    setQueueFormat(format);
    setIsQueuing(true);
    setQueueTime(0);
    showAlert('Queuing Started', `Searching for a ${format} match...`, 'info');
  };

  const cancelQueue = () => {
    setIsQueuing(false);
    setQueueTime(0);
    showAlert('Queue Canceled', 'You left the matchmaking queue.', 'warning');
  };

  const rentItem = (itemId, durationHours) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, isPending: true } : i));
    const totalCost = item.baseRate * durationHours;
    const newNotif = {
      id: `req-eq-${Date.now()}`,
      targetId: itemId,
      itemType: 'inventory',
      playerName: profile.fullName,
      title: `Equipment Rental: ${item.name}`,
      duration: `${durationHours} Hour(s)`,
      totalPrice: `₱${totalCost}`,
      status: 'Pending Approval',
      timestamp: 'Just now'
    };

    setNotifications(prev => [newNotif, ...prev]);
    setSystemLogs(prev => [newNotif, ...prev]);
    showAlert('Request Sent', `${item.name} rental request sent to Admin for approval.`, 'info');
  };

  const bookCourt = (courtId, durationHours) => {
    const court = courts.find(c => c.id === courtId);
    if (!court) return;

    setCourts(prev => prev.map(c => c.id === courtId ? { ...c, isPending: true } : c));
    const totalCost = court.baseRate * durationHours;
    const newNotif = {
      id: `req-court-${Date.now()}`,
      targetId: courtId,
      itemType: 'courts',
      playerName: profile.fullName,
      title: `Court Booking: ${court.name}`,
      duration: `${durationHours} Hour(s)`,
      totalPrice: `₱${totalCost}`,
      status: 'Pending Approval',
      timestamp: 'Just now'
    };

    setNotifications(prev => [newNotif, ...prev]);
    setSystemLogs(prev => [newNotif, ...prev]);
    showAlert('Request Sent', `${court.name} booking request sent to Admin for approval.`, 'info');
  };

  const approveRequest = (notifId, targetId, itemType) => {
    if (itemType === 'inventory') {
      setInventory(prev => prev.map(i => i.id === targetId ? { ...i, isRented: true, isPending: false } : i));
    } else if (itemType === 'courts') {
      setCourts(prev => prev.map(c => c.id === targetId ? { ...c, open: false, isPending: false } : c));
    }

    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, status: 'Approved' } : n));
    setSystemLogs(prev => prev.map(l => l.id === notifId ? { ...l, status: 'Approved' } : l));
    showAlert('Request Approved', 'User request has been approved.', 'success');
  };

  const rejectRequest = (notifId, targetId, itemType) => {
    if (itemType === 'inventory') {
      setInventory(prev => prev.map(i => i.id === targetId ? { ...i, isPending: false } : i));
    } else if (itemType === 'courts') {
      setCourts(prev => prev.map(c => c.id === targetId ? { ...c, isPending: false } : c));
    }

    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, status: 'Rejected' } : n));
    setSystemLogs(prev => prev.map(l => l.id === notifId ? { ...l, status: 'Rejected' } : l));
    showAlert('Request Rejected', 'User request was rejected.', 'error');
  };

  const dismissNotification = (notifId, targetId, itemType, wasPending) => {
    if (wasPending) {
      if (itemType === 'inventory') {
        setInventory(prev => prev.map(i => i.id === targetId ? { ...i, isPending: false } : i));
      } else if (itemType === 'courts') {
        setCourts(prev => prev.map(c => c.id === targetId ? { ...c, isPending: false } : c));
      }
    }
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const resolveMatchResult = (winnerType) => {
    if (!activeMatch) return;

    const isPlayerWin = winnerType === 'player';
    const newMmrChange = isPlayerWin ? 25 : -18;

    setProfile(prev => ({ ...prev, mmr: Math.max(0, prev.mmr + newMmrChange) }));

    const firstOpponent = activeMatch.opponentName.split(' & ')[0];

    const newHistoryEntry = {
      id: `gh-${Date.now()}`,
      opponentName: activeMatch.opponentName,
      opponentAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${firstOpponent}`,
      date: '09/09/2026',
      result: isPlayerWin ? 'WIN' : 'LOSS'
    };

    setMatchHistory(prev => [newHistoryEntry, ...prev]);

    setSystemLogs(prev => [
      {
        id: `log-${Date.now()}`,
        playerName: activeMatch.playerName,
        title: `Match Completed vs ${activeMatch.opponentName} (${isPlayerWin ? 'WIN' : 'LOSS'})`,
        duration: activeMatch.format,
        status: 'Completed',
        timestamp: 'Just now'
      },
      ...prev
    ]);

    setActiveMatch(null);
    showAlert('Match Concluded', `Match resolved: ${isPlayerWin ? 'Victory' : 'Defeat'} recorded.`, isPlayerWin ? 'success' : 'info');
  };

  const cancelMatch = () => {
    if (!activeMatch) return;

    const cancellationNotif = {
      id: `notif-${Date.now()}`,
      title: `Match Canceled`,
      duration: `Court ${activeMatch.courtName}`,
      totalPrice: `N/A`,
      status: 'Canceled by Admin',
      timestamp: 'Just now',
      itemType: 'match',
      targetId: activeMatch.id
    };

    setNotifications(prev => [cancellationNotif, ...prev]);
    setSystemLogs(prev => [
      {
        id: `log-${Date.now()}`,
        playerName: activeMatch.playerName,
        title: `Match vs ${activeMatch.opponentName} was canceled by Admin`,
        duration: activeMatch.format,
        status: 'Canceled',
        timestamp: 'Just now'
      },
      ...prev
    ]);

    setActiveMatch(null);
    showAlert('Match Canceled', 'The active match was canceled. Player notified.', 'warning');
  };

  const value = {
    currentRole, setCurrentRole, toggleRole,
    profile, setProfile, alert, showAlert, registeredPlayers,
    inventory, setInventory, courts, setCourts,
    matchHistory, setMatchHistory, notifications, setNotifications,
    systemLogs, setSystemLogs, isQueuing, queueTime, startQueue, cancelQueue,
    activeMatch, matchFoundModal, setMatchFoundModal,
    rentItem, bookCourt, approveRequest, rejectRequest, dismissNotification,
    resolveMatchResult, cancelMatch,
    equipments: inventory.filter(i => !i.isRented && !i.isPending).length
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}