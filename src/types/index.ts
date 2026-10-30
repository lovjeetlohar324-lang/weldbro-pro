export type UserRole = 'welder' | 'customer' | 'admin' | 'worker';

export type MeasurementUnit = 'inches' | 'feet' | 'mm' | 'cm' | 'm';

export type MaterialProfile = 'round_pipe' | 'square_pipe' | 'sariya' | 'flat_bar' | 'angle' | 'sheet';

export type OrderStatus =
  | 'new_order'
  | 'quotation_sent'
  | 'accepted'
  | 'work_started'
  | 'in_progress'
  | 'completed'
  | 'payment_pending'
  | 'paid'
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  shopName?: string;
  shopAddress?: string;
  city?: string;
  state?: string;
  district?: string;
  tehsil?: string;
  isVerified?: boolean;
}

export interface WelderProfile extends User {
  welderId: string; // e.g. WB-WELD-778
  experienceYears: number;
  about: string;
  workingHours: string;
  services: string[];
  workingLocations: string[]; // e.g. ["Jaipur", "Udaipur", "Jodhpur"]
  portfolioPhotos: string[];
  rating: number;
  reviewsCount: number;
  dailyRate?: number;
  completedJobsCount: number;
}

export interface Review {
  id: string;
  welderId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  projectType: string;
}

export interface MeasurementItem {
  id: string;
  itemName: string;
  category: 'door' | 'gate' | 'grill' | 'window' | 'railing' | 'staircase' | 'frame' | 'furniture' | 'custom';
  photoUrl: string;
  length: number;
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  unit: MeasurementUnit;
  notes: string;
  customDimensions?: string;
  annotatedImageUrl?: string;
  createdAt: string;
}

export interface MaterialCalculationResult {
  profile: MaterialProfile;
  materialName: string;
  grade: string;
  density: number; // kg/m3 e.g. 7850
  thicknessMm: number;
  lengthMm: number;
  outerDimensionMm: number;
  quantity: number;
  calculatedWeightKg: number;
  ratePerKg: number;
  materialCost: number;
  weldingRodsCost: number;
  boltsAndHardwareCost: number;
  labourCost: number;
  installationCost: number;
  transportationCost: number;
  totalEstimatedCost: number;
}

export interface OrderItem {
  id: string;
  name: string;
  dimensions: string;
  quantity: number;
  material: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  receiptNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  welderId: string;
  shopName: string;
  title: string;
  items: OrderItem[];
  materialCost: number;
  labourCharges: number;
  installationCharges: number;
  transportCharges: number;
  additionalCharges: number;
  totalAmount: number;
  advancePayment: number;
  remainingBalance: number;
  status: OrderStatus;
  createdAt: string;
  deliveryDate: string;
  notes?: string;
  paymentMethod?: 'cash' | 'online_upi';
  upiTransactionId?: string;
}

export interface CustomerPartyAccount {
  id: string;
  partyName: string;
  phone: string;
  city: string;
  totalBilled: number;
  totalReceived: number;
  advancePayment: number;
  remainingBalance: number;
  lastPaymentDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  transactions: {
    id: string;
    date: string;
    amount: number;
    type: 'invoice' | 'payment' | 'advance';
    notes: string;
    receiptNo?: string;
  }[];
}

export interface ShopWorker {
  id: string;
  name: string;
  phone: string;
  role: 'Master Welder' | 'Assistant Fabricator' | 'Helper / Grinder' | 'Fitter';
  dailyWage: number;
  daysWorked: number;
  advanceTaken: number;
  balanceDue: number;
  attendanceThisMonth: number;
  payments: {
    id: string;
    date: string;
    amount: number;
    method: 'cash' | 'upi';
    notes: string;
  }[];
}

export interface ChatMessage {
  id: string;
  orderId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  photoUrl?: string;
  measurementAttachment?: Partial<MeasurementItem>;
  quotationAttachment?: {
    title: string;
    amount: number;
    receiptNo: string;
  };
  timestamp: string;
}

export interface JobPosting {
  id: string;
  title: string;
  shopName: string;
  location: string;
  wage: string;
  type: 'Full-time' | 'Contract' | 'Daily Wage' | 'Project Based';
  skillsRequired: string[];
  contactPhone: string;
  postedDate: string;
  description: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorShop: string;
  content: string;
  category: 'Welding Tips' | 'Machine Setup' | 'Design Showcase' | 'Safety' | 'Rate Card Discussion';
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  date: string;
  imageUrl?: string;
}

export interface AppAdminSettings {
  appName: string;
  tagline: string;
  ownerName: string;
  ownerMobile: string;
  ownerUpiId: string;
  businessAddress: string;
  supportEmail: string;
  whatsappCommunityLink: string;
  telegramGroupLink: string;
  youtubeChannelUrl: string;
  instagramHandle: string;
  verifiedWelderCommissionRate: number;
  allowPublicGuestRegistrations: boolean;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  profile: MaterialProfile | 'rod' | 'hardware';
  materialType: 'mild_steel' | 'stainless_steel' | 'iron' | 'aluminium' | 'copper' | 'consumable';
  dimensionSummary: string;
  stockQuantity: number;
  unit: 'pipes' | 'bars' | 'sheets' | 'packets' | 'kg' | 'units';
  minThreshold: number;
  weightPerUnitKg: number;
  costPerUnit: number;
  rackLocation: string;
  supplierName?: string;
  lastRestockedDate: string;
  notes?: string;
}
