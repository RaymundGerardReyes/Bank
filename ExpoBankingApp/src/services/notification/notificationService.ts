import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '../../models/ApiResponse';

export interface BackendNotificationItem {
  id: string;
  category: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  correlationId: string;
  referenceId: string;
  channel: string;
  ipAddress: string;
  deviceInfo: string;
  severity: string;
}

export const notificationService = {
  getAuditNotifications: async (): Promise<BackendNotificationItem[]> => {
    try {
      const response = await apiClient.get<ApiResponse<BackendNotificationItem[]>>(ENDPOINTS.NOTIFICATIONS.BASE);
      return response.data?.data || [];
    } catch (error) {
      console.log('Using default audit notification stream fallback:', error);
      return [];
    }
  },
};
