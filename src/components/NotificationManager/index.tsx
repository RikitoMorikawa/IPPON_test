// components/NotificationManager.tsx
// Optional component for managing notifications manually (for admin/debug purposes)

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  Chip
} from '@mui/material';
import {
  getNotificationCounts,
  clearNotificationCount,
  clearAllNotifications,
  incrementNotificationCount,
  type NotificationCounts,
  type InquiryMethod,
  type NotificationKey
} from '../../utils/notificationUtils';

const NotificationManager: React.FC = () => {
  const [counts, setCounts] = useState<NotificationCounts>({
    suumo: 0,
    phone: 0,
    other: 0
  });

  const loadCounts = (): void => {
    const currentCounts = getNotificationCounts();
    setCounts(currentCounts);
  };

  useEffect(() => {
    loadCounts();
  }, []);

  const handleClearAll = (): void => {
    clearAllNotifications();
    loadCounts();
  };

  const handleClearSpecific = (method: InquiryMethod): void => {
    clearNotificationCount(method);
    loadCounts();
  };

  const handleIncrement = (method: InquiryMethod): void => {
    incrementNotificationCount(method);
    loadCounts();
  };

  interface MethodConfig {
    key: NotificationKey;
    display: string;
    method: InquiryMethod;
  }

  const methods: MethodConfig[] = [
    { key: 'suumo', display: 'SUUMO', method: 'SUUMO' },
    { key: 'phone', display: '電話', method: '電話' },
    { key: 'other', display: 'その他', method: 'その他' }
  ];

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          通知管理 (Notification Manager)
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {methods.map((item) => (
            <Grid item xs={12} md={4} key={item.key}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.display}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 1 }}>
                      {counts[item.key]}
                    </Typography>
                    <Chip 
                      label="件" 
                      size="small"
                      color={counts[item.key] > 0 ? "error" : "default"}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleIncrement(item.method)}
                    >
                      +1
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleClearSpecific(item.method)}
                      disabled={counts[item.key] === 0}
                    >
                      クリア
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleClearAll}
            disabled={Object.values(counts).every(count => count === 0)}
          >
            すべての通知をクリア
          </Button>
          <Button 
            variant="outlined" 
            onClick={loadCounts}
          >
            更新
          </Button>
        </Box>

        <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center' }}>
          * This component is for testing/admin purposes. Remove in production.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationManager;