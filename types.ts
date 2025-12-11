export enum AgentType {
  COORDINATOR = 'Koordinator Pusat',
  PATIENT_MANAGER = 'Manajer Informasi Pasien',
  MEDICAL_ASSISTANT = 'Asisten Informasi Medis',
  DOC_CREATOR = 'Pembuat Dokumen',
  ADMIN_HANDLER = 'Penangan Tugas Administratif',
  UNKNOWN = 'Sistem'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  agent?: AgentType; // The agent answering the query
  timestamp: Date;
}

export interface KPIStats {
  revenue: number;
  bedOccupancy: number;
  patientsToday: number;
  pendingClaims: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  revenue?: number;
  patients?: number;
}