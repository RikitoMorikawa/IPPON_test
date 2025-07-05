// utils/notificationUtils.ts

// Type definitions
export type InquiryMethod = 'SUUMO' | '電話' | 'その他';
export type NotificationKey = 'suumo' | 'phone' | 'other';

export interface NotificationCounts {
  suumo: number;
  phone: number;
  other: number;
}

const NOTIFICATION_KEY = 'inquiry_notifications';

// Method mapping for consistency
const METHOD_KEYS: Record<InquiryMethod, NotificationKey> = {
  'SUUMO': 'suumo',
  '電話': 'phone', 
  'その他': 'other'
};

// Get notification counts from localStorage
export const getNotificationCounts = (): NotificationCounts => {
  try {
    const stored = localStorage.getItem(NOTIFICATION_KEY);
    if (stored) {
      return JSON.parse(stored) as NotificationCounts;
    }
  } catch (error) {
    console.error('Error reading notification counts:', error);
  }
  
  // Return default structure
  return {
    suumo: 0,
    phone: 0,
    other: 0
  };
};

// Set notification counts to localStorage
export const setNotificationCounts = (counts: NotificationCounts): void => {
  try {
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(counts));
  } catch (error) {
    console.error('Error saving notification counts:', error);
  }
};

// Increment notification count for specific method
export const incrementNotificationCount = (method: InquiryMethod): void => {
  const methodKey = METHOD_KEYS[method];
  if (!methodKey) {
    console.warn('Unknown inquiry method:', method);
    return;
  }
  
  const counts = getNotificationCounts();
  counts[methodKey] = (counts[methodKey] || 0) + 1;
  setNotificationCounts(counts);
  };

// Clear notification count for specific method
export const clearNotificationCount = (method: InquiryMethod): void => {
  const methodKey = METHOD_KEYS[method];
  if (!methodKey) {
    console.warn('Unknown inquiry method:', method);
    return;
  }
  
  const counts = getNotificationCounts();
  counts[methodKey] = 0;
  setNotificationCounts(counts);
};

// Clear all notification counts
export const clearAllNotifications = (): void => {
  setNotificationCounts({
    suumo: 0,
    phone: 0,
    other: 0
  });
};

// Get notification count for specific method
export const getNotificationCount = (method: InquiryMethod): number => {
  const methodKey = METHOD_KEYS[method];
  if (!methodKey) {
    return 0;
  }
  
  const counts = getNotificationCounts();
  return counts[methodKey] || 0;
};