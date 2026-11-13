export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
export const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'won', 'lost'];
export const STATUS_LABEL: Record<LeadStatus, string> = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', won: 'Won', lost: 'Lost' };

export type Lead = {
  id: string; createdAt: string; updatedAt: string;
  name: string; email: string; phone: string;
  status: LeadStatus; starred: boolean; notes: string;
  source: string; passNo: string; page: string; referrer: string;
  utm: Record<string, string>; country: string; city: string; device: string; submissions: number;
};

export type Row = { k: string; v: number };
export type Totals = { pv: number; uv: number; ss: number; leads: number; cta: number; popup: number; wa: number; call: number; formStart: number };
export type DayRow = { date: string; pv: number; uv: number; ss: number; leads: number };

export type FirstParty = {
  series: DayRow[]; totals: Totals; prev: Totals;
  devices: Row[]; browsers: Row[]; os: Row[]; countries: Row[]; channels: Row[]; referrers: Row[]; pages: Row[]; events: Row[];
  hours: number[]; live: number; livePages: Row[];
};

export type GA = {
  totals: { users: number; sessions: number; views: number; engagementRate: number; avgDuration: number; keyEvents: number };
  series: { date: string; users: number; sessions: number; views: number }[];
  channels: { k: string; v: number; v2: number }[]; countries: { k: string; v: number; v2: number }[];
  devices: { k: string; v: number; v2: number }[]; pages: { k: string; v: number; v2: number }[];
  realtime: number;
};

export type AnalyticsResponse = { days: number; first: FirstParty; ga: GA | null; gaError: string; gaConfigured: boolean; gaId: string };

export type Status = {
  storage: 'redis' | 'file'; durable: boolean;
  ga: { trackingId: string; dataApi: boolean }; metaPixel: boolean;
  notifications: { webhook: boolean; email: boolean }; siteUrl: string;
};
