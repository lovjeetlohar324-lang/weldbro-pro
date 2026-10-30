import {
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

export const initialAdminSettings: AppAdminSettings = {
  appName: 'WeldBro',
  tagline: 'Your Welding Business, Smarter.',
  ownerName: 'LAVJEET KUMAR SOLANKI',
  ownerMobile: '+91 98765 43210',
  ownerUpiId: 'lovejeetsolanki420@okhdfcbank',
  businessAddress: 'Station Road, Barmer, Rajasthan 344001, India',
  supportEmail: 'support@weldbro.in',
  whatsappCommunityLink: 'https://chat.whatsapp.com/invite/weldbro',
  telegramGroupLink: 'https://t.me/weldbro_official',
  youtubeChannelUrl: 'https://youtube.com/@weldbro_fabrication',
  instagramHandle: '@weldbro.official',
  verifiedWelderCommissionRate: 0,
  allowPublicGuestRegistrations: true,
  updatedAt: new Date().toISOString()
};

export const sampleServicesList = [
  'Iron Welding & Gate Fabrication',
  'Steel & SS-304 Decorative Gates',
  'Aluminium TIG Welding',
  'Stainless Steel Railings & Glass Railing',
  'Balcony Safety Grills & Window Mesh',
  'Designer Main Entrance Doors',
  'Spiral & Floating Staircase Railings',
  'Industrial Shed & Truss Structure',
  'Custom Metal Furniture & Table Bases',
  'On-Site Machine & Farm Equipment Repair',
  'Heavy Duty Structural Fabrication',
  'Laser Cut CNC Sheet Metal Welding'
];

export const sampleWelders: WelderProfile[] = [
  {
    id: 'weld-01',
    welderId: 'WB-SOLANKI-778',
    name: 'Lavjeet Kumar Solanki',
    email: 'lovejeetsolanki420@gmail.com',
    phone: '+91 98765 43210',
    role: 'welder',
    shopName: 'Solanki Net Cafe & Smart Print & Welding Hub',
    shopAddress: 'Industrial Area Phase 2, Near Railway Station',
    city: 'Barmer',
    state: 'Rajasthan',
    district: 'Barmer',
    tehsil: 'Barmer',
    isVerified: true,
    experienceYears: 12,
    about: 'Specialized in automated precision fabrication, SS-304 laser-grade gates, spiral railings, and heavy iron shed structures. Available with mobile generator welding rig for on-site projects.',
    workingHours: '8:00 AM - 8:30 PM (Mon-Sat)',
    services: [
      'Iron Welding & Gate Fabrication',
      'Steel & SS-304 Decorative Gates',
      'Stainless Steel Railings & Glass Railing',
      'Balcony Safety Grills & Window Mesh',
      'Industrial Shed & Truss Structure'
    ],
    workingLocations: ['Barmer', 'Balotra', 'Jodhpur', 'Jaisalmer'],
    portfolioPhotos: [
      '/public/assets/aistudio/IMG-20261030-WA3750_a2b6a8aa.jpg'
    ],
    rating: 4.9,
    reviewsCount: 38,
    dailyRate: 1200,
    completedJobsCount: 142
  },
  {
    id: 'weld-02',
    welderId: 'WB-RAJPUT-402',
    name: 'Vikram Singh Rathore',
    email: 'vikram.welding@gmail.com',
    phone: '+91 94140 12345',
    role: 'welder',
    shopName: 'Royal Rajputana Steel Arts & Grill Works',
    shopAddress: 'Plot 45, VKI Area, Sikar Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    district: 'Jaipur',
    tehsil: 'Amer',
    isVerified: true,
    experienceYears: 16,
    about: 'Heritage ornamental wrought iron gates, French balcony railings, CNC sheet cut sliding doors with motorized fitting. Undertakes turnkey residential villa projects.',
    workingHours: '9:00 AM - 8:00 PM',
    services: [
      'Designer Main Entrance Doors',
      'Balcony Safety Grills & Window Mesh',
      'Spiral & Floating Staircase Railings',
      'Custom Metal Furniture & Table Bases'
    ],
    workingLocations: ['Jaipur', 'Udaipur', 'Ajmer', 'Kota'],
    portfolioPhotos: [
      '/public/assets/aistudio/IMG-20261030-WA3750_a2b6a8aa.jpg'
    ],
    rating: 4.8,
    reviewsCount: 64,
    dailyRate: 1400,
    completedJobsCount: 215
  },
  {
    id: 'weld-03',
    welderId: 'WB-GUJARAT-510',
    name: 'Pravin Bhai Patel',
    email: 'patel.fabrication@yahoo.com',
    phone: '+91 98250 88990',
    role: 'welder',
    shopName: 'Shree Umiya Modern Fabrication',
    shopAddress: 'GIDC Industrial Estate, Odhav',
    city: 'Ahmedabad',
    state: 'Gujarat',
    district: 'Ahmedabad',
    tehsil: 'Daskroi',
    isVerified: true,
    experienceYears: 14,
    about: 'Expertise in high-grade stainless steel argon TIG welding, food-grade storage tanks, aluminium architectural partitions, and pharmaceutical factory piping.',
    workingHours: '8:30 AM - 7:30 PM',
    services: [
      'Aluminium TIG Welding',
      'Stainless Steel Railings & Glass Railing',
      'Heavy Duty Structural Fabrication',
      'On-Site Machine & Farm Equipment Repair'
    ],
    workingLocations: ['Ahmedabad', 'Gandhinagar', 'Sanand', 'Vadodara'],
    portfolioPhotos: [],
    rating: 4.9,
    reviewsCount: 52,
    dailyRate: 1500,
    completedJobsCount: 180
  }
];

export const sampleOrders: Order[] = [
  {
    id: 'ORD-1082',
    receiptNumber: 'WB-REC-2026-1082',
    customerId: 'cust-01',
    customerName: 'Mahendra Sharma',
    customerPhone: '+91 98290 11223',
    welderId: 'weld-01',
    shopName: 'Solanki Net Cafe & Smart Print & Welding Hub',
    title: 'Main Entrance Heavy Iron Gate with CNC Floral Sheet',
    items: [
      {
        id: 'item-1',
        name: 'Heavy Double Swing Main Gate',
        dimensions: '12 ft (W) × 7 ft (H) × 50mm square pipe',
        quantity: 1,
        material: 'Tata MS Pipe 50x50x2.5mm + 12mm Square Sariya',
        unitPrice: 38500,
        totalPrice: 38500
      },
      {
        id: 'item-2',
        name: 'CNC Laser-Cut Center Motif Panel (2mm Sheet)',
        dimensions: '4 ft × 3 ft',
        quantity: 2,
        material: 'CR Sheet 2.0mm thickness',
        unitPrice: 4200,
        totalPrice: 8400
      }
    ],
    materialCost: 32000,
    labourCharges: 8500,
    installationCharges: 3500,
    transportCharges: 1500,
    additionalCharges: 1400,
    totalAmount: 46900,
    advancePayment: 25000,
    remainingBalance: 21900,
    status: 'in_progress',
    createdAt: '2026-10-24T10:30:00Z',
    deliveryDate: '2026-11-05',
    notes: 'Primer coating done. Red oxide coat applied. Matte black finish pending with brass rivets.',
    paymentMethod: 'online_upi',
    upiTransactionId: 'UPI-TXN-998822341'
  },
  {
    id: 'ORD-1083',
    receiptNumber: 'WB-REC-2026-1083',
    customerId: 'cust-02',
    customerName: 'Rameshwar Ji Gehlot',
    customerPhone: '+91 94142 55667',
    welderId: 'weld-01',
    shopName: 'Solanki Net Cafe & Smart Print & Welding Hub',
    title: 'First Floor Balcony Safety Grills (4 Units)',
    items: [
      {
        id: 'item-3',
        name: 'Square Bar Modern Grid Grill with Planter Hooks',
        dimensions: '6 ft (W) × 4 ft (H)',
        quantity: 4,
        material: '12mm Bright Mild Steel Bar & 25x5mm Flat Bar',
        unitPrice: 4500,
        totalPrice: 18000
      }
    ],
    materialCost: 11000,
    labourCharges: 4200,
    installationCharges: 1800,
    transportCharges: 1000,
    additionalCharges: 0,
    totalAmount: 18000,
    advancePayment: 18000,
    remainingBalance: 0,
    status: 'completed',
    createdAt: '2026-10-18T14:15:00Z',
    deliveryDate: '2026-10-26',
    notes: 'Completed and installed on site. Full payment received.',
    paymentMethod: 'cash'
  }
];

export const sampleParties: CustomerPartyAccount[] = [
  {
    id: 'party-01',
    partyName: 'Mahendra Sharma (Barmer City)',
    phone: '+91 98290 11223',
    city: 'Barmer',
    totalBilled: 46900,
    totalReceived: 25000,
    advancePayment: 25000,
    remainingBalance: 21900,
    lastPaymentDate: '2026-10-24',
    status: 'partial',
    transactions: [
      {
        id: 'txn-1',
        date: '2026-10-24',
        amount: 25000,
        type: 'advance',
        notes: 'Advance booking amount for 12ft Main Gate',
        receiptNo: 'WB-REC-2026-1082'
      }
    ]
  },
  {
    id: 'party-02',
    partyName: 'Choudhary Hardware & Builders',
    phone: '+91 94145 99001',
    city: 'Balotra',
    totalBilled: 94000,
    totalReceived: 60000,
    advancePayment: 30000,
    remainingBalance: 34000,
    lastPaymentDate: '2026-10-15',
    status: 'overdue',
    transactions: [
      {
        id: 'txn-2',
        date: '2026-10-05',
        amount: 30000,
        type: 'advance',
        notes: 'Advance for 10 Window Grills'
      },
      {
        id: 'txn-3',
        date: '2026-10-15',
        amount: 30000,
        type: 'payment',
        notes: 'Partial payment on site delivery'
      }
    ]
  },
  {
    id: 'party-03',
    partyName: 'Rameshwar Ji Gehlot',
    phone: '+91 94142 55667',
    city: 'Barmer',
    totalBilled: 18000,
    totalReceived: 18000,
    advancePayment: 10000,
    remainingBalance: 0,
    lastPaymentDate: '2026-10-26',
    status: 'paid',
    transactions: [
      {
        id: 'txn-4',
        date: '2026-10-18',
        amount: 10000,
        type: 'advance',
        notes: 'Advance token'
      },
      {
        id: 'txn-5',
        date: '2026-10-26',
        amount: 8000,
        type: 'payment',
        notes: 'Final settlement after installation'
      }
    ]
  }
];

export const sampleWorkers: ShopWorker[] = [
  {
    id: 'worker-01',
    name: 'Kailash Suthar',
    phone: '+91 97831 22334',
    role: 'Master Welder',
    dailyWage: 850,
    daysWorked: 24,
    advanceTaken: 4000,
    balanceDue: 16400,
    attendanceThisMonth: 24,
    payments: [
      {
        id: 'p-1',
        date: '2026-10-12',
        amount: 4000,
        method: 'cash',
        notes: 'Family emergency advance'
      }
    ]
  },
  {
    id: 'worker-02',
    name: 'Bhanwar Lal Meghwal',
    phone: '+91 96492 55441',
    role: 'Assistant Fabricator',
    dailyWage: 650,
    daysWorked: 22,
    advanceTaken: 2500,
    balanceDue: 11800,
    attendanceThisMonth: 22,
    payments: [
      {
        id: 'p-2',
        date: '2026-10-10',
        amount: 2500,
        method: 'upi',
        notes: 'Mid-month advance'
      }
    ]
  },
  {
    id: 'worker-03',
    name: 'Dinesh Kumar',
    phone: '+91 91660 77889',
    role: 'Helper / Grinder',
    dailyWage: 450,
    daysWorked: 26,
    advanceTaken: 1500,
    balanceDue: 10200,
    attendanceThisMonth: 26,
    payments: [
      {
        id: 'p-3',
        date: '2026-10-14',
        amount: 1500,
        method: 'cash',
        notes: 'Advance'
      }
    ]
  }
];

export const sampleJobs: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Senior SS Argon TIG Welder for Luxury Railings',
    shopName: 'Solanki Net Cafe & Smart Print & Welding Hub',
    location: 'Barmer, Rajasthan',
    wage: '₹24,000 - ₹28,000 / month',
    type: 'Full-time',
    skillsRequired: ['SS-304/316 TIG', 'Argon Gas Purging', 'Buffing & Mirror Polish'],
    contactPhone: '+91 98765 43210',
    postedDate: '2 days ago',
    description: 'Looking for an experienced TIG welder with steady hand for architectural handrails and luxury villa gates. Free lodging and lunch provided.'
  },
  {
    id: 'job-2',
    title: 'Structural Steel Fitters & ARC Welders for Factory Shed',
    shopName: 'Royal Rajputana Steel Arts',
    location: 'Jaipur (Sikar Road), Rajasthan',
    wage: '₹800 - ₹950 / day (Overtime extra)',
    type: 'Contract',
    skillsRequired: ['7018 Electrode', 'Truss Fitting', 'Gas Cutting Torch', 'Safety Harness'],
    contactPhone: '+91 94140 12345',
    postedDate: 'Yesterday',
    description: 'Immediate requirement for 4 structural fitters for 15,000 sq ft industrial warehouse shed fabrication.'
  },
  {
    id: 'job-3',
    title: 'MIG Welder & Grinder Operator for Gate Manufacturing',
    shopName: 'Shree Umiya Modern Fabrication',
    location: 'Ahmedabad, Gujarat',
    wage: '₹22,000 - ₹26,000 / month',
    type: 'Full-time',
    skillsRequired: ['CO2 MIG Welding', 'Angle Grinder', 'Reading Blueprint Drawings'],
    contactPhone: '+91 98250 88990',
    postedDate: '3 days ago',
    description: 'Continuous production of window grills and steel gates. Standard 8-hour shift with bonus on festival orders.'
  }
];

export const sampleCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Lavjeet Kumar Solanki',
    authorRole: 'Master Fabricator',
    authorShop: 'Solanki Smart Welding Hub, Barmer',
    content: 'Pro tip for new welders welding thin square pipe (1.2mm or 16 gauge): Use 2.5mm 6013 electrodes at 65-75 amps. Avoid continuous bead—use stitch/pulse method with 1-second pause to prevent blow-through holes!',
    category: 'Welding Tips',
    likes: 47,
    commentsCount: 14,
    date: '3 hours ago'
  },
  {
    id: 'post-2',
    authorName: 'Vikram Singh Rathore',
    authorRole: 'Shop Owner',
    authorShop: 'Royal Rajputana Steel Arts, Jaipur',
    content: 'Market steel rate update: Tata MS Square Pipe is running at ₹74/kg in Rajasthan wholesale mandis today. Ensure you adjust your gate quotation formulas accordingly so you do not lose margin on big jobs!',
    category: 'Rate Card Discussion',
    likes: 82,
    commentsCount: 29,
    date: '6 hours ago'
  },
  {
    id: 'post-3',
    authorName: 'Pravin Bhai Patel',
    authorRole: 'SS Argon Specialist',
    authorShop: 'Shree Umiya Fabrication, Ahmedabad',
    content: 'When welding SS-304 railing tubes, always ensure 100% pure Argon at 8-10 LPM flow rate. If you see black discoloration around the weld toe, your cup size is too small or gas lens is dirty.',
    category: 'Machine Setup',
    likes: 63,
    commentsCount: 19,
    date: '1 day ago'
  }
];

export const sampleMeasurements: MeasurementItem[] = [
  {
    id: 'meas-01',
    itemName: 'Grand Entrance Double Swing Gate',
    category: 'gate',
    photoUrl: '/public/assets/aistudio/IMG-20261030-WA3750_a2b6a8aa.jpg',
    length: 12,
    width: 0.15,
    height: 7,
    thickness: 50,
    quantity: 1,
    unit: 'feet',
    notes: 'Left pillar to right pillar clearance: exactly 144 inches. Hinge mount on 4-inch heavy duty pipe.',
    createdAt: '2026-10-25'
  },
  {
    id: 'meas-02',
    itemName: 'Front Hall Balcony Safety Grill',
    category: 'grill',
    photoUrl: '/public/assets/aistudio/IMG-20261030-WA3750_a2b6a8aa.jpg',
    length: 6,
    width: 0.2,
    height: 4,
    thickness: 12,
    quantity: 3,
    unit: 'feet',
    notes: 'Standard 4-inch vertical spacing for child safety compliance. Red oxide primer requested.',
    createdAt: '2026-10-26'
  }
];

export const sampleInventory: InventoryItem[] = [
  {
    id: 'inv-01',
    name: 'MS Round Pipe 2.0 Inch (60mm OD)',
    profile: 'round_pipe',
    materialType: 'mild_steel',
    dimensionSummary: 'OD: 60mm × Thk: 2.0mm × 6.0m (20ft)',
    stockQuantity: 14,
    unit: 'pipes',
    minThreshold: 5,
    weightPerUnitKg: 17.2,
    costPerUnit: 1350,
    rackLocation: 'Rack A-1 (Main Yard)',
    supplierName: 'Jindal Steel Pipes Depot',
    lastRestockedDate: '2026-10-20',
    notes: 'Primary material for heavy main gates and structural columns'
  },
  {
    id: 'inv-02',
    name: 'SS-304 Round Pipe 1.5 Inch (38mm OD)',
    profile: 'round_pipe',
    materialType: 'stainless_steel',
    dimensionSummary: 'OD: 38mm × Thk: 1.5mm × 6.0m Mirror Polish',
    stockQuantity: 3,
    unit: 'pipes',
    minThreshold: 6,
    weightPerUnitKg: 8.2,
    costPerUnit: 2100,
    rackLocation: 'Rack A-3 (Indoor SS Bay)',
    supplierName: 'Apex Stainless Barmer',
    lastRestockedDate: '2026-10-15',
    notes: 'Premium grade for balcony railings and staircase handrails'
  },
  {
    id: 'inv-03',
    name: 'GI Round Pipe 1.0 Inch (32mm OD)',
    profile: 'round_pipe',
    materialType: 'mild_steel',
    dimensionSummary: 'OD: 32mm × Thk: 2.5mm × 6.0m Galvanized',
    stockQuantity: 22,
    unit: 'pipes',
    minThreshold: 8,
    weightPerUnitKg: 10.9,
    costPerUnit: 980,
    rackLocation: 'Rack A-2 (Main Yard)',
    supplierName: 'Tata Tiscon Depot',
    lastRestockedDate: '2026-10-25',
    notes: 'Water-resistant outdoor framing and greenhouse pipe'
  },
  {
    id: 'inv-04',
    name: 'MS Square Pipe 50×50mm Hollow Box',
    profile: 'square_pipe',
    materialType: 'mild_steel',
    dimensionSummary: 'Dim: 50×50mm × Thk: 2.5mm × 6.0m Box',
    stockQuantity: 4,
    unit: 'pipes',
    minThreshold: 8,
    weightPerUnitKg: 22.1,
    costPerUnit: 1720,
    rackLocation: 'Rack B-1 (Heavy Section)',
    supplierName: 'Jindal Steel Pipes Depot',
    lastRestockedDate: '2026-10-18',
    notes: 'Door post frames and shed support beams'
  },
  {
    id: 'inv-05',
    name: 'MS Square Pipe 25×25mm Window Grill Section',
    profile: 'square_pipe',
    materialType: 'mild_steel',
    dimensionSummary: 'Dim: 25×25mm × Thk: 1.6mm × 6.0m Box',
    stockQuantity: 28,
    unit: 'pipes',
    minThreshold: 10,
    weightPerUnitKg: 7.2,
    costPerUnit: 580,
    rackLocation: 'Rack B-2 (Grill Rack)',
    supplierName: 'Apollo Pipes Distributor',
    lastRestockedDate: '2026-10-24',
    notes: 'High turnover for domestic window grill and boundary mesh'
  },
  {
    id: 'inv-06',
    name: 'SS Square Pipe 40×40mm Mirror Finish',
    profile: 'square_pipe',
    materialType: 'stainless_steel',
    dimensionSummary: 'Dim: 40×40mm × Thk: 2.0mm × 6.0m SS-304',
    stockQuantity: 2,
    unit: 'pipes',
    minThreshold: 5,
    weightPerUnitKg: 14.8,
    costPerUnit: 3400,
    rackLocation: 'Rack B-4 (SS Precision Bay)',
    supplierName: 'Apex Stainless Barmer',
    lastRestockedDate: '2026-10-12',
    notes: 'Used in modern luxury entrance door frames and glass clamps'
  },
  {
    id: 'inv-07',
    name: 'TMT Sariya 12mm FE550D Rebar',
    profile: 'sariya',
    materialType: 'mild_steel',
    dimensionSummary: 'Dia: 12mm × 12.0m Full Length Bar (FE550)',
    stockQuantity: 35,
    unit: 'bars',
    minThreshold: 15,
    weightPerUnitKg: 10.6,
    costPerUnit: 790,
    rackLocation: 'Bay Ground C-1 (Rebar Yard)',
    supplierName: 'Jindal Panther Barmer Store',
    lastRestockedDate: '2026-10-27',
    notes: 'Structural lintels, foundation anchor bolts, window grill bars'
  },
  {
    id: 'inv-08',
    name: 'TMT Sariya 16mm Heavy Pillar Rebar',
    profile: 'sariya',
    materialType: 'mild_steel',
    dimensionSummary: 'Dia: 16mm × 12.0m Full Length Bar (FE550)',
    stockQuantity: 6,
    unit: 'bars',
    minThreshold: 10,
    weightPerUnitKg: 18.9,
    costPerUnit: 1420,
    rackLocation: 'Bay Ground C-2 (Rebar Yard)',
    supplierName: 'Jindal Panther Barmer Store',
    lastRestockedDate: '2026-10-14',
    notes: 'Heavy foundation cages and industrial crane supports'
  },
  {
    id: 'inv-09',
    name: 'TMT Sariya 8mm Ring / Stirrups Rebar',
    profile: 'sariya',
    materialType: 'mild_steel',
    dimensionSummary: 'Dia: 8mm × 12.0m Flexible Ring Rod',
    stockQuantity: 42,
    unit: 'bars',
    minThreshold: 15,
    weightPerUnitKg: 4.7,
    costPerUnit: 360,
    rackLocation: 'Bay Ground C-3 (Rebar Yard)',
    supplierName: 'Kamdhenu Steel Hub',
    lastRestockedDate: '2026-10-28',
    notes: 'Column rings, boundary spikes, tie bars'
  },
  {
    id: 'inv-10',
    name: 'MS Angle Iron 40×40×5mm Heavy L-Section',
    profile: 'angle',
    materialType: 'iron',
    dimensionSummary: 'L-Angle: 40×40mm × Thk: 5.0mm × 6.0m',
    stockQuantity: 18,
    unit: 'bars',
    minThreshold: 6,
    weightPerUnitKg: 17.8,
    costPerUnit: 1340,
    rackLocation: 'Rack D-1 (Angle Rack)',
    supplierName: 'National Steel Corporation',
    lastRestockedDate: '2026-10-22',
    notes: 'Door frames, tin shed trusses, generator base frames'
  },
  {
    id: 'inv-11',
    name: 'MS Flat Patti 32×5mm Border Bar',
    profile: 'flat_bar',
    materialType: 'iron',
    dimensionSummary: 'Flat Bar: 32mm width × 5.0mm thk × 6.0m',
    stockQuantity: 5,
    unit: 'bars',
    minThreshold: 8,
    weightPerUnitKg: 7.5,
    costPerUnit: 570,
    rackLocation: 'Rack D-3 (Flat Rack)',
    supplierName: 'National Steel Corporation',
    lastRestockedDate: '2026-10-19',
    notes: 'Decorative gate borders, lock box brackets, leaf weld plates'
  },
  {
    id: 'inv-12',
    name: 'Advani Overcord-S E6013 (3.15mm)',
    profile: 'rod',
    materialType: 'consumable',
    dimensionSummary: 'Dia: 3.15mm × 350mm (5kg Sealed Box)',
    stockQuantity: 3,
    unit: 'packets',
    minThreshold: 5,
    weightPerUnitKg: 5.0,
    costPerUnit: 520,
    rackLocation: 'Storage Shelf S-1 (Tool Room)',
    supplierName: 'Ador Welding Agency',
    lastRestockedDate: '2026-10-16',
    notes: 'Universal all-position general fabrication electrode'
  },
  {
    id: 'inv-13',
    name: 'D&H Secheron 7018 Heavy Structural Electrodes',
    profile: 'rod',
    materialType: 'consumable',
    dimensionSummary: 'Dia: 4.0mm × 450mm Low Hydrogen (5kg Box)',
    stockQuantity: 8,
    unit: 'packets',
    minThreshold: 4,
    weightPerUnitKg: 5.0,
    costPerUnit: 680,
    rackLocation: 'Storage Shelf S-2 (Tool Room)',
    supplierName: 'Ador Welding Agency',
    lastRestockedDate: '2026-10-25',
    notes: 'Boiler plate, heavy truss and truck chassis welding'
  }
];
