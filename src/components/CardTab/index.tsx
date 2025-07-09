import React, { useState, useEffect, useCallback } from "react";
import SectionTitle from "../SectionTitle";
import { Card, CardContent, Box, Typography, Badge, useMediaQuery, useTheme } from "@mui/material";
import InquiryTable from "../../pages/Dashboard/Listing/InquiryTable";
import { useDispatch } from "react-redux";
import { searchInquiry } from "../../store/inquirySlice";
import { AppDispatch } from "../../store";
// Import notification utilities
import { 
  getNotificationCounts, 
  clearNotificationCount,
  type NotificationCounts,
  InquiryMethod,
} from "../../utils/notificationUtils";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
}

interface TabDataItem {
  data: any[];
  pagination: PaginationInfo;
}

interface TabData {
  suumo: TabDataItem;
  phone: TabDataItem;
  other: TabDataItem;
}

const CardTab: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // true for xs
  const [activeTab, setActiveTab] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [tabData, setTabData] = useState<TabData>({
    suumo: { data: [], pagination: { total: 0, page: 1, limit: 10 } },
    phone: { data: [], pagination: { total: 0, page: 1, limit: 10 } },
    other: { data: [], pagination: { total: 0, page: 1, limit: 10 } }
  });
  const [loading, setLoading] = useState<boolean>(true);
  // Add state for notification counts with proper typing
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts>({
    suumo: 0,
    phone: 0,
    other: 0
  });

  const dispatch = useDispatch<AppDispatch>();

  // Load notification counts from localStorage
  const loadNotificationCounts = useCallback(() => {
    const counts = getNotificationCounts();
    setNotificationCounts(counts);
  }, []);

  // Function to transform inquiry data to table format
  const transformInquiryData = useCallback((data: any[]) => {
    if (!data || data.length === 0) return [];
    return data.map((inquiry: any, index: number) => ({
      id: inquiry?.inquiry?.id || index,
      customer_id: inquiry?.inquiry?.customer?.id || '', // ADD THIS LINE - This was missing!
      method: inquiry?.inquiry?.method,
      employee_id: inquiry?.inquiry?.customer?.employee_id || '',
      name: inquiry.inquiry?.customer?.last_name + ' ' + inquiry?.inquiry?.customer?.first_name,
      property_name: inquiry?.inquiry?.property?.name,
      type: inquiry?.inquiry?.type,
      content: inquiry?.inquiry?.summary,
      manager: inquiry?.manager || "",
      registration_timestamp: inquiry?.inquiry?.created_at,
      // Add additional fields for the update
      first_name: inquiry?.inquiry?.customer?.first_name,
      last_name: inquiry?.inquiry?.customer?.last_name,
      mail_address: inquiry?.inquiry?.customer?.mail_address,
      phone_number: inquiry?.inquiry?.customer?.phone_number,
      created_at: inquiry?.inquiry?.created_at,
    }));
  }, []);

  // Function to fetch data for a specific method with pagination
  const fetchDataForMethod = useCallback(async (method: string, page: number = 1, limit: number = 10) => {
    const params: any = { 
      name: '',
      inquiryMethod: method,
      page: page,
      limit: limit
    };
    
    try {
      const result = await dispatch(searchInquiry(params));
      if (searchInquiry.fulfilled.match(result)) {
        const responseData = result.payload;
        console.log("Response ", responseData.items)
        return {
          data: responseData.items || [],
          pagination: {
            total: responseData.total || 0,
            page: responseData.page || 1,
            limit: responseData.limit || limit
          }
        };
      } else {
        return {
          data: [],
          pagination: { total: 0, page: 1, limit: limit }
        };
      }
    } catch (error) {
      console.warn(`Error fetching data for:`, error);
      return {
        data: [],
        pagination: { total: 0, page: 1, limit: limit }
      };
    }
  }, [dispatch]);

  // Fetch data for a specific tab
  const fetchTabData = useCallback(async (tabIndex: number, page: number = 1, limit: number = perPage) => {
    const methods = ["SUUMO", "電話", "その他"];
    const method = methods[tabIndex];
    const tabKeys = ["suumo", "phone", "other"] as const;
    const tabKey = tabKeys[tabIndex];
    
    setLoading(true);
    
    try {
      const result = await fetchDataForMethod(method, page, limit);
      const transformedData = transformInquiryData(result.data);
      
      setTabData(prev => ({
        ...prev,
        [tabKey]: {
          data: transformedData,
          pagination: result.pagination
        }
      }));
      
    } catch (error) {
      console.error(`Error fetching data for ${method}:`, error);
      setTabData(prev => ({
        ...prev,
        [tabKey]: {
          data: [],
          pagination: { total: 0, page: 1, limit: limit }
        }
      }));
    } finally {
      setLoading(false);
    }
  }, [fetchDataForMethod, transformInquiryData, perPage]);

  // Fetch initial data for all tabs (first page only)
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    
    try {
      // Fetch first page for all three types of data simultaneously with current perPage
      const [suumoResult, phoneResult, otherResult] = await Promise.all([
        fetchDataForMethod("SUUMO", 1, perPage),
        fetchDataForMethod("電話", 1, perPage),
        fetchDataForMethod("その他", 1, perPage)
      ]);

      // Transform the data
      const transformedSuumoData = transformInquiryData(suumoResult.data);
      const transformedPhoneData = transformInquiryData(phoneResult.data);
      const transformedOtherData = transformInquiryData(otherResult.data);

      // Update all tab data at once
      setTabData({
        suumo: {
          data: transformedSuumoData,
          pagination: suumoResult.pagination
        },
        phone: {
          data: transformedPhoneData,
          pagination: phoneResult.pagination
        },
        other: {
          data: transformedOtherData,
          pagination: otherResult.pagination
        }
      });

    } catch (error) {
      console.error('Error fetching initial data:', error);
      // Set empty data on error
      setTabData({
        suumo: { data: [], pagination: { total: 0, page: 1, limit: perPage } },
        phone: { data: [], pagination: { total: 0, page: 1, limit: perPage } },
        other: { data: [], pagination: { total: 0, page: 1, limit: perPage } }
      });
    } finally {
      setLoading(false);
    }
  }, [fetchDataForMethod, transformInquiryData, perPage]);

  // Fetch initial data and notification counts on component mount
  useEffect(() => {
    fetchInitialData();
    loadNotificationCounts();
  }, [fetchInitialData, loadNotificationCounts]);

  // Listen for localStorage changes (when notifications are updated from other components)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'inquiry_notifications') {
        loadNotificationCounts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadNotificationCounts]);

  // Handle page change for current active tab
  const handlePageChange = useCallback((page: number) => {
    fetchTabData(activeTab, page, perPage);
  }, [activeTab, fetchTabData, perPage]);

  // Handle per page change
  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    
    // Refetch current tab data with new per page value and reset to page 1
    fetchTabData(activeTab, 1, newPerPage);
  }, [activeTab, fetchTabData]);

  // Tab data with dynamic counts and notification status
  const tabs = [
    { 
      title: "SUUMO", 
      count: tabData.suumo.pagination.total, 
      hasNotification: notificationCounts.suumo > 0,
      notificationCount: notificationCounts.suumo,
      method: "SUUMO"
    },
    { 
      title: "電話", 
      count: tabData.phone.pagination.total, 
      hasNotification: notificationCounts.phone > 0,
      notificationCount: notificationCounts.phone,
      method: "電話"
    },
    { 
      title: "その他問い合わせ", 
      count: tabData.other.pagination.total, 
      hasNotification: notificationCounts.other > 0,
      notificationCount: notificationCounts.other,
      method: "その他"
    }
  ];

  // Get current tab data
  const getCurrentTabData = () => {
    switch (activeTab) {
      case 0:
        return tabData.suumo;
      case 1:
        return tabData.phone;
      case 2:
        return tabData.other;
      default:
        return { data: [], pagination: { total: 0, page: 1, limit: perPage } };
    }
  };

  // Get current tab method for display purposes
  const getCurrentTabMethod = () => {
    switch (activeTab) {
      case 0:
        return "SUUMO";
      case 1:
        return "電話";
      case 2:
        return "その他";
      default:
        return null;
    }
  };

  // Handle tab change
  const handleTabChange = (index: number) => {
    if (index === activeTab) return; // Don't change if same tab

    setActiveTab(index);
    
    // Clear notification for the tab being viewed
    const methods: InquiryMethod[] = ["SUUMO", "電話", "その他"];
    const method = methods[index];
    if (method) {
      clearNotificationCount(method);
      loadNotificationCounts(); // Reload counts after clearing
    }
    
    // If the new tab has no data, fetch it with current perPage setting
    const tabKeys = ["suumo", "phone", "other"] as const;
    const tabKey = tabKeys[index];
    const currentTabData = tabData[tabKey];
    
    if (currentTabData.data.length === 0 && currentTabData.pagination.total > 0) {
      fetchTabData(index, 1, perPage);
    }
  };

  const handleEmployeeUpdate = useCallback(() => {
    // Refresh current tab data
    const currentTabData = getCurrentTabData();
    fetchTabData(activeTab, currentTabData.pagination.page, perPage);
    
    // Also refresh the initial data to update counts
    fetchInitialData();
  }, [activeTab, fetchTabData, perPage, fetchInitialData]);

  // Content for each tab
  const renderContent = () => {
    const currentTabData = getCurrentTabData();
    const currentMethod = getCurrentTabMethod();
    
    switch (activeTab) {
      case 0:
        return <InquiryTable 
          title={'問い合わせ一覧'} 
          checkbox={false} 
          fullList={true} 
          addAction={true} 
          method={currentMethod}
          data={currentTabData.data}
          pagination={currentTabData.pagination}
          loading={loading}
          onPageChange={handlePageChange}
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
          onEmployeeUpdate={handleEmployeeUpdate} // ADD THIS LINE
        />;
      case 1:
        return <InquiryTable 
          title={'問い合わせ一覧'} 
          checkbox={false} 
          fullList={true} 
          addAction={true} 
          method={currentMethod}
          data={currentTabData.data}
          pagination={currentTabData.pagination}
          loading={loading}
          onPageChange={handlePageChange}
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
          onEmployeeUpdate={handleEmployeeUpdate} // ADD THIS LINE
        />;
      case 2:
        return <InquiryTable 
          title={'その他問い合わせ'} 
          checkbox={false} 
          fullList={true} 
          addAction={true} 
          method={currentMethod}
          data={currentTabData.data}
          pagination={currentTabData.pagination}
          loading={loading}
          onPageChange={handlePageChange}
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
          onEmployeeUpdate={handleEmployeeUpdate} // ADD THIS LINE
        />;
      default:
        return null;
    }
  };

  return (
    <>
      <SectionTitle title='ダッシュボード' addBorder={isMobile} />
      
      {/* Tab Cards */}
      <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 'none', 
        borderRadius: {xs: '10px',sm: '12px'},
        mt: {xs: '10px',sm: '8px'} }}>
        <CardContent sx={{ 
          display: 'flex', 
          flexWrap: { xs: 'wrap', sm: 'wrap' },
          gap: 1, 
          pb: 1,
          padding: '8px !important', 
        }}>
            {tabs.map((tab, index) => (
            <Card 
                key={index}
                sx={{ 
                    width: { xs: 'calc(49% - 4px)', sm: '150px' },
                    height: {xs: '96px',sm: 'inherit'},
                    cursor: 'pointer',
                    backgroundColor: index === activeTab ? '#bfe6f0' : 'transparent',
                    borderColor: index === activeTab ? '#bfe6f0' : 'transparent',
                    borderWidth: 1,
                    boxShadow: 'none',
                    borderRadius: { xs: '8px', sm: '12px' },
                    borderStyle: 'solid',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                }}
                onClick={() => handleTabChange(index)}
            >
                <CardContent sx={{ textAlign: 'center', 
                    p: {xs: '8px', sm: '10px'},
                  ':last-child': 
                  { pb: {xs: '8px',sm: '10px'} } }}>
                    <Typography 
                    sx={{ 
                      fontSize: {xs: '11.28px', sm: '14px'},
                      lineHeight: {xs: '16px', sm: '24px'},
                       fontWeight: 'bold', color: index === activeTab ? '#0B9DBD': '#3E3E3E' }}>
                        {tab.title}
                    </Typography>
                    <Box sx={{ width: "100%", display: "inline-block" }}>
                        {tab.hasNotification ? (
                        <Badge 
                            color="secondary" 
                            overlap="circular" 
                            badgeContent={''} 
                            sx={{
                            width: "100%",
                            "& .MuiBadge-badge": {
                                right: {xs: '4px', sm: '5px'},
                                top: {xs: '6px', sm: '9px'},
                                width: {xs: '20px', sm: '30px'},
                                height: {xs: '20px', sm: '30px'},
                                borderRadius: "50%",
                                minWidth: {xs: '20px', sm: '30px'},
                                backgroundColor: "#FF0000",
                                border: "3px solid #F5F5F5",
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }
                            }}
                        >
                            <Box 
                            sx={{
                                backgroundColor: '#fff', 
                                mt: {xs: '5px',sm: '8px'},
                                width: {xs: 'inherit !important',sm: '130px'},
                                height: {xs: '56.38px', sm: '70px'},
                                boxShadow: 'none',
                                borderRadius: {xs: '8px', sm: '10px'},
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                '&:hover': {
                                  boxShadow: '0px 0px 10px 0px #00000040'
                                }
                            }}
                          >
                            <Typography variant="h4" align="center" color="#3E3E3E" lineHeight='28px' fontWeight={700}
                            sx={{
                              fontSize: {xs: '21px', sm: '28px'}
                            }}>
                                {loading ? '...' : tab.count}
                                <Typography component="span" variant="body2" color="#3E3E3E" fontWeight={700} sx={{
                              fontSize: {xs: '8px', sm: '12px'}
                            }}>件</Typography>
                            </Typography>
                            </Box>
                        </Badge>
                        ) : (
                        <Box 
                            sx={{
                            backgroundColor: '#fff', 
                            mt: {xs: '5px',sm: '8px'},
                            width: {xs: 'inherit !important',sm: '130px'},
                            height: {xs: '56.38px', sm: '70px'},
                            borderRadius: {xs: '8px', sm: '10px'},
                            display: "flex",
                            justifyContent: "center",
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: '0px 0px 10px 0px #00000040'
                            },
                            alignItems: "center"
                            }}
                        >
                            <Typography variant="h4" align="center" lineHeight='28px' fontWeight={700} sx={{
                              fontSize: {xs: '21px', sm: '28px'}
                            }}>
                            {loading ? '...' : tab.count}
                            <Typography component="span" variant="body2" fontWeight={700} sx={{
                              fontSize: {xs: '8px', sm: '12px'}
                            }}>件</Typography>
                            </Typography>
                        </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
            ))}
        </CardContent>
      </Card>

      {/* Content Area */}
      <Box py={3}>
        {renderContent()}
      </Box>
    </>
  );
};

export default CardTab;