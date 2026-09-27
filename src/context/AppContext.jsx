// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Roles: 'admin' (Super Admin) | 'facility' (Facility Admin) | 'player' (Player)
  const [currentRole, setCurrentRole] = useState('admin');
  
  // Shared Active Modal State
  const [activeModal, setActiveModal] = useState(null);

  const registeredPlayers = ['Chris', 'Nazzer', 'Soffy', 'Kier', 'Owen'];

  // Player Profile
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

  // Super Admin Facilities State
  const [facilities, setFacilities] = useState([
    { id: 'fac-1', name: 'Metro Pickleball Hub', location: 'Metro Manila', courtCount: 6, allowCoaching: true, allowTenants: true, status: 'Active' },
    { id: 'fac-2', name: 'Laguna Sports & Pickle Complex', location: 'Calamba, Laguna', courtCount: 4, allowCoaching: true, allowTenants: false, status: 'Active' },
    { id: 'fac-3', name: 'Santa Rosa Indoor Arena', location: 'Santa Rosa, Laguna', courtCount: 4, allowCoaching: false, allowTenants: true, status: 'Active' },
    { id: 'fac-4', name: 'Cebu Smash Arena', location: 'Cebu City', courtCount: 3, allowCoaching: true, allowTenants: true, status: 'Active' }
  ]);

  // Facility Admin Items
  const [inventory, setInventory] = useState([
    { id: 'eq-1', name: 'Paddle Pair A', baseRate: 100, condition: 'Excellent', isRented: false, isPending: false, desc: 'Professional pickleball paddle pair.' },
    { id: 'eq-2', name: 'Paddle Pair B', baseRate: 100, condition: 'Good', isRented: false, isPending: false, desc: 'Standard composite paddle pair.' },
    { id: 'eq-3', name: 'Ball Set A', baseRate: 80, condition: 'Brand New', isRented: false, isPending: false, desc: 'Set of 4 high-durability outdoor balls.' },
    { id: 'eq-4', name: 'Ball Set B', baseRate: 80, condition: 'Good', isRented: false, isPending: false, desc: 'Set of 4 indoor pickleball balls.' },
  ]);

  const [courts, setCourts] = useState([
    { id: 'c-1', name: 'Court 1', type: 'Indoor', surface: 'Pro Cushion Hardcourt', baseRate: 250, open: true, isPending: false },
    { id: 'c-2', name: 'Court 2', type: 'Indoor', surface: 'Pro Cushion Hardcourt', baseRate: 250, open: true, isPending: false },
    { id: 'c-3', name: 'Court 3', type: 'Outdoor', surface: 'Standard Acrylic', baseRate: 200, open: true, isPending: false },
    { id: 'c-4', name: 'Court 4', type: 'Outdoor', surface: 'Standard Acrylic', baseRate: 200, open: true, isPending: false },
    { id: 'c-5', name: 'Court 5', type: 'Covered', surface: 'Premium Turf', baseRate: 300, open: true, isPending: false },
  ]);

  // Player Match History Data
  const [matchHistory, setMatchHistory] = useState([
    { id: 'gh-1', opponentName: 'Owen & Soffy', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Owen', date: '09/06/2026', result: 'WIN' },
    { id: 'gh-2', opponentName: 'Chris', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chris', date: '09/05/2026', result: 'WIN' },
    { id: 'gh-3', opponentName: 'Nazzer', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nazzer', date: '09/04/2026', result: 'LOSS' },
    { id: 'gh-4', opponentName: 'Soffy', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Soffy', date: '09/03/2026', result: 'WIN' },
    { id: 'gh-5', opponentName: 'Kier', opponentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kier', date: '09/01/2026', result: 'LOSS' },
  ]);

  // System Activity Logs
  const [systemLogs, setSystemLogs] = useState([
    { id: 'log-101', playerName: 'Laguna Sports & Pickle Complex', title: 'Accepted Coach Kier as an official in-house coach', duration: 'Vetted Coaching Program', status: 'Approved', timestamp: '10 mins ago' },
    { id: 'log-102', playerName: 'Metro Pickleball Hub', title: 'Approved store application for "Smash & Pickle Pro Shop"', duration: 'Retail Tenant Space', status: 'Approved', timestamp: '25 mins ago' }
  ]);

  const [notifications, setNotifications] = useState([]);

  // Queue & Matchmaking State
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

  // Role Toggler: Super Admin ('admin') -> Facility ('facility') -> Player ('player')
  const toggleRole = () => {
    setCurrentRole(prev => {
      if (prev === 'admin') return 'facility';
      if (prev === 'facility') return 'player';
      return 'admin';
    });
  };

  const addFacility = (newFacility) => {
    setFacilities(prev => [newFacility, ...prev]);
    showAlert('Facility Registered', `${newFacility.name} was registered.`, 'success');
  };

  const toggleFacilityCoachingService = (facilityId) => {
    setFacilities(prev => prev.map(f => f.id === facilityId ? { ...f, allowCoaching: !f.allowCoaching } : f));
  };

  const toggleFacilityTenantService = (facilityId) => {
    setFacilities(prev => prev.map(f => f.id === facilityId ? { ...f, allowTenants: !f.allowTenants } : f));
  };

  const value = {
    currentRole, setCurrentRole, toggleRole,
    activeModal, setActiveModal,
    profile, setProfile, alert, showAlert, registeredPlayers,
    facilities, addFacility, toggleFacilityCoachingService, toggleFacilityTenantService,
    inventory, setInventory, courts, setCourts,
    matchHistory, setMatchHistory, notifications, setNotifications,
    systemLogs, setSystemLogs, isQueuing, queueTime,
    activeMatch, matchFoundModal, setMatchFoundModal,
    equipments: inventory.filter(i => !i.isRented && !i.isPending).length
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}