// Permanent Version - No Expiry
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  WelderProfile,
  Order,
  CustomerPartyAccount,
  ShopWorker,
  ChatMessage,
  JobPosting,
  CommunityPost,
  AppAdminSettings,
  MeasurementItem,
  InventoryItem
} from '../types';
import {
  initialAdminSettings,
  sampleWelders,
  sampleOrders,
  sampleParties,
  sampleWorkers,
  sampleJobs,
  sampleCommunityPosts,
  sampleMeasurements,
  sampleInventory
} from '../data/mockData';
import { translations, Language } from '../utils/i18n';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['en'];
  currentUser: User;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  adminSettings: AppAdminSettings;
  updateAdminSettings: (newSettings: Partial<AppAdminSettings>) => void;
  welders: WelderProfile[];
  toggleWelderVerification: (id: string) => void;
  addWelder: (welder: WelderProfile) => void;
  orders: Order[];
  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  recordOrderPayment: (orderId: string, amount: number, method: 'cash' | 'online_upi', txnId?: string) => void;
  parties: CustomerPartyAccount[];
  addParty: (party: CustomerPartyAccount) => void;
  recordPartyPayment: (partyId: string, amount: number, notes: string) => void;
  workers: ShopWorker[];
  addWorker: (worker: ShopWorker) => void;
  recordWorkerPayment: (workerId: string, amount: number, notes: string, method: 'cash' | 'upi') => void;
  recordWorkerAttendance: (workerId: string, daysDelta: number) => void;
  measurements: MeasurementItem[];
  saveMeasurement: (item: MeasurementItem) => void;
  deleteMeasurement: (id: string) => void;
  jobs: JobPosting[];
  postJob: (job: JobPosting) => void;
  communityPosts: CommunityPost[];
  addCommunityPost: (content: string, category: CommunityPost['category']) => void;
  likeCommunityPost: (id: string) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playSparkSound: () => void;
  inventory: InventoryItem[];
  updateInventoryStock: (id: string, delta: number) => void;
  setInventoryItemStock: (id: string, newStock: number) => void;
  addInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  lowStockAlerts: InventoryItem[];
  lowStockCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('wb_lang') as Language) || 'en';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('wb_sound') === 'true';
  });

  const [adminSettings, setAdminSettings] = useState<AppAdminSettings>(() => {
    const saved = localStorage.getItem('wb_admin_settings');
    return saved ? JSON.parse(saved) : initialAdminSettings;
  });

  const [welders, setWelders] = useState<WelderProfile[]>(() => {
    const saved = localStorage.getItem('wb_welders');
    return saved ? JSON.parse(saved) : sampleWelders;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('wb_orders');
    return saved ? JSON.parse(saved) : sampleOrders;
  });

  const [parties, setParties] = useState<CustomerPartyAccount[]>(() => {
    const saved = localStorage.getItem('wb_parties');
    return saved ? JSON.parse(saved) : sampleParties;
  });

  const [workers, setWorkers] = useState<ShopWorker[]>(() => {
    const saved = localStorage.getItem('wb_workers');
    return saved ? JSON.parse(saved) : sampleWorkers;
  });

  const [measurements, setMeasurements] = useState<MeasurementItem[]>(() => {
    const saved = localStorage.getItem('wb_measurements');
    return saved ? JSON.parse(saved) : sampleMeasurements;
  });

  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    const saved = localStorage.getItem('wb_jobs');
    return saved ? JSON.parse(saved) : sampleJobs;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('wb_community');
    return saved ? JSON.parse(saved) : sampleCommunityPosts;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('wb_chats');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg-1',
        senderId: 'cust-01',
        senderName: 'Mahendra Sharma',
        senderRole: 'customer',
        text: 'Namaste Lavjeet ji! What is the estimated completion date for my main entrance gate?',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg-2',
        senderId: 'weld-01',
        senderName: 'Lavjeet Kumar Solanki',
        senderRole: 'welder',
        text: 'Namaste Mahendra ji! Welding and primer coating are finished. We are doing the black satin spray and fitting hinges. Ready by Wednesday afternoon!',
        timestamp: '10:20 AM'
      }
    ];
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('wb_inventory');
    return saved ? JSON.parse(saved) : sampleInventory;
  });

  useEffect(() => {
    localStorage.setItem('wb_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const updateInventoryStock = (id: string, delta: number) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, stockQuantity: Math.max(0, item.stockQuantity + delta) } : item
      )
    );
  };

  const setInventoryItemStock = (id: string, newStock: number) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, stockQuantity: Math.max(0, newStock) } : item
      )
    );
  };

  const addInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [item, ...prev]);
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const lowStockAlerts = inventory.filter(item => item.stockQuantity <= item.minThreshold);
  const lowStockCount = lowStockAlerts.length;

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('wb_user');
    if (saved) return JSON.parse(saved);
    return {
      id: 'weld-01',
      name: 'Lavjeet Kumar Solanki',
      email: 'lovejeetsolanki420@gmail.com',
      phone: '+91 98765 43210',
      role: 'welder',
      shopName: 'Solanki Net Cafe & Smart Print & Welding Hub',
      shopAddress: 'Industrial Area Phase 2, Station Road',
      city: 'Barmer',
      state: 'Rajasthan',
      district: 'Barmer',
      tehsil: 'Barmer',
      isVerified: true
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('wb_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('wb_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('wb_admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem('wb_welders', JSON.stringify(welders));
  }, [welders]);

  useEffect(() => {
    localStorage.setItem('wb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('wb_parties', JSON.stringify(parties));
  }, [parties]);

  useEffect(() => {
    localStorage.setItem('wb_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('wb_measurements', JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem('wb_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('wb_community', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem('wb_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('wb_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Audio synthesis for realistic welding spark / arc sound
  const playSparkSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.35);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio autoplay policy catch
    }
  };

  const switchRole = (role: UserRole) => {
    if (role === 'welder') {
      setCurrentUser({
        id: 'weld-01',
        name: 'Lavjeet Kumar Solanki',
        email: 'lovejeetsolanki420@gmail.com',
        phone: '+91 98765 43210',
        role: 'welder',
        shopName: 'Solanki Net Cafe & Smart Print & Welding Hub',
        shopAddress: 'Industrial Area Phase 2, Station Road',
        city: 'Barmer',
        state: 'Rajasthan',
        district: 'Barmer',
        tehsil: 'Barmer',
        isVerified: true
      });
    } else if (role === 'customer') {
      setCurrentUser({
        id: 'cust-01',
        name: 'Mahendra Sharma',
        email: 'mahendra.sharma@gmail.com',
        phone: '+91 98290 11223',
        role: 'customer',
        city: 'Barmer',
        state: 'Rajasthan',
        isVerified: true
      });
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'admin-master',
        name: adminSettings.ownerName,
        email: 'admin@weldbro.in',
        phone: adminSettings.ownerMobile,
        role: 'admin',
        city: 'Barmer',
        state: 'Rajasthan',
        isVerified: true
      });
    } else if (role === 'worker') {
      setCurrentUser({
        id: 'worker-01',
        name: 'Kailash Suthar',
        email: 'kailash.welder@gmail.com',
        phone: '+91 97831 22334',
        role: 'worker',
        shopName: 'Solanki Net Cafe & Smart Print & Welding Hub',
        city: 'Barmer',
        state: 'Rajasthan',
        isVerified: true
      });
    }
  };

  const updateAdminSettings = (newSettings: Partial<AppAdminSettings>) => {
    setAdminSettings(prev => ({
      ...prev,
      ...newSettings,
      updatedAt: new Date().toISOString()
    }));
  };

  const toggleWelderVerification = (id: string) => {
    setWelders(prev =>
      prev.map(w => (w.id === id ? { ...w, isVerified: !w.isVerified } : w))
    );
  };

  const addWelder = (welder: WelderProfile) => {
    setWelders(prev => [welder, ...prev]);
  };

  const createOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    // Also record party transaction if party exists, or create new party
    setParties(prev => {
      const existing = prev.find(p => p.phone === order.customerPhone);
      if (existing) {
        return prev.map(p => {
          if (p.id === existing.id) {
            return {
              ...p,
              totalBilled: p.totalBilled + order.totalAmount,
              advancePayment: p.advancePayment + order.advancePayment,
              totalReceived: p.totalReceived + order.advancePayment,
              remainingBalance: p.remainingBalance + order.remainingBalance,
              status: order.remainingBalance === 0 ? 'paid' : 'partial',
              transactions: [
                {
                  id: `txn-${Date.now()}`,
                  date: new Date().toISOString().split('T')[0],
                  amount: order.advancePayment,
                  type: 'advance',
                  notes: `Order created: ${order.title}`,
                  receiptNo: order.receiptNumber
                },
                ...p.transactions
              ]
            };
          }
          return p;
        });
      } else {
        const newParty: CustomerPartyAccount = {
          id: `party-${Date.now()}`,
          partyName: order.customerName,
          phone: order.customerPhone,
          city: order.shopName,
          totalBilled: order.totalAmount,
          totalReceived: order.advancePayment,
          advancePayment: order.advancePayment,
          remainingBalance: order.remainingBalance,
          lastPaymentDate: new Date().toISOString().split('T')[0],
          status: order.remainingBalance === 0 ? 'paid' : 'partial',
          transactions: [
            {
              id: `txn-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              amount: order.advancePayment,
              type: 'advance',
              notes: `Order advance for ${order.title}`,
              receiptNo: order.receiptNumber
            }
          ]
        };
        return [newParty, ...prev];
      }
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const recordOrderPayment = (
    orderId: string,
    amount: number,
    method: 'cash' | 'online_upi',
    txnId?: string
  ) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const newAdvance = o.advancePayment + amount;
          const newRemaining = Math.max(0, o.totalAmount - newAdvance);
          return {
            ...o,
            advancePayment: newAdvance,
            remainingBalance: newRemaining,
            paymentMethod: method,
            upiTransactionId: txnId || o.upiTransactionId,
            status: newRemaining === 0 ? 'paid' : 'payment_pending'
          };
        }
        return o;
      })
    );
  };

  const addParty = (party: CustomerPartyAccount) => {
    setParties(prev => [party, ...prev]);
  };

  const recordPartyPayment = (partyId: string, amount: number, notes: string) => {
    setParties(prev =>
      prev.map(p => {
        if (p.id === partyId) {
          const newRecv = p.totalReceived + amount;
          const newRem = Math.max(0, p.totalBilled - newRecv);
          return {
            ...p,
            totalReceived: newRecv,
            remainingBalance: newRem,
            lastPaymentDate: new Date().toISOString().split('T')[0],
            status: newRem === 0 ? 'paid' : 'partial',
            transactions: [
              {
                id: `txn-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                amount,
                type: 'payment',
                notes: notes || 'Payment settlement'
              },
              ...p.transactions
            ]
          };
        }
        return p;
      })
    );
  };

  const addWorker = (worker: ShopWorker) => {
    setWorkers(prev => [worker, ...prev]);
  };

  const recordWorkerPayment = (
    workerId: string,
    amount: number,
    notes: string,
    method: 'cash' | 'upi'
  ) => {
    setWorkers(prev =>
      prev.map(w => {
        if (w.id === workerId) {
          return {
            ...w,
            advanceTaken: w.advanceTaken + amount,
            balanceDue: Math.max(0, w.balanceDue - amount),
            payments: [
              {
                id: `wp-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                amount,
                method,
                notes: notes || 'Wage distribution'
              },
              ...w.payments
            ]
          };
        }
        return w;
      })
    );
  };

  const recordWorkerAttendance = (workerId: string, daysDelta: number) => {
    setWorkers(prev =>
      prev.map(w => {
        if (w.id === workerId) {
          const newDays = Math.max(0, w.daysWorked + daysDelta);
          const totalEarned = newDays * w.dailyWage;
          const newBalance = Math.max(0, totalEarned - w.advanceTaken);
          return {
            ...w,
            daysWorked: newDays,
            attendanceThisMonth: newDays,
            balanceDue: newBalance
          };
        }
        return w;
      })
    );
  };

  const saveMeasurement = (item: MeasurementItem) => {
    setMeasurements(prev => {
      const idx = prev.findIndex(m => m.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
  };

  const deleteMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  const postJob = (job: JobPosting) => {
    setJobs(prev => [job, ...prev]);
  };

  const addCommunityPost = (content: string, category: CommunityPost['category']) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role === 'welder' ? 'Shop Fabricator' : 'Community Member',
      authorShop: currentUser.shopName || 'WeldBro Network',
      content,
      category,
      likes: 0,
      commentsCount: 0,
      date: 'Just now'
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const likeCommunityPost = (id: string) => {
    setCommunityPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const hasLiked = p.hasLiked;
          return {
            ...p,
            hasLiked: !hasLiked,
            likes: hasLiked ? p.likes - 1 : p.likes + 1
          };
        }
        return p;
      })
    );
  };

  const sendChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        currentUser,
        switchRole,
        setCurrentUser,
        adminSettings,
        updateAdminSettings,
        welders,
        toggleWelderVerification,
        addWelder,
        orders,
        createOrder,
        updateOrderStatus,
        recordOrderPayment,
        parties,
        addParty,
        recordPartyPayment,
        workers,
        addWorker,
        recordWorkerPayment,
        recordWorkerAttendance,
        measurements,
        saveMeasurement,
        deleteMeasurement,
        jobs,
        postJob,
        communityPosts,
        addCommunityPost,
        likeCommunityPost,
        chatMessages,
        sendChatMessage,
        soundEnabled,
        setSoundEnabled,
        playSparkSound,
        inventory,
        updateInventoryStock,
        setInventoryItemStock,
        addInventoryItem,
        deleteInventoryItem,
        lowStockAlerts,
        lowStockCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
