export interface DashboardStat {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface SystemActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'security' | 'maintenance' | 'deployment';
  user: string;
  status: 'completed' | 'in-progress' | 'failed';
}

export interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  networkLatency: number;
  uptime: string;
}

export interface DashboardStatsData {
  activeUsers: number;
  systemModules: number;
  lookupItems: number;
  activeSessions: number;
}

export interface DashboardData {
  stats: DashboardStatsData;
  activities: SystemActivity[];
  systemHealth: SystemHealth;
}

export interface DashboardState {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastRefresh: string | null;
}

export const initialDashboardState: DashboardState = {
  dashboardData: null,
  loading: false,
  error: null,
  lastRefresh: null,
};