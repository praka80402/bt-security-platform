export type ProductCategory =
  | "CCTV_CAMERA"
  | "NVR_DVR"
  | "BIOMETRIC_ATTENDANCE"
  | "ACCESS_CONTROL"
  | "ACCESSORIES";

export type TicketStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";
export type AmcStatus = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";

export interface ProductItem {
  id: number;
  name: string;
  slug: string;
  category: ProductCategory;
  brand: string;
  modelNumber?: string | null;
  price?: number | null;
  description?: string | null;
  features?: string | null;
  imageUrl?: string | null;
  inStock: boolean;
  featured: boolean;
}

export interface LeadItem {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  serviceType: string;
  message?: string | null;
  status: LeadStatus;
  createdAt: string;
}

export interface ServiceTicketItem {
  id: number;
  ticketNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city?: string | null;
  serviceType: string;
  issueDescription: string;
  status: TicketStatus;
  technicianName?: string | null;
  technicianPhone?: string | null;
  scheduledDate?: string | null;
  resolutionNotes?: string | null;
  createdAt: string;
}

export interface AmcContractItem {
  id: number;
  contractNumber: string;
  customerName: string;
  companyName?: string | null;
  phone: string;
  email?: string | null;
  address: string;
  planType: string;
  totalCameras: number;
  totalBiometrics: number;
  amount?: number | null;
  startDate: string;
  endDate: string;
  status: AmcStatus;
}
